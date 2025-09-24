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
    item.FinalPrice ??
      item.ListPrice ??
      item.SuggestedRetailPrice ??
      item.final_price ??
      item.list_price ??
      item.suggested_retail_price ??
      0,
  );
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const listElement = document.querySelector(".cart-list");
  const footerElement = document.querySelector(".cart-footer");

  if (cartItems.length === 0) {
    listElement.innerHTML = "<li>Your cart is empty</li>";
    if (footerElement) footerElement.classList.add("hide");
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  listElement.innerHTML = htmlItems.join("");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + getPrice(item) * (item.quantity || 1),
    0,
  );
  const itemsCount = cartItems.reduce((n, i) => n + (i.quantity || 1), 0);

  const totalElement = document.getElementById("cart-total");
  if (totalElement) {
    totalElement.textContent = `Subtotal (${itemsCount} items): $${subtotal.toFixed(
      2,
    )}`;
  }

  if (footerElement) footerElement.classList.remove("hide");

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.currentTarget.dataset.index;
      removeItem(index);
    });
  });
}

function cartItemTemplate(item, index) {
  const imageUrl =
    item.Images?.PrimarySmall ?? item.Images?.PrimaryMedium ?? "";
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
      <span style="text-decoration: line-through; color:#888;">
        $${item.SuggestedRetailPrice.toFixed(2)}
      </span>
      <span style="font-weight:bold; color:#b91c1c; margin-left:0.5rem;">
        $${item.FinalPrice.toFixed(2)}
      </span>
    `;
  }

  return `
    <li class="cart-card divider">
      <img src="${imageUrl}" alt="${item.Name}" class="cart-card__image" />
      <div class="cart-card__info">
        <h2 class="card__name">${item.Name}</h2>
        <p>Qty: ${item.quantity || 1}</p>
      </div>
      <div class="cart-card__actions">
        <p class="cart-card__price">
          ${priceBlock} ${discountBadge}
          <button class="remove-item" data-index="${index}">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" 
                 viewBox="0 0 24 24" fill="#525b0f" aria-hidden="true">
              <path d="M9 3h6v2h5v2H4V5h5V3zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM7 9h2v9H7V9z"/>
            </svg>
          </button>
        </p>
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

init();
