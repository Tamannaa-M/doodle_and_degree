// Doodle & Degree - Smooth Canvas Drawing Engine with Bézier Interpolation

class DrawingCanvas {
  constructor(canvasElement, onStrokeComplete) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.onStrokeComplete = onStrokeComplete;

    this.isDrawing = false;
    this.canDraw = false; // enabled only for active drawer
    this.currentPoints = [];
    this.strokes = [];

    // Default brush settings
    this.currentColor = '#1E1E24';
    this.currentWidth = 6;
    this.currentTool = 'brush'; // 'brush' | 'eraser'

    // Virtual coordinate resolution for crisp multi-device synchronization
    this.virtualWidth = 1000;
    this.virtualHeight = 700;

    this.initCanvasSize();
    this.bindEvents();

    window.addEventListener('resize', () => {
      this.initCanvasSize();
      this.redrawAll();
    });
  }

  initCanvasSize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    this.canvas.width = this.virtualWidth;
    this.canvas.height = this.virtualHeight;
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  setCanDraw(canDraw) {
    this.canDraw = canDraw;
    this.canvas.style.cursor = canDraw ? 'crosshair' : 'default';
  }

  setTool(tool) {
    this.currentTool = tool;
  }

  setColor(color) {
    this.currentColor = color;
    this.currentTool = 'brush';
  }

  setWidth(width) {
    this.currentWidth = parseFloat(width);
  }

  getPointerPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const scaleX = this.virtualWidth / rect.width;
    const scaleY = this.virtualHeight / rect.height;

    return {
      x: Math.round((clientX - rect.left) * scaleX),
      y: Math.round((clientY - rect.top) * scaleY)
    };
  }

  bindEvents() {
    const start = (e) => {
      if (!this.canDraw) return;
      e.preventDefault();
      this.isDrawing = true;
      const pt = this.getPointerPos(e);
      this.currentPoints = [pt];

      this.ctx.beginPath();
      this.ctx.strokeStyle = this.currentTool === 'eraser' ? '#FFFFFF' : this.currentColor;
      this.ctx.lineWidth = this.currentTool === 'eraser' ? this.currentWidth * 2.5 : this.currentWidth;
      this.ctx.arc(pt.x, pt.y, this.ctx.lineWidth / 2, 0, Math.PI * 2);
      this.ctx.fillStyle = this.ctx.strokeStyle;
      this.ctx.fill();
    };

    const move = (e) => {
      if (!this.canDraw || !this.isDrawing) return;
      e.preventDefault();
      const pt = this.getPointerPos(e);
      this.currentPoints.push(pt);

      if (this.currentPoints.length >= 2) {
        this.renderStrokeChunk(this.currentPoints, this.currentTool === 'eraser' ? '#FFFFFF' : this.currentColor, this.currentTool === 'eraser' ? this.currentWidth * 2.5 : this.currentWidth);
      }
    };

    const end = (e) => {
      if (!this.canDraw || !this.isDrawing) return;
      e.preventDefault();
      this.isDrawing = false;

      if (this.currentPoints.length > 0) {
        const stroke = {
          points: this.currentPoints,
          color: this.currentTool === 'eraser' ? '#FFFFFF' : this.currentColor,
          width: this.currentTool === 'eraser' ? this.currentWidth * 2.5 : this.currentWidth,
          tool: this.currentTool
        };
        this.strokes.push(stroke);

        if (this.onStrokeComplete) {
          this.onStrokeComplete(stroke);
        }
      }
      this.currentPoints = [];
    };

    this.canvas.addEventListener('mousedown', start);
    this.canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);

    this.canvas.addEventListener('touchstart', start, { passive: false });
    this.canvas.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end, { passive: false });
  }

  // Smooth quadratic Bézier interpolation
  renderStrokeChunk(points, color, width) {
    if (points.length < 2) return;
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    const p1 = points[points.length - 2];
    const p2 = points[points.length - 1];

    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.stroke();
  }

  drawSingleStroke(stroke) {
    const pts = stroke.points;
    if (!pts || pts.length === 0) return;

    this.ctx.beginPath();
    this.ctx.strokeStyle = stroke.color || '#1E1E24';
    this.ctx.lineWidth = stroke.width || 6;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    if (pts.length === 1) {
      this.ctx.arc(pts[0].x, pts[0].y, (stroke.width || 6) / 2, 0, Math.PI * 2);
      this.ctx.fillStyle = stroke.color || '#1E1E24';
      this.ctx.fill();
      return;
    }

    this.ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const midPoint = {
        x: (pts[i - 1].x + pts[i].x) / 2,
        y: (pts[i - 1].y + pts[i].y) / 2
      };
      this.ctx.quadraticCurveTo(pts[i - 1].x, pts[i - 1].y, midPoint.x, midPoint.y);
    }
    this.ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    this.ctx.stroke();
  }

  redrawAll() {
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this.virtualWidth, this.virtualHeight);

    for (const stroke of this.strokes) {
      this.drawSingleStroke(stroke);
    }
  }

  addRemoteStroke(stroke) {
    this.strokes.push(stroke);
    this.drawSingleStroke(stroke);
  }

  undoStroke() {
    if (this.strokes.length > 0) {
      this.strokes.pop();
      this.redrawAll();
    }
  }

  clearCanvas() {
    this.strokes = [];
    this.redrawAll();
  }

  setStrokes(strokes) {
    this.strokes = strokes || [];
    this.redrawAll();
  }

  getSnapshotBase64() {
    return this.canvas.toDataURL('image/png', 0.85);
  }
}
