document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".scroll-progress");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const menuBackdrop = document.createElement("button");
  menuBackdrop.type = "button";
  menuBackdrop.className = "menu-backdrop";
  menuBackdrop.setAttribute("aria-label", "Cerrar menú");
  menuBackdrop.setAttribute("aria-hidden", "true");
  menuBackdrop.tabIndex = -1;
  header?.after(menuBackdrop);

  const closeMenu = () => {
    body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menú");
    menuBackdrop.setAttribute("aria-hidden", "true");
  };

  menuToggle?.addEventListener("click", () => {
    const open = body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menuBackdrop.setAttribute("aria-hidden", String(!open));
  });

  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  menuBackdrop.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("menu-open")) {
      closeMenu();
      menuToggle?.focus();
    }
  });

  const desktopMenu = window.matchMedia("(min-width: 901px)");
  const syncMenuLayout = (event) => {
    if (event.matches) closeMenu();
  };
  desktopMenu.addEventListener?.("change", syncMenuLayout);

  const syncScroll = () => {
    const root = document.documentElement;
    const scrollable = Math.max(root.scrollHeight - innerHeight, 1);
    const ratio = Math.min(scrollY / scrollable, 1);
    header?.classList.toggle("scrolled", scrollY > 16);
    if (progress) progress.style.width = `${ratio * 100}%`;
  };

  syncScroll();
  addEventListener("scroll", syncScroll, { passive: true });

  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: "0px 0px -6%" });

    reveals.forEach((element) => observer.observe(element));
  }

  const hero = document.querySelector(".home-hero");
  if (hero && !reduceMotion && matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("pointermove", (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      hero.style.setProperty("--mx", `${x}%`);
      hero.style.setProperty("--my", `${y}%`);
    });
  }

  const curtain = document.createElement("div");
  curtain.className = "page-curtain";
  curtain.setAttribute("aria-hidden", "true");
  body.appendChild(curtain);

  document.querySelectorAll("a[data-transition]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (reduceMotion || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.hash || link.target === "_blank") return;
      event.preventDefault();
      closeMenu();
      curtain.classList.add("leaving");
      setTimeout(() => { location.href = url.href; }, 460);
    });
  });

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
});
