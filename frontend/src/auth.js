// Authentification HTTP Basic.
// Le backend DRF accepte deja BasicAuthentication (voir settings/base.py),
// il n'y a donc rien a ajouter cote serveur : le navigateur envoie
// simplement un en-tete "Authorization: Basic <base64(user:password)>".
//
// Le token est garde dans le localStorage pour survivre aux rechargements
// de page (CategoryForm fait un window.location.reload()).
const STORAGE_KEY = "auth_token";

export function saveToken(username, password) {
  localStorage.setItem(STORAGE_KEY, btoa(`${username}:${password}`));
}

export function getToken() {
  return localStorage.getItem(STORAGE_KEY);
}

export function clearToken() {
  localStorage.removeItem(STORAGE_KEY);
}

// A etaler dans les headers des appels API : { ...authHeaders() }
export function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Basic ${token}` } : {};
}
