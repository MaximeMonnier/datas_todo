import { useState } from "react";
import axios from "axios";
import { API_URL } from "../api";
import { saveToken, clearToken } from "../auth";
import Input from "./utils/Input";
import Button from "./utils/Button";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // On valide les identifiants en appelant une route protegee :
      // 200 => le couple user/password est bon, 401 => il est mauvais.
      await axios.get(`${API_URL}/categories/`, {
        headers: { Authorization: `Basic ${btoa(`${username}:${password}`)}` },
      });
      saveToken(username, password);
      onLogin();
    } catch (err) {
      console.error(err);
      clearToken();
      setError("Identifiants invalides");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 w-full max-w-sm"
      data-cy="login-form"
    >
      <h1 className="text-xl font-bold text-center">Connexion</h1>
      <Input
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        data-cy="login-username"
      />
      <Input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        data-cy="login-password"
      />
      <Button type="submit" disabled={loading} data-cy="login-submit">
        {loading ? "..." : "Se connecter"}
      </Button>
      {error && (
        <p className="text-red-500 text-xs" data-cy="login-error">
          {error}
        </p>
      )}
    </form>
  );
};

export default Login;
