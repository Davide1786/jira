const { models } = require("../../sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const SECRET_KEY = "mia-chiave-super-segreta"; // ⚠️ in produzione metti in .env
const SECRET_KEY = process.env.SECRET_KEY;

async function login(req, res) {
  // req contiene tutte le info sulla richiesta HTTP inviata dal client al server.
  /*
  req.body: è un oggetto che contiene i dati inviati dal client nel corpo della richiesta HTTP.
  Solitamente, questi dati vengono inviati tramite metodi come POST o PUT e possono essere in diversi
  formati (ad esempio, JSON, URL-encoded). In questo caso, si presume che il client stia inviando un
  oggetto JSON con i campi email e password nel corpo della richiesta di login.
  */
  const { email, password } = req.body;

  try {
    const user = await models.user.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Password errata" });
    }

    // refresh token come si fa?
    // 🔐 Genera il JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      SECRET_KEY,
      // { expiresIn: "1h" } // il token dura 1 ora
      { expiresIn: "600s" } // il token dura 1 minuto per fare test da postman
    );

    // Rimuove la password dalla risposta
    const { password: _, ...userData } = user.toJSON();

    // ✅ Risposta con token
    res.status(200).json({
      message: "Login riuscito",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Errore nel login:", error);
    res.status(500).json({ message: "Errore nel login", error: error.message });
  }
}

module.exports = { login };
