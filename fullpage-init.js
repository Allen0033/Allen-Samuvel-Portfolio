/**
 * fullpage-init.js
 * Initializes the FullPageScroll controller and wires up
 * all nav link clicks, section-aware animations, and
 * the active nav highlighting.
 */
document.addEventListener('DOMContentLoaded', () => {

  // Boot the fullpage controller
  const fp = new FullPageScroll({ duration: 750 });

  // ── Wire ALL anchor links that carry data-fp-target ──────────────────────
  document.querySelectorAll('[data-fp-target]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const targetId = el.dataset.fpTarget;
      const idx = fp.sections.findIndex(s => s.id === targetId);
      if (idx !== -1) fp.goTo(idx);

      // Close mobile menu if open
      const navLinks = document.getElementById('nav-links');
      if (navLinks) navLinks.classList.remove('active');
    });
  });

  // ── Active nav link: match by data-fp-target ─────────────────────────────
  function highlightNav(sectionId) {
    document.querySelectorAll('.nav-links a[data-fp-target]').forEach(a => {
      a.classList.toggle('active', a.dataset.fpTarget === sectionId);
    });
  }

  // Override the controller's _updateNav to use our smarter version
  const origGoTo = fp.goTo.bind(fp);
  fp.goTo = function(index) {
    origGoTo(index);
    const section = fp.sections[index];
    if (section) highlightNav(section.id);
  };

  // Highlight on load
  const initial = fp.sections[fp.currentIndex];
  if (initial) highlightNav(initial.id);

  // ── Reveal elements in the current (first) section immediately ───────────
  fp.sections[0]?.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));

  // ── Re-trigger reveal when a section becomes visible ────────────────────
  // We patch after each transition ends
  fp.sections.forEach(section => {
    section.addEventListener('transitionend', () => {
      if (parseFloat(section.style.opacity) === 1) {
        section.querySelectorAll('.reveal').forEach(el => {
          el.classList.add('active');
          el.querySelectorAll('.skill-bar').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width') || '0%';
          });
        });
      }
    });
  });

});
