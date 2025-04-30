const { models } = require("../../sequelize");
const bcrypt = require("bcrypt");

async function login(req, res) {
  const { email, password } = req.body;

  try {
    // 1. Cerca l'utente tramite email
    const user = await models.user.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    // 2. Verifica la password (bcrypt)
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Password errata" });
    }

    // 3. Login riuscito → rimuove la password dall'oggetto utente
    const { password: _, ...userData } = user.toJSON();

    res.status(200).json({ message: "Login riuscito", user: userData });
  } catch (error) {
    console.error("Errore nel login:", error);
    res.status(500).json({ message: "Errore nel login", error: error.message });
  }
}

module.exports = {
  login,
};
