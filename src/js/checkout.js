import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";
import { initCartBadge } from "./cartBadge.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

async function init() {
  await loadHeaderFooter();
  initCartBadge();
  renderSummary();
  bindForm();
}

function bindForm() {
  const form = document.getElementById("form-checkout");
  if (!form) return;
  const checkout = new CheckoutProcess(form);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    checkout.checkout();
  });
}

function renderSummary() {
  const cartItems = getLocalStorage("so-cart") || [];
  const summaryList = document.getElementById("summary-items");
  if (summaryList) {
    summaryList.innerHTML = cartItems
      .map((item) => summaryItemTemplate(item))
      .join("");
  }
  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum +
      Number(
        item.FinalPrice ?? item.ListPrice ?? item.SuggestedRetailPrice ?? 0,
      ) *
        (item.quantity || 1),
    0,
  );
  const shipping = cartItems.length > 0 ? 4.0 : 0;
  const tax = subtotal * 0.06;
  const total = subtotal + shipping + tax;
  document.getElementById("summary-subtotal").textContent =
    `$${subtotal.toFixed(2)}`;
  document.getElementById("summary-shipping").textContent =
    `$${shipping.toFixed(2)}`;
  document.getElementById("summary-tax").textContent = `$${tax.toFixed(2)}`;
  document.getElementById("summary-total").textContent = `$${total.toFixed(2)}`;
}

function summaryItemTemplate(item) {
  const finalPrice =
    item.FinalPrice ?? item.ListPrice ?? item.SuggestedRetailPrice ?? 0;
  let priceBlock = `$${Number(finalPrice).toFixed(2)}`;
  let discountBadge = "";
  if (
    item.SuggestedRetailPrice &&
    item.FinalPrice &&
    item.SuggestedRetailPrice > item.FinalPrice
  ) {
    const discount = Math.round(
      ((item.SuggestedRetailPrice - item.FinalPrice) /
        item.SuggestedRetailPrice) *
        100,
    );
    discountBadge = `<span class="discount-badge">-${discount}% OFF</span>`;
    priceBlock = `
      <span style="text-decoration: line-through; color:#888; margin-right:0.5rem;">
        $${item.SuggestedRetailPrice.toFixed(2)}
      </span>
      <span style="font-weight:bold; color:#b91c1c;">
        $${item.FinalPrice.toFixed(2)}
      </span>
    `;
  }
  return `
    <li class="summary-item">
      <span class="summary-name">${item.Name} (Qty: ${item.quantity || 1})</span>
      <span class="summary-price">${priceBlock} ${discountBadge}</span>
    </li>`;
}

init();
