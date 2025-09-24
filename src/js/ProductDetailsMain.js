import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";
import { initCartBadge } from "./cartBadge.mjs";

async function init() {
  await loadHeaderFooter();
  initCartBadge();

  const productId = getParam("product");
  const category = getParam("category");

  const dataSource = new ProductData();
  const productElement = document.querySelector("#product-details");

  const product = new ProductDetails(
    productId,
    category,
    dataSource,
    productElement,
  );
  product.init();
}
init();
