import React, { useState, useEffect } from "react";
import Input from "./utils/Input";
import Select from "./utils/Select";
import Button from "./utils/Button";
import Card from "./utils/Card";
import { API_URL } from "../api";

const TaskList = ({ filterCategory }) => {
  const [taskName, setTaskName] = useState("");
  const [category, setCategory] = useState("");
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [categoriesRes, tasksRes] = await Promise.all([
          fetch(`${API_URL}/categories/`),
          fetch(`${API_URL}/tasks/`),
        ]);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        } else {
          setError("Erreur lors du chargement des catégories");
        }

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData);
        } else {
          setError("Erreur lors du chargement des tâches");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setError("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddTask = async () => {
    if (!taskName.trim() || !category) {
      setFormErrors({
        description: !taskName.trim() ? "La description est requise" : null,
        category: !category ? "La catégorie est requise" : null,
      });
      return;
    }

    setFormErrors({});
    setError(null);

    try {
      const response = await fetch(`${API_URL}/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: taskName,
          is_completed: false,
          category: parseInt(category),
        }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setTaskName("");
        setCategory("");
        setFormErrors({});
      } else {
        const errorData = await response.json();
        setFormErrors(errorData);
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError("Erreur de connexion au serveur");
    }
  };

  const handleDeleteTask = async (id) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/tasks/${id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks(tasks.filter((t) => t.id !== id));
      } else {
        setError("Erreur lors de la suppression de la tâche");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setError("Erreur de connexion au serveur");
    }
  };

  const handleToggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    setError(null);
    try {
      const response = await fetch(`${API_URL}/tasks/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_completed: !task.is_completed,
        }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
      } else {
        setError("Erreur lors de la mise à jour de la tâche");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      setError("Erreur de connexion au serveur");
    }
  };

  const filteredTasks =
    filterCategory && filterCategory !== "Toutes les Catégories"
      ? tasks.filter((t) => {
          const cat = categories.find((c) => c.id === t.category);
          return cat && cat.name === filterCategory;
        })
      : tasks;

  if (loading) {
    return (
      <p className="text-gray-500 text-sm italic text-center">Chargement...</p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full mt-4">
      {/* Affichage des erreurs générales */}
      {error && (
        <div className="w-full p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-2 w-full">
          <Input
            className="flex-1"
            type="text"
            size="sm"
            placeholder="Nouvelle tâche"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <Select
            className="w-1/3"
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            size="sm"
            placeholder="Catégorie"
          />
          <Button size="sm" color="bg-green-600" onClick={handleAddTask}>
            Ajouter
          </Button>
        </div>
        {/* Affichage des erreurs de validation */}
        {(formErrors.description || formErrors.category) && (
          <div className="text-red-500 text-xs">
            {formErrors.description && <p>{formErrors.description}</p>}
            {formErrors.category && <p>{formErrors.category}</p>}
          </div>
        )}
      </div>

      <div className="w-full mt-3 space-y-2">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500 text-sm italic text-center">
            Aucune tâche enregistrée.
          </p>
        ) : (
          filteredTasks.map((task) => (
            <Card
              key={task.id}
              task={{
                ...task,
                name: task.description,
                done: task.is_completed,
                category:
                  categories.find((c) => c.id === task.category)?.name || "",
              }}
              onDelete={handleDeleteTask}
              onToggle={handleToggleTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
