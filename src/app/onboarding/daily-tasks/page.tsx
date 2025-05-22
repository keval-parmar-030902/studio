"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Trash2, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function DailyTasksOnboardingPage() {
  const [dailyTasks, setDailyTasks] = useState<Omit<Task, 'id' | 'userId' | 'completed'>[]>([]);
  const [currentTaskText, setCurrentTaskText] = useState('');
  const { user, updateUserOnboardingStatus, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && (!user || user.hasCompletedOnboarding)) {
      // If user is somehow here but already onboarded or not logged in, redirect
      router.replace(user ? '/dashboard' : '/login');
    }
  }, [user, authLoading, router]);

  const handleAddDailyTask = () => {
    if (currentTaskText.trim() === '') {
      toast({
        variant: "destructive",
        title: "Empty Task",
        description: "Please enter text for your daily task.",
      });
      return;
    }
    setDailyTasks(prev => [...prev, { text: currentTaskText.trim(), isRecurring: true }]);
    setCurrentTaskText('');
  };

  const handleDeleteDailyTask = (index: number) => {
    setDailyTasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleFinishOnboarding = () => {
    if (!user) return;

    const existingTasksString = localStorage.getItem(`dayscribe-tasks-${user.id}`);
    const existingTasks: Task[] = existingTasksString ? JSON.parse(existingTasksString) : [];

    const newTasksToAdd: Task[] = dailyTasks.map(task => ({
      ...task,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 15), // More unique ID
      userId: user.id,
      completed: false, // Daily tasks start uncompleted each day (logic for this reset is not part of this setup)
    }));

    const allTasks = [...newTasksToAdd, ...existingTasks]; // Add new daily tasks to existing ones
    localStorage.setItem(`dayscribe-tasks-${user.id}`, JSON.stringify(allTasks));
    
    updateUserOnboardingStatus(true);
    toast({
      title: "Daily Tasks Saved!",
      description: "You're all set up. Welcome to your dashboard!",
      className: "bg-primary text-primary-foreground",
    });
    router.push('/dashboard');
  };
  
  if (authLoading || !user || user.hasCompletedOnboarding) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading or redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Set Up Your Daily Tasks</CardTitle>
          <CardDescription>
            Add tasks you do every day. You can manage these and add more later from your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-2">
            <Input
              type="text"
              placeholder="E.g., Morning meditation, Check emails"
              value={currentTaskText}
              onChange={(e) => setCurrentTaskText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddDailyTask()}
              className="h-12 text-base"
            />
            <Button onClick={handleAddDailyTask} size="lg" className="h-12" aria-label="Add daily task">
              <PlusCircle className="mr-2 h-5 w-5" /> Add
            </Button>
          </div>

          {dailyTasks.length > 0 && (
            <div className="space-y-3 pt-4">
              <h4 className="font-semibold text-foreground">Your Daily Tasks:</h4>
              <ul className="space-y-2 max-h-60 overflow-y-auto rounded-md border p-3">
                {dailyTasks.map((task, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-card rounded-md">
                    <span className="text-card-foreground">{task.text}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteDailyTask(index)}
                      className="text-destructive hover:bg-destructive/10"
                      aria-label={`Delete task: ${task.text}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button onClick={handleFinishOnboarding} className="w-full" size="lg" disabled={dailyTasks.length === 0}>
            <CheckCircle className="mr-2 h-5 w-5" /> Finish Setup & Go to Dashboard
          </Button>
          <Button variant="link" onClick={() => { updateUserOnboardingStatus(true); router.push('/dashboard');}} className="w-full text-sm">
            Skip for now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
