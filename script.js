const WHATSAPP_NUMBER = "5521983766288";
const FOUNDER_WHATSAPP = {
  solanie: "5521983766288",
  paulo: "5521971594481",
};

function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function defaultMessage() {
  return "Olá, vim pela landing da GSM Prime e quero pedir uma cotação de embalagens.";
}

document.querySelectorAll(".js-whatsapp").forEach((link) => {
  link.href = buildWhatsAppUrl(defaultMessage());
});

document.querySelectorAll(".founder-whatsapp").forEach((link) => {
  const founder = link.dataset.founder || link.dataset.founderActive;
  const number = FOUNDER_WHATSAPP[founder] || WHATSAPP_NUMBER;
  const name = founder === "solanie" ? "Solanie" : "Paulo";
  const message = `Olá, ${name}. Vim pela landing da GSM Prime e quero falar sobre embalagens.`;
  link.href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
});

function setFounderLink(link, founder) {
  const number = FOUNDER_WHATSAPP[founder] || WHATSAPP_NUMBER;
  const name = founder === "solanie" ? "Solanie" : "Paulo";
  const message = `Olá, ${name}. Vim pela landing da GSM Prime e quero falar sobre embalagens.`;
  link.dataset.founderActive = founder;
  link.href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function createDots(container, count) {
  container.innerHTML = "";
  return Array.from({ length: count }, (_, index) => {
    const dot = document.createElement("span");
    dot.className = index === 0 ? "is-active" : "";
    container.append(dot);
    return dot;
  });
}

function nearestSlideIndex(track, slides) {
  const trackCenter = track.scrollLeft + track.clientWidth / 2;
  return slides.reduce((closestIndex, slide, index) => {
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    const closest = slides[closestIndex];
    const closestCenter = closest.offsetLeft + closest.offsetWidth / 2;
    return Math.abs(slideCenter - trackCenter) < Math.abs(closestCenter - trackCenter) ? index : closestIndex;
  }, 0);
}

function initCarousel(name, trackSelector, onChange) {
  const track = document.querySelector(trackSelector);
  if (!track) return;

  const slides = Array.from(track.children);
  const dotsContainer = document.querySelector(`[data-carousel-dots="${name}"]`);
  const dots = dotsContainer ? createDots(dotsContainer, slides.length) : [];
  const prev = document.querySelector(`[data-carousel-prev="${name}"]`);
  const next = document.querySelector(`[data-carousel-next="${name}"]`);
  let activeIndex = 0;
  let scrollTimer;

  function activate(index, shouldScroll = false) {
    const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
    const didChange = nextIndex !== activeIndex;
    activeIndex = nextIndex;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
    if (shouldScroll) {
      slides[activeIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
    onChange?.(slides[activeIndex], activeIndex, didChange);
  }

  prev?.addEventListener("click", () => activate(activeIndex - 1, true));
  next?.addEventListener("click", () => activate(activeIndex + 1, true));

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => activate(index, true));
  });

  track.addEventListener("scroll", () => {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      activate(nearestSlideIndex(track, slides));
    }, 80);
  }, { passive: true });

  activate(0);
}

initCarousel("products", ".product-grid");

let founderRevealTimer;

function presentFounderCard() {
  const section = document.querySelector(".founders");
  if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  window.clearTimeout(founderRevealTimer);
  section.classList.remove("has-settled");
  section.classList.add("is-presenting");
  founderRevealTimer = window.setTimeout(() => {
    section.classList.remove("is-presenting");
    section.classList.add("has-settled");
  }, 1150);
}

initCarousel("founders", ".founder-grid", (slide, _activeIndex, didChange) => {
  const founder = slide.dataset.founderCard;
  const name = slide.dataset.founderName;
  const role = slide.dataset.founderRole;
  const description = slide.dataset.founderDescription;
  const nameEl = document.querySelector("[data-founder-name]");
  const roleEl = document.querySelector("[data-founder-role]");
  const descriptionEl = document.querySelector("[data-founder-description]");
  const activeLink = document.querySelector("[data-founder-active]");

  if (nameEl && name) nameEl.textContent = name;
  if (roleEl && role) roleEl.textContent = role;
  if (descriptionEl && description) descriptionEl.textContent = description;
  if (activeLink && founder) setFounderLink(activeLink, founder);
  if (didChange) presentFounderCard();
});

const foundersSection = document.querySelector(".founders");
if (foundersSection && "IntersectionObserver" in window) {
  const founderObserver = new IntersectionObserver((entries, observer) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      presentFounderCard();
      observer.disconnect();
    }
  }, { threshold: 0.38 });
  founderObserver.observe(foundersSection);
}

document.querySelector("#quote-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const empresa = String(form.get("empresa") || "").trim();
  const itens = String(form.get("itens") || "").trim();
  const bairro = String(form.get("bairro") || "").trim();

  const lines = [
    "Olá, vim pela landing da GSM Prime e quero pedir uma cotação.",
    empresa ? `Empresa: ${empresa}` : "",
    itens ? `Itens: ${itens}` : "",
    bairro ? `Bairro de entrega: ${bairro}` : "",
  ].filter(Boolean);

  window.open(buildWhatsAppUrl(lines.join("\n")), "_blank", "noopener,noreferrer");
});

window.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
