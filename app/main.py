import asyncio
import os

from faster_whisper import WhisperModel
from fastapi import FastAPI, Request, UploadFile, File, Form, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

model = WhisperModel("base", compute_type="int8", device="cpu")

app_state = {
    "state": "idle",
    "filename": None,
    "result": None
}

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

def format_seconds_to_time(seconds: int) -> str:
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60
    return f"{hours:02}:{minutes:02}:{secs:02}"

@app.get("/", response_class=HTMLResponse)
async def get_page_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api/state")
async def api_state():
    return app_state

@app.post("/api/reset")
async def api_reset():
    app_state.update({
        "state": "idle",
        "filename": None,
        "result": None
    })

@app.post("/api/transcribe")
async def api_transcribe(file: UploadFile = File(...), language: str = Form(...)):
    global app_state

    if app_state["state"] == "processing":
        raise HTTPException(status_code=400, detail="Processing already in progress")

    with open(file.filename, "wb") as buffer:
        buffer.write(await file.read())

    app_state["state"] = "processing"
    asyncio.get_event_loop().create_task(run_whisper(file.filename, language))

async def run_whisper(filepath: str, language: str):
    global app_state

    def transcribe():
        full_text = ""
        segments, _ = model.transcribe(filepath, beam_size=5, language=language, vad_filter=True)

        for segment in segments:
            f_time_start = format_seconds_to_time(int(segment.start))
            f_time_end = format_seconds_to_time(int(segment.end))
            f_text = segment.text.strip()
            full_text += f"[{f_time_start} - {f_time_end}] {f_text}<br>"
            
        return full_text.strip()

    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(None, transcribe)
    
    app_state.update({
        "state": "completed",
        "filename": os.path.splitext(os.path.basename(filepath))[0],
        "result": result
    })

    if os.path.exists(filepath):
        os.remove(filepath)
