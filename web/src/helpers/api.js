const API_HOST = process.env.REACT_APP_API_HOST;

export default function(path, options = {}) {
  return fetch(`${API_HOST}/${path}`, options)
    .then(response => response.json());
}
