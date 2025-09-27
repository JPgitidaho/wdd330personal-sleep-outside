import { getParam, loadHeaderFooter } from "./utils.mjs";
import { getProductById } from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { initCartBadge } from "./cartBadge.mjs";

async function init() {
  await loadHeaderFooter();
  initCartBadge();

  const productId = getParam("product");
  const category = getParam("category");
  const productElement = document.querySelector("#product-details");

  const product = new ProductDetails(
    productId,
    category,
    { findProductById: (id) => getProductById(id) },
    productElement,
  );

  product.init();
}

init();
