interface Person {
  name: string;
  age: number;
}

class Student implements Person {
  constructor(
    public name: string,
    public age: number,
    public grade: string,
  ) {}

  getDetails(): string {
    return `${this.name}, Age: ${this.age}, Grade: ${this.grade}`;
  }
}

const student: Student = new Student("Bob", 20, "A");
console.log(student.getDetails());
