from fastapi import FastAPI, Request
from retriever import QARetriever
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()
retriever = QARetriever()

# Autoriser CORS si besoin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    question = data.get("question")
    response = retriever.retrieve(question)
    return JSONResponse(content={"response": str(response)}, status_code=200)
