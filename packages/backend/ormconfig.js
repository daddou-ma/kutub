module.exports = {
  "name": "prod",
  "type": "mysql",
  "host": process.env.DBHOST,
  "port": 3306,
  "username": process.env.DBUSER,
  "password": process.env.DBPASS,
  "database": process.env.DBNAME,
  "synchronize": true,
  "entities": [ "src/modules/**/*.entity.{ts,js}" ],
  "factories": [ "src/database/factories/**/*.factory.{ts,js}" ],
  "seeds": [ "src/database/seeds/**/*.seed.{ts,js}" ]
};