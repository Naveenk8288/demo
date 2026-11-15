/* ==========================================================================
   DS Visualizer — Main Interactive Script (js/main.js)
   - Dark / Light Theme Toggle
   - Mobile Hamburger Navigation & Scroll-Spy Active Link Highlighting
   - Section Tabs ("Overview", "Types", "Example", "Code")
   - Code Snippet Copy Button
   - Scroll-Reveal Animations
   - Interactive Classroom Quick Quiz with Instant Feedback & Score
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------------
     1. Dark / Light Theme Toggle
     ------------------------------------------------------------------------ */
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const root = document.documentElement;
      const current = root.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      if (themeIcon) themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
      if (themeLabel) themeLabel.textContent = next === 'dark' ? 'Light Mode' : 'Dark Mode';
    });
  }

  /* ------------------------------------------------------------------------
     2. Mobile Hamburger Menu & Scroll-Spy Active Nav Link
     ------------------------------------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const navLinksBox = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navLinksBox) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinksBox.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksBox.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const sections = document.querySelectorAll('section[id]');
  function updateActiveNav() {
    const scrollPos = window.scrollY + 160;
    let activeId = 'home';
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) {
        activeId = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      const target = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', target === activeId);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ------------------------------------------------------------------------
     3. Internal Topic Tabs ("Overview", "Types", "Example", "Code")
     ------------------------------------------------------------------------ */
  const tabGroups = document.querySelectorAll('[data-tab-group]');
  tabGroups.forEach(group => {
    const groupName = group.getAttribute('data-tab-group');
    const buttons = group.querySelectorAll('.sec-tab-btn');
    const panes = document.querySelectorAll(`.sec-tab-pane[data-pane-group="${groupName}"]`);

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetPane = btn.getAttribute('data-target');
        buttons.forEach(b => {
          const isSelected = b === btn;
          b.classList.toggle('active', isSelected);
          b.setAttribute('aria-selected', String(isSelected));
        });
        panes.forEach(pane => {
          pane.classList.toggle('active', pane.id === targetPane);
        });
      });
    });
  });

  /* ------------------------------------------------------------------------
     4. Copy Code Buttons
     ------------------------------------------------------------------------ */
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const codeId = btn.getAttribute('data-copy-target');
      const codeEl = document.getElementById(codeId);
      if (!codeEl) return;
      try {
        await navigator.clipboard.writeText(codeEl.innerText);
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => { btn.textContent = originalText; }, 1800);
      } catch {
        btn.textContent = 'Press Ctrl+C';
      }
    });
  });

  /* ------------------------------------------------------------------------
     5. Scroll-Reveal Observer
     ------------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => observer.observe(el));

  /* ------------------------------------------------------------------------
     6. Interactive Classroom Quick Quiz
     ------------------------------------------------------------------------ */
  const quizQuestions = [
    {
      q: "1. Which principle does a Stack data structure follow, and where do insertions/deletions happen?",
      options: [
        "FIFO — Insertion at Rear, Deletion at Front",
        "LIFO — Insertion and Deletion both at TOP",
        "LILO — Insertion at Head, Deletion at Tail",
        "Random Access — Any index in O(1)"
      ],
      answer: 1,
      explanation: "Correct! A Stack follows LIFO (Last-In, First-Out) where both Push and Pop occur at the TOP end in O(1) time."
    },
    {
      q: "2. Why do we use a Circular Queue instead of a Simple Array Queue?",
      options: [
        "To sort elements automatically by priority",
        "To reuse empty front slots freed by Dequeue using modulo arithmetic ((rear + 1) % N)",
        "To allow insertion and deletion at both ends simultaneously",
        "To reduce time complexity from O(n) to O(log n)"
      ],
      answer: 1,
      explanation: "Correct! A Circular Queue wraps REAR around to index 0 using (rear + 1) % N, solving the wasted-space problem."
    },
    {
      q: "3. What is the time complexity of inserting a new node at the HEAD vs. the TAIL of a Singly Linked List (without a tail pointer)?",
      options: [
        "Head: O(1), Tail: O(n)",
        "Head: O(n), Tail: O(1)",
        "Both are O(1)",
        "Both are O(n)"
      ],
      answer: 0,
      explanation: "Correct! Inserting at HEAD only updates two pointers in O(1), while inserting at TAIL requires traversing n nodes in O(n)."
    },
    {
      q: "4. What is the minimum number of moves required to solve the Classic 3-Peg Tower of Hanoi with n = 5 discs?",
      options: [
        "15 moves",
        "25 moves",
        "31 moves (2⁵ - 1)",
        "63 moves"
      ],
      answer: 2,
      explanation: "Correct! Using the formula 2ⁿ - 1, 5 discs require 2⁵ - 1 = 32 - 1 = 31 moves."
    },
    {
      q: "5. Which data structure is used internally by the CPU/compiler to manage recursive function calls like Tower of Hanoi?",
      options: [
        "Priority Queue",
        "Circular Doubly Linked List",
        "Call Stack (LIFO)",
        "Hash Table"
      ],
      answer: 2,
      explanation: "Correct! Recursion uses the system Call Stack to push activation records and pop them when base cases return."
    }
  ];

  const quizMount = document.getElementById('quiz-mount');
  const scoreDisplay = document.getElementById('quiz-score');
  const resetQuizBtn = document.getElementById('quiz-reset-btn');
  let score = 0;
  let answeredCount = 0;

  function renderQuiz() {
    if (!quizMount) return;
    score = 0;
    answeredCount = 0;
    if (scoreDisplay) scoreDisplay.textContent = `Score: 0 / ${quizQuestions.length}`;
    quizMount.innerHTML = '';

    quizQuestions.forEach((item, qIdx) => {
      const card = document.createElement('div');
      card.className = 'quiz-card';

      const qTitle = document.createElement('div');
      qTitle.className = 'quiz-question';
      qTitle.textContent = item.q;
      card.appendChild(qTitle);

      const optsGrid = document.createElement('div');
      optsGrid.className = 'quiz-options';

      const feedback = document.createElement('div');
      feedback.className = 'quiz-feedback';

      item.options.forEach((optText, oIdx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opt-btn';
        btn.textContent = optText;
        btn.addEventListener('click', () => {
          const allBtns = optsGrid.querySelectorAll('.quiz-opt-btn');
          allBtns.forEach(b => { b.disabled = true; });
          answeredCount++;

          if (oIdx === item.answer) {
            btn.classList.add('correct');
            score++;
            feedback.style.color = 'var(--green)';
            feedback.textContent = '✓ ' + item.explanation;
          } else {
            btn.classList.add('wrong');
            allBtns[item.answer].classList.add('correct');
            feedback.style.color = 'var(--orange)';
            feedback.textContent = '✗ ' + item.explanation;
          }

          if (scoreDisplay) {
            scoreDisplay.textContent = `Score: ${score} / ${quizQuestions.length}${answeredCount === quizQuestions.length ? ' — Quiz Complete!' : ''}`;
          }
        });
        optsGrid.appendChild(btn);
      });

      card.appendChild(optsGrid);
      card.appendChild(feedback);
      quizMount.appendChild(card);
    });
  }

  renderQuiz();
  if (resetQuizBtn) {
    resetQuizBtn.addEventListener('click', renderQuiz);
  }

  /* ------------------------------------------------------------------------
     7. PWA Service Worker & Cross-Platform App Install (Android / iOS / macOS)
     ------------------------------------------------------------------------ */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }

  let deferredInstallPrompt = null;
  const installBtn = document.getElementById('install-app-btn');
  const openModalBtns = document.querySelectorAll('.open-install-modal');
  const installModal = document.getElementById('install-app-modal');
  const closeInstallModalBtn = document.getElementById('close-install-modal');
  const nativeBanner = document.getElementById('native-install-banner');
  const triggerNativeBtn = document.getElementById('trigger-native-install');
  const platBtns = document.querySelectorAll('.install-plat-btn');
  const platPanes = {
    android: document.getElementById('plat-android'),
    ios: document.getElementById('plat-ios'),
    macos: document.getElementById('plat-macos')
  };

  function selectPlatformTab(plat) {
    platBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-plat') === plat);
    });
    Object.keys(platPanes).forEach(key => {
      if (platPanes[key]) {
        platPanes[key].classList.toggle('active', key === plat);
      }
    });
  }

  // Auto-detect OS to highlight the right tab by default
  const ua = navigator.userAgent || '';
  if (/iPhone|iPad|iPod/i.test(ua)) {
    selectPlatformTab('ios');
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    selectPlatformTab('macos');
  } else {
    selectPlatformTab('android');
  }

  platBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectPlatformTab(btn.getAttribute('data-plat'));
    });
  });

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (nativeBanner) nativeBanner.hidden = false;
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    if (nativeBanner) nativeBanner.hidden = true;
    if (installModal) installModal.hidden = true;
  });

  async function handleInstallClick() {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        deferredInstallPrompt = null;
        if (nativeBanner) nativeBanner.hidden = true;
        return;
      }
    }
    if (installModal) {
      installModal.hidden = false;
    }
  }

  if (installBtn) {
    installBtn.addEventListener('click', handleInstallClick);
  }
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (installModal) installModal.hidden = false;
    });
  });
  if (triggerNativeBtn) {
    triggerNativeBtn.addEventListener('click', handleInstallClick);
  }
  if (closeInstallModalBtn && installModal) {
    closeInstallModalBtn.addEventListener('click', () => {
      installModal.hidden = true;
    });
    installModal.addEventListener('click', (e) => {
      if (e.target === installModal) installModal.hidden = true;
    });
  }

  /* ------------------------------------------------------------------------
     8. Creator Profile Modal ("Build by Naveen K")
     ------------------------------------------------------------------------ */
  const openProfileBtns = document.querySelectorAll('.open-profile-modal');
  const profileModal = document.getElementById('creator-profile-modal');
  const closeProfileBtn = document.getElementById('close-profile-modal');

  openProfileBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (profileModal) profileModal.hidden = false;
    });
  });

  if (closeProfileBtn && profileModal) {
    closeProfileBtn.addEventListener('click', () => {
      profileModal.hidden = true;
    });
    profileModal.addEventListener('click', (e) => {
      if (e.target === profileModal) profileModal.hidden = true;
    });
  }

  /* ------------------------------------------------------------------------
     9. Liquid Metal Button Click Ripple Effect
     ------------------------------------------------------------------------ */
  document.querySelectorAll('.btn-liquid-metal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'lm-ripple';
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
});
