import Alert from "./alert.js";
import { updateCartCount, loadHeaderFooter } from "./utils.mjs";
import ProductSearch from "./productSearch.mjs";
import { getHaitiInfo, renderHaitiInfo } from "./haitiInfo.mjs";

new Alert();
updateCartCount();
loadHeaderFooter();
loadProductCategories();
initializeProductSearch();
loadHaitiInfo();

async function loadHaitiInfo() {
  try {
    const haiti = await getHaitiInfo();
    renderHaitiInfo(haiti);
  } catch (error) {
    console.error("Haiti API failed:", error);
  }
}

async function initializeProductSearch() {
  const searchInput = document.getElementById("product-search");
  const searchResults = document.getElementById("search-results");

  if (searchInput && searchResults) {
    const productSearch = new ProductSearch(searchInput, searchResults);
    await productSearch.init();
  }
}

async function loadProductCategories() {
  try {
    const res = await fetch("json/categories.json");

    if (!res.ok) {
      throw new Error("Could not load categories.json");
    }

    const categories = await res.json();

    const categoryList = document.querySelector(".category-list");
    const template = document.getElementById("category-card-template");

    if (!categoryList || !template) return;

    categories.forEach((category) => {
      const clone = template.content.cloneNode(true);

      const link = clone.querySelector("a");
      const image = clone.querySelector("img");
      const title = clone.querySelector("h3");
      const description = clone.querySelector("p");

      link.href = `product_listing/?category=${category.id}`;
      image.src = `images/icons/${category.icon}`;
      image.alt = category.name;
      title.textContent = category.name;

      if (description) {
        description.textContent = category.description;
      }

      categoryList.appendChild(clone);
    });
  } catch (error) {
    console.error("Categories failed:", error);
  }
}
