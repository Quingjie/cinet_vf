//repository/user.ts
export interface User {
  id: string;
  username: string;
  name: string;
  password: string;
  apiKey: string; // Ajout de apiKey
}

export const users : User[] = [
    {
      id: "1",
      username : 'katell.gouzerh@hotmail.com',
      password : '$2y$10$Gt.w6FPXKkSxCuIJzQYdh.hhBqgcnySIj/k8pVs5wwAfDKMvTHatq',
      name: "Katell Gouzerh",
      apiKey :"f2b3b1fefb7b5b9e61b92b5b8ed7785c",
    },
    {
      id: "2",
      username : 'adam.okba@hotmail.com',
      password : '$2y$10$Gt.w6FPXKkSxCuIJzQYdh.hhBqgcnySIj/k8pVs5wwAfDKMvTHatq',
      name: "Adam Okba",
      apiKey :"f2b3b1fefb7b5b9e61b92b5b8ed7785c",
    },
  ];
  