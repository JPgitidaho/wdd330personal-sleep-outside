import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const productId = getParam("product");
const category = getParam("category");

console.log("Param productId:", productId);
console.log("Param category:", category);

const dataSource = new ProductData();
const productElement = document.querySelector("#product-details");

const product = new ProductDetails(
  productId,
  category,
  dataSource,
  productElement,
);
product.init();
