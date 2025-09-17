import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource, element) {
    this.productId = productId;
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

    const h3 = clone.querySelector("h3");
    const h2 = clone.querySelector("h2");
    const img = clone.querySelector("img");
    const description = clone.querySelector(".description");
    const price = clone.querySelector(".price");
    const finalPrice = clone.querySelector(".final-price");

    if (h3) h3.textContent = product.Brand?.Name ?? "";
    if (h2) h2.textContent = product.Name ?? product.Title ?? "";
    if (img) {
      img.src = product.Image ?? product.image ?? "";
      img.alt = product.Name ?? "";
    }
    if (description)
      description.textContent =
        product.DescriptionHtmlSimple ?? product.Description ?? "";
    if (price)
      price.textContent = product.SuggestedRetailPrice ?? product.price ?? "";
    if (finalPrice) finalPrice.textContent = `$${product.FinalPrice}`;

    this.element.innerHTML = "";
    this.element.appendChild(clone);
  }

  addProductToCart() {
    let cart = getLocalStorage("so-cart") || [];
    cart.push(this.product);
    setLocalStorage("so-cart", cart);

    alert("Product added to cart!");
  }
}
