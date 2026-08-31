import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import TaskList from "./TaskList";

// TaskList charge ses donnees au montage via fetch (/categories/ et /tasks/ en parallele).
// On mocke fetch pour garder les tests rapides, deterministes et hors reseau.

const categories = [
  { id: 1, name: "Courses" },
  { id: 2, name: "Travail" },
];

const tasks = [
  { id: 10, description: "Acheter du pain", is_completed: false, category: 1 },
  { id: 11, description: "Envoyer le rapport", is_completed: true, category: 2 },
];

const jsonOk = (data) => ({ ok: true, status: 200, json: async () => data });

let fetchSpy;

beforeEach(() => {
  fetchSpy = vi.spyOn(globalThis, "fetch");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("TaskList", () => {
  it("affiche 'Chargement...' pendant que la promesse API est en attente", () => {
    // Promesse volontairement jamais resolue -> on reste sur l'etat de chargement
    fetchSpy.mockImplementation(() => new Promise(() => {}));

    render(<TaskList filterCategory="Toutes les Catégories" />);

    expect(screen.getByText("Chargement...")).toBeInTheDocument();
  });

  it("affiche les 2 tâches renvoyées par l'API une fois la promesse résolue", async () => {
    fetchSpy.mockImplementation((url) =>
      Promise.resolve(
        String(url).includes("/categories/") ? jsonOk(categories) : jsonOk(tasks),
      ),
    );

    render(<TaskList filterCategory="Toutes les Catégories" />);

    expect(await screen.findByText("Acheter du pain")).toBeInTheDocument();
    expect(screen.getByText("Envoyer le rapport")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });

  it("affiche un message d'alerte rouge si l'API répond une erreur 500", async () => {
    fetchSpy.mockImplementation((url) =>
      Promise.resolve(
        String(url).includes("/categories/")
          ? jsonOk(categories)
          : { ok: false, status: 500, json: async () => ({}) },
      ),
    );

    render(<TaskList filterCategory="Toutes les Catégories" />);

    const alert = await screen.findByText("Erreur lors du chargement des tâches");
    expect(alert).toHaveClass("bg-red-100");
    expect(alert).toHaveClass("text-red-700");
  });
});
