import Alert from "./alert.js";
import { updateCartCount, loadHeaderFooter } from "./utils.mjs";
import ProductSearch from "./productSearch.mjs";
import { getHaitiHolidays, renderHaitiHolidays } from "./haitiInfo.mjs";
import { renderListWithTemplate } from "./utils.mjs";
new Alert();

await loadHeaderFooter();
updateCartCount();


loadProductCategories();
initializeProductSearch();
loadHaitiInfo();

async function loadHaitiInfo() {
  try {
    const holidays = await getHaitiHolidays();
    renderHaitiHolidays(holidays);
  } catch (error) {
    console.error("Haiti holidays API failed:", error);
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

async function loadFeaturedProducts() {
  try {
    const response = await fetch("json/products-all.json");

    if (!response.ok) {
      throw new Error("Could not load featured products");
    }

    const products = await response.json();
    const featuredProducts = products.filter((product) => product.Featured);

    const featuredList = document.querySelector(".featured-products-list");

    if (!featuredList) return;

    renderListWithTemplate(
      featuredProductTemplate,
      featuredList,
      featuredProducts,
      "afterbegin",
      true,
    );
  } catch (error) {
    console.error("Featured products failed:", error);
  }
}

function featuredProductTemplate(product) {
  return `
    <li class="product-card">
      <a href="/hthaitimarket/product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.Name}</h3>
        <p class="product-card__price">$${Number(product.FinalPrice).toFixed(2)}</p>
      </a>
    </li>
  `;
}

loadFeaturedProducts();
