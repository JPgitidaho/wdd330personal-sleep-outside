import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { initCartBadge } from "./cartBadge.mjs";

async function init() {
  await loadHeaderFooter();
  initCartBadge();

  const productId = getParam("product");
  const dataSource = new ProductData("tents");
  const product = new ProductDetails(productId, dataSource);
  product.init();
}
init();

//function addProductToCart(product) {
//  setLocalStorage("so-cart", product);
//}
// add to cart button event handler
//async function addToCartHandler(e) {
//const product = await dataSource.findProductById(e.target.dataset.id);
//addProductToCart(product);
//}

// add listener to Add to Cart button
//document
// .getElementById("addToCart")
//  .addEventListener("click", addToCartHandler);
