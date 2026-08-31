import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddTaskForm from "./AddTaskForm";

const categories = [
  { id: 1, name: "Courses" },
  { id: 2, name: "Travail" },
];

describe("AddTaskForm", () => {
  it("contient un champ texte pour le titre et un select pour la catégorie", () => {
    render(<AddTaskForm categories={categories} onSubmit={vi.fn()} />);

    expect(screen.getByPlaceholderText("Nouvelle tâche")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Courses" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Travail" })).toBeInTheDocument();
  });

  it("désactive le bouton tant que le titre ou la catégorie manque", async () => {
    const user = userEvent.setup();
    render(<AddTaskForm categories={categories} onSubmit={vi.fn()} />);

    const submit = screen.getByRole("button", { name: "Ajouter" });

    // Les deux champs sont vides
    expect(submit).toBeDisabled();

    // Titre rempli, mais toujours pas de catégorie
    await user.type(screen.getByPlaceholderText("Nouvelle tâche"), "Acheter du pain");
    expect(submit).toBeDisabled();

    // Les deux champs sont remplis -> le bouton s'active
    await user.selectOptions(screen.getByRole("combobox"), "1");
    expect(submit).toBeEnabled();
  });

  it("appelle onSubmit avec le titre saisi et la catégorie sélectionnée", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AddTaskForm categories={categories} onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("Nouvelle tâche"), "Acheter du pain");
    await user.selectOptions(screen.getByRole("combobox"), "2");
    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      title: "Acheter du pain",
      category: "2",
    });
  });
});
