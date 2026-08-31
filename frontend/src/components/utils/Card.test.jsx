import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Card from "./Card";

// Composant de presentation d'une tache (equivalent "TaskItem") :
// on valide uniquement l'affichage en fonction des props recues.

const baseTask = {
  id: 1,
  name: "Acheter du pain",
  category: "Courses",
  done: false,
};

const renderCard = (overrides = {}) =>
  render(
    <Card
      task={{ ...baseTask, ...overrides }}
      onDelete={vi.fn()}
      onToggle={vi.fn()}
    />,
  );

describe("Card (TaskItem)", () => {
  it("affiche le titre de la tâche et le nom de sa catégorie", () => {
    renderCard();

    expect(screen.getByText("Acheter du pain")).toBeInTheDocument();
    expect(screen.getByText("(Courses)")).toBeInTheDocument();
  });

  it("barre le texte et coche la case quand la tâche est terminée", () => {
    renderCard({ done: true });

    const title = screen.getByText("Acheter du pain");
    expect(title).toHaveClass("line-through");
    expect(title).toHaveClass("text-gray-400");
    expect(screen.getByRole("checkbox")).toBeChecked();
  });
});
