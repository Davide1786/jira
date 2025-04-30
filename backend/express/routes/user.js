const { models } = require("../../sequelize");
const bcrypt = require("bcrypt");

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
  const { name, surname, email, role, password } = req.body;

  if (!name || !surname || !email || !role || !password) {
    return res.status(400).json({ error: "Campi obbligatori mancanti." });
  }

  if (req.body.id) {
    return res.status(400).send("L'ID non deve essere fornito, è generato automaticamente.");
  }

  try {
    // Verifica se l'email esiste già
    const existingUser = await models.user.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email già registrata." });
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creazione utente
    const newUser = await models.user.create({
      name,
      surname,
      email,
      role,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Errore nella creazione dell'utente:", error);
    res.status(500).json({ error: "Errore interno", message: error.message });
  }
}

module.exports = {
  getAll,
  create,
};
