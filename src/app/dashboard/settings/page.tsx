"use client";

import { useState, useEffect, type FormEvent } from 'react';
import type { Task } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Trash2, ListChecks } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

export default function DailyTasksSettingsPage() {
  const [recurringTasks, setRecurringTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]); // To store all tasks for saving
  const [newTaskText, setNewTaskText] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const storedTasksString = localStorage.getItem(`dayscribe-tasks-${user.id}`);
      if (storedTasksString) {
        const loadedTasks: Task[] = JSON.parse(storedTasksString);
        setAllTasks(loadedTasks);
        setRecurringTasks(loadedTasks.filter(task => task.isRecurring));
      }
    }
  }, [user]);

  const saveTasksToLocalStorage = (tasksToSave: Task[]) => {
    if (user) {
      localStorage.setItem(`dayscribe-tasks-${user.id}`, JSON.stringify(tasksToSave));
      setAllTasks(tasksToSave); // Update the allTasks state
      setRecurringTasks(tasksToSave.filter(task => task.isRecurring)); // Update recurring tasks view
    }
  };

  const handleAddRecurringTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTaskText.trim() === '') {
      toast({
        variant: "destructive",
        title: "Empty Task",
        description: "Please enter text for your daily task.",
      });
      return;
    }
    if (!user) return;

    const newRecurringTask: Task = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      text: newTaskText.trim(),
      completed: false,
      userId: user.id,
      isRecurring: true,
    };

    const updatedAllTasks = [...allTasks, newRecurringTask];
    saveTasksToLocalStorage(updatedAllTasks);
    
    toast({
      title: "Daily Task Added!",
      description: `"${newRecurringTask.text}" has been added.`,
    });
    setNewTaskText('');
  };

  const handleDeleteRecurringTask = (id: string) => {
    const taskToDelete = recurringTasks.find(task => task.id === id);
    const updatedAllTasks = allTasks.filter(task => task.id !== id);
    saveTasksToLocalStorage(updatedAllTasks);

    if (taskToDelete) {
      toast({
        variant: "destructive",
        title: "Daily Task Deleted",
        description: `"${taskToDelete.text}" has been removed.`,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Manage Daily Tasks
          </h1>
          <p className="text-muted-foreground">
            Add or remove tasks that you perform regularly.
          </p>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-primary" />
            Your Recurring Daily Tasks
          </CardTitle>
          <CardDescription>
            These tasks will appear on your dashboard. You can manage them here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleAddRecurringTask} className="flex items-start gap-2">
            <Input
              type="text"
              placeholder="Add a new daily task..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              className="h-12 text-base"
            />
            <Button type="submit" size="lg" className="h-12 shrink-0">
              <PlusCircle className="mr-2 h-5 w-5" /> Add Daily Task
            </Button>
          </form>

          <Separator />

          {recurringTasks.length > 0 ? (
            <ul className="space-y-3 max-h-96 overflow-y-auto rounded-md border p-3">
              {recurringTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-card rounded-md shadow-sm hover:bg-muted/30 transition-colors"
                >
                  <span className="text-card-foreground">{task.text}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRecurringTask(task.id)}
                    className="text-destructive hover:bg-destructive/10"
                    aria-label={`Delete task: ${task.text}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No daily recurring tasks defined yet. Add some above!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
