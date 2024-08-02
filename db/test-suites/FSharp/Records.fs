namespace Records

module Example =
    type Person = { Name: string; Age: int }

    let run () =
        let person = { Name = "Alice"; Age = 25 }
        printfn "Name: %s, Age: %d" person.Name person.Age
