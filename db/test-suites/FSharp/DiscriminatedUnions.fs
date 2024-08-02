namespace DiscriminatedUnions

module Example =
    type Animal =
        | Dog of string * int // Name and Age
        | Cat of string * int // Name and Age
        | Bird of string * bool // Name and CanFly

    let describe animal =
        match animal with
        | Dog(name, age) -> sprintf "Dog named %s, aged %d" name age
        | Cat(name, age) -> sprintf "Cat named %s, aged %d" name age
        | Bird(name, canFly) ->
            let flyStatus = if canFly then "can fly" else "cannot fly"
            sprintf "Bird named %s, which %s" name flyStatus

    let run () =
        let myDog = Dog("Buddy", 3)
        let myCat = Cat("Whiskers", 2)
        let myBird = Bird("Tweety", true)

        printfn "%s" (describe myDog)
        printfn "%s" (describe myCat)
        printfn "%s" (describe myBird)
