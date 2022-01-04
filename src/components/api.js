export default class Api {
  constructor(config) {
    this.url = config.url;
  }

  sendMessage(message) {
    return fetch(`${this.url}${message}`)
    .then(this._checkPromise);
  }

  _checkPromise(res) {
    if (!res.ok) Promise.reject(`Error ${res.status}`);
    return res.json();
  }
}
