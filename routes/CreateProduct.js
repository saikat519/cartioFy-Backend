const express = require('express');
const router = express.Router();
const Product = require('../models/Product')
const session = require("express-session")
const cookieParser = require("cookie-parser")
require('dotenv').config();
const { uuid } = require('uuidv4');


router.use(cookieParser());

router.post("/create", (req, res) => {
    const { name, brand, image, price, description, category_name } = req.body;
    const product = new Product({
        name,
        brand,
        image,
        price,
        description,
        category_name
    });
    product.save().then((result) => {
        return res.status(201).send("product data saved")
      })
      .catch(err => {
            console.log("the error>>>>",err)
            return res.status(400).send("Error occured during saving product data")
        })
});