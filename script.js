const WHATSAPP_NUMBER = "5521999999999";
const FOUNDER_WHATSAPP = {
  solanie: "5521988880001",
  paulo: "5521988880002",
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
  const founder = link.dataset.founder;
  const number = FOUNDER_WHATSAPP[founder] || WHATSAPP_NUMBER;
  const name = founder === "solanie" ? "Solanie" : "Paulo";
  const message = `Olá, ${name}. Vim pela landing da GSM Prime e quero falar sobre embalagens.`;
  link.href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
});

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
