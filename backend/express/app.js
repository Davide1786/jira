const express = require("express"); //  importo Express, il framework per creare server Node.js.
const cors = require("cors");
const bodyParser = require("body-parser");
const loginRoute = require("./routes/login");

const routes = {
  user: require("./routes/user"),
};

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
Questa è una funzione che: Accetta un'altra funzione come argomento.
(handler) che restituisce una nuova funzione.

Il parametro handler è la funzione di gestione della route che ho passato come argomento e
ritorna async function (req, res, next) che è una funzione middleware di Express.

questa fn riceve tre parametri:
req: L'oggetto request di Express. Contiene tutte le informazioni sulla richiesta HTTP in arrivo (header, parametri della query, corpo della richiesta, ecc.).
res: L'oggetto response di Express. Viene utilizzato per inviare una risposta HTTP al client (status code, header, corpo della risposta, ecc.).
next: Una funzione fornita da Express. Se la middleware corrente non termina il ciclo request-response (ad esempio, inviando una risposta), deve chiamare next() per passare il controllo al prossimo middleware nella catena.

Gestisce gli errori: Il blocco try...catch avvolge la chiamata a handler.
Se la funzione handler genera un errore (e non lo gestisce internamente),
l'esecuzione salta al blocco catch. Qui, next(error) viene chiamato.
Questo è un meccanismo standard in Express per passare l'errore al middleware di gestione
degli errori successivo nella catena.

*/
function makeHandlerAwareOfAsyncErrors(handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res); // Chiama la funzione effettiva
    } catch (error) {
      next(error); // Passa l'errore al middleware di gestione degli errori di Express
    }
  };
}

app.get("/", (req, res) => {
  res.send(`
    <h2>Hello, Sequelize + Express!</h2>
    <p>Make sure you have executed <b>npm run setup-example-db</b> once to have a populated example database. Otherwise, you will get <i>'no such table'</i> errors.</p>
    <p>Try some routes, such as <a href='/api/users'>/api/users</a> or <a href='/api/orchestras?includeInstruments'>/api/orchestras?includeInstruments</a>!</p>
    <p>To experiment with POST/PUT/DELETE requests, use a tool for creating HTTP requests such as <a href='https://github.com/jakubroztocil/httpie#readme'>HTTPie</a>, <a href='https://www.postman.com/downloads/'>Postman</a>, or even <a href='https://en.wikipedia.org/wiki/CURL'>the curl command</a>, or write some JS code for it with <a href='https://github.com/sindresorhus/got#readme'>got</a>, <a href='https://github.com/sindresorhus/ky#readme'>ky</a> or <a href='https://github.com/axios/axios#readme'>axios</a>.</p>
  `);
});

// ‼️ Non serve mettere login dentro routes come oggetto, perché ha solo una route
// e non segue la struttura REST standard.
app.post("/api/login", makeHandlerAwareOfAsyncErrors(loginRoute.login));

// =============== qui sto solo testando se funziona
const authenticateToken = require("../middleware/auth");
// Esempio: proteggi la route che restituisce tutti gli utenti
app.get("/api/user", authenticateToken, makeHandlerAwareOfAsyncErrors(routes.user.getAll));

for (const [routeName, routeController] of Object.entries(routes)) {
  if (routeController.getAll) {
    app.get(`/api/${routeName}`, makeHandlerAwareOfAsyncErrors(routeController.getAll));
  }
  if (routeController.getById) {
    app.get(`/api/${routeName}/:id`, makeHandlerAwareOfAsyncErrors(routeController.getById));
  }
  if (routeController.create) {
    app.post(`/api/${routeName}`, makeHandlerAwareOfAsyncErrors(routeController.create));
  }
  if (routeController.update) {
    app.put(`/api/${routeName}/:id`, makeHandlerAwareOfAsyncErrors(routeController.update));
  }
  if (routeController.remove) {
    app.delete(`/api/${routeName}/:id`, makeHandlerAwareOfAsyncErrors(routeController.remove));
  }
}

module.exports = app;
/*
Questo file configura un server web Express.js che gestisce le richieste API.
Utilizza middleware per CORS e per l'analisi del corpo delle richieste,
definisce rotte per gestire le richieste relative agli utenti e utilizza
un wrapper per gestire gli errori asincroni.
*/
