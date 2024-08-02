let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;

console.log(strLength);

let anotherValue: any = 123;
let numValue: number = <number>anotherValue;

console.log(numValue);

function getLength(value: any): number {
  if ((value as string).length !== undefined) {
    return (value as string).length;
  } else {
    return value.toString().length;
  }
}

console.log(getLength("hello"));
console.log(getLength(12345));
