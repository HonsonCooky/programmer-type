// Define a discriminated union
type Shape =
    | Circle of radius: float
    | Rectangle of width: float * height: float

// Define a function to calculate area
let area shape =
    match shape with
    | Circle radius -> Math.PI * radius * radius
    | Rectangle(width, height) -> width * height

// Create some shapes
let shapes = [ Circle 3.0; Rectangle(4.0, 5.0) ]

// Calculate and print the area of each shape
for shape in shapes do
    printfn "Area: %f" (area shape)

// List comprehension
let evens =
    [ for i in 1..10 do
          if i % 2 = 0 then
              yield i ]

printfn "Even numbers: %A" evens
