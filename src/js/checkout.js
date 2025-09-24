import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderSummary() {
  const cartItems = getLocalStorage("so-cart") || [];
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
