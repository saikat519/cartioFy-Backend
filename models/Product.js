const Sequelize = require('sequelize');
const db = require('../config/database');

const Product = db.define(
    "products",
    {
      product_id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      brand: {
          type: Sequelize.STRING,
          allowNull:false
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      reviews: {
        type: Sequelize.JSONB
      },
      category_name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    },
    {
      freezeTableName: true 
    }
  );
  
Product.sync();
module.exports = Product;