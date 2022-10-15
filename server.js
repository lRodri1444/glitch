const fs = require("fs");
const express = require("express");

const products = JSON.parse(fs.readFileSync(`${__dirname}/products.txt`));

const readProductPro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject("No se pudo leer el archivo");
      resolve(data);
    });
  });
};

const writeProductPro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("No pude escribir");
      resolve("Nuevo JSON creado!");
    });
  });
};

//Contenedor de la clase pasada
class Container {
  constructor(file) {
    this.file = file;
  }

  async save(Obj) {
    try {
      const data = await readProductPro(this.file);
      const parsedData = JSON.parse(data);
      Obj.id = parsedData.length + 1;
      for (let i of parsedData) {
        if (i.id === Obj.id) {
          Obj.id++;
        }
      }

      parsedData.push(Obj);
      const updatedJSON = JSON.stringify(parsedData);

      await writeProductPro(this.file, `${updatedJSON}`);
      console.log(`${Obj.id}`);
    } catch (err) {
      console.log(err);
    }
  }

  async getById(Number) {
    try {
      const data = await readProductPro(this.file);
      const parsedData = JSON.parse(data);
      const index = parsedData.map((product) => product.id).indexOf(Number);
      index === -1
        ? console.log("El producto no existe")
        : console.log(parsedData[index]);
    } catch (err) {
      console.log(err);
    }
  }

  async getAll() {
    try {
      const data = await readProductPro(this.file);
      const parsedData = JSON.parse(data);
      console.log(parsedData);
    } catch (err) {
      console.log(err);
    }
  }

  async deleteById(Number) {
    try {
      const data = await readProductPro(this.file);
      const parsedData = JSON.parse(data);

      const index = parsedData.map((product) => product.id).indexOf(Number);
      if (index === -1) {
        console.log("No se pudo eliminar el producto porque no existe");
      } else {
        parsedData.splice(index, 1);
        const updatedJSON = JSON.stringify(parsedData);
        await writeProductPro(this.file, updatedJSON);
        console.log("Producto eliminado con éxito");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async deleteAll() {
    try {
      const data = await readProductPro(this.file);
      const parsedData = JSON.parse(data);
      if (parsedData.length > 0) {
        parsedData.length = 0;

        const updatedJSON = JSON.stringify(parsedData);
        await writeProductPro(this.file, updatedJSON);
        console.log("Todos los productos fueron eliminados con éxito");
      } else {
        console.log("No hay productos en el archivo");
      }
    } catch (err) {
      console.log(err);
    }
  }
}

const product = new Container(`${__dirname}/products.txt`);

const app = express();

//Tarea
app.get("/productos", (req, res) => {
  res.status(200).send(products);
});
app.get("/productoRandom", (req, res) => {
  res.status(200).send(products[Math.floor(Math.random() * products.length)]);
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//product.save({title:'Ccc',price:`S/.${85}`,thumbnail:'https://www.iconfinder.com/search?q=bird'})
//product.getById(3);
//product.getAll()
//product.deleteById(4);
//product.deleteAll()
