const { models } = require("../../sequelize"); // Importa i modelli

async function getAll(req, res) {
  try {
    const user = await models.user.findAll({});
    res.status(200).json(user);
  } catch (error) {
    console.error("Errore durante il recupero dell user:", error);
    res.status(500).json({ error: "Si è verificato un errore durante il recupero dell user" });
  }
}

async function create(req, res) {
  console.log("Body ricevuto:", req.body);
  const { name, surname, email, role } = req.body;

  if (!name || !surname || !email || !role) {
    return res.status(400).json({ error: "Campi obbligatori mancanti." });
  }

  console.log("Tentativo di creazione utente:", req.body);
  if (req.body.id) {
    return res.status(400).send("Bad request: L'ID non deve essere fornito, poiché viene determinato automaticamente dal database.");
  }
  try {
    console.log("Dati che sto per salvare su Sequelize:", {
      name,
      surname,
      email,
      role,
    });

    // Creazione del user
    const newUser = await models.user.create({
      name,
      surname,
      email,
      role,
    });

    console.log("Utente creato:", newUser);

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Errore durante la creazione dell'utente:", error);
    res.status(500).json({
      error: "Errore nella creazione dell'utente",
      message: error.message,
      stack: error.stack,
    });
  }
}

module.exports = {
  getAll,
  create,
};
