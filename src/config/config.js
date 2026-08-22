export default {
  "development": {
    "username": "postgres",
    "password": "admin",
    "database": "belimudah",
    "host": "127.0.0.1",
    "dialect": "postgres", 
    "logging": false
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.DB_NAME || "postgres",
    "password": process.env.DB_NAME || "admin",
    "database": process.env.DB_NAME|| "belimudah",
    "host": process.env.DB_HOST || "localhost",
    "dialect": "postgres"
  }
}
