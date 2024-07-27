using System;

public class GenericList<T>
{
    private T item;

    public void Add(T item)
    {
        this.item = item;
    }

    public T GetItem()
    {
        return item;
    }
}

class Program
{
    static void Main(string[] args)
    {
        GenericList<int> intList = new GenericList<int>();
        intList.Add(1);
        Console.WriteLine(intList.GetItem());

        GenericList<string> strList = new GenericList<string>();
        strList.Add("Hello, World!");
        Console.WriteLine(strList.GetItem());
    }
}
