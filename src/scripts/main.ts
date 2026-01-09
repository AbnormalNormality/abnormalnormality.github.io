//cSpell:ignore aest

const local = new Date();
local.setHours(0, 0, 0, 0);
const aest = new Date(local.toLocaleString("en-AU", { timeZone: "Australia/Brisbane" }));
const dif = local.getUTCHours() - aest.getUTCHours();

const textVariables = {
  tzaDiff: dif.toString(),
  tzaDiffAbs: Math.abs(dif).toString(),
  tzaDirection: dif >= 0 ? "ahead" : "behind",
  tzaMidnight: aest.getHours().toString().padStart(2, "0"),
};

let bodyHtml = document.body.innerHTML;
for (const [key, value] of Object.entries(textVariables)) {
  bodyHtml = bodyHtml.replaceAll(`{${key}}`, value);
}
document.body.innerHTML = bodyHtml;

document.addEventListener("click", (e) => {
  if (e.target === document.body) {
    console.log(document.activeElement);
  }
});

document.querySelectorAll<HTMLDivElement>(".card").forEach((card, i) => {
  card.tabIndex = i + 1;
});
