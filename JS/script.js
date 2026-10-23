const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    navLinks.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Ouvrir le menu" : "Fermer le menu");
    navLinks.classList.toggle("is-open", !isExpanded);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuToggle.focus();
    }
  });
}

const currentYear = document.querySelector("#current-year");

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealElements = document.querySelectorAll(
  ".section-heading, .about-content, .skills-grid, .portrait-photo-column, .portrait-copy, .timeline-item, .project-card, .process-step, .contact-copy, .contact-form, .contact-social"
);

if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -35px 0px" }
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);
  });
} else if (reduceMotion.matches) {
  document.documentElement.classList.add("reduce-motion");
}

document.documentElement.classList.add("js-ready");

document.querySelectorAll(".skills-grid, .project-grid, .process-grid").forEach((group) => {
  [...group.children].forEach((item, index) => {
    item.style.setProperty("--stagger-index", String(index));
  });
});

const readingProgress = document.querySelector(".reading-progress");
const backToTop = document.querySelector(".back-to-top");
let scrollUpdateScheduled = false;

const updateReadingProgress = () => {
  if (!readingProgress || scrollUpdateScheduled) {
    return;
  }

  scrollUpdateScheduled = true;
  window.requestAnimationFrame(() => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    readingProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    backToTop?.classList.toggle("is-visible", window.scrollY > 400);
    scrollUpdateScheduled = false;
  });
};

window.addEventListener("scroll", updateReadingProgress, { passive: true });
window.addEventListener("resize", updateReadingProgress);
updateReadingProgress();

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion.matches) {
  document.querySelectorAll(".project-visual").forEach((visual) => {
    visual.addEventListener("pointermove", (event) => {
      const bounds = visual.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      visual.style.setProperty("--tilt-x", `${(0.5 - y) * 4}deg`);
      visual.style.setProperty("--tilt-y", `${(x - 0.5) * 4}deg`);
    });

    visual.addEventListener("pointerleave", () => {
      visual.style.setProperty("--tilt-x", "0deg");
      visual.style.setProperty("--tilt-y", "0deg");
    });
  });
}

const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");

if (contactForm && formNote) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const subject = encodeURIComponent(`Prise de contact de ${name}`);
    const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);

    formNote.textContent = "Votre application de messagerie va s’ouvrir avec votre message prérempli.";
    window.location.href = `mailto:bonjour@alexmartin.dev?subject=${subject}&body=${body}`;
  });
}
