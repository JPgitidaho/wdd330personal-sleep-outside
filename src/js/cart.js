import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");

  if (cartItems.length === 0) {
    productList.innerHTML = "<li>Your cart is empty</li>";
  } else {
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    productList.innerHTML = htmlItems.join("");
    renderCartTotal(cartItems);
  }
}

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

function renderCartTotal(cartItems) {
  const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
  const totalElement = document.createElement("li");
  totalElement.classList.add("cart-total");
  totalElement.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
  document.querySelector(".product-list").appendChild(totalElement);
}

renderCartContents();
