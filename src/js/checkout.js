import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

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
    `Subtotal: $${subtotal.toFixed(2)}`;
  document.getElementById("summary-shipping").textContent =
    `Shipping Estimate: $${shipping.toFixed(2)}`;
  document.getElementById("summary-tax").textContent =
    `Tax: $${tax.toFixed(2)}`;
  document.getElementById("summary-total").textContent =
    `Order Total: $${total.toFixed(2)}`;
}

function summaryItemTemplate(item) {
  const price =
    item.FinalPrice ?? item.ListPrice ?? item.SuggestedRetailPrice ?? 0;

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
    if (discount > 0) {
      discountBadge = `<span class="discount-badge">-${discount}% OFF</span>`;
    }
  }

  return `
    <li class="summary-item">
      <span class="summary-name">${item.Name} (Qty: ${item.quantity || 1})</span>
      <span class="summary-price">$${Number(price).toFixed(2)} ${discountBadge}</span>
    </li>
  `;
}

function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;

  if (!form.checkValidity()) {
    alert("Please fill in all required fields.");
    return;
  }

  const formData = new FormData(form);
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");

  localStorage.removeItem("so-cart");

  document.querySelector("main").innerHTML = `
    <section class="order-confirmation">
      <h1>Thank you for your order, ${firstName} ${lastName}!</h1>
      <p>Your order has been successfully placed.</p>
      <p>A confirmation email will be sent to <strong>${email || "your inbox"}</strong>.</p>
    </section>
  `;
}

document
  .getElementById("form-checkout")
  .addEventListener("submit", handleFormSubmit);

renderSummary();
