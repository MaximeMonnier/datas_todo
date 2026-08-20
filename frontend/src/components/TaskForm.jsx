import { useState, useEffect } from "react";
import Select from "./utils/Select";
import axios from "axios";

const TaskForm = ({ onCategoryChange }) => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  async function getCategories() {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/categories/");
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
      />
    </div>
  );
};

export default TaskForm;
