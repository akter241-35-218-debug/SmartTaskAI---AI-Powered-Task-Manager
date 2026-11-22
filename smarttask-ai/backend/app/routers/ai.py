import sys, pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parents[3]))  # project root

from fastapi import APIRouter
from pydantic import BaseModel
from ai.analyzer import analyze_task

router = APIRouter(prefix="/ai", tags=["AI"])


class AnalyzeRequest(BaseModel):
    text: str


@router.post("/analyze")
def analyze(req: AnalyzeRequest):
    return analyze_task(req.text)
