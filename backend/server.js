require('dotenv').config();
const mysql = require('mysql2');
const readline = require('readline');
// const bcrypt = require('bcrypt');

const { createUser } = require('./createUser.js');

const { addProduct } = require('./addProduct.js')

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}).promise()

createUser(pool); 
addProduct(pool);
// del_user(pool, 'ytrewq')