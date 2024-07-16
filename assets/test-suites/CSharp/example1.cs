using System;

// Define an interface
public interface IAnimal
{
    void Speak();
}

// Base class
public class Animal
{
    public string Name { get; set; }

    public Animal(string name)
    {
        Name = name;
    }
}

// Derived class with interface
public class Dog : Animal, IAnimal
{
    public Dog(string name)
        : base(name) { }

    public void Speak()
    {
        Console.WriteLine($"{Name} says: Woof!");
    }
}

// Derived class with interface
public class Cat : Animal, IAnimal
{
    public Cat(string name)
        : base(name) { }

    public void Speak()
    {
        Console.WriteLine($"{Name} says: Meow!");
    }
}

class Program
{
    static void Main(string[] args)
    {
        try
        {
            IAnimal myDog = new Dog("Rover");
            IAnimal myCat = new Cat("Whiskers");

            myDog.Speak();
            myCat.Speak();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred: {ex.Message}");
        }
    }
}
