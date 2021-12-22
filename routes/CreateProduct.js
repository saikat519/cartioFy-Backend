const express = require('express');
const router = express.Router();
const Product = require('../models/Product')
const session = require("express-session")
const cookieParser = require("cookie-parser")
require('dotenv').config();
const { uuid } = require('uuidv4');
const multer = require('multer');
const path = require('path');
var fs = require('fs');
var fse = require('fs-extra')

router.use(cookieParser());

const temp_path = "public/api/temp/";

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, temp_path)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)  //file.fieldname + "-" + Date.now()+".jpg"
    }
})

var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize }, //const maxSize = 1 * 1000 * 1000; (1MB)
    fileFilter: function (_req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myFile')  

router.post("/create", async(req, res) => {
    const { name, brand, price, description, category_name } = req.body;

    if (category_name === undefined) {
        return res.status(404).end('Attributes are missing');
    }
    let file_path = "public/api/uploads/" + category_name + '/';
    
            await upload(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(500).json(err)
                } else if (error) {
                    return res.status(500).json(error)
                }
                var fileName = req.file.filename;
                console.log("file name>>>", fileName);
                fse.move((temp_path + fileName), (file_path + fileName), function (err) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json(err)
                    }
                    res.status(200).end(fileName);
                })
            })
    const product = new Product({
        name,
        brand,
        fileName,
        price,
        description,
        category_name
    });
    await product.save().then((result) => {
        return res.status(201).send("product data saved")
      })
      .catch(err => {
            console.log("the error>>>>",err)
            return res.status(400).send("Error occured during saving product data")
        })
});