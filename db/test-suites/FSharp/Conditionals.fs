namespace Conditionals

module Example =
    let run () =
        let number = 10

        if number > 0 then
            printfn "Positive number"
        else
            printfn "Non-positive number"

        for i in 1..5 do
            printfn "Iteration %d" i
