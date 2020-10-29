const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors  = require('colors');

/**Render config File */
dotenv.config({path:'./config/config.env'});

const app = express();

const DUMMY_PRODUCTS = []; // not a database, just some in-memory storage for now

app.use(bodyParser.json());

// CORS Headers => Required for cross-origin/ cross-server communication
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.get('/products', (req, res, next) => {
  res.status(200).json({ products: DUMMY_PRODUCTS });
});

app.post('/product', (req, res, next) => {
  const { title, price } = req.body;

  if (!title || title.trim().length === 0 || !price || price <= 0) {
    return res.status(422).json({
      message: 'Invalid input, please enter a valid title and price.'
    });
  }

  const createdProduct = {
    id: uuid(),
    title,
    price
  };

  DUMMY_PRODUCTS.push(createdProduct);

  res
    .status(201)
    .json({ message: 'Created new product.', product: createdProduct });
});

const PORT = process.env.PORT || 5000;

const server =  app.listen(PORT, console.log(`server is runing ${process.env.NODE_ENV} mode on port ${PORT}`.bgWhite.black));

//Handle rejection 

process.on('unhandledRejection', (err,promise) => {
    console.log(`Error : ${err.message}`);
    server.close( () => process.exit(1));
})
