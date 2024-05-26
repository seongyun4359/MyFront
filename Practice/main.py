from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import List
from datetime import datetime

app = FastAPI()

# Static files and templates configuration
app.mount("/static", StaticFiles(directory="portfolio"), name="static")
templates = Jinja2Templates(directory="portfolio")

# In-memory guestbook entries
class GuestBookEntry(BaseModel):
    writer: str
    content: str
    time: str

guestbook_entries: List[GuestBookEntry] = []

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("portfolio.html", {"request": request, "entries": guestbook_entries})

@app.post("/add_entry")
async def add_entry(writer: str = Form(...), content: str = Form(...)):
    time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = GuestBookEntry(writer=writer, content=content, time=time)
    guestbook_entries.append(entry)
    return {"message": "Entry added successfully"}

@app.post("/delete_entry")
async def delete_entry(writer: str = Form(...), content: str = Form(...), time: str = Form(...)):
    global guestbook_entries
    guestbook_entries = [entry for entry in guestbook_entries if not (entry.writer == writer and entry.content == content and entry.time == time)]
    return {"message": "Entry deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
