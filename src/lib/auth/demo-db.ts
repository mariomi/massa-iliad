export interface DemoUser {
  email: string;
  password: string;
  role: 'admin' | 'user' | 'workforce';
  name: string;
}

const demoUsers = {
  users: [
    {
      email: "admin@demo.com",
      password: "test",
      role: "admin",
      name: "Admin Demo"
    },
    {
      email: "workforce@demo.com",
      password: "workforce123",
      role: "workforce",
      name: "Forza Lavoro Demo"
    }
  ]
};

export function findUserByEmail(email: string): DemoUser | null {
  return demoUsers.users.find(user => user.email === email) || null;
}

export function verifyCredentials(email: string, password: string): DemoUser | null {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
}
