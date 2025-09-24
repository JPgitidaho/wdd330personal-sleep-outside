import { setLocalStorage, getLocalStorage } from "./utils.mjs";

function cleanHtml(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  doc.querySelectorAll("a").forEach((el) => {
    const text = el.textContent;
    el.replaceWith(text);
  });
  return doc.body.innerHTML;
}

export default class ProductDetails {
  constructor(productId, category, dataSource, element) {
    this.productId = productId;
    this.category = category;
    this.dataSource = dataSource;
    this.element = element;
    this.product = null;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    if (this.product) {
      this.renderProductDetails(this.product);
      document
        .getElementById("addToCart")
        .addEventListener("click", this.addProductToCart.bind(this));
    } else {
      this.element.innerHTML = "<p>Product not found.</p>";
    }
  }

  renderProductDetails(product) {
    const template = document.querySelector("template.product-detail");
    const clone = template.content.cloneNode(true);

    clone.querySelector("h3").textContent = product.Brand?.Name ?? "";
    clone.querySelector("h2").textContent = product.Name ?? "";
    clone.querySelector("img").src =
      product.Images?.PrimaryLarge ?? product.Images?.PrimaryMedium ?? "";
    clone.querySelector("img").alt = product.Name ?? "";

    const rawDescription =
      product.DescriptionHtmlSimple ?? product.Description ?? "";
    clone.querySelector(".description").innerHTML = cleanHtml(rawDescription);

    clone.querySelector(".price").textContent =
      `Regular: $${product.SuggestedRetailPrice ?? product.ListPrice ?? "0.00"}`;
    clone.querySelector(".final-price").textContent =
      `Now: $${product.FinalPrice ?? product.ListPrice ?? product.SuggestedRetailPrice ?? "0.00"}`;

    this.element.innerHTML = "";
    this.element.appendChild(clone);
  }

  addProductToCart() {
    let cart = getLocalStorage("so-cart") || [];
    const existing = cart.find((item) => item.Id === this.product.Id);

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      this.product.quantity = 1;
      cart.push(this.product);
    }

    setLocalStorage("so-cart", cart);
  }
}
