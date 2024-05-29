import json
from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import List
from datetime import datetime
import os
import uuid

app = FastAPI()

origins = ["http://127.0.0.1:5500", "http://3.222.6.7"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files and templates configuration
app.mount("/main", StaticFiles(directory="main"), name="main")
app.mount("/portfolio", StaticFiles(directory="portfolio"), name="portfolio")
templates = Jinja2Templates(directory="portfolio")

# In-memory guestbook entries
class GuestBookEntry(BaseModel):
    id: str
    writer: str
    pwd: str
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

@app.get("/guestbook", response_class=JSONResponse)
async def get_entries():
    return guestbook_entries

@app.post("/guestbook")
async def add_entry(writer: str = Form(...), pwd: str = Form(...), content: str = Form(...)):
    entry = GuestBookEntry(id=str(uuid.uuid4()), writer=writer, pwd=pwd, content=content, time=str(datetime.now()))
    guestbook_entries.append(entry)
    save_guestbook_entries()
    return {"message": "Entry added successfully"}

@app.delete("/guestbook/{entry_id}")
async def delete_entry(entry_id: str):
    global guestbook_entries
    guestbook_entries = [entry for entry in guestbook_entries if entry.id != entry_id]
    save_guestbook_entries()
    return {"message": "Entry deleted successfully"}

@app.put("/guestbook/{entry_id}")
async def edit_entry(entry_id: str, writer: str = Form(...), pwd: str = Form(...), content: str = Form(...)):
    for entry in guestbook_entries:
        if entry.id == entry_id:
            entry.writer = writer
            entry.pwd = pwd
            entry.content = content
            entry.time = str(datetime.now())
            save_guestbook_entries()
            return {"message": "Entry updated successfully"}
    return {"message": "Entry not found"}, 404

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8008, reload=True)
