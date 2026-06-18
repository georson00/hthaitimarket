export default class ExternalServices {
  async getData(category) {
    const response = await fetch(`/hthaitimarket/json/${category}.json`);

    if (!response.ok) {
      throw new Error(`Could not load ${category}.json`);
    }

    return await response.json();
  }

  async findProductById(id) {
    const response = await fetch("/hthaitimarket/json/products-all.json");

    if (!response.ok) {
      throw new Error("Could not load products-all.json");
    }

    const products = await response.json();
    return products.find((product) => product.Id === id);
  }

  async processCheckout(payload) {
    const orders = JSON.parse(localStorage.getItem("ht-orders")) || [];
    orders.push(payload);
    localStorage.setItem("ht-orders", JSON.stringify(orders));
    return true;
  }
}
