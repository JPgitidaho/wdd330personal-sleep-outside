import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

const productId = getParam("product");
const dataSource = new ProductData("tents");
const element = document.querySelector("main.divider");

const product = new ProductDetails(productId, dataSource, element);
product.init();
