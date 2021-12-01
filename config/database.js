const Sequelize = require('sequelize');
if (process.env.NODE_ENV == 'dev') {
    const db = new Sequelize('cartiofy', 'postgres', '1234', {
        host: 'localhost',
        dialect: 'postgres',
   
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },

    });
    module.exports = db;
}
else {
    const db = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'postgres',
      
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        },
      
    });
    module.exports = db;
}
