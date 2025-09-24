import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";
import { initCartBadge } from "./cartBadge.mjs";

async function init() {
  await loadHeaderFooter();
  initCartBadge();

  const category = getParam("category");
  const dataSource = new ProductData();
  const listElement = document.querySelector(".product-list");

  const myList = new ProductList(category, dataSource, listElement);
  myList.init();

  const categoryTitle = document.getElementById("category-title");
  if (categoryTitle && category) {
    const formatted =
      category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ");
    categoryTitle.textContent = `Top Products: ${formatted}`;
  }
}
init();
