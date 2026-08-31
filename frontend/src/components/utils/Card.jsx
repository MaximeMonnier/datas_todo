import React from "react";
import Button from "./Button";

const Card = ({ task, onDelete, onToggle }) => {
  return (
    <div
      className="flex justify-between items-center p-2 border border-slate-300 rounded-md hover:border-blue-500 transition cursor-pointer"
      data-cy="task-item"
    >
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        className="accent-blue-500 cursor-pointer"
        data-cy="task-checkbox"
      />
      <div className="flex items-center gap-2">
        <p
          className={`${
            task.done ? "line-through text-gray-400" : "text-gray-800"
          }`}
          data-cy="task-label"
        >
          {task.name}{" "}
          <span className="text-gray-500 text-sm italic">
            ({task.category})
          </span>
        </p>
      </div>
      <Button
        color="bg-red-500"
        size="sm"
        onClick={() => onDelete(task.id)}
        data-cy="task-delete"
      >
        Supprimer
      </Button>
    </div>
  );
};

export default Card;
