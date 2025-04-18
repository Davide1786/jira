const express = require("express"); //  importo Express, il framework per creare server Node.js.
const cors = require("cors");

const bodyParser = require("body-parser");

const routes = {
  user: require("./routes/user"),
};

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
