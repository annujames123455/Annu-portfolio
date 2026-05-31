/* ==========================================================================
   PREMIUM PORTFOLIO INTERACTIVITY - ANNU JAMES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. SYSTEM-PREFERENCED LIGHT/DARK ENGINE
  // ==========================================
  const htmlElement = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Set default theme state
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    htmlElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }

  // Toggle Action
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    showToast(`Switched to ${newTheme} theme`, 'info');
  });


  // ==========================================
  // 2. MOBILE MENU NAVIGATION
  // ==========================================
  const burgerMenuBtn = document.getElementById('mobile-menu-trigger');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMobileMenu() {
    burgerMenuBtn.classList.toggle('active');
    mobileNavOverlay.classList.toggle('active');
    document.body.style.overflow = mobileNavOverlay.classList.contains('active') ? 'hidden' : 'auto';
  }

  burgerMenuBtn.addEventListener('click', toggleMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      burgerMenuBtn.classList.remove('active');
      mobileNavOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });


  // ==========================================
  // 3. CANVAS INTERACTIVE PARTICLES SYSTEM
  // ==========================================
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  const numberOfParticles = 40;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  // Particle Blueprint
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1; // subtle small sizes
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off screen boundaries
      if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
      if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
    }

    draw() {
      // Fetch dynamic colors based on theme HSL settings (indirectly using canvas opacity)
      const currentTheme = htmlElement.getAttribute('data-theme');
      ctx.fillStyle = currentTheme === 'dark' ? 'rgba(167, 139, 250, 0.15)' : 'rgba(99, 102, 241, 0.1)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Connect particles with extremely faint lines if they are close
    const currentTheme = htmlElement.getAttribute('data-theme');
    const strokeColor = currentTheme === 'dark' ? 'rgba(167, 139, 250, 0.03)' : 'rgba(99, 102, 241, 0.02)';
    
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
      
      for (let j = i; j < particlesArray.length; j++) {
        const dx = particlesArray[i].x - particlesArray[j].x;
        const dy = particlesArray[i].y - particlesArray[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
          ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();


  // ==========================================
  // 4. HERO SECTION AUTO-TYPING ENGINE
  // ==========================================
  const typingSpan = document.getElementById('typing-text');
  const roles = [
    "Computer Science Student",
    "Full-Stack Web Developer",
    "Open-Source Contributor",
    "Creative Technical Event Lead"
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function handleTypeEffect() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typingSpan.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40; // faster deleting
    } else {
      typingSpan.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80; // steady writing
    }

    // Checking boundaries
    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full text
      isDeleting = true;
      typingSpeed = 1500; // wait 1.5s
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // brief pause before next word
    }

    setTimeout(handleTypeEffect, typingSpeed);
  }

  // Kickstart Typing Loop
  setTimeout(handleTypeEffect, 500);


  // ==========================================
  // 5. INTERSECTION OBSERVER (REVEAL & NAV ACTIVATE)
  // ==========================================
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll Reveals
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // Auto Active Nav Links
  window.addEventListener('scroll', () => {
    let currentActiveSectionId = '';
    const scrollPosition = window.scrollY + 200; // offset navigation height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentActiveSectionId = section.getAttribute('id');
      }
    });

    if (currentActiveSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });


  // ==========================================
  // 6. INTERACTIVE SKILLS TAB FILTERING
  // ==========================================
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Sync buttons
      skillTabs.forEach(btn => btn.classList.remove('active'));
      tab.classList.add('active');

      const filterGroup = tab.getAttribute('data-skill-group');

      skillCards.forEach(card => {
        const cardGroup = card.getAttribute('data-group');
        
        if (filterGroup === 'all' || cardGroup === filterGroup) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });


  // ==========================================
  // 7. PROJECT FILTERING ENGINE
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Sync visual state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });


  // ==========================================
  // 8. DRAWER DETAIL MODAL ENGINE & DATABASE
  // ==========================================
  const projectsData = {
    'splittr': {
      title: "Splittr - Ride Expense Sharing App",
      category: "Featured Web App",
      icon: "fa-car-side",
      desc: "An automated ride fare splitting application that solves group transit logging hassles. Deployed directly on Vercel with serverless configurations.",
      tech: ["Next.js", "Tailwind CSS", "Supabase", "Vercel", "JavaScript"],
      features: [
        "Facilitates fully automated calculations for ride splitting calculations based on dynamic routes.",
        "Integrated robust user authentication schemes securing accounts and profiles via Supabase auth.",
        "Equipped with interactive ride logs, fare tracking histories, and visual analytics dashboards.",
        "Allows direct email invitations to share splitting templates with fellow commuters."
      ]
    },
    'college-event': {
      title: "College Event Management System",
      category: "Full-Stack Web Dev / SQL",
      icon: "fa-calendar-days",
      desc: "A comprehensive student-facing administrative platform designed for community-wide event registration, log management, and cross-channel event coordinator tracking.",
      tech: ["HTML5", "CSS3", "MySQL", "PHP / XAMPP", "Git/GitHub"],
      features: [
        "Enabled students to easily discover ongoing seminars, competitive hackathons, and local cultural functions.",
        "Equipped coordinators with robust CRUD control panels to upload, alter, and manage registrations.",
        "Secured databases with filtered views ensuring data privacy for coordinator logs.",
        "Served as Team Lead, structuring schema dependencies and ensuring project milestones were completed on Git."
      ]
    },
    'expense-tracker': {
      title: "Expense & Budget Tracker Dashboard",
      category: "Personal Finance / Web App",
      icon: "fa-wallet",
      desc: "An elegant finance dashboard enabling individuals to monitor accounts, categorize expenditures, log balances, and visually audit monthly budgeting habits.",
      tech: ["HTML5", "CSS3 Glass", "Vanilla JavaScript", "Node.js", "MongoDB"],
      features: [
        "Engineered visual charts, budget graphs, and expenditure bars mapping real-time logs.",
        "Built responsive CRUD operations allowing direct additions and quick removal of expenditures.",
        "Integrated category filtering (Groceries, Transit, Education) for efficient budget reviews.",
        "Utilized local and database storage ensuring smooth persistence of active logs."
      ]
    },
    'whatsapp-auto': {
      title: "WhatsApp API Automation System",
      category: "API Automation & Scripting",
      icon: "fa-brands fa-whatsapp",
      desc: "A headless automation daemon orchestrating session caching, automatic scheduled replies, and profile details fetching using lightweight REST APIs.",
      tech: ["Node.js", "WhatsApp Web API", "Express.js", "REST APIs", "JSON Cache"],
      features: [
        "Orchestrated session persistence with QR-code scans to keep accounts securely connected without browser dependencies.",
        "Built custom endpoints fetching profile status URLs and feeding profile images directly into frontend panels.",
        "Equipped with message scheduling pipelines triggering alerts based on scheduled webhooks.",
        "Designed to operate smoothly in the background, utilizing system logs to flag network outages."
      ]
    },
    'trash-treasure': {
      title: "Trash to Treasure Waste Analytics",
      category: "AI/ML & IoT Hackathon Project",
      icon: "fa-recycle",
      desc: "An innovative waste classification automation prototype built for HackForImpact, sorting waste into biodegradable, recyclable, or electronic tracks.",
      tech: ["Python", "IoT Basics", "TensorFlow", "OpenCV", "Electronics"],
      features: [
        "Configured physical smart container trigger layouts powered by custom Python scripts.",
        "Utilized image classification algorithms analyzing captured items to classify target categories.",
        "Aimed at optimizing public recycling facilities and lowering municipal trash sort labor.",
        "Shortlisted at the district level for innovative solution pathways."
      ]
    },
    'gssoc-contrib': {
      title: "GirlScript Summer of Code Contributions",
      category: "Open Source Collaboration",
      icon: "fa-code-fork",
      desc: "Collaborated in high-scale developer repositories, resolving complex bug trackers, coding new features, and submitting merge-ready code for review.",
      tech: ["Python", "Java", "Git & GitHub", "Documentation", "Agile Review"],
      features: [
        "Resolved real-world repository issues using core algorithms and modular coding in Python and Java.",
        "Raised, polished, and successfully merged multiple pull requests on GitHub.",
        "Collaborated with project mentors on strict code audits and formatting styles.",
        "Drafted deep documentation mapping workflow standards and installation procedures."
      ]
    }
  };

  const drawerOverlay = document.getElementById('project-detail-drawer');
  const drawerPanel = drawerOverlay.querySelector('.drawer-panel');
  const drawerCloseBtn = drawerOverlay.querySelector('.drawer-close');
  const drawerDynamicContent = document.getElementById('drawer-dynamic-content');

  function openDrawer(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    // Build Drawer HTML
    let techTagsHTML = data.tech.map(t => `<span>${t}</span>`).join('');
    let featuresHTML = data.features.map(f => `
      <div class="drawer-feature-item">
        <i class="fa-solid fa-circle-check"></i>
        <span>${f}</span>
      </div>
    `).join('');

    drawerDynamicContent.innerHTML = `
      <div class="drawer-content-header">
        <span>${data.category}</span>
        <h2>${data.title}</h2>
      </div>
      
      <div class="drawer-img-graphic">
        <i class="fa-solid ${data.icon}"></i>
      </div>
      
      <div class="drawer-desc-block">
        <h4>Overview</h4>
        <p>${data.desc}</p>
      </div>

      <div class="drawer-tech-grid">
        <h4>Built With</h4>
        <div class="drawer-tech-tags">
          ${techTagsHTML}
        </div>
      </div>

      <div class="drawer-features-block">
        <h4>Key Achievements & Features</h4>
        <div class="drawer-feature-list">
          ${featuresHTML}
        </div>
      </div>
    `;

    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // halt page scrolling
  }

  function closeDrawer() {
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = 'auto'; // release scrolling
  }

  // Event delegation for opening triggers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.trigger-detail');
    if (trigger) {
      const projectId = trigger.getAttribute('data-project');
      openDrawer(projectId);
    }
  });

  drawerCloseBtn.addEventListener('click', closeDrawer);
  
  // Close drawer on overlay backdrop clicking
  drawerOverlay.addEventListener('click', (e) => {
    if (e.target === drawerOverlay) {
      closeDrawer();
    }
  });


  // ==========================================
  // 9. DYNAMIC FORM SUBMIT & SUCCESS TOASTS
  // ==========================================
  const contactForm = document.getElementById('portfolio-contact-form');
  const submitBtn = document.getElementById('btn-submit-form');
  const toastContainer = document.getElementById('toast-container');

  // Custom Toast Generator
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-triangle-exclamation';
    if (type === 'info') iconClass = 'fa-circle-info';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass}"></i>
      <span class="toast-msg">${message}</span>
    `;

    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.add('show');
    }, 50);

    // Remove toast after 4 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4000);
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameVal = document.getElementById('contact-name').value.trim();
    const emailVal = document.getElementById('contact-email').value.trim();
    const subjectVal = document.getElementById('contact-subject').value.trim();
    const messageVal = document.getElementById('contact-message').value.trim();

    if (!nameVal || !emailVal || !subjectVal || !messageVal) {
      showToast("Please fill out all fields.", "error");
      return;
    }

    // Set Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Sending... <i class="fa-solid fa-spinner fa-spin"></i>`;

    // Simulate Server Request (1.5 seconds)
    setTimeout(() => {
      showToast(`Thank you, ${nameVal}! Your message has been sent successfully.`, 'success');
      
      // Reset Form State
      contactForm.reset();
      
      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Send Message <i class="fa-solid fa-paper-plane"></i>`;
    }, 1500);
  });

});
