namespace CombinedExample

module Main =
    open HelloWorld
    open Conditionals
    open Arrays
    open Records
    open DiscriminatedUnions
    open Interfaces

    let run () =
        HelloWorld.Example.run ()
        Conditionals.Example.run ()
        Arrays.Example.run ()
        Records.Example.run ()
        DiscriminatedUnions.Example.run ()
        Interfaces.Example.run ()

    [<EntryPoint>]
    let main argv =
        run ()
        0
