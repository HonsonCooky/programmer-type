namespace Exceptions;

class Program
{
    static void Main()
    {
        try
        {
            int zero = 0;
            int result = 10 / zero;
        }
        catch (DivideByZeroException ex)
        {
            Console.WriteLine($"Cannot divide by zero! {ex}");
        }
    }
}
