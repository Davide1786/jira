const app = require("./express/app");
/*
 In Node.js, quando uso require con un percorso di cartella,
 const sequelize = require("./sequelize");
 Node.js cerca un file index.js all'interno di quella cartella.
*/
const sequelize = require("./sequelize");
const PORT = 3001;
/*
Questa funzione asincrona verifica la connessione al database.
sequelize.authenticate(): Tenta di autenticarsi con il database utilizzando
le credenziali fornite nella configurazione di Sequelize.
Se l'autenticazione ha successo, stampa "Database connection OK!".
Se si verifica un errore, stampa un messaggio di errore e termina il
processo Node.js (process.exit(1)).
*/
async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  try {
    await sequelize.authenticate();
    console.log("Database connection OK!");
  } catch (error) {
    console.log("Unable to connect to the database:");
    console.log(error.message);
    process.exit(1);
  }
}
/*
Questa funzione asincrona inizializza l'applicazione.
await assertDatabaseConnectionOk();:
Chiama la funzione per verificare la connessione al database.
app.listen(PORT, () => { ... });:
Avvia il server Express sulla porta definita in PORT.
Il callback all'interno di app.listen() viene eseguito quando il server
è in ascolto.
Il codice commentato (la parte sequelize.sync) è per la sincronizzazione
del database. Se decommentato, forza la ricreazione delle tabelle
del database.
*/

async function init() {
  await assertDatabaseConnectionOk();

  await sequelize.sync({ alter: true }); // crea o aggiorna le tabelle

  console.log(`Starting Sequelize + Express example on port ${PORT}...`);

  app.listen(PORT, () => {
    console.log(`Express server started on port ${PORT}. Try some routes, such as '/api/users'.`);

    /*
    attivandolo verrà buttato giu tutto il DB e ricostruito
    FARE ATTENZIONE A COME LO USO
    */
    sequelize
      .sync({ force: true })
      .then(() => {
        console.log("Database e tabelle sincronizzate!");
      })
      .catch((error) => console.error("Errore durante la sincronizzazione:", error));
  });
}

init();
/*
In sintesi:
Questo file avvia un server Express che utilizza Sequelize per interagire
con un database. Verifica la connessione al database all'avvio e avvia il
server sulla porta 3001. Il codice commentato mostra come sincronizzare i
modelli del database con le tabelle del database.
*/
