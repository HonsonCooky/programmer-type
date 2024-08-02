async function fetchData(url: string): Promise<any> {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

fetchData("https://api.example.com/data")
  .then((data) => console.log(data))
  .catch((error) => console.error(error));

async function getUser(id: number): Promise<any> {
  const response = await fetch(`https://api.example.com/users/${id}`);
  const user = await response.json();
  return user;
}

getUser(1)
  .then((user) => console.log(user))
  .catch((error) => console.error(error));
