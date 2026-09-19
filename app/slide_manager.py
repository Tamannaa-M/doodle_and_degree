import os
import re
import hashlib
from typing import List, Dict, Optional, Tuple
import pymupdf as fitz  # PyMuPDF
from app.models import SlideData, WordBox

STOPWORDS = {
    "the", "and", "for", "that", "this", "with", "from", "have", "are", "which",
    "using", "where", "into", "their", "will", "what", "when", "more", "such",
    "each", "then", "them", "some", "other", "about", "slide", "study", "terms",
    "doodling", "between", "across", "while", "these", "there", "those", "occur",
    "occurs", "instead", "allows", "models", "building", "block", "layer", "level"
}

TECHNICAL_STEMS = {
    "perceptron", "activation", "gradient", "descent", "backpropagation", "weights",
    "overfitting", "sigmoid", "softmax", "decision", "tree", "ensemble", "boosting",
    "forest", "entropy", "residuals", "variance", "convolution", "kernel", "pooling",
    "filter", "invariance", "pixels", "tensors", "transformer", "attention", "tokenizer",
    "embedding", "tokens", "encoder", "decoder", "policy", "reward", "exploration",
    "environment", "state", "action", "discount", "neural", "network", "vectors"
}

class SlideManager:
    def __init__(self, cache_dir: str = "static/cache_slides"):
        self.cache_dir = cache_dir
        os.makedirs(self.cache_dir, exist_ok=True)
        self.slides: List[SlideData] = []
        self.pdf_name: str = ""

    def load_pdf(self, pdf_path: str) -> List[SlideData]:
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF not found at {pdf_path}")

        self.pdf_name = os.path.basename(pdf_path)
        with open(pdf_path, "rb") as f:
            pdf_hash = hashlib.md5(f.read()).hexdigest()[:10]

        pdf_cache_folder = os.path.join(self.cache_dir, pdf_hash)
        os.makedirs(pdf_cache_folder, exist_ok=True)

        doc = fitz.open(pdf_path)
        self.slides = []

        for page_idx in range(len(doc)):
            page = doc[page_idx]
            rect = page.rect
            width, height = rect.width, rect.height

            # Render to PNG at 150 DPI for super crisp display
            zoom = 150 / 72.0
            mat = fitz.Matrix(zoom, zoom)
            pix = page.get_pixmap(matrix=mat, alpha=False)

            img_filename = f"page_{page_idx + 1}.png"
            img_path = os.path.join(pdf_cache_folder, img_filename)
            if not os.path.exists(img_path):
                pix.save(img_path)

            rel_url = f"/static/cache_slides/{pdf_hash}/{img_filename}"

            # Extract word bounding boxes: words format: (x0, y0, x1, y1, word, block_no, line_no, word_no)
            raw_words = page.get_text("words")
            word_boxes: List[WordBox] = []
            seen_clean_words = set()

            for w in raw_words:
                x0, y0, x1, y1, raw_word = w[0], w[1], w[2], w[3], w[4]
                clean = re.sub(r'[^a-zA-Z]', '', raw_word).strip()
                if len(clean) >= 3 and clean.lower() not in STOPWORDS:
                    norm_box = [
                        round(x0 / width, 4),
                        round(y0 / height, 4),
                        round(x1 / width, 4),
                        round(y1 / height, 4)
                    ]
                    diff = "challenging" if (len(clean) >= 8 or clean.lower() in TECHNICAL_STEMS) else "simple"
                    word_boxes.append(WordBox(word=clean, norm_box=norm_box, difficulty=diff))
                    seen_clean_words.add(clean.title())

            full_text = page.get_text()

            # Categorize candidate study terms
            simple_candidates = []
            challenging_candidates = []

            for w in sorted(list(seen_clean_words)):
                lower = w.lower()
                if lower in STOPWORDS:
                    continue
                if len(w) >= 8 or lower in TECHNICAL_STEMS:
                    challenging_candidates.append(w)
                elif len(w) >= 4:
                    simple_candidates.append(w)

            # If slide has no text (e.g. image, diagram, or visual PPT slide), provide smart candidate terms
            if not word_boxes:
                defaults = ["Diagram", "Architecture", "Overview", "Workflow", "System", "Process", "Component", "Structure"]
                for idx, term in enumerate(defaults[:4]):
                    word_boxes.append(WordBox(word=term, norm_box=[round(0.08 + idx * 0.22, 4), 0.85, round(0.26 + idx * 0.22, 4), 0.95], difficulty="simple" if idx % 2 == 0 else "challenging"))
                    simple_candidates.append(term)

            # Ensure we have at least a few terms
            if not simple_candidates and challenging_candidates:
                simple_candidates = challenging_candidates[:2]
            if not challenging_candidates and simple_candidates:
                challenging_candidates = simple_candidates[-2:]

            slide = SlideData(
                page_num=page_idx + 1,
                image_url=rel_url,
                text_content=full_text,
                word_boxes=word_boxes,
                simple_terms=simple_candidates[:6],
                challenging_terms=challenging_candidates[:6]
            )
            self.slides.append(slide)

        doc.close()
        return self.slides

    def get_slide(self, index: int) -> Optional[SlideData]:
        if 0 <= index < len(self.slides):
            return self.slides[index]
        return None

    def get_contextual_hint(self, slide_index: int, target_word: str) -> str:
        slide = self.get_slide(slide_index)
        if not slide or not target_word:
            return "Watch the drawing and use the letter count above."
        # Rejoin PDF line wraps before extracting a complete sentence.
        text = re.sub(r"\s+", " ", slide.text_content).strip()
        pattern = re.compile(rf"\b{re.escape(target_word)}\b", re.IGNORECASE)
        candidates = [sentence.strip() for sentence in re.split(r"(?<=[.!?])\s+", text)
                      if pattern.search(sentence) and len(sentence.split()) >= 5]
        if candidates:
            sentence = min(candidates, key=len)
            match = pattern.search(sentence)
            if len(sentence) > 220:
                start = max(0, match.start() - 95)
                end = min(len(sentence), match.end() + 110)
                if start:
                    boundary = sentence.find(" ", start)
                    start = boundary + 1 if boundary < match.start() else start
                if end < len(sentence):
                    end = sentence.rfind(" ", match.end(), end)
                sentence = ("…" if start else "") + sentence[start:end] + ("…" if end < len(sentence) else "")
            return f"Slide {slide.page_num} · Fill the gap: {pattern.sub('_____', sentence)}"
        return f"Slide {slide.page_num} · Look for a {len(target_word)}-letter word on this slide. Match it to the drawing."
