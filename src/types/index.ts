export interface Task {
  id: string;
  text: string;
  completed: boolean;
  userId: string; // To associate task with a user
}

export interface User {
  id: string;
  email: string;
  firstName?: string; // Optional: for users registered before this change or via simplified login
  lastName?: string;  // Optional: for users registered before this change or via simplified login
}
