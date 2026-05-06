/**
 * FullPage Scroll Controller
 * Handles smooth full-screen section scrolling with keyboard,
 * mouse wheel, and touch swipe support.
 */
class FullPageScroll {
  constructor(options = {}) {
    this.sections = Array.from(document.querySelectorAll('.fp-section'));
    this.currentIndex = 0;
    this.isAnimating = false;
    this.animationDuration = options.duration || 800;
    this.touchStartY = 0;
    this.touchStartX = 0;
    this.wheelCooldown = false;
    this.navDots = [];

    if (this.sections.length === 0) return;

    this._init();
  }

  _init() {
    this._setupStyles();
    this._createDots();
    this._updateNav();
    this._bindEvents();
    this._checkHash();
  }

  _setupStyles() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';

    this.sections.forEach((section, i) => {
      section.style.position = 'fixed';
      section.style.top = '0';
      section.style.left = '0';
      section.style.width = '100%';
      section.style.height = '100vh';
      section.style.overflowY = 'auto';
      section.style.overflowX = 'hidden';
      section.style.transition = `transform ${this.animationDuration}ms cubic-bezier(0.77, 0, 0.175, 1), opacity ${this.animationDuration}ms ease`;
      section.style.willChange = 'transform';
      section.style.zIndex = i === 0 ? '10' : '1';
      this._setPosition(section, i === 0 ? 0 : 1); // 0 = visible, 1 = below
    });
  }

  _setPosition(section, pos) {
    // pos: 0 = current (on-screen), -1 = above, 1 = below
    if (pos === 0) {
      section.style.transform = 'translateY(0)';
      section.style.opacity = '1';
      section.style.zIndex = '10';
      section.style.pointerEvents = 'all';
    } else if (pos === -1) {
      section.style.transform = 'translateY(-100vh)';
      section.style.opacity = '0';
      section.style.zIndex = '1';
      section.style.pointerEvents = 'none';
    } else {
      section.style.transform = 'translateY(100vh)';
      section.style.opacity = '0';
      section.style.zIndex = '1';
      section.style.pointerEvents = 'none';
    }
  }

  _createDots() {
    const dotsContainer = document.createElement('div');
    dotsContainer.id = 'fp-dots';
    dotsContainer.style.cssText = `
      position: fixed;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 9999;
    `;

    this.sections.forEach((section, i) => {
      const dot = document.createElement('button');
      const label = section.getAttribute('data-section') || `Section ${i + 1}`;
      dot.setAttribute('aria-label', `Go to ${label}`);
      dot.style.cssText = `
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.8);
        background: transparent;
        cursor: pointer;
        padding: 0;
        transition: all 0.3s ease;
        outline: none;
      `;
      dot.addEventListener('click', () => this.goTo(i));
      dotsContainer.appendChild(dot);
      this.navDots.push(dot);
    });

    document.body.appendChild(dotsContainer);
    this._updateDots();

    // Hide dots on mobile
    const mq = window.matchMedia('(max-width: 768px)');
    dotsContainer.style.display = mq.matches ? 'none' : 'flex';
    mq.addEventListener('change', e => {
      dotsContainer.style.display = e.matches ? 'none' : 'flex';
    });
  }

  _updateDots() {
    this.navDots.forEach((dot, i) => {
      if (i === this.currentIndex) {
        dot.style.background = 'rgba(255,255,255,1)';
        dot.style.transform = 'scale(1.4)';
      } else {
        dot.style.background = 'transparent';
        dot.style.transform = 'scale(1)';
      }
    });
  }

  _updateNav() {
    const section = this.sections[this.currentIndex];
    const sectionId = section ? section.id : '';
    const sectionName = section ? section.getAttribute('data-section') : '';

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${sectionId}` || (href && href.includes(sectionName))) {
        link.classList.add('active');
      }
      // Match by index-based data attribute
      if (link.dataset.fpTarget === sectionId) {
        link.classList.add('active');
      }
    });
  }

  _bindEvents() {
    // Mouse wheel
    window.addEventListener('wheel', e => this._onWheel(e), { passive: false });

    // Keyboard
    window.addEventListener('keydown', e => this._onKeyDown(e));

    // Touch
    window.addEventListener('touchstart', e => this._onTouchStart(e), { passive: true });
    window.addEventListener('touchend', e => this._onTouchEnd(e), { passive: true });

    // Nav link clicks
    document.querySelectorAll('.nav-links a[data-fp-target]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.dataset.fpTarget;
        const idx = this.sections.findIndex(s => s.id === targetId);
        if (idx !== -1) this.goTo(idx);
      });
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.sections.forEach((section, i) => {
        section.style.height = '100vh';
      });
    });
  }

  _isAtBottom(section) {
    return section.scrollTop + section.clientHeight >= section.scrollHeight - 5;
  }

  _isAtTop(section) {
    return section.scrollTop <= 5;
  }

  _onWheel(e) {
    if (this.isAnimating || this.wheelCooldown) return;

    const section = this.sections[this.currentIndex];
    const hasScroll = section.scrollHeight > section.clientHeight + 10;

    // If section has inner scroll, allow it until user reaches boundary
    if (hasScroll) {
      if (e.deltaY > 0 && !this._isAtBottom(section)) return; // scrolling down, not at bottom
      if (e.deltaY < 0 && !this._isAtTop(section)) return;    // scrolling up, not at top
    }

    e.preventDefault();
    this.wheelCooldown = true;
    setTimeout(() => { this.wheelCooldown = false; }, this.animationDuration + 300);

    if (e.deltaY > 0) {
      this.next();
    } else {
      this.prev();
    }
  }

  _onKeyDown(e) {
    if (this.isAnimating) return;
    const section = this.sections[this.currentIndex];
    const hasScroll = section.scrollHeight > section.clientHeight + 10;

    switch (e.key) {
      case 'ArrowDown':
      case 'PageDown':
        if (hasScroll && !this._isAtBottom(section)) return; // allow inner scroll
        e.preventDefault();
        this.next();
        break;
      case 'ArrowUp':
      case 'PageUp':
        if (hasScroll && !this._isAtTop(section)) return;
        e.preventDefault();
        this.prev();
        break;
      case 'Home':
        e.preventDefault();
        this.goTo(0);
        break;
      case 'End':
        e.preventDefault();
        this.goTo(this.sections.length - 1);
        break;
    }
  }

  _onTouchStart(e) {
    this.touchStartY = e.changedTouches[0].screenY;
    this.touchStartX = e.changedTouches[0].screenX;
  }

  _onTouchEnd(e) {
    if (this.isAnimating) return;
    const dy = this.touchStartY - e.changedTouches[0].screenY;
    const dx = Math.abs(this.touchStartX - e.changedTouches[0].screenX);

    if (Math.abs(dy) < 50 || dx > Math.abs(dy)) return;

    const section = this.sections[this.currentIndex];
    const hasScroll = section.scrollHeight > section.clientHeight + 10;

    if (hasScroll) {
      if (dy > 0 && !this._isAtBottom(section)) return;
      if (dy < 0 && !this._isAtTop(section)) return;
    }

    if (dy > 0) {
      this.next();
    } else {
      this.prev();
    }
  }

  _checkHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const idx = this.sections.findIndex(s => s.id === hash);
      if (idx !== -1) {
        // Instantly position all sections without animation
        this.sections.forEach((s, i) => {
          s.style.transition = 'none';
          this._setPosition(s, i < idx ? -1 : i === idx ? 0 : 1);
        });
        this.currentIndex = idx;
        this._updateDots();
        this._updateNav();
        // Re-enable transitions after next frame
        requestAnimationFrame(() => {
          this.sections.forEach(s => {
            s.style.transition = `transform ${this.animationDuration}ms cubic-bezier(0.77, 0, 0.175, 1), opacity ${this.animationDuration}ms ease`;
          });
        });
      }
    }
  }

  goTo(index) {
    if (index < 0 || index >= this.sections.length || index === this.currentIndex || this.isAnimating) return;

    this.isAnimating = true;
    const direction = index > this.currentIndex ? 1 : -1;
    const current = this.sections[this.currentIndex];
    const next = this.sections[index];

    // Position next section just off-screen (below or above)
    next.style.transition = 'none';
    next.scrollTop = 0; // Reset inner scroll
    this._setPosition(next, direction);

    // Force reflow
    next.getBoundingClientRect();

    // Re-enable transitions
    next.style.transition = `transform ${this.animationDuration}ms cubic-bezier(0.77, 0, 0.175, 1), opacity ${this.animationDuration}ms ease`;
    current.style.transition = `transform ${this.animationDuration}ms cubic-bezier(0.77, 0, 0.175, 1), opacity ${this.animationDuration}ms ease`;

    // Animate
    this._setPosition(current, -direction);
    this._setPosition(next, 0);

    this.currentIndex = index;
    this._updateDots();
    this._updateNav();
    history.replaceState(null, '', `#${next.id}`);

    setTimeout(() => {
      this.isAnimating = false;
      // Trigger reveal animations in newly shown section
      next.querySelectorAll('.reveal:not(.active)').forEach(el => {
        el.classList.add('active');
        el.querySelectorAll('.skill-bar').forEach(bar => {
          bar.style.width = bar.getAttribute('data-width') || '0%';
        });
      });
    }, this.animationDuration);
  }

  next() { this.goTo(this.currentIndex + 1); }
  prev() { this.goTo(this.currentIndex - 1); }
}
