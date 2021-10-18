const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('users',{
    user_id:{
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
    },
    user_name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    token:{
        type: Sequelize.STRING,
        allowNull: true,
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