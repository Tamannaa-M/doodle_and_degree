from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class WordBox(BaseModel):
    word: str
    norm_box: List[float]  # [x0, y0, x1, y1] normalized (0.0 to 1.0)
    difficulty: str = "simple"  # "simple" or "challenging"

class SlideData(BaseModel):
    page_num: int
    image_url: str
    text_content: str
    word_boxes: List[WordBox] = []
    simple_terms: List[str] = []
    challenging_terms: List[str] = []

class Player(BaseModel):
    id: str
    name: str
    avatar: str  # "cat" | "bird" | "flame" | "dino"
    score: int = 0
    is_host: bool = False
    has_guessed: bool = False
    is_drawing: bool = False
    connected: bool = True

class DrawingPoint(BaseModel):
    x: float
    y: float

class Stroke(BaseModel):
    points: List[DrawingPoint]
    color: str = "#1E1E24"
    width: float = 4.0
    tool: str = "brush"  # "brush", "eraser", "fill"

class ChatMessage(BaseModel):
    sender_id: str
    sender_name: str
    text: str
    avatar: str
    is_system: bool = False
    is_correct: bool = False
    timestamp: float = 0.0

class StudyPair(BaseModel):
    slide_index: int
    slide_image_url: str
    word: str
    drawer_name: str
    drawing_strokes: List[Stroke] = []
    drawing_snapshot: Optional[str] = None  # Base64 image snapshot
