"use client";

import type { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type TaskItemProps = {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TaskItem({ task, onToggleComplete, onDelete }: TaskItemProps) {
  return (
    <div className={cn(
      "flex items-center p-4 bg-card rounded-lg shadow-md transition-all duration-300 hover:shadow-lg",
      task.completed ? "opacity-60" : "opacity-100"
    )}>
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggleComplete(task.id)}
        className="h-6 w-6 rounded-md border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        aria-label={task.completed ? "Mark task as incomplete" : "Mark task as complete"}
      />
      <label
        htmlFor={`task-${task.id}`}
        className={cn(
          "ml-4 flex-grow text-lg cursor-pointer",
          task.completed ? "line-through text-muted-foreground" : "text-foreground"
        )}
      >
        {task.text}
      </label>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(task.id)}
        className="text-destructive hover:bg-destructive/10"
        aria-label="Delete task"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
