export function initCartBadge() {
const el = document.querySelector("a[href*='cart']");

  if (!el) return;
  const update = () => {
    const raw = localStorage.getItem("so-cart") || "[]";
    let arr = [];
    try {
      arr = JSON.parse(raw);
    } catch (err) {}

    const count = Array.isArray(arr)
      ? arr.reduce((s, i) => s + Number(i.quantity ?? 1), 0)
      : 0;
    el.setAttribute("data-count", String(count));
  };
  update();
  window.addEventListener("storage", (e) => {
    if (e.key === "so-cart") update();
  });
  document.addEventListener("cart:updated", update);
}
