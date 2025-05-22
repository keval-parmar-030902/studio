"use client";

import { useState } from 'react';
import { suggestTasks, type SuggestTasksInput, type SuggestTasksOutput } from '@/ai/flows/suggest-tasks';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, PlusCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type TaskSuggestionsProps = {
  onAddTask: (text: string) => void;
  completedTasks: string[];
};

export default function TaskSuggestions({ onAddTask, completedTasks }: TaskSuggestionsProps) {
  const [schedule, setSchedule] = useState('');
  const [userGoals, setUserGoals] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    if (!schedule.trim() || !userGoals.trim()) {
      setError("Please provide your schedule and goals for today.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setSuggestions([]);
    try {
      const input: SuggestTasksInput = {
        schedule,
        completedTasks,
        userGoals,
      };
      const output: SuggestTasksOutput = await suggestTasks(input);
      setSuggestions(output.suggestedTasks);
      if (output.suggestedTasks.length === 0) {
        toast({
          title: "No new suggestions",
          description: "AI couldn't find new tasks based on your input. Try refining your goals or schedule.",
        });
      }
    } catch (e) {
      console.error("Error getting suggestions:", e);
      setError('Failed to get task suggestions. Please try again.');
      toast({
        variant: "destructive",
        title: "Suggestion Error",
        description: "Could not fetch task suggestions.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSuggestedTask = (taskText: string) => {
    onAddTask(taskText);
    setSuggestions(prev => prev.filter(s => s !== taskText));
    toast({
      title: "Task Added",
      description: `"${taskText}" added to your list.`,
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-accent" />
          <CardTitle>Intelligent Task Suggestions</CardTitle>
        </div>
        <CardDescription>Let AI help you plan your day. Enter your schedule and goals below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="schedule">Today's Schedule (e.g., 9am Meeting, 1pm Lunch)</Label>
          <Textarea
            id="schedule"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="Briefly outline your key appointments or time blocks..."
            rows={3}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="userGoals">Today's Goals (e.g., Finish project report, Exercise)</Label>
          <Textarea
            id="userGoals"
            value={userGoals}
            onChange={(e) => setUserGoals(e.target.value)}
            placeholder="What do you want to achieve today?"
            rows={3}
            disabled={isLoading}
          />
        </div>
        <Button onClick={handleGetSuggestions} disabled={isLoading || !schedule.trim() || !userGoals.trim()} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="mr-2 h-4 w-4" />
          )}
          Get Suggestions
        </Button>

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive p-3 bg-destructive/10 rounded-md">
            <AlertTriangle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-3 pt-4">
            <h4 className="font-semibold text-foreground">Suggested Tasks:</h4>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-center justify-between p-3 bg-background rounded-md border border-border transition-all hover:bg-muted/50">
                  <span className="text-muted-foreground">{suggestion}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddSuggestedTask(suggestion)}
                    aria-label={`Add task: ${suggestion}`}
                    className="text-primary hover:text-primary"
                  >
                    <PlusCircle className="mr-1 h-4 w-4" /> Add
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
