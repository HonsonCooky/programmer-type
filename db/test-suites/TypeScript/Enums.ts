enum Direction {
  Up,
  Down,
  Left,
  Right,
}

function move(direction: Direction): void {
  console.log(`Moving ${Direction[direction]}`);
}

move(Direction.Up);
move(Direction.Left);

enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Pending = "PENDING",
}

function getStatus(status: Status): string {
  return `Status is ${status}`;
}

console.log(getStatus(Status.Active));
