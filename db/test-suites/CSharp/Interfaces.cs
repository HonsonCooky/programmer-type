namespace Interface;

interface IAnimal
{
    void MakeSound();
}

class Dog : IAnimal
{
    public void MakeSound()
    {
        Console.WriteLine("Bark");
    }
}

class Program
{
    static void Main()
    {
        IAnimal animal = new Dog();
        animal.MakeSound();
    }
}
