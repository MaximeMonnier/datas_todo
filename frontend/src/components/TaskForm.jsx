import { useState, useEffect } from "react";
import Select from "./utils/Select";
import axios from "axios";
import { API_URL } from "../api";
import { authHeaders } from "../auth";

const TaskForm = ({ onCategoryChange }) => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  async function getCategories() {
    try {
      const response = await axios.get(`${API_URL}/categories/`, {
        headers: authHeaders(),
      });
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getCategories();
  }, []);

  const handleChange = (e) => {
    const selected = e.target.value;
    setCategory(selected);
    onCategoryChange(selected);
  };

  return (
    <div className="w-full">
      <Select
        className="w-full"
        options={[
          "Toutes les Catégories",
          ...categories.map((cat) => cat.name),
        ]}
        value={category}
        onChange={handleChange}
        size="md"
        placeholder="Toutes les catégories"
        data-cy="category-filter"
      />
    </div>
  );
};

export default TaskForm;
