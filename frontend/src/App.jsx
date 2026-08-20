import "./App.css";
import { useState, useEffect } from "react";
import CategoryForm from "./components/CatergoryForm";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import axios from "axios";

function App() {
  const [filterCategory, setFilterCategory] = useState("Toutes les Catégories");
  const [responseData, setResponseData] = useState("");

  async function getApiConnexion() {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/hello/");
      setResponseData(response.data);
      console.log(responseData);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getApiConnexion();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-3 w-full ">
      <h1 className="text-xl font-bold">Ma To-Do List par Catégories</h1>
      <h2>{responseData.message}</h2>
      <CategoryForm />
      <TaskForm onCategoryChange={setFilterCategory} />
      <TaskList filterCategory={filterCategory} />
    </div>
  );
}

export default App;
