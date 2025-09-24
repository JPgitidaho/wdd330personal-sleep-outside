import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function productCardTemplate(product, category) {
  const imageUrl =
    product.Images?.PrimaryMedium ?? product.Images?.PrimarySmall ?? "";
  const price =
    product.FinalPrice ??
    product.ListPrice ??
    product.SuggestedRetailPrice ??
    0;

  let discountBadge = "";
  if (
    product.SuggestedRetailPrice &&
    product.FinalPrice &&
    product.SuggestedRetailPrice > product.FinalPrice
  ) {
    const discount = Math.round(
      ((product.SuggestedRetailPrice - product.FinalPrice) /
        product.SuggestedRetailPrice) *
        100,
    );
    if (discount > 0) {
      discountBadge = `<span class="discount-badge">-${discount}% OFF</span>`;
    }
  }

  return `
  <li class="product-card">
    <a href="/product_pages/index.html?product=${encodeURIComponent(
      product.Id,
    )}&category=${encodeURIComponent(category)}">
      <img src="${imageUrl}" alt="${product.Name}" />
      ${discountBadge}
      <h3 class="card__brand">${product.Brand?.Name ?? ""}</h3>
      <h2 class="card__name">${product.Name}</h2>
      <p class="product-card__price">$${price}</p>
    </a>
    <button class="add-to-cart" data-id="${product.Id}">Quick view</button>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
    this.addToCartHandler(list);
  }

  renderList(list) {
    const template = list
      .map((product) => productCardTemplate(product, this.category))
      .join("");
    this.listElement.innerHTML = template;
  }

  addToCartHandler(products) {
    this.listElement.addEventListener("click", (e) => {
      const btn = e.target.closest(".add-to-cart");
      if (!btn) return;

      const id = btn.dataset.id;
      let cart = getLocalStorage("so-cart") || [];
      const product = products.find((p) => p.Id === id);

      const existing = cart.find((item) => item.Id === id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        product.quantity = 1;
        cart.push(product);
      }

      setLocalStorage("so-cart", cart);
    });
  }
}
