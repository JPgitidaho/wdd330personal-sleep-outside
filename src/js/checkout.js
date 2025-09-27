import { getLocalStorage, loadHeaderFooter, alertMessage } from "./utils.mjs";
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

    document.querySelector(".alert-list")?.remove();

    const errors = validateForm(form);

    if (errors.length > 0) {
      alertMessage(errors, { type: "error" });
      return;
    }

    checkout.checkout();
  });
}

function validateForm(form) {
  const errors = [];
  const ccnum = form.ccnum.value.trim();
  const exp = form.exp.value.trim();
  const cvv = form.cvv.value.trim();

  if (!/^\d{16}$/.test(ccnum)) errors.push("Invalid Card Number");
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp))
    errors.push("Invalid expiration date");
  if (!/^\d{3,4}$/.test(cvv)) errors.push("Invalid CVV");

  if (!form.firstName.value.trim()) errors.push("First Name is required");
  if (!form.lastName.value.trim()) errors.push("Last Name is required");
  if (!form.street.value.trim()) errors.push("Street Address is required");
  if (!form.city.value.trim()) errors.push("City is required");
  if (!form.state.value.trim()) errors.push("State is required");
  if (!form.zip.value.trim()) errors.push("Zip Code is required");

  return errors;
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
      <span class="summary-name">${item.Name} (Qty: ${item.quantity || 1}) </span>
      <span class="summary-price">${priceBlock} </span>
    </li>`;
}

init();
