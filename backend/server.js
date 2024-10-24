require('dotenv').config();
const mysql = require('mysql2');

const { createUser } = require('./createUser.js');

const { addProduct } = require('./addProduct.js')

// ad hoc login 
const genpool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise()

// pool = createUser(genpool); 
// console.log('hi');
// console.log('hi')

addProduct(genpool)

// del_user(pool, 'ytrewq')