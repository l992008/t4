const productsList = require("./data/products.json"); // Импортируем данные о товарах

const root = {
  products: () => {
    return productsList;
  },
  product: ({ id }) => {
    return productsList.find(product => product.id === id);
  },
};

module.exports = root;
