module.exports = {
  "name": "prod",
  "type": "mysql",
  "host": process.env.DB_HOST,
  "port": 3306,
  "username": process.env.DB_USER,
  "password": process.env.DB_PASS,
  "database": process.env.DB_NAME,
  "synchronize": true,
  "entities": [ "src/modules/**/*.entity.{ts,js}" ],
  "factories": [ "src/database/factories/**/*.factory.{ts,js}" ],
  "seeds": [ "src/database/seeds/**/*.seed.{ts,js}" ]
};