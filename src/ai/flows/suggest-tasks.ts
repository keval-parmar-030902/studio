// src/ai/flows/suggest-tasks.ts
'use server';

/**
 * @fileOverview AI-powered task suggestion flow.
 *
 * - suggestTasks - A function that suggests tasks based on user schedule and completed tasks.
 * - SuggestTasksInput - The input type for the suggestTasks function.
 * - SuggestTasksOutput - The return type for the suggestTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTasksInputSchema = z.object({
  schedule: z
    .string()
    .describe(
      'The user schedule for the day, including time slots and planned activities.'
    ),
  completedTasks: z
    .array(z.string())
    .describe('A list of tasks the user has already completed.'),
  userGoals: z.string().describe('The goals of the user for the current day.'),
});
export type SuggestTasksInput = z.infer<typeof SuggestTasksInputSchema>;

const SuggestTasksOutputSchema = z.object({
  suggestedTasks: z
    .array(z.string())
    .describe('A list of suggested tasks for the user to add to their to-do list.'),
});
export type SuggestTasksOutput = z.infer<typeof SuggestTasksOutputSchema>;

export async function suggestTasks(input: SuggestTasksInput): Promise<SuggestTasksOutput> {
  return suggestTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTasksPrompt',
  input: {schema: SuggestTasksInputSchema},
  output: {schema: SuggestTasksOutputSchema},
  prompt: `You are a personal assistant that suggests tasks for the user's to-do list.

  Consider the user's schedule, completed tasks, and goals for the day to suggest relevant and useful tasks.

  Schedule: {{{schedule}}}
  Completed Tasks: {{#if completedTasks}}{{#each completedTasks}}- {{{this}}}\n{{/each}}{{else}}None{{/if}}
  Goals: {{{userGoals}}}

  Suggest tasks that are most likely to help the user achieve their goals for the day, but avoid including tasks that are already completed or that don't fit the schedule.
  Do not suggest more than 5 tasks.
  Return the tasks as a JSON array of strings.
  `,
});

const suggestTasksFlow = ai.defineFlow(
  {
    name: 'suggestTasksFlow',
    inputSchema: SuggestTasksInputSchema,
    outputSchema: SuggestTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
