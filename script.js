(() => {
  "use strict";

  /* ==========================================================================
     Helpers & shared data
     ========================================================================== */
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#icon-${name}"/></svg>`;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollBehavior = reducedMotion ? "auto" : "smooth";

  const PROGRAMS = {
    forge: {
      name: "Foundation Forge",
      level: "Beginner",
      tags: ["Strength", "Full body"],
      weeks: 6,
      days: 3,
      minutes: 40,
      goal: "strength",
      experience: "beginner",
      lead: "A six-week on-ramp to serious training. You'll learn the four fundamental patterns and build a base of strength that carries into every program after this one.",
      split: [
        { label: "Day 1", focus: "Full Body A" },
        { label: "Day 2", focus: "Full Body B" },
        { label: "Day 3", focus: "Full Body C" },
        { label: "Day 4", focus: "Optional conditioning" },
      ],
      movements: [
        { name: "Barbell back squat", scheme: "3 × 6–8" },
        { name: "Romanian deadlift", scheme: "3 × 8–10" },
        { name: "Dumbbell bench press", scheme: "3 × 8–10" },
        { name: "Lat pulldown", scheme: "3 × 10–12" },
        { name: "Walking lunge", scheme: "2 × 10 / leg" },
        { name: "Plank", scheme: "3 × 30–45 s" },
      ],
    },
    reset: {
      name: "Total Body Reset",
      level: "Beginner",
      tags: ["Dumbbells", "Low impact"],
      weeks: 4,
      days: 3,
      minutes: 35,
      goal: "health",
      experience: "beginner",
      lead: "A joint-friendly reset built on dumbbells and bodyweight. Perfect if you're returning after a break or want to rebuild habits without living in the gym.",
      split: [
        { label: "Day 1", focus: "Lower body" },
        { label: "Day 2", focus: "Upper body" },
        { label: "Day 3", focus: "Full-body flow" },
        { label: "Day 4", focus: "Mobility & walk" },
      ],
      movements: [
        { name: "Goblet squat", scheme: "3 × 10–12" },
        { name: "Dumbbell row", scheme: "3 × 10–12" },
        { name: "Incline push-up", scheme: "3 × 8–12" },
        { name: "Hip bridge", scheme: "3 × 12–15" },
        { name: "Farmer carry", scheme: "3 × 30 m" },
        { name: "Dead bug", scheme: "3 × 8 / side" },
      ],
    },
    daily30: {
      name: "The Daily 30",
      level: "Beginner",
      tags: ["Home", "Time-efficient"],
      weeks: 5,
      days: 4,
      minutes: 30,
      goal: "fat",
      experience: "beginner",
      lead: "Thirty minutes, four times a week, one pair of dumbbells. A compact full-body plan using supersets to keep density high and sessions short.",
      split: [
        { label: "Day 1", focus: "Upper push / pull" },
        { label: "Day 2", focus: "Legs & core" },
        { label: "Day 3", focus: "Full-body superset" },
        { label: "Day 4", focus: "Conditioning" },
      ],
      movements: [
        { name: "Dumbbell floor press", scheme: "3 × 10–12" },
        { name: "Single-arm row", scheme: "3 × 10 / side" },
        { name: "Goblet squat", scheme: "3 × 12–15" },
        { name: "Dumbbell RDL", scheme: "3 × 10–12" },
        { name: "Dumbbell shoulder press", scheme: "3 × 10–12" },
        { name: "Hollow hold", scheme: "3 × 30 s" },
      ],
    },
    power: {
      name: "Power Build",
      level: "Advanced",
      tags: ["Strength", "Periodized"],
      weeks: 8,
      days: 4,
      minutes: 60,
      goal: "strength",
      experience: "advanced",
      lead: "A heavy, periodized strength block for lifters with 3+ years of experience. Weeks build from volume to intensity and peak in week 7 before a small deload.",
      split: [
        { label: "Day 1", focus: "Squat focus" },
        { label: "Day 2", focus: "Bench focus" },
        { label: "Day 3", focus: "Deadlift focus" },
        { label: "Day 4", focus: "Accessories" },
      ],
      movements: [
        { name: "Barbell back squat", scheme: "5 × 5" },
        { name: "Bench press", scheme: "5 × 5" },
        { name: "Deadlift", scheme: "3 × 3" },
        { name: "Overhead press", scheme: "4 × 6" },
        { name: "Barbell row", scheme: "4 × 8" },
        { name: "Weighted pull-up", scheme: "4 × 5" },
      ],
    },
    engine: {
      name: "Hypertrophy Engine",
      level: "Advanced",
      tags: ["Hypertrophy", "High volume"],
      weeks: 10,
      days: 5,
      minutes: 70,
      goal: "muscle",
      experience: "advanced",
      lead: "High-volume push / pull / legs over five days. Built around precise weekly set targets, 10–20 rep ranges and controlled eccentrics.",
      split: [
        { label: "Day 1", focus: "Push" },
        { label: "Day 2", focus: "Pull" },
        { label: "Day 3", focus: "Legs" },
        { label: "Day 4", focus: "Upper" },
        { label: "Day 5", focus: "Lower + arms" },
      ],
      movements: [
        { name: "Incline dumbbell press", scheme: "4 × 8–12" },
        { name: "Cable row", scheme: "4 × 10–12" },
        { name: "Hack squat", scheme: "4 × 8–10" },
        { name: "Lateral raise", scheme: "4 × 12–15" },
        { name: "Cable curl", scheme: "3 × 12–15" },
        { name: "Rope pushdown", scheme: "3 × 12–15" },
      ],
    },
    athletic: {
      name: "Athletic Edge",
      level: "Advanced",
      tags: ["Performance", "Conditioning"],
      weeks: 8,
      days: 5,
      minutes: 55,
      goal: "health",
      experience: "advanced",
      lead: "Explosive strength, speed and work capacity in one block. Designed for athletes and anyone who wants to move like one.",
      split: [
        { label: "Day 1", focus: "Lower power + sprint" },
        { label: "Day 2", focus: "Upper strength" },
        { label: "Day 3", focus: "Conditioning" },
        { label: "Day 4", focus: "Full-body power" },
        { label: "Day 5", focus: "Mobility + core" },
      ],
      movements: [
        { name: "Trap-bar jump", scheme: "4 × 3" },
        { name: "Box squat", scheme: "4 × 5" },
        { name: "Med-ball throw", scheme: "4 × 5" },
        { name: "Sprint", scheme: "6 × 30 m" },
        { name: "Chin-up", scheme: "4 × 6" },
        { name: "Pallof press", scheme: "3 × 10 / side" },
      ],
    },
  };

  const RECIPES = {
    bowl: {
      name: "Green Power Bowl",
      category: "Lunch · Vegetarian",
      time: "20 min",
      lead: "A balanced bowl that hits protein, fibre and colour. Batch the quinoa and roast the chickpeas on Sunday for fast lunches all week.",
      facts: [
        ["520", "kcal"],
        ["24 g", "protein"],
        ["58 g", "carbs"],
        ["22 g", "fats"],
      ],
      ingredients: [
        "80 g dry quinoa, rinsed",
        "2 cups broccoli florets",
        "120 g cooked chickpeas, patted dry",
        "1 handful baby spinach",
        "½ avocado, sliced",
        "1 tbsp tahini",
        "Juice of ½ lemon",
        "1 tsp olive oil, salt & pepper",
      ],
      steps: [
        "Heat the oven to 200°C. Toss broccoli and chickpeas with olive oil, salt and pepper. Roast for 18–20 minutes until crisp.",
        "Simmer quinoa in 160 ml water for 12 minutes. Fluff with a fork and season.",
        "Whisk tahini with lemon juice and 2–3 tbsp water until pourable.",
        "Build the bowl with quinoa, spinach, roasted veg and avocado. Drizzle with dressing.",
      ],
      tip: "No tahini? Use Greek yogurt with lemon and a pinch of cumin — extra protein, same bright finish.",
    },
    salmon: {
      name: "Lemon Herb Salmon",
      category: "Dinner · High protein",
      time: "25 min",
      lead: "Pan-seared salmon with quinoa, charred greens and a garlic-lemon sauce. High protein, high flavour, ready in under half an hour.",
      facts: [
        ["610", "kcal"],
        ["42 g", "protein"],
        ["45 g", "carbs"],
        ["28 g", "fats"],
      ],
      ingredients: [
        "150 g salmon fillet",
        "70 g dry quinoa",
        "100 g asparagus",
        "1 cup spinach",
        "1 clove garlic, minced",
        "1 tbsp olive oil",
        "½ lemon, juice + zest",
        "Fresh parsley & dill",
      ],
      steps: [
        "Cook quinoa in salted water for 12–15 minutes, then drain and cover.",
        "Season salmon with lemon zest, salt and pepper. Sear skin-side down for 4–5 minutes, flip and cook 2–3 minutes more.",
        "Sauté asparagus and spinach with garlic and olive oil for 3 minutes.",
        "Plate everything and finish with lemon juice and fresh herbs.",
      ],
      tip: "Rest the salmon for 2 minutes before serving — carry-over heat finishes the centre and keeps it juicy.",
    },
    oats: {
      name: "Berry Overnight Oats",
      category: "Breakfast · Meal prep",
      time: "5 min + overnight",
      lead: "Rolled oats, Greek yogurt, chia and mixed berries. Prepare once, then grab-and-go for three mornings without thinking about breakfast.",
      facts: [
        ["420", "kcal"],
        ["26 g", "protein"],
        ["52 g", "carbs"],
        ["12 g", "fats"],
      ],
      ingredients: [
        "60 g rolled oats",
        "150 g Greek yogurt",
        "100 ml milk of choice",
        "1 tbsp chia seeds",
        "1 tsp honey",
        "100 g mixed berries",
        "Pinch of cinnamon",
        "1 tsp almond butter (optional)",
      ],
      steps: [
        "Stir oats, yogurt, milk, chia, honey and cinnamon together in a jar.",
        "Seal and refrigerate overnight (or at least 4 hours).",
        "Top with berries and almond butter before eating. Keeps for 3 days.",
      ],
      tip: "Swapping Greek yogurt for skyr adds extra protein. Training early? Stir in a scoop of whey before refrigerating.",
    },
  };

  const SCHEDULES = {
    fat: {
      2: ["Full-body circuit", null, "Strength intervals", null, null, "Active recovery", null],
      3: ["Full-body circuit", null, "Upper strength + HIIT", null, "Lower strength + HIIT", "Active recovery", null],
      4: ["Upper strength", "Lower + intervals", null, "Full-body circuit", "HIIT + core", null, "Active recovery"],
      5: ["Push + intervals", "Pull strength", "Legs + conditioning", null, "Full-body circuit", "HIIT + core", "Active recovery"],
      6: ["Push + intervals", "Pull strength", "Legs + conditioning", "Upper circuit", "Lower + HIIT", "Full-body finisher", null],
    },
    muscle: {
      2: ["Full-body A", null, "Full-body B", null, null, "Mobility & walk", null],
      3: ["Push", null, "Pull", null, "Legs", null, "Active recovery"],
      4: ["Upper A", "Lower A", null, "Upper B", "Lower B", null, "Active recovery"],
      5: ["Push", "Pull", "Legs", null, "Upper", "Lower", "Active recovery"],
      6: ["Push", "Pull", "Legs", "Push", "Pull", "Legs", null],
    },
    strength: {
      2: ["Full-body strength A", null, "Full-body strength B", null, null, "Mobility", null],
      3: ["Squat focus", null, "Bench focus", null, "Deadlift focus", null, "Mobility"],
      4: ["Squat + upper", "Bench + back", null, "Deadlift + arms", "Accessories", null, "Mobility"],
      5: ["Squat", "Bench", "Deadlift", null, "Full-body strength", "Accessories", "Mobility"],
      6: ["Squat", "Bench", "Pull", "Lower accessories", "Upper accessories", "Full-body strength", "Mobility"],
    },
    health: {
      2: ["Full-body A", "Walk 30 min", "Full-body B", null, "Mobility", "Walk 40 min", null],
      3: ["Full-body A", "Mobility", "Full-body B", "Walk 30 min", "Full-body C", null, "Walk 45 min"],
      4: ["Upper A", "Lower A", "Mobility", "Upper B", "Lower B", "Walk 40 min", null],
      5: ["Upper A", "Lower A", "Full-body", "Upper B", "Lower B", "Walk 45 min", null],
      6: ["Push", "Pull", "Legs", "Upper", "Lower", "Full-body", "Mobility"],
    },
  };

  const GOAL_LABELS = { fat: "fat loss", muscle: "muscle gain", strength: "strength", health: "overall health" };
  const EXPERIENCE_LABELS = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };
  const EQUIPMENT_LABELS = { gym: "Full gym", home: "Dumbbells at home", bodyweight: "Bodyweight only" };
  const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  /* ==========================================================================
     Shared UI: header, scroll spy, nav, toast, reveal
     ========================================================================== */
  const header = $("#siteHeader");
  const scrollProgress = $("#scrollProgress");
  const backToTop = $("#backToTop");
  const navToggle = $("#navToggle");
  const mainNav = $("#mainNav");
  const navLinks = $$(".nav-link");
  const spySections = ["home", "training", "nutrition", "bmi", "program"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  let scrollQueued = false;

  function updateScrollUI() {
    const y = window.scrollY;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;

    header.classList.toggle("is-scrolled", y > 20);
    backToTop.classList.toggle("is-visible", y > 700);
    scrollProgress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;

    let activeId = "home";
    spySections.forEach((section) => {
      if (section.offsetTop <= y + 160) activeId = section.id;
    });
    if (window.innerHeight + y >= doc.scrollHeight - 60) activeId = "program";

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${activeId}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function queueScrollUI() {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
      updateScrollUI();
      scrollQueued = false;
    });
  }

  window.addEventListener("scroll", queueScrollUI, { passive: true });
  window.addEventListener("resize", queueScrollUI);
  updateScrollUI();

  function closeNav() {
    if (!document.body.classList.contains("nav-open")) return;
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  navToggle.addEventListener("click", () => {
    const isOpen = !document.body.classList.contains("nav-open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeNav();
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior });
  });

  const toast = $("#toast");
  const toastMessage = $("#toastMessage");
  let toastTimer = null;

  function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3400);
  }

  function initReveal() {
    const items = $$(".reveal");
    if (reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((item) => observer.observe(item));
  }
  initReveal();

  function initCounters() {
    const counters = $$("[data-count]");
    if (!counters.length) return;

    if (reducedMotion) {
      counters.forEach((el) => {
        el.textContent = el.dataset.count;
      });
      return;
    }

    counters.forEach((el) => {
      el.textContent = "0";
    });

    const animate = (el) => {
      const target = Number(el.dataset.count) || 0;
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toString();
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toString();
      };
      requestAnimationFrame(step);
    };

    const stats = $(".hero-stats");
    if (!stats || !("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          counters.forEach(animate);
          observer.disconnect();
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(stats);
  }
  initCounters();

  /* ==========================================================================
     Modals
     ========================================================================== */
  const modal = $("#modal");
  const modalBody = $("#modalBody");
  let lastFocused = null;

  function openModal(html) {
    closeNav();
    lastFocused = document.activeElement;
    modalBody.innerHTML = html;
    modal.hidden = false;
    document.body.classList.add("no-scroll");
    requestAnimationFrame(() => {
      const closeBtn = $(".modal-close", modal);
      if (closeBtn) closeBtn.focus();
    });
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    modalBody.innerHTML = "";
    document.body.classList.remove("no-scroll");
    if (lastFocused && lastFocused.isConnected) lastFocused.focus();
  }

  function openProgram(id) {
    const program = PROGRAMS[id];
    if (!program) return;

    const chips = [
      `${icon("dumbbell")}${program.level}`,
      `${icon("calendar")}${program.weeks} weeks`,
      `${icon("activity")}${program.days}× / week`,
      `${icon("clock")}${program.minutes} min`,
    ]
      .map((chip) => `<span>${chip}</span>`)
      .join("");

    const split = program.split
      .map((item) => `<div><span>${item.label}</span><strong>${item.focus}</strong></div>`)
      .join("");

    const movements = program.movements
      .map((item) => `<li><span>${item.name}</span><b>${item.scheme}</b></li>`)
      .join("");

    openModal(`
      <span class="eyebrow small">${program.level} · ${program.tags.join(" · ")}</span>
      <h2 class="modal-title" id="modalTitle">${program.name}</h2>
      <p class="modal-lead">${program.lead}</p>
      <div class="modal-chips">${chips}</div>
      <h4 class="modal-label">Weekly structure</h4>
      <div class="modal-split">${split}</div>
      <h4 class="modal-label">Key movements</h4>
      <ul class="modal-list">${movements}</ul>
      <div class="modal-actions">
        <button type="button" class="btn btn-primary" data-use-program="${id}">Use this program ${icon("arrow")}</button>
        <button type="button" class="btn btn-ghost" data-close-modal>Close</button>
      </div>
    `);
  }

  function openRecipe(id) {
    const recipe = RECIPES[id];
    if (!recipe) return;

    const facts = recipe.facts
      .map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`)
      .join("");
    const ingredients = recipe.ingredients.map((item) => `<li>${item}</li>`).join("");
    const steps = recipe.steps.map((item) => `<li>${item}</li>`).join("");

    openModal(`
      <span class="eyebrow small">${recipe.category} · ${recipe.time}</span>
      <h2 class="modal-title" id="modalTitle">${recipe.name}</h2>
      <p class="modal-lead">${recipe.lead}</p>
      <div class="recipe-facts">${facts}</div>
      <h4 class="modal-label">Ingredients</h4>
      <ul class="recipe-ingredients">${ingredients}</ul>
      <h4 class="modal-label">Method</h4>
      <ol class="modal-steps">${steps}</ol>
      <div class="recipe-tip"><strong>Coach's tip.</strong> ${recipe.tip}</div>
      <div class="modal-actions">
        <button type="button" class="btn btn-primary" data-goto-plan>Build a plan around it ${icon("arrow")}</button>
        <button type="button" class="btn btn-ghost" data-close-modal>Close</button>
      </div>
    `);
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-modal]")) {
      closeModal();
      return;
    }

    const programTrigger = event.target.closest("[data-program]");
    if (programTrigger) {
      openProgram(programTrigger.dataset.program);
      return;
    }

    const recipeTrigger = event.target.closest("[data-recipe]");
    if (recipeTrigger) {
      openRecipe(recipeTrigger.dataset.recipe);
      return;
    }

    const useProgram = event.target.closest("[data-use-program]");
    if (useProgram) {
      prepareProgram(useProgram.dataset.useProgram);
      return;
    }

    if (event.target.closest("[data-goto-plan]")) {
      closeModal();
      scrollToPlanner();
      return;
    }

    if (event.target.closest("[data-plan-download]")) {
      downloadPlan();
      return;
    }

    if (event.target.closest("[data-plan-restart]")) {
      resetPlanner();
      return;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!modal.hidden) closeModal();
      closeNav();
      return;
    }

    if (event.key !== "Tab" || modal.hidden) return;

    const focusables = $$(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      modal
    ).filter((el) => el.getClientRects().length > 0);

    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* ==========================================================================
     Training filters & nutrition tabs
     ========================================================================== */
  const programGrid = $("#programGrid");
  const filterButtons = $$(".filter-btn");
  const programCards = $$(".program-card", programGrid);

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((btn) => {
        btn.classList.toggle("is-active", btn === button);
        btn.setAttribute("aria-pressed", String(btn === button));
      });

      programCards.forEach((card) => {
        const tags = card.dataset.tags.split(" ");
        const show = filter === "all" || tags.includes(filter);
        card.classList.toggle("is-hidden", !show);
      });

      programGrid.classList.remove("filtering");
      void programGrid.offsetWidth;
      programGrid.classList.add("filtering");
    });
  });

  const dietTabs = $$(".diet-tab");
  const dietPanels = $$(".diet-panel");

  dietTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      dietTabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });

      dietPanels.forEach((panel) => {
        const active = panel.dataset.dietPanel === tab.dataset.diet;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
    });
  });

  /* ==========================================================================
     BMI calculator
     ========================================================================== */
  const bmiCard = $("#bmiCard");
  const bmiValueEl = $("#bmiValue");
  const bmiCategoryEl = $("#bmiCategory");
  const bmiMessageEl = $("#bmiMessage");
  const bmiRangeEl = $("#bmiRange");
  const bmiNeedle = $("#bmiNeedle");
  const bmiError = $("#bmiError");
  const bmiCalculate = $("#bmiCalculate");
  const bmiReset = $("#bmiReset");
  const unitButtons = $$(".unit-btn");
  const unitPanels = $$("[data-unit-panel]");

  const heightCm = $("#heightCm");
  const heightCmRange = $("#heightCmRange");
  const weightKg = $("#weightKg");
  const weightKgRange = $("#weightKgRange");
  const heightFt = $("#heightFt");
  const heightIn = $("#heightIn");
  const weightLb = $("#weightLb");
  const weightLbRange = $("#weightLbRange");

  const bmiState = { cm: 175, kg: 72 };
  let bmiUnit = "metric";
  let bmiPopTimer = null;

  const KG_TO_LB = 2.20462262;
  const IN_TO_CM = 2.54;

  function parseNumber(input) {
    const value = parseFloat(input.value);
    return Number.isFinite(value) ? value : null;
  }

  function syncRangeFill(range) {
    const min = Number(range.min);
    const max = Number(range.max);
    const percent = max > min ? ((Number(range.value) - min) / (max - min)) * 100 : 0;
    range.style.setProperty("--fill", `${clamp(percent, 0, 100)}%`);
  }

  function paintMetric() {
    const cm = Math.round(bmiState.cm);
    const kg = Math.round(bmiState.kg);
    heightCm.value = cm;
    heightCmRange.value = cm;
    weightKg.value = kg;
    weightKgRange.value = kg;
    syncRangeFill(heightCmRange);
    syncRangeFill(weightKgRange);
  }

  function paintImperial() {
    const totalInches = bmiState.cm / IN_TO_CM;
    let feet = Math.floor(totalInches / 12);
    let inches = Math.round(totalInches - feet * 12);
    if (inches === 12) {
      feet += 1;
      inches = 0;
    }
    const pounds = Math.round(bmiState.kg * KG_TO_LB);
    heightFt.value = feet;
    heightIn.value = inches;
    weightLb.value = pounds;
    weightLbRange.value = pounds;
    syncRangeFill(weightLbRange);
  }

  function hideBmiError() {
    bmiError.textContent = "";
    bmiError.classList.remove("show");
  }

  function bmiCategory(bmi) {
    if (bmi < 18.5) {
      return {
        key: "under",
        label: "Underweight",
        message: "You're below the healthy weight range. Focus on nutrient-dense meals and strength training — a gentle calorie surplus can help.",
      };
    }
    if (bmi < 25) {
      return {
        key: "healthy",
        label: "Healthy",
        message: "You're within the healthy range. Keep training consistently and eating protein-forward meals to maintain and build.",
      };
    }
    if (bmi < 30) {
      return {
        key: "over",
        label: "Overweight",
        message: "You're above the healthy range. A modest calorie deficit, daily movement and 2–3 strength sessions per week are a solid start.",
      };
    }
    return {
      key: "obese",
      label: "Obese",
      message: "Your BMI is in the higher range. Start with sustainable nutrition changes and low-impact movement. Consider speaking with a health professional.",
    };
  }

  function renderBMI(animate = false) {
    const bmi = bmiState.kg / Math.pow(bmiState.cm / 100, 2);
    if (!Number.isFinite(bmi)) return;

    const category = bmiCategory(bmi);
    bmiCard.dataset.cat = category.key;
    bmiValueEl.textContent = bmi.toFixed(1);
    bmiCategoryEl.textContent = category.label;
    bmiMessageEl.textContent = category.message;

    const height = bmiState.cm / 100;
    const minKg = 18.5 * height * height;
    const maxKg = 24.9 * height * height;
    bmiRangeEl.textContent =
      bmiUnit === "metric"
        ? `${minKg.toFixed(1)} – ${maxKg.toFixed(1)} kg`
        : `${Math.round(minKg * KG_TO_LB)} – ${Math.round(maxKg * KG_TO_LB)} lb`;

    const ratio = clamp((bmi - 12) / (40 - 12), 0, 1);
    bmiNeedle.style.transform = `rotate(${-90 + ratio * 180}deg)`;

    if (animate) {
      bmiValueEl.classList.remove("is-updating");
      void bmiValueEl.offsetWidth;
      bmiValueEl.classList.add("is-updating");
      window.clearTimeout(bmiPopTimer);
      bmiPopTimer = window.setTimeout(() => bmiValueEl.classList.remove("is-updating"), 450);
    }
  }

  function updateMetricState() {
    const h = parseNumber(heightCm);
    const w = parseNumber(weightKg);
    if (h !== null && h >= 120 && h <= 220) bmiState.cm = h;
    if (w !== null && w >= 35 && w <= 250) bmiState.kg = w;
    paintImperial();
    hideBmiError();
    renderBMI();
  }

  heightCmRange.addEventListener("input", () => {
    bmiState.cm = Number(heightCmRange.value);
    heightCm.value = heightCmRange.value;
    syncRangeFill(heightCmRange);
    paintImperial();
    hideBmiError();
    renderBMI();
  });

  heightCm.addEventListener("input", () => {
    const value = parseNumber(heightCm);
    if (value !== null && value >= 120 && value <= 220) {
      bmiState.cm = value;
      heightCmRange.value = value;
      syncRangeFill(heightCmRange);
      paintImperial();
      renderBMI();
    }
    hideBmiError();
  });

  weightKgRange.addEventListener("input", () => {
    bmiState.kg = Number(weightKgRange.value);
    weightKg.value = weightKgRange.value;
    syncRangeFill(weightKgRange);
    updateMetricState();
  });

  weightKg.addEventListener("input", () => {
    const value = parseNumber(weightKg);
    if (value !== null && value >= 35 && value <= 250) {
      bmiState.kg = value;
      weightKgRange.value = value;
      syncRangeFill(weightKgRange);
      updateMetricState();
    } else {
      hideBmiError();
    }
  });

  function readImperialHeight() {
    const feet = parseNumber(heightFt);
    const inches = parseNumber(heightIn);
    if (feet === null || inches === null) return null;
    if (feet < 3 || feet > 7 || inches < 0 || inches > 11) return null;
    const totalInches = feet * 12 + inches;
    if (totalInches < 47 || totalInches > 87) return null;
    return totalInches * IN_TO_CM;
  }

  function handleImperialHeight() {
    const cm = readImperialHeight();
    if (cm !== null) {
      bmiState.cm = cm;
      hideBmiError();
      renderBMI();
    }
  }

  heightFt.addEventListener("input", handleImperialHeight);
  heightIn.addEventListener("input", handleImperialHeight);

  weightLbRange.addEventListener("input", () => {
    const pounds = Number(weightLbRange.value);
    bmiState.kg = pounds / KG_TO_LB;
    weightLb.value = pounds;
    syncRangeFill(weightLbRange);
    hideBmiError();
    renderBMI();
  });

  weightLb.addEventListener("input", () => {
    const pounds = parseNumber(weightLb);
    if (pounds !== null && pounds >= 77 && pounds <= 551) {
      bmiState.kg = pounds / KG_TO_LB;
      weightLbRange.value = pounds;
      syncRangeFill(weightLbRange);
      hideBmiError();
      renderBMI();
    } else {
      hideBmiError();
    }
  });

  function setUnit(unit) {
    bmiUnit = unit;
    unitButtons.forEach((button) => {
      const active = button.dataset.unit === unit;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    unitPanels.forEach((panel) => {
      const active = panel.dataset.unitPanel === unit;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    if (unit === "metric") paintMetric();
    else paintImperial();
    hideBmiError();
    renderBMI();
  }

  unitButtons.forEach((button) => {
    button.addEventListener("click", () => setUnit(button.dataset.unit));
  });

  bmiCalculate.addEventListener("click", () => {
    if (bmiUnit === "metric") {
      const h = parseNumber(heightCm);
      const w = parseNumber(weightKg);
      if (h === null || w === null || h < 120 || h > 220 || w < 35 || w > 250) {
        bmiError.textContent = "Enter a height between 120–220 cm and a weight between 35–250 kg.";
        bmiError.classList.add("show");
        return;
      }
      bmiState.cm = h;
      bmiState.kg = w;
      paintImperial();
    } else {
      const cm = readImperialHeight();
      const pounds = parseNumber(weightLb);
      if (cm === null || pounds === null || pounds < 77 || pounds > 551) {
        bmiError.textContent = "Enter a height between 3 ft 11 in and 7 ft 3 in, and a weight between 77–551 lb.";
        bmiError.classList.add("show");
        return;
      }
      bmiState.cm = cm;
      bmiState.kg = pounds / KG_TO_LB;
      paintMetric();
    }
    hideBmiError();
    renderBMI(true);
  });

  bmiReset.addEventListener("click", () => {
    bmiState.cm = 175;
    bmiState.kg = 72;
    setUnit("metric");
    paintMetric();
    paintImperial();
    renderBMI(true);
    showToast("BMI calculator reset to default measurements.");
  });

  paintMetric();
  paintImperial();
  renderBMI();

  /* ==========================================================================
     Personalized planner
     ========================================================================== */
  const planForm = $("#planForm");
  const planSteps = $$(".form-step");
  const stepDots = $$(".step-dot");
  const stepCount = $("#stepCount");
  const stepTrack = $("#stepTrack");
  const planBack = $("#planBack");
  const planNext = $("#planNext");
  const planResult = $("#planResult");
  const plannerCard = $("#plannerCard");
  let currentStep = 1;
  let currentPlan = null;

  function scrollToPlanner() {
    if (!plannerCard) return;
    plannerCard.scrollIntoView({ behavior: scrollBehavior, block: "start" });
  }

  function showStepError(step, message) {
    const errorEl = $(`[data-error-for="${step}"]`, planForm);
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.toggle("show", Boolean(message));
  }

  function clearStepErrors() {
    $$(".form-error", planForm).forEach((el) => {
      el.textContent = "";
      el.classList.remove("show");
    });
  }

  function goToStep(step) {
    currentStep = clamp(step, 1, 3);
    planSteps.forEach((section) => {
      const active = Number(section.dataset.step) === currentStep;
      section.hidden = !active;
      section.classList.toggle("is-active", active);
    });
    stepDots.forEach((dot) => {
      const value = Number(dot.dataset.stepDot);
      dot.classList.toggle("is-active", value === currentStep);
      dot.classList.toggle("is-complete", value < currentStep);
    });
    stepCount.textContent = `Step ${currentStep} of 3`;
    planBack.disabled = currentStep === 1;
    planNext.innerHTML =
      currentStep === 3
        ? `Generate my plan ${icon("sparkle")}`
        : `Continue ${icon("arrow")}`;
  }

  function getCheckedValue(name) {
    const input = $(`input[name="${name}"]:checked`, planForm);
    return input ? input.value : null;
  }

  function validateProfile() {
    const goal = getCheckedValue("goal");
    const age = parseInt($("#age", planForm).value, 10);
    const gender = $("#gender", planForm).value;
    const height = parseFloat($("#planHeight", planForm).value);
    const weight = parseFloat($("#planWeight", planForm).value);
    const experience = $("#experience", planForm).value;

    if (!goal) return { ok: false, message: "Pick the goal that matters most to you right now." };
    if (!Number.isFinite(age) || age < 16 || age > 90) return { ok: false, message: "Enter an age between 16 and 90." };
    if (!gender) return { ok: false, message: "Select your sex so we can estimate calories more accurately." };
    if (!Number.isFinite(height) || height < 120 || height > 220) return { ok: false, message: "Enter a height between 120 and 220 cm." };
    if (!Number.isFinite(weight) || weight < 35 || weight > 250) return { ok: false, message: "Enter a weight between 35 and 250 kg." };
    if (!experience) return { ok: false, message: "Choose your training experience." };

    return { ok: true, data: { goal, age, gender, height, weight, experience } };
  }

  function buildSchedule(goal, days) {
    const template = (SCHEDULES[goal] && SCHEDULES[goal][days]) || SCHEDULES.health[3];
    return DAY_NAMES.map((day, index) => {
      const focus = template[index];
      let type = "rest";
      if (focus) type = /active recovery|mobility|walk/i.test(focus) ? "recovery" : "train";
      return { day, focus: focus || "Rest & recover", type };
    });
  }

  function recommendProgram(goal, experience) {
    const map = {
      beginner: { fat: "reset", muscle: "daily30", strength: "forge", health: "reset" },
      intermediate: { fat: "daily30", muscle: "engine", strength: "power", health: "forge" },
      advanced: { fat: "athletic", muscle: "engine", strength: "power", health: "athletic" },
    };
    const id = (map[experience] && map[experience][goal]) || "forge";
    return { id, program: PROGRAMS[id] };
  }

  function buildFocus(goal, profile, protein) {
    const { equipment, session, calories } = profile;
    const focusByGoal = {
      fat: [
        "Run a sustainable 300–500 kcal daily deficit and keep protein high to protect muscle.",
        "Add 8,000–10,000 steps on non-training days — the easiest lever for fat loss.",
        "Strength first, conditioning last. Never trade your main lifts for extra burpees.",
      ],
      muscle: [
        "Take the last set of each exercise close to failure, then add reps or weight next week.",
        `Eat around ${calories} kcal with ${protein} g protein to support growth without excess fat gain.`,
        "Rest 90–180 seconds on compound lifts and shorten rest on isolation work.",
      ],
      strength: [
        "Progress linearly: hit the top of the rep range on all sets, then add 2.5 kg.",
        `Prioritise 7–9 hours of sleep and ${protein} g protein — recovery is where strength is built.`,
        "Warm up with the movement you're about to load. Save static stretching for after.",
      ],
      health: [
        `Target roughly ${calories} kcal with ${protein} g protein; build meals around vegetables, lean protein and whole grains.`,
        "Accumulate 150+ minutes of moderate cardio per week, including one or two longer walks.",
        "Sleep, steps and consistency beat any perfect plan. Aim for good enough, every week.",
      ],
    };

    const equipmentTip = {
      gym: "Use compound lifts first while you're fresh, then isolate. Your gym has everything you need.",
      home: "Dumbbells, bands and bodyweight cover every pattern — progress with tempo, pauses and single-leg work.",
      bodyweight: "No equipment, no excuses: progress by adding reps, slowing eccentrics and reducing rest.",
    }[equipment];

    return [
      ...focusByGoal[goal],
      equipmentTip,
      `Inside ${session} minutes: 8 min warm-up, ${session - 18} min main work, 8 min finisher or core, 2 min cooldown.`,
    ];
  }

  function makePlan() {
    const profileCheck = validateProfile();
    if (!profileCheck.ok) {
      showStepError(2, profileCheck.message);
      goToStep(2);
      return;
    }

    const { goal, age, gender, height, weight, experience } = profileCheck.data;
    const days = Number(getCheckedValue("days")) || 4;
    const session = Number(getCheckedValue("session")) || 45;
    const equipment = getCheckedValue("equipment") || "gym";

    const genderFactor = gender === "male" ? 5 : gender === "female" ? -161 : -78;
    const bmr = 10 * weight + 6.25 * height - 5 * age + genderFactor;
    const activity = { 2: 1.375, 3: 1.46, 4: 1.55, 5: 1.65, 6: 1.725 }[days] || 1.55;
    const adjustment = { fat: -400, muscle: 250, strength: 150, health: 0 }[goal] || 0;
    const calories = Math.max(1400, Math.round((bmr * activity + adjustment) / 10) * 10);
    const proteinPerKg = { fat: 2.2, muscle: 2.0, strength: 1.8, health: 1.6 }[goal] || 1.8;
    const protein = Math.round(weight * proteinPerKg);
    const water = Math.round(weight * 0.035 * 10) / 10;

    const schedule = buildSchedule(goal, days);
    const recommended = recommendProgram(goal, experience);
    const focus = buildFocus(goal, { equipment, session, calories }, protein);
    const trainingDays = schedule.filter((row) => row.type === "train").length;

    currentPlan = {
      goal,
      goalLabel: GOAL_LABELS[goal],
      experience,
      experienceLabel: EXPERIENCE_LABELS[experience],
      age,
      gender,
      height,
      weight,
      days,
      session,
      equipment,
      equipmentLabel: EQUIPMENT_LABELS[equipment],
      calories,
      protein,
      water,
      schedule,
      focus,
      trainingDays,
      recommended,
    };

    renderPlan(currentPlan);
  }

  function renderPlan(plan) {
    const statusLabel = { train: "Train", recovery: "Recover", rest: "Rest" };
    const weekRows = plan.schedule
      .map(
        (row) => `
        <div class="week-row">
          <span class="week-day-label">${row.day}</span>
          <span class="week-focus">${row.focus}</span>
          <span class="week-status ${row.type}">${statusLabel[row.type]}</span>
        </div>`
      )
      .join("");

    const focusItems = plan.focus
      .map((item) => `<li>${icon("check")}<span>${item}</span></li>`)
      .join("");

    planResult.innerHTML = `
      <div class="result-head">
        <span class="eyebrow small">Plan generated</span>
        <h3>Your weekly blueprint</h3>
        <p>Built for <strong>${plan.goalLabel}</strong> with <strong>${plan.days} training days</strong> a week at ${plan.session} minutes per session.</p>
      </div>
      <div class="result-stats">
        <div class="stat-tile"><strong>${plan.calories}</strong><span>kcal / day</span></div>
        <div class="stat-tile"><strong>${plan.protein} g</strong><span>Protein</span></div>
        <div class="stat-tile"><strong>${plan.water} L</strong><span>Water</span></div>
        <div class="stat-tile"><strong>${plan.trainingDays}×</strong><span>Sessions</span></div>
      </div>
      <div class="result-section-title"><h4>Weekly split</h4><span>${plan.trainingDays} train · ${7 - plan.trainingDays} recover</span></div>
      <div class="week-list">${weekRows}</div>
      <div class="result-section-title"><h4>Your focus</h4><span>${plan.experienceLabel} level</span></div>
      <ul class="focus-list">${focusItems}</ul>
      <div class="result-section-title"><h4>Recommended program</h4><span>Closest match</span></div>
      <div class="program-reco">
        <div>
          <span>Best match for you</span>
          <strong>${plan.recommended.program.name}</strong>
          <small>${plan.recommended.program.weeks} weeks · ${plan.recommended.program.days}×/week · ${plan.recommended.program.minutes} min</small>
        </div>
        <button type="button" class="mini-btn" data-program="${plan.recommended.id}">Preview</button>
      </div>
      <div class="result-actions">
        <button type="button" class="btn btn-primary" data-plan-download>Download plan ${icon("arrow")}</button>
        <button type="button" class="btn btn-ghost" data-plan-restart>Start over</button>
      </div>
    `;

    planForm.hidden = true;
    stepTrack.hidden = true;
    planResult.hidden = false;
    stepCount.textContent = "Plan ready";
    showToast("Your personalized program is ready.");
    requestAnimationFrame(() => {
      plannerCard.scrollIntoView({ behavior: scrollBehavior, block: "start" });
    });
  }

  function downloadPlan() {
    if (!currentPlan) return;
    const plan = currentPlan;
    const generated = new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const statusLabel = { train: "Train", recovery: "Recovery", rest: "Rest" };

    const lines = [
      "FITLIFE — PERSONALIZED TRAINING PLAN",
      "=====================================",
      `Generated: ${generated}`,
      "",
      "YOUR PROFILE",
      `Goal: ${plan.goalLabel}`,
      `Experience: ${plan.experienceLabel}`,
      `Age: ${plan.age} · Sex: ${plan.gender}`,
      `Height: ${plan.height} cm · Weight: ${plan.weight} kg`,
      `Training: ${plan.days} days/week · ${plan.session} minutes/session`,
      `Equipment: ${plan.equipmentLabel}`,
      "",
      "DAILY TARGETS",
      `Calories: approximately ${plan.calories} kcal`,
      `Protein: ${plan.protein} g`,
      `Water: ${plan.water} L`,
      "",
      "WEEKLY SPLIT",
      ...plan.schedule.map((row) => `${row.day} — ${row.focus} (${statusLabel[row.type]})`),
      "",
      "YOUR FOCUS",
      ...plan.focus.map((item, index) => `${index + 1}. ${item}`),
      "",
      "RECOMMENDED PROGRAM",
      `${plan.recommended.program.name} — ${plan.recommended.program.weeks} weeks, ${plan.recommended.program.days}×/week, ${plan.recommended.program.minutes} min`,
      "",
      "Note: This plan is general guidance, not medical advice. Adjust it to how you feel and consult a qualified professional if needed.",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fitlife-personalized-plan.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Plan downloaded. Time to train.");
  }

  function resetPlanner(silent = false) {
    planForm.reset();
    clearStepErrors();
    planResult.hidden = true;
    planResult.innerHTML = "";
    planForm.hidden = false;
    stepTrack.hidden = false;
    currentPlan = null;
    goToStep(1);
    if (!silent) {
      showToast("Planner cleared — ready for a fresh start.");
      scrollToPlanner();
    }
  }

  function prepareProgram(id) {
    const program = PROGRAMS[id];
    if (!program) return;

    closeModal();
    if (!planResult.hidden) resetPlanner(true);
    clearStepErrors();

    const goalInput = $(`input[name="goal"][value="${program.goal}"]`, planForm);
    if (goalInput) goalInput.checked = true;
    const experienceSelect = $("#experience", planForm);
    if (experienceSelect) experienceSelect.value = program.experience;

    goToStep(2);
    scrollToPlanner();
    showToast(`${program.name} loaded — add your details to personalize it.`);
  }

  planNext.addEventListener("click", () => {
    if (currentStep === 1) {
      if (!getCheckedValue("goal")) {
        showStepError(1, "Pick the goal that matters most to you right now.");
        return;
      }
      showStepError(1, "");
      goToStep(2);
      return;
    }

    if (currentStep === 2) {
      const check = validateProfile();
      if (!check.ok) {
        showStepError(2, check.message);
        return;
      }
      showStepError(2, "");
      goToStep(3);
      return;
    }

    makePlan();
  });

  planBack.addEventListener("click", () => {
    goToStep(currentStep - 1);
  });

  $$('.choice-card input[name="goal"]', planForm).forEach((input) => {
    input.addEventListener("change", () => showStepError(1, ""));
  });

  $$("#age, #gender, #planHeight, #planWeight, #experience", planForm).forEach((field) => {
    field.addEventListener("input", () => showStepError(2, ""));
    field.addEventListener("change", () => showStepError(2, ""));
  });

  goToStep(1);

  /* ==========================================================================
     Newsletter & misc
     ========================================================================== */
  const newsletterForm = $("#newsletterForm");
  const newsletterEmail = $("#newsletterEmail");
  const newsletterStatus = $("#newsletterStatus");

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = newsletterEmail.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    if (!valid) {
      newsletterStatus.textContent = "Please enter a valid email address.";
      newsletterStatus.classList.add("is-error");
      newsletterEmail.focus();
      return;
    }

    newsletterStatus.textContent = "You're in. Look out for your first weekly fuel.";
    newsletterStatus.classList.remove("is-error");
    newsletterForm.reset();
    showToast("Subscribed — welcome to FitLife.");
  });

  newsletterEmail.addEventListener("input", () => {
    newsletterStatus.textContent = "";
    newsletterStatus.classList.remove("is-error");
  });

  $("#year").textContent = new Date().getFullYear();
})();
