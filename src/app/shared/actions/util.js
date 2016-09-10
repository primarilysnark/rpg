import fetch from 'node-fetch';
import 'whatwg-fetch';

function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res;
  }

  const error = new Error(res.statusText);
  error.response = res;

  throw error;
}

export function fetchJson(input, { credentials, method, headers, body } = {}) {
  if (typeof window !== 'undefined') {
    const request = new window.Request(`http://localhost:3000${input}`, {
      body,
      credentials: credentials || 'same-origin',
      headers,
      method: method || 'GET',
    });

    request.headers.append('Accept', 'application/json');

    return window.fetch(request)
      .then(checkStatus)
      .then(response => response.json());
  }

  const request = new fetch.Request(`http://localhost:3000${input}`, {
    body,
    credentials: credentials || 'same-origin',
    headers,
    method: method || 'GET',
  });

  request.headers.append('Accept', 'application/json');

  return fetch(request)
    .then(checkStatus)
    .then(response => response.json());
}
