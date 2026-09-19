// Doodle & Degree - High-Res Interactive Slide Viewer with Zoom, Pan & Click-to-Pick Words

class SlideViewer {
  constructor(viewportEl, contentContainerEl, onWordClicked) {
    this.viewport = viewportEl;
    this.container = contentContainerEl;
    this.onWordClicked = onWordClicked;

    this.slideData = null;
    this.isClickToPickEnabled = false;

    // Pan & Zoom Transform State
    this.scale = 1.0;
    this.minScale = 0.5;
    this.maxScale = 3.5;
    this.posX = 0;
    this.posY = 0;

    this.isPanning = false;
    this.startX = 0;
    this.startY = 0;

    this.imgEl = null;
    this.overlayEl = null;

    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div id="slideInner" style="position: relative; display: inline-block;">
        <img id="slideImg" class="slide-img" alt="Lecture Slide" />
        <div id="wordBoxesOverlay" style="position: absolute; inset: 0; pointer-events: none;"></div>
      </div>
    `;

    this.imgEl = this.container.querySelector('#slideImg');
    this.overlayEl = this.container.querySelector('#wordBoxesOverlay');

    this.bindPanZoomEvents();
  }

  setClickToPickEnabled(enabled) {
    this.isClickToPickEnabled = enabled;
    this.overlayEl.classList.toggle('picking', enabled);
    if (this.overlayEl) {
      this.overlayEl.style.pointerEvents = enabled ? 'auto' : 'none';
    }
  }

  loadSlide(slide) {
    if (!slide) { this.slideData = null; this.imgEl.removeAttribute('src'); this.overlayEl.innerHTML = ''; return; }
    this.slideData = slide;
    this.overlayEl.replaceChildren();
    const caption=document.getElementById('slideCaption');
    if(caption) caption.textContent=`Slide ${slide.page_num} · same for everyone`;

    this.imgEl.onload = () => {
      this.renderWordBoxes();
      this.fitToViewport();
    };
    this.imgEl.src = slide.image_url;
    if (this.imgEl.complete && this.imgEl.naturalWidth) { this.renderWordBoxes(); this.fitToViewport(); }
  }

  renderWordBoxes() {
    this.overlayEl.innerHTML = '';
    if (!this.slideData || !this.slideData.word_boxes) return;

    for (const box of this.slideData.word_boxes) {
      const [x0, y0, x1, y1] = box.norm_box;
      const widthPct = (x1 - x0) * 100;
      const heightPct = (y1 - y0) * 100;
      const leftPct = x0 * 100;
      const topPct = y0 * 100;

      const el = document.createElement('button');
      el.type = 'button';
      el.setAttribute('aria-label', `Choose ${box.word}`);
      el.className = `word-box-highlight ${box.difficulty === 'challenging' ? 'word-box-challenging' : 'word-box-simple'}`;
      el.style.left = `${leftPct}%`;
      el.style.top = `${topPct}%`;
      el.style.width = `${widthPct}%`;
      el.style.height = `${heightPct}%`;
      el.title = `Click to draw: "${box.word}" (${box.difficulty.toUpperCase()})`;

      el.addEventListener('click', (e) => {
        if (!this.isClickToPickEnabled) return;
        e.stopPropagation();
        if (this.onWordClicked) {
          this.onWordClicked(box.word, box.difficulty);
        }
      });

      this.overlayEl.appendChild(el);
    }
  }

  fitToViewport() {
    if (!this.imgEl.naturalWidth) return;

    const vpWidth = this.viewport.clientWidth - 24;
    const vpHeight = this.viewport.clientHeight - 24;

    const scaleX = vpWidth / this.imgEl.naturalWidth;
    const scaleY = vpHeight / this.imgEl.naturalHeight;
    this.scale = Math.min(scaleX, scaleY, 1.2);
    this.minScale = this.scale * 0.5;

    // Center image
    const scaledW = this.imgEl.naturalWidth * this.scale;
    const scaledH = this.imgEl.naturalHeight * this.scale;
    this.posX = Math.max(12, (this.viewport.clientWidth - scaledW) / 2);
    this.posY = Math.max(12, (this.viewport.clientHeight - scaledH) / 2);

    this.applyTransform();
  }

  zoom(factor, clientX = null, clientY = null) {
    const prevScale = this.scale;
    let newScale = this.scale * factor;
    newScale = Math.max(this.minScale, Math.min(this.maxScale, newScale));

    if (clientX !== null && clientY !== null) {
      const rect = this.viewport.getBoundingClientRect();
      const originX = clientX - rect.left;
      const originY = clientY - rect.top;

      this.posX = originX - (originX - this.posX) * (newScale / prevScale);
      this.posY = originY - (originY - this.posY) * (newScale / prevScale);
    }

    this.scale = newScale;
    this.applyTransform();
  }

  zoomIn() {
    this.zoom(1.25);
  }

  zoomOut() {
    this.zoom(0.8);
  }

  resetZoom() {
    this.fitToViewport();
  }

  applyTransform() {
    this.container.style.transform = `translate(${this.posX}px, ${this.posY}px) scale(${this.scale})`;
  }

  bindPanZoomEvents() {
    // Mouse wheel zoom
    this.viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 0.88;
      this.zoom(factor, e.clientX, e.clientY);
    }, { passive: false });

    // Drag to pan
    const startPan = (e) => {
      if (e.target.classList.contains('word-box-highlight') && this.isClickToPickEnabled) {
        // Allow word click without initiating pan if clicked quickly
        return;
      }
      this.isPanning = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      this.startX = clientX - this.posX;
      this.startY = clientY - this.posY;
    };

    const doPan = (e) => {
      if (!this.isPanning) return;
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      this.posX = clientX - this.startX;
      this.posY = clientY - this.startY;
      this.applyTransform();
    };

    const endPan = () => {
      this.isPanning = false;
    };

    this.viewport.addEventListener('mousedown', startPan);
    window.addEventListener('mousemove', doPan);
    window.addEventListener('mouseup', endPan);

    this.viewport.addEventListener('touchstart', startPan, { passive: true });
    window.addEventListener('touchmove', doPan, { passive: false });
    window.addEventListener('touchend', endPan, { passive: true });
  }
}
