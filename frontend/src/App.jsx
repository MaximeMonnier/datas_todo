import "./App.css";
import { useState, useEffect } from "react";
import CategoryForm from "./components/CatergoryForm";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Login from "./components/Login";
import axios from "axios";
import { API_URL } from "./api";
import { getToken } from "./auth";

function App() {
  const [filterCategory, setFilterCategory] = useState("Toutes les Catégories");
  const [responseData, setResponseData] = useState("");
  // Le token survit au rechargement de page : on repart de ce qui est stocke.
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getToken()));

  async function getApiConnexion() {
    try {
      const response = await axios.get(`${API_URL}/hello/`);
      setResponseData(response.data);
      console.log(responseData);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getApiConnexion();
  }, []);

  // L'API est protegee (IsAuthenticated) : tant qu'on n'est pas connecte,
  // on n'affiche que le formulaire de connexion.
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col justify-center items-center gap-3 w-full">
        <Login onLogin={() => setIsAuthenticated(true)} />
      </div>
    );
  }

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
