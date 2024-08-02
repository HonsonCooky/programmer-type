namespace Interfaces

module Example =
    type IAnimal =
        abstract member MakeSound: unit -> unit

    type Dog() =
        interface IAnimal with
            member _.MakeSound() = printfn "Bark"

    let run () =
        let animal: IAnimal = Dog()
        animal.MakeSound()

        try
            let result = 10 / 0
            printfn "%d" result
        with :? System.DivideByZeroException ->
            printfn "Cannot divide by zero!"
