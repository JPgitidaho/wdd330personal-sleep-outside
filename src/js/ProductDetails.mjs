import { setLocalStorage, getLocalStorage, alertMessage } from "./utils.mjs";

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

    const oldImg = clone.querySelector("img");
    const picture = document.createElement("picture");

    const sourceLarge = document.createElement("source");
    sourceLarge.media = "(min-width: 1024px)";
    sourceLarge.srcset = product.Images?.PrimaryLarge ?? "";

    const sourceMedium = document.createElement("source");
    sourceMedium.media = "(min-width: 600px)";
    sourceMedium.srcset = product.Images?.PrimaryMedium ?? "";

    const img = document.createElement("img");
    img.src = product.Images?.PrimarySmall ?? "";
    img.alt = product.Name ?? "";

    picture.append(sourceLarge, sourceMedium, img);
    oldImg.replaceWith(picture);

    const rawDescription =
      product.DescriptionHtmlSimple ?? product.Description ?? "";
    clone.querySelector(".description").innerHTML = cleanHtml(rawDescription);

    if (
      product.SuggestedRetailPrice &&
      product.FinalPrice &&
      product.SuggestedRetailPrice > product.FinalPrice
    ) {
      clone.querySelector(".price").innerHTML =
        `<span style="text-decoration: line-through; color: #888;">$${product.SuggestedRetailPrice.toFixed(
          2,
        )}</span>`;
      clone.querySelector(".final-price").innerHTML =
        `<span style="font-weight: bold; color: #b91c1c;">$${product.FinalPrice.toFixed(
          2,
        )}</span>`;

      const discount = Math.round(
        ((product.SuggestedRetailPrice - product.FinalPrice) /
          product.SuggestedRetailPrice) *
          100,
      );
      const discountBadge = document.createElement("span");
      discountBadge.classList.add("discount-badge");
      discountBadge.textContent = `-${discount}% OFF`;
      clone.querySelector(".product-detail").prepend(discountBadge);
    } else {
      clone.querySelector(".final-price").textContent = `$${(
        product.FinalPrice ??
        product.ListPrice ??
        product.SuggestedRetailPrice ??
        0
      ).toFixed(2)}`;
      clone.querySelector(".price").textContent = "";
    }

    this.element.innerHTML = "";
    this.element.appendChild(clone);
  }

  addProductToCart() {
    let cart = getLocalStorage("so-cart") || [];
    const existing = cart.find((item) => item.Id === this.product.Id);

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      const newItem = {
        Id: this.product.Id,
        Name: this.product.Name,
        Images: this.product.Images,
        FinalPrice: this.product.FinalPrice,
        ListPrice: this.product.ListPrice,
        SuggestedRetailPrice: this.product.SuggestedRetailPrice,
        quantity: 1,
      };
      cart.push(newItem);
    }

    setLocalStorage("so-cart", cart);
    document.dispatchEvent(new Event("cart:updated"));
    alertMessage("Producto agregado al carrito", {
      type: "success",
      scroll: false,
      timeout: 2000,
    });
  }
}
