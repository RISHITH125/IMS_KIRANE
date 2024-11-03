require('dotenv').config();
const mysql = require('mysql2');

const { createUser } = require('./createUser.js');

const { addProduct } = require('./addProduct.js')

const { addSales } = require('./addSales.js');

const { productSaleUpdate } = require('./sales.js');

// ad hoc login 
const genpool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise()

pool = createUser(genpool); 

productSaleUpdate(pool);  // adding the trigger

addProduct(pool)

addSales(pool)

// del_user(pool, 'ytrewq')