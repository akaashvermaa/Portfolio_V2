/* Section links: mark the section nearest the middle of the screen as current. */
const nav = document.querySelector(".site-nav");
const navLinks = [...nav.querySelectorAll("a")];
const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href")));

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const current = link.getAttribute("href") === `#${entry.target.id}`;
        if (current) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    });
  },
  { rootMargin: "-40% 0px -55% 0px" },
);

sections.forEach((section) => section && spyObserver.observe(section));

/* Scroll reveals: headings and content blocks fade up once as they enter the screen.
   Skipped entirely when the visitor prefers reduced motion. */
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealTargets = document.querySelectorAll(
    ".section .title, .about-lead, .contact-note, .split-row, .row.project, .stack-note, .site-footer",
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      /* Items arriving together come in one after another, a beat apart. */
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, i) => {
          entry.target.style.setProperty("--reveal-delay", `${Math.min(i, 4) * 0.07}s`);
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
    },
    { rootMargin: "0px 0px -10% 0px" },
  );

  revealTargets.forEach((el) => {
    el.setAttribute("data-reveal", "");
    revealObserver.observe(el);
  });
  document.documentElement.classList.add("motion");
}

/* Phone menu. */
const menuButton = nav.querySelector(".menu-btn");

function setMenu(open) {
  nav.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
}

menuButton.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});
