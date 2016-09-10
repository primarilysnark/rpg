export function sendBadRequest(res, message) {
  return res.status(400).send(message);
}

export function sendNotFound(res) {
  return res.status(404).send();
}
