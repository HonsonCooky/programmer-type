// Define a value
let name = "Alice"

// Define a function
let greet person = printfn "Hello, %s!" person

// Call the function
greet name

// Define a list
let numbers = [ 1; 2; 3; 4; 5 ]

// Use a higher-order function and lambda expression
let squares = List.map (fun n -> n * n) numbers
printfn "Squares: %A" squares

// Use pattern matching
let rec factorial n =
    match n with
    | 0 -> 1
    | _ -> n * factorial (n - 1)

let result = factorial 5
printfn "Factorial of 5 is %d" result
