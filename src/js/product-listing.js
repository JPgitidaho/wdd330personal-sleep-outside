import { getProductsByCategory } from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";
import { initCartBadge } from "./cartBadge.mjs";

async function init() {
  await loadHeaderFooter();
  initCartBadge();

  const category = getParam("category");
  const listElement = document.querySelector(".product-list");

  const products = await getProductsByCategory(category);

  const myList = new ProductList(category, () => products, listElement);
  await myList.init();

  const categoryTitle = document.getElementById("category-title");
  if (categoryTitle && category) {
    const formatted =
      category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ");
    categoryTitle.textContent = `${formatted}`;
  }

  const breadcrumb = document.getElementById("breadcrumb");
  if (breadcrumb && category) {
    const formatted =
      category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ");
    breadcrumb.textContent = `${formatted} → (${products.length} items)`;
  }
}
init();
