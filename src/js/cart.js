import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
} from "./utils.mjs";

loadHeaderFooter();

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

  document.querySelectorAll(".remove-x").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      removeItem(id);
    });
  });
}

function cartItemTemplate(item) {
  const imageUrl =
    item.Images?.PrimarySmall ?? item.Images?.PrimaryMedium ?? "";
  const price = getPrice(item);

  let discountBadge = "";
  if (
    (item.SuggestedRetailPrice ?? item.suggested_retail_price) &&
    (item.FinalPrice ?? item.final_price) &&
    (item.SuggestedRetailPrice ?? item.suggested_retail_price) >
      (item.FinalPrice ?? item.final_price)
  ) {
    const base = Number(
      item.SuggestedRetailPrice ?? item.suggested_retail_price,
    );
    const now = Number(item.FinalPrice ?? item.final_price);
    const discount = Math.round(((base - now) / base) * 100);
    if (discount > 0) {
      discountBadge = `<span class="discount-badge">-${discount}% OFF</span>`;
    }
  }

  return `
    <li class="cart-card divider">
      <span class="remove-x" data-id="${item.Id}">
        <i class="fa-solid fa-trash"></i>
      </span>
      <img src="${imageUrl}" alt="${item.Name}" class="cart-card__image" />
      <div class="cart-card__info">
        ${discountBadge}
        <h2 class="card__name">${item.Name}</h2>
        <p>Qty: ${item.quantity || 1}</p>
      </div>
      <div class="cart-card__actions">
        <p class="cart-card__price">$${price.toFixed(2)}</p>
      </div>
    </li>`;
}

function removeItem(id) {
  let cartItems = getLocalStorage("so-cart") || [];
  cartItems = cartItems.filter((item) => item.Id !== id);
  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

renderCartContents();
