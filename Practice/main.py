import json
from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import List
from datetime import datetime
import os

app = FastAPI()

# Static files and templates configuration
app.mount("/main", StaticFiles(directory="main"), name="main")
app.mount("/portfolio", StaticFiles(directory="portfolio"), name="portfolio")
templates = Jinja2Templates(directory="portfolio")

# In-memory guestbook entries
class GuestBookEntry(BaseModel):
    writer: str
    content: str
    time: str

guestbook_entries: List[GuestBookEntry] = []

# Load guestbook entries from JSON file
def load_guestbook_entries():
    if os.path.exists("guestbook.json"):
        with open("guestbook.json", "r", encoding="utf-8") as file:
            entries = json.load(file)
            return [GuestBookEntry(**entry) for entry in entries]
    return []

# Save guestbook entries to JSON file
def save_guestbook_entries():
    with open("guestbook.json", "w", encoding="utf-8") as file:
        json.dump([entry.dict() for entry in guestbook_entries], file, ensure_ascii=False, indent=4)

guestbook_entries = load_guestbook_entries()

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("portfolio.html", {"request": request, "entries": guestbook_entries})

@app.get("/entries", response_class=JSONResponse)
async def get_entries():
    return guestbook_entries

@app.post("/add_entry")
async def add_entry(writer: str = Form(...), content: str = Form(...), time: str = Form(...)):
    entry = GuestBookEntry(writer=writer, content=content, time=time)
    guestbook_entries.append(entry)
    save_guestbook_entries()
    return {"message": "Entry added successfully"}

@app.post("/delete_entry")
async def delete_entry(writer: str = Form(...), content: str = Form(...), time: str = Form(...)):
    global guestbook_entries
    guestbook_entries = [entry for entry in guestbook_entries if not (entry.writer == writer and entry.content == content and entry.time == time)]
    save_guestbook_entries()
    return {"message": "Entry deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
