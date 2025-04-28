const app = require("./express/app");
const sequelize = require("./sequelize");
const PORT = 3001;

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
    // sequelize
    //   .sync({ force: true })
    //   .then(() => {
    //     console.log("Database e tabelle sincronizzate!");
    //   })
    //   .catch((error) => console.error("Errore durante la sincronizzazione:", error));
  });
}

init();
