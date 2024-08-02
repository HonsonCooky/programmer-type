namespace Classes;

class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}

class Program
{
    static void Main()
    {
        Person person = new Person { Name = "Alice", Age = 25 };
        Console.WriteLine($"Name: {person.Name}, Age: {person.Age}");
    }
}
