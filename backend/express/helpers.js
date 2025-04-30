// Una funzione di supporto per verificare che il parametro
//  ID richiesta sia valido
// e convertirlo in un numero (poiché è una stringa di default)

function getIdParam(req) {
  const id = req.params.id;
  if (/^\d+$/.test(id)) {
    return Number.parseInt(id, 10);
  }
  throw new TypeError(`Invalid ':id' param: "${id}"`);
}

module.exports = { getIdParam };
