// URL de base de l'API.
// Vite injecte VITE_API_URL au moment du build :
//   - en local          -> .env
//   - sur Vercel        -> .env.production (ou les variables du dashboard)
// Le repli permet de lancer `npm run dev` meme sans fichier .env.
export const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
