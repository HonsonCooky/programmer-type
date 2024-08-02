function greet(name: string): string {
  return `Hello, ${name}!`;
}

const userName: string = "Alice";
console.log(greet(userName));

function add(a: number, b: number): number {
  return a + b;
}

const sum: number = add(5, 3);
console.log(`Sum: ${sum}`);
