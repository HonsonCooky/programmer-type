namespace Arrays

module Example =
    let run () =
        let numbers = [| 1; 2; 3; 4; 5 |]

        for number in numbers do
            printfn "%d" number

        let greet name = printfn "Hello, %s!" name

        greet "Alice"
