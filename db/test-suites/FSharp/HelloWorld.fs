namespace HelloWorld

module Example =
    open System

    let run () =
        printfn "Hello, World!"
        let age = 25
        let name = "Alice"
        let height = 5.7
        printfn "Name: %s, Age: %d, Height: %f" name age height
