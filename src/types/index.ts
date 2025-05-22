export interface Task {
  id: string;
  text: string;
  completed: boolean;
  userId: string; // To associate task with a user
}

export interface User {
  id: string;
  email: string;
  // Add other user-specific fields if needed
}
