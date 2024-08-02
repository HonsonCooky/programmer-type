function identity<T>(arg: T): T {
  return arg;
}

const num: number = identity<number>(42);
const str: string = identity<string>("Hello");

function getArray<T>(items: T[]): T[] {
  return new Array<T>().concat(items);
}

const numArray = getArray<number>([1, 2, 3, 4]);
const strArray = getArray<string>(["a", "b", "c", "d"]);

console.log(num, str);
console.log(numArray, strArray);
