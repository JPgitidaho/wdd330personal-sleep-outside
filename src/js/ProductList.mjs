import {
  renderListWithTemplate,
  getLocalStorage,
  setLocalStorage,
} from "./utils.mjs";

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}">
        <img src="${product.Image}" alt="${product.Name}">
        <h3>${product.Name}</h3>
        <p class="price">$${product.ListPrice}</p>
      </a>
      <button class="addToCart" data-id="${product.Id}">Add to Cart</button>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const data = await this.dataSource.getData();
    this.renderList(data);
    this.addToCartHandler();
  }

  renderList(list) {
    if (!list || list.length === 0) {
      this.listElement.innerHTML = "<li>No products available</li>";
      return;
    }

    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      "afterbegin",
      true,
    );
  }

  addToCartHandler() {
    this.listElement.addEventListener("click", (e) => {
      const btn = e.target.closest(".addToCart");
      if (!btn) return;
      const id = btn.dataset.id;

      let cart = getLocalStorage("so-cart") || [];
      const idx = cart.findIndex((i) => i.Id === id);

      if (idx >= 0) {
        cart[idx].quantity = (cart[idx].quantity || 1) + 1;
      } else {
        cart.push({ Id: id, quantity: 1 });
      }

      setLocalStorage("so-cart", cart);
      alert("Product added to cart!");
    });
  }
}
