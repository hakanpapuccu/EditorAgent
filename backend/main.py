from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import shutil
import uuid
from typing import List, Optional
from pydantic import BaseModel

from tools import get_preview_content, convert_xls_to_xlsx
# Import agent invocation logic (we will add this to agent.py and import it here)
from agent import run_agent 

app = FastAPI(title="AI Agent Backend")

# CORS setup
origins = [
    "http://localhost:3000",  # Next.js frontend
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ChatRequest(BaseModel):
    message: str
    session_id: str
    filename: Optional[str] = None # Added filename to request

@app.get("/")
def read_root():
    return {"message": "AI Agent Backend is running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Save file
        file_location = os.path.join(UPLOAD_DIR, file.filename)
        
        # Check if file exists, if so overwrite or maybe version? Overwriting for now as per "editing" flow
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Convert .xls to .xlsx if needed
        final_filename = file.filename
        if file.filename.lower().endswith('.xls'):
            new_path = convert_xls_to_xlsx(file_location)
            if new_path != file_location:
                 file_location = new_path
                 final_filename = os.path.basename(new_path)
            
        # Generate preview
        preview_content = get_preview_content(file_location)
        
        return JSONResponse(content={
            "filename": final_filename, 
            "filepath": file_location,
            "preview": preview_content
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        response_text = f"Echo: {request.message}" # Default
        preview_content = ""
        
        if request.filename:
            file_path = os.path.join(UPLOAD_DIR, request.filename)
            
            # TODO: Call agent here
            result = await run_agent(request.message, file_path)
            response_text = result["response"]
            
            # Regenerate preview after potential edits
            if os.path.exists(file_path):
                preview_content = get_preview_content(file_path)
        
        return {
            "response": response_text, 
            "preview": preview_content
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
