import { getParam, updateCartCount, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./productDetails.mjs";

loadHeaderFooter();
updateCartCount();

const dataSource = new ExternalServices();

const productId = getParam("product");

const productDetails = new ProductDetails(productId, dataSource);



const initProductDetail = async () => {
  try {
    await productDetails.init();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

initProductDetail();
