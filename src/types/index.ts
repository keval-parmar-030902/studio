export interface Task {
  id: string;
  text: string;
  completed: boolean;
  userId: string; // To associate task with a user
  isRecurring?: boolean; // For daily recurring tasks
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  hasCompletedOnboarding?: boolean; // To track if user has set up initial daily tasks
}

