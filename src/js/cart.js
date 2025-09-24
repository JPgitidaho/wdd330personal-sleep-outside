import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
} from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const listElement = document.querySelector(".cart-list");

  if (cartItems.length === 0) {
    listElement.innerHTML = "<li>Your cart is empty</li>";
    return;
  }

  const htmlItems = cartItems.map((item, index) =>
    cartItemTemplate(item, index),
  );
  listElement.innerHTML = htmlItems.join("");

  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      Number(
        item.FinalPrice ?? item.ListPrice ?? item.SuggestedRetailPrice ?? 0,
      ) *
        (item.quantity || 1),
    0,
  );

  const totalElement = document.getElementById("cart-total");
  if (totalElement) {
    totalElement.textContent = `Subtotal (${cartItems.length} items): $${total.toFixed(2)}`;
  }

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      removeItem(index);
    });
  });
}

function cartItemTemplate(item, index) {
  const imageUrl =
    item.Images?.PrimarySmall ?? item.Images?.PrimaryMedium ?? "";
  const price =
    item.FinalPrice ?? item.ListPrice ?? item.SuggestedRetailPrice ?? 0;
  return `
    <li class="cart-card divider">
      <img src="${imageUrl}" alt="${item.Name}" class="cart-card__image" />
      <div class="cart-card__info">
        <h2 class="card__name">${item.Name}</h2>
        <p>Qty: ${item.quantity || 1}</p>
      </div>
      <div class="cart-card__actions">
        <p class="cart-card__price">
          $${Number(price).toFixed(2)}
          <button class="remove-item" data-index="${index}">X</button>
        </p>
      </div>
    </li>`;
}

function removeItem(index) {
  let cartItems = getLocalStorage("so-cart") || [];
  cartItems.splice(index, 1);
  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

renderCartContents();
