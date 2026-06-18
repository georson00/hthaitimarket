import { renderListWithTemplate } from "./utils.mjs";

const PRODUCTS_URL = "json/products-all.json";

const productCardTemplate = (product) => {
  const retail = Number(product.SuggestedRetailPrice);
  const final = Number(product.FinalPrice);
  let discountHtml = "";
  let priceHtml = "";

  if (retail && retail > final) {
    const discount = retail - final;
    const discountPercent = Math.round((discount / retail) * 100);
    discountHtml = `<span class="product-card__discount-badge">${discountPercent}% OFF</span>`;
    priceHtml = `
      <p class="product-card__price">
        <span class="product-card__retail-price-list">$${retail.toFixed(2)}</span>
        <span class="product-card__final-price-list">$${final.toFixed(2)}</span>
      </p>
    `;
  } else {
    priceHtml = `<p class="product-card__price">$${final.toFixed(2)}</p>`;
  }

  return `
    <li class="product-card">
      <a href="product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimarySmall}" alt="${product.Name}">
        ${discountHtml}
        <h2>${product.Brand.Name}</h2>
        <h3>${product.Name}</h3>
        ${priceHtml}
      </a>
    </li>
  `;
};

export default class ProductSearch {
  constructor(searchInput, resultsContainer) {
    this.searchInput = searchInput;
    this.resultsContainer = resultsContainer;
    this.allProducts = [];
  }

  async init() {
    await this.loadAllProducts();
    this.setupEventListeners();
  }

  async loadAllProducts() {
    try {
      const response = await fetch(PRODUCTS_URL);

      if (!response.ok) {
        throw new Error(`Failed to load products: ${response.statusText}`);
      }

      this.allProducts = await response.json();
    } catch (err) {
      console.error("Error loading products:", err);
      this.allProducts = [];
    }
  }

  setupEventListeners() {
    this.searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase();

      if (query.length === 0) {
        this.clearResults();
      } else {
        this.performSearch(query);
      }
    });
  }

  performSearch(query) {
    const results = this.allProducts.filter((product) => {
      const name = (product.Name || "").toLowerCase();
      const brand = (product.Brand?.Name || "").toLowerCase();
      const nameWithoutBrand = (product.NameWithoutBrand || "").toLowerCase();
      const description = (product.DescriptionHtmlSimple || "").toLowerCase();
      const category = (product.Category || "").toLowerCase();
      const store = (product.Store || "").toLowerCase();

      return (
        name.includes(query) ||
        brand.includes(query) ||
        nameWithoutBrand.includes(query) ||
        description.includes(query) ||
        category.includes(query) ||
        store.includes(query)
      );
    });

    this.displayResults(results);
  }

  displayResults(results) {
    this.resultsContainer.innerHTML = "";

    if (results.length === 0) {
      this.resultsContainer.innerHTML =
        '<p class="search-no-results">No products found</p>';
      return;
    }

    const resultsList = document.createElement("ul");
    resultsList.className = "product-list search-results-list";

    renderListWithTemplate(
      productCardTemplate,
      resultsList,
      results,
      "afterbegin",
      false,
    );

    this.resultsContainer.appendChild(resultsList);
  }

  clearResults() {
    this.resultsContainer.innerHTML = "";
  }
}
