"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";

const formSchema = z.object({
  text: z.string().min(1, { message: "Task cannot be empty." }).max(200, {message: "Task too long."}),
});

type AddTaskFormProps = {
  onAddTask: (text: string) => void;
};

export default function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddTask(values.text);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Input placeholder="Add a new task..." {...field} className="h-12 text-base"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="h-12" aria-label="Add Task">
          <PlusCircle className="mr-2 h-5 w-5" /> Add
        </Button>
      </form>
    </Form>
  );
}
