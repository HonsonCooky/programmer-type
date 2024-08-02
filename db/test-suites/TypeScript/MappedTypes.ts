type ReadOnly<T> = {
  readonly [P in keyof T]: T[P];
};

interface User {
  name: string;
  age: number;
}

const user: ReadOnly<User> = {
  name: "Charlie",
  age: 30,
};

console.log(user);

type Part<T> = {
  [P in keyof T]?: T[P];
};

const partialUser: Part<User> = {
  name: "Eve",
};

console.log(partialUser);
