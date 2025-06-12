const { Sequelize } = require("sequelize");
require("dotenv").config(); // Carica le variabili d'ambiente dal file .env

// Variabili di ambiente
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "mysql",
  logging: false,
});

const modelDefiners = [
  require("./models/user.model"), // prendo il modello - persorso relativo
];

/*
 modelDefiners è un array che conterrà funzioni.
 Queste funzioni sono quelle che definiscono i modelli del database.
 ogni modello altro non è che una funzione che riceve un parametro, che
 chiama il metodo define (vedere i modelli).
 Quindi il for of mappa ogni elemento dell'array e salva in modelDefiner
 le funzioni eseguendole una per volta, passando il parametro sequelize
*/

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

module.exports = sequelize;
