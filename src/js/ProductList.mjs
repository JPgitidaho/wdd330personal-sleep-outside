import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function productCardTemplate(product, category) {
  const imageUrl =
    product.Images?.PrimaryMedium ?? product.Images?.PrimarySmall ?? "";

  let discountBadge = "";
  let priceBlock = "";

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
    priceBlock = `
      <p class="product-card__price">
        <span style="text-decoration: line-through; color: #888;">
          $${product.SuggestedRetailPrice.toFixed(2)}
        </span>
        <span style="font-weight: bold; color: #b91c1c; margin-left: 0.5rem;">
          $${product.FinalPrice.toFixed(2)}
        </span>
      </p>
    `;
  } else {
    priceBlock = `
      <p class="product-card__price">
        $${(
          product.FinalPrice ??
          product.ListPrice ??
          product.SuggestedRetailPrice ??
          0
        ).toFixed(2)}
      </p>
    `;
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
      ${priceBlock}
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
      document.dispatchEvent(new Event("cart:updated"));
    });
  }
}
