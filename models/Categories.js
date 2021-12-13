const Sequelize = require('sequelize');
const db = require('../config/database');

const Category = db.define('categories',{
    category_id:{
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
    },
    category_name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
   
   
     
},

);
Category.sync();
//Category.sync({force:true})  //--> for the first time
module.exports = Category;