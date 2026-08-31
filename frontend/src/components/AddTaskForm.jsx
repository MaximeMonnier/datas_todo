import { useState } from "react";
import Input from "./utils/Input";
import Select from "./utils/Select";
import Button from "./utils/Button";

const AddTaskForm = ({ categories = [], onSubmit, errors = {} }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const isValid = title.trim() !== "" && category !== "";

  const handleAdd = async () => {
    // onSubmit renvoie false si l'ajout a echoue : on garde alors la saisie.
    const ok = await onSubmit({ title, category });
    if (ok !== false) {
      setTitle("");
      setCategory("");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2 w-full">
        <Input
          className="flex-1"
          type="text"
          size="sm"
          placeholder="Nouvelle tâche"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Select
          className="w-1/3"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          size="sm"
          placeholder="Catégorie"
        />
        <Button
          size="sm"
          color="bg-green-600"
          onClick={handleAdd}
          disabled={!isValid}
        >
          Ajouter
        </Button>
      </div>
      {/* Affichage des erreurs de validation */}
      {(errors.description || errors.category) && (
        <div className="text-red-500 text-xs">
          {errors.description && <p>{errors.description}</p>}
          {errors.category && <p>{errors.category}</p>}
        </div>
      )}
    </div>
  );
};

export default AddTaskForm;
