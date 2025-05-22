"use client";

import { useState, useEffect } from 'react';
import type { Task } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import AddTaskForm from '@/components/tasks/AddTaskForm';
import TaskList from '@/components/tasks/TaskList';
import TaskSuggestions from '@/components/tasks/TaskSuggestions';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load tasks from local storage on mount (simulation of persistence)
  useEffect(() => {
    if (user) {
      const storedTasks = localStorage.getItem(`dayscribe-tasks-${user.id}`);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    }
  }, [user]);

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`dayscribe-tasks-${user.id}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  const handleAddTask = (text: string) => {
    if (!user) return; // Should not happen due to layout protection
    const newTask: Task = {
      id: Date.now().toString(), // Simple ID generation
      text,
      completed: false,
      userId: user.id,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    toast({
      title: "Task Added!",
      description: `"${text}" has been added to your list.`,
    });
  };

  const handleToggleComplete = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    if (taskToDelete) {
      toast({
        variant: "destructive",
        title: "Task Deleted",
        description: `"${taskToDelete.text}" has been removed.`,
      });
    }
  };

  const completedTaskTexts = tasks.filter(task => task.completed).map(task => task.text);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
          My Day
        </h1>
        <p className="text-muted-foreground">
          What&apos;s on your agenda today, {user?.email}?
        </p>
      </div>

      <AddTaskForm onAddTask={handleAddTask} />

      <Separator className="my-8" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">To-Do List</h2>
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
          />
        </div>
        <div className="md:col-span-1 space-y-6">
           <TaskSuggestions onAddTask={handleAddTask} completedTasks={completedTaskTexts} />
        </div>
      </div>
    </div>
  );
}
