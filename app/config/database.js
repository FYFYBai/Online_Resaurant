const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'online_restaurant',
    'JAadmin',
    'Heqi123@qq.com',
     {
       host: 'projectgroup4.mysql.database.azure.com',
       dialect: 'mysql'
     }
);

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database: ', error);
    });

module.exports = sequelize;


