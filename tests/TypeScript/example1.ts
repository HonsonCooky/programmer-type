// Type
type Employee = {
  id: number;
  name: string;
  department: string;
};

// Async/Await
async function fetchEmployee(id: number): Promise<Employee> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const employee: Employee = { id: id, name: "John Doe", department: "Engineering" };
      resolve(employee);
    }, 2000);
  });
}

// Usage
(async () => {
  const employee = await fetchEmployee(1);
  console.log(employee.name, employee.department);
})();
