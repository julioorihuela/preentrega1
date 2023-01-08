const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.path = path;
    // guardo el próximo id en archivo/
    this.idFile = "../id.txt";
    if (fs.existsSync(`${this.idFile}`)) {
      this.id = JSON.parse(fs.readFileSync(`${this.idFile}`));
    } else {
      this.id = 1;
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    let products = [];
    let product = {
      id: this.id,
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
    };
    if (fs.existsSync(`${this.path}`)) {
      products = await this.getProducts();
    } else {
      products = [];
    }
    if (!products.some((currentProduct) => currentProduct.code === code)) {
      if (title && description && price && thumbnail && code && stock) {
        try {
          this.id++;
          await fs.promises.writeFile(
            `${this.idFile}`,
            JSON.stringify(this.id)
          );

          products.push(product);
          await fs.promises.writeFile(
            `${this.path}`,
            JSON.stringify(products, null, 2)
          );
        } catch (error) {
          console.error(error);
        }
      } else {
        throw new Error("Todos los campos deben tener data.");
      }
    } else {
      console.log("Code ya existente, producto no añadido");
    }
  }

  async getProducts() {
    try {
      let data;
      try {
        await fs.promises.access(`${this.path}`);
        data = await fs.promises.readFile(`${this.path}`, "utf-8");
      } catch (err) {
        if (err.code === 'ENOENT') {
          return [];
        } else {
          throw err;
        }
      }
      const convert = JSON.parse(data);
      return convert;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getProductById(productId) {
    try {
      const products = await this.getProducts();
      const product = products.find((product) => product.id === productId);
      if (!product) {
        return { error: 'Product not found' };
      }
      return product;
    } catch (error) {
      console.error(error);
    }
  }

  async updateProduct(id, updates) {
    try {
      const products = await this.getProducts();
      const updatedProducts = products.map((product) => {
        if (product.id === id) {
          return { ...product, ...updates };
        }
        return product;
      });
      await fs.promises.writeFile(
        `${this.path}`,
        JSON.stringify(updatedProducts, null, 2)
      );
    } catch (error) {
      console.error(error);
    }
  }

  async deleteProduct(productId) {
    try {
      const products = await this.getProducts();
      const updatedProducts = products.filter(
        (product) => product.id !== productId
      );
      await fs.promises.writeFile(
        `${this.path}`,
        JSON.stringify(updatedProducts, null, 2)
      );
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = ProductManager;
