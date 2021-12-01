const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('users',{
    user_id:{
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    user_name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
    }
   
     
},

);
User.sync();
//User.sync({force:true})  //--> for the first time
module.exports = User;