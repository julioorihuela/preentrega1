const { application } = require('express');
const express = require('express');
const productManager = require('./ProductManager');

const app = express();
// app.use(express.urlencoded({extended:true}));

const pm = new productManager('./products.json');

app.get('/products', async (req, res) => {
  const resultado = await pm.getProducts();
  const limit = req.query.limit;

  if (limit) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(resultado.slice(0, limit), null, 2));
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(resultado, null,2));
  }
});

app.get('/products/:pid', async (req, res) => {   
    const pid = Number(req.params.pid);
    if (isNaN(pid)) {
      res.status(400).send({ error: 'Invalid product ID' });
      return;
    }
    const resultado = await pm.getProductById(pid);
    if (resultado.error) {
      res.status(404).send(resultado);
    } else {
        res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(resultado, null,2));
    }
  });

app.listen(8080, () => {
  console.log('Listening on 8080');
});

// Se verificó ok lo pedido:
// http://localhost:8080/products sin query
// http://localhost:8080/products?limit=5
// http://localhost:8080/products/2
// http://localhost:8080/products/34123123