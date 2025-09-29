import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
} from "./utils.mjs";
import { initCartBadge } from "./cartBadge.mjs";

async function init() {
  await loadHeaderFooter();
  initCartBadge();
  renderCartContents();
}

function getPrice(item) {
  return Number(
    item.FinalPrice ?? item.ListPrice ?? item.SuggestedRetailPrice ?? 0,
  );
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const listElement = document.querySelector(".cart-list");
  const footerElement = document.querySelector(".cart-footer");
  const totalElement = document.getElementById("cart-total");

  if (!listElement) return;

  if (cartItems.length === 0) {
    listElement.innerHTML = "<li>Your cart is empty</li>";
    if (totalElement) totalElement.textContent = "Subtotal (0 items): $0.00";
    if (footerElement) footerElement.classList.add("hide");
    return;
  }

  listElement.innerHTML = cartItems
    .map((item, i) => cartItemTemplate(item, i))
    .join("");

  const subtotal = cartItems.reduce(
    (s, it) => s + getPrice(it) * (it.quantity || 1),
    0,
  );
  const itemsCount = cartItems.reduce((n, it) => n + (it.quantity || 1), 0);

  if (totalElement)
    totalElement.textContent = `Total (${itemsCount} items): $${subtotal.toFixed(2)}`;
  if (footerElement) footerElement.classList.remove("hide");

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = Number(e.currentTarget.dataset.index);
      removeItem(index);
    });
  });
  document.querySelectorAll(".decrease-qty").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = Number(e.currentTarget.dataset.index);
      changeQuantity(index, -1);
    });
  });
  document.querySelectorAll(".increase-qty").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = Number(e.currentTarget.dataset.index);
      changeQuantity(index, 1);
    });
  });
}

function cartItemTemplate(item, index) {
  const imageUrl =
    item.Images?.PrimarySmall ?? item.Images?.PrimaryMedium ?? "";
  const unit =
    item.FinalPrice ?? item.ListPrice ?? item.SuggestedRetailPrice ?? 0;

  let unitPrice = `$${Number(unit).toFixed(2)}`;
  if (
    item.SuggestedRetailPrice &&
    item.FinalPrice &&
    item.SuggestedRetailPrice > item.FinalPrice
  ) {
    unitPrice = `
      <span style="text-decoration: line-through; color:#888;">
        $${item.SuggestedRetailPrice.toFixed(2)}
      </span>
      <span style="font-weight:bold; color:#b91c1c; margin-left:.5rem;">
        $${item.FinalPrice.toFixed(2)}
      </span>
    `;
  }

  const qty = item.quantity || 1;
  const lineTotal = (getPrice(item) * qty).toFixed(2);

  return `
    <li class="cart-card divider">
      <img src="${imageUrl}" alt="${item.Name}" class="cart-card__image" />
      <div class="cart-card__info">
        <h2 class="card__name">${item.Name}</h2>
        <p class="cart-card__unit">${unitPrice}</p>
      </div>
      <div class="cart-card__actions">
      <button class="remove-item" data-index="${index}">
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" 
                 viewBox="0 0 24 24" fill="#525b0f" aria-hidden="true">
              <path d="M9 3h6v2h5v2H4V5h5V3zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM7 9h2v9H7V9z"/>
            </svg></button>
        <div class="qty-controls">
          <button class="decrease-qty" data-index="${index}">-</button>
          <span>qty: ${qty}</span>
          <button class="increase-qty" data-index="${index}">+</button>
        </div>
        <p class="line-total">$${lineTotal}</p>
      </div>
    </li>`;
}

function removeItem(index) {
  let cartItems = getLocalStorage("so-cart") || [];
  cartItems.splice(index, 1);
  setLocalStorage("so-cart", cartItems);
  document.dispatchEvent(new Event("cart:updated"));
  renderCartContents();
}

function changeQuantity(index, delta) {
  let cartItems = getLocalStorage("so-cart") || [];
  const item = cartItems[index];
  if (!item) return;
  item.quantity = (item.quantity || 1) + delta;
  if (item.quantity <= 0) cartItems.splice(index, 1);
  setLocalStorage("so-cart", cartItems);
  document.dispatchEvent(new Event("cart:updated"));
  renderCartContents();
}

init();
