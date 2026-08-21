import { useState } from "react";
import Button from "./utils/Button";
import Input from "./utils/Input";
import axios from "axios";
import { API_URL } from "../api";
import Test from "../components/utils/Test";

const CategoryForm = () => {
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function createCategories() {
    if (!newCategory.trim()) {
      setError("Le nom de la catégorie est requis");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(
        `${API_URL}/categories/`,
        {
          name: newCategory,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      setNewCategory("");
      setError(null);
      // Recharger la page pour voir la nouvelle catégorie
      window.location.reload();
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        // Afficher les erreurs de validation du backend
        const errors = error.response.data;
        if (errors.name) {
          setError(Array.isArray(errors.name) ? errors.name[0] : errors.name);
        } else {
          setError("Erreur lors de la création de la catégorie");
        }
      } else {
        setError("Erreur de connexion au serveur");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <Test />
      <div className="flex justify-center gap-2 w-full">
        <Input
          className="flex-1"
          type="text"
          size="sm"
          placeholder="Nouvelle catégorie"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button
          size="sm"
          color="bg-green-600"
          onClick={createCategories}
          disabled={loading}
        >
          {loading ? "..." : "Ajouter Catégorie"}
        </Button>
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default CategoryForm;
