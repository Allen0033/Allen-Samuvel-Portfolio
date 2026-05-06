document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle (Dark / Light Mode) ---
  const themeSwitch = document.getElementById('theme-switch');
  const body = document.body;
  
  // Check local storage for saved theme
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light') {
    body.setAttribute('data-theme', 'light');
  }

  themeSwitch.addEventListener('click', () => {
    if (body.hasAttribute('data-theme')) {
      body.removeAttribute('data-theme');
      localStorage.setItem('portfolio-theme', 'dark');
    } else {
      body.setAttribute('data-theme', 'light');
      localStorage.setItem('portfolio-theme', 'light');
    }
  });

  // --- Background Star Generation (Space Theme) ---
  const bgContainer = document.getElementById('bg-container');
  if (bgContainer) {
    const starCount = 120;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      
      const posX = Math.floor(Math.random() * 100);
      const posY = Math.floor(Math.random() * 100);
      const size = Math.random() * 3;
      const duration = 2 + Math.random() * 4;
      const delay = Math.random() * 3;
      
      star.style.left = `${posX}vw`;
      star.style.top = `${posY}vh`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.setProperty('--duration', `${duration}s`);
      star.style.animationDelay = `${delay}s`;
      
      bgContainer.appendChild(star);
    }
  }

  // --- Sand Particle Animation (Mars Theme - About Page) ---
  const sandContainer = document.getElementById('sand-particles');
  if (sandContainer) {
    const particleCount = 60;
    for (let i = 0; i < particleCount; i++) {
      createSandParticle(sandContainer);
    }
  }

  function createSandParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'sand-particle';
    
    const size = Math.random() * 3 + 1;
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * -20;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    particle.style.opacity = Math.random() * 0.4 + 0.1;
    
    container.appendChild(particle);

    particle.animate([
      { transform: 'translate(0, 0)', opacity: 0 },
      { transform: 'translate(150px, 80px)', opacity: 0.4, offset: 0.5 },
      { transform: 'translate(300px, 160px)', opacity: 0 }
    ], {
      duration: duration * 1000,
      delay: delay * 1000,
      iterations: Infinity,
      easing: 'linear'
    });
  }

  // --- Storm Theme Animations (Skills Page) ---
  const lightningFlash = document.getElementById('lightning');
  if (lightningFlash) {
    function triggerLightning() {
      // Create a double flash effect
      lightningFlash.animate([
        { opacity: 0 },
        { opacity: 0.8, offset: 0.1 },
        { opacity: 0, offset: 0.2 },
        { opacity: 0.5, offset: 0.3 },
        { opacity: 0 }
      ], {
        duration: 500,
        easing: 'ease-out'
      });

      // Schedule next flash randomly between 3 to 10 seconds
      const nextFlash = Math.random() * 7000 + 3000;
      setTimeout(triggerLightning, nextFlash);
    }
    
    // Start lightning
    setTimeout(triggerLightning, 2000);
  }

  const rainContainer = document.getElementById('rain-particles');
  if (rainContainer) {
    const dropCount = 100;
    for (let i = 0; i < dropCount; i++) {
      createRaindrop(rainContainer);
    }
  }

  function createRaindrop(container) {
    const drop = document.createElement('div');
    drop.className = 'raindrop';
    
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 0.5 + 0.5; // Fast falling (0.5s to 1s)
    const delay = Math.random() * -2; // Random delay so they don't all start at once

    drop.style.left = `${startX}px`;
    drop.style.top = `-50px`; // Start slightly above screen
    
    container.appendChild(drop);

    drop.animate([
      { transform: `translate(0, 0)` },
      { transform: `translate(-20vh, 120vh)` } // slight angle for wind
    ], {
      duration: duration * 1000,
      delay: delay * 1000,
      iterations: Infinity,
      easing: 'linear'
    });
  }

  // --- Winter Theme Snow Animation (Projects Page) ---
  const snowContainer = document.getElementById('snow-container');
  if (snowContainer) {
    // Create 3 layers for depth
    const layers = [
      { count: 50, size: [8, 12], speed: [15, 25], opacity: [0.2, 0.4], blur: '2px' }, // distant
      { count: 30, size: [16, 24], speed: [10, 18], opacity: [0.4, 0.6], blur: '0px' }, // mid
      { count: 15, size: [28, 40], speed: [6, 12], opacity: [0.6, 0.8], blur: '0px', rotate: true } // close
    ];

    layers.forEach(layer => {
      for (let i = 0; i < layer.count; i++) {
        createSnowflake(snowContainer, layer);
      }
    });
  }

  function createSnowflake(container, config) {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake' + (config.rotate ? ' rotate' : '');
    snowflake.innerHTML = '❄';
    
    const size = Math.random() * (config.size[1] - config.size[0]) + config.size[0];
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * (config.speed[1] - config.speed[0]) + config.speed[0];
    const delay = Math.random() * -duration;
    const opacity = Math.random() * (config.opacity[1] - config.opacity[0]) + config.opacity[0];

    snowflake.style.fontSize = `${size}px`;
    snowflake.style.left = `${startX}px`;
    snowflake.style.opacity = opacity;
    if (config.blur) snowflake.style.filter = `blur(${config.blur})`;
    
    container.appendChild(snowflake);

    snowflake.animate([
      { transform: `translateY(-50px) translateX(0) rotate(0deg)`, opacity: opacity },
      { transform: `translateY(105vh) translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0.2 }
    ], {
      duration: duration * 1000,
      delay: delay * 1000,
      iterations: Infinity,
      easing: 'linear'
    });
  }

  // --- Navbar Scroll Effect ---
  // Works for both window scroll (multi-page) and active fp-section scroll (single-page)
  const navbar = document.getElementById('navbar');
  const isFullPage = document.querySelector('.fp-section') !== null;

  if (!isFullPage) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  } else {
    // In fullpage mode the active section scrolls, not window
    document.querySelectorAll('.fp-section').forEach(section => {
      section.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', section.scrollTop > 50);
      });
    });
  }

  // --- Mobile Menu Toggle ---
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('active'));
    });
  }

  // --- Active Link Highlighting (multi-page only; single-page handled by fullpage-init.js) ---
  if (!isFullPage) {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('active', href === currentPath);
    });
  }

  // --- Scroll Reveal & Skill Bar Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  const skillBars = document.querySelectorAll('.skill-bar');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        if (entry.target.classList.contains('skill-category') || entry.target.querySelector('.skill-bar')) {
          const barsInTarget = entry.target.querySelectorAll('.skill-bar');
          barsInTarget.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
          });
        }
      }
    });
  };

  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
  
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
  
  skillBars.forEach(bar => {
    bar.style.width = '0%';
  });

  // --- Butterfly Animation (Contact Page) ---
  const butterflyContainer = document.getElementById('butterfly-container');
  if (butterflyContainer) {
    const butterfly = document.createElement('div');
    butterfly.classList.add('butterfly');
    
    const leftWing = document.createElement('div');
    leftWing.classList.add('wing', 'left');
    
    const rightWing = document.createElement('div');
    rightWing.classList.add('wing', 'right');
    
    butterfly.appendChild(leftWing);
    butterfly.appendChild(rightWing);
    butterflyContainer.appendChild(butterfly);

    let x = -400; // Start further back due to larger size
    let y = Math.random() * window.innerHeight;
    let targetY = y;
    let speedX = 2.5; // Slightly faster for the large butterfly
    let speedY = 0;
    let angle = 0;

    function animateButterfly() {
      x += speedX;
      
      // Calculate a smooth sine wave for the bobbing effect
      let wave = Math.sin(Date.now() / 600) * 15; // Increased wave for huge butterfly
      
      // Smooth vertical wandering
      if (Math.abs(y - targetY) < 20) {
        targetY = y + (Math.random() - 0.5) * 400; // Even larger vertical sweeps
        // Keep within bounds
        targetY = Math.max(100, Math.min(window.innerHeight - 300, targetY));
      }
      
      speedY += (targetY - y) * 0.001;
      speedY *= 0.97; // friction
      y += speedY;

      // Calculate rotation based on movement + wave
      angle = Math.atan2(speedY + (Math.cos(Date.now() / 600) * 5), speedX) * (180 / Math.PI);

      butterfly.style.transform = `translate(${x}px, ${y + wave}px) rotate(${angle}deg)`;

      // Reset when off screen (looping) - use larger buffer for huge butterfly
      if (x > window.innerWidth + 500) {
        x = -500;
        y = Math.random() * (window.innerHeight - 400) + 100;
        targetY = y;
      }

      requestAnimationFrame(animateButterfly);
    }

    animateButterfly();
  }

  // --- Continuous Shooting Stars (Experience Page) ---
  const experiencePage = document.querySelector('.experience-page');
  if (experiencePage) {
    const spaceBg = document.querySelector('.space-background');
    if (spaceBg) {
      // Create Background and Foreground containers
      const bgStarContainer = document.createElement('div');
      bgStarContainer.className = 'shooting-star-container';
      spaceBg.appendChild(bgStarContainer);

      const fgStarContainer = document.createElement('div');
      fgStarContainer.className = 'shooting-star-container foreground';
      spaceBg.appendChild(fgStarContainer);

      function createShootingStar(isForeground = false, isMeteor = false) {
        const star = document.createElement('div');
        star.className = isMeteor ? 'meteorite' : 'shooting-star';
        
        // Random start position
        const startX = Math.random() * (window.innerWidth + 600);
        const startY = Math.random() * (window.innerHeight / 1.5) - 200;
        const angle = 210;
        
        star.style.left = `${startX}px`;
        star.style.top = `${startY}px`;
        star.style.transform = `rotate(${angle}deg)`;
        
        // Append to either foreground or background container
        if (isForeground) {
          fgStarContainer.appendChild(star);
        } else {
          bgStarContainer.appendChild(star);
        }
        
        const duration = isMeteor ? (2000 + Math.random() * 1500) : (1000 + Math.random() * 1000);
        
        star.animate([
          { transform: `rotate(${angle}deg) translateX(0)`, opacity: 0 },
          { transform: `rotate(${angle}deg) translateX(-150px)`, opacity: 1, offset: 0.1 },
          { transform: `rotate(${angle}deg) translateX(-1500px)`, opacity: 0 }
        ], {
          duration: duration,
          easing: 'linear'
        });

        setTimeout(() => star.remove(), duration);
      }

      // Function to spawn a "group" of stars
      function spawnGroup() {
        const count = Math.floor(Math.random() * 3) + 2; // 2-5 stars per group
        for (let i = 0; i < count; i++) {
          setTimeout(() => {
            const isFG = Math.random() > 0.6; // 40% chance for foreground
            const isMeteor = Math.random() > 0.8; // 20% chance for meteorite
            createShootingStar(isFG, isMeteor);
          }, i * 200); // Slight stagger within the group
        }
      }

      // Initial continuous loop
      function startContinuousStars() {
        spawnGroup();
        const nextSpawn = 1500 + Math.random() * 2000; // Spawn a new group every 1.5-3.5 seconds
        setTimeout(startContinuousStars, nextSpawn);
      }

      startContinuousStars();
    }
  }
});

