// Type
type Developer = {
	id: number;
	name: string;
	language: string;
};

// Constants
const developers: Developer[] = [
	{ id: 1, name: "Alice", language: "JavaScript" },
	{ id: 2, name: "Bob", language: "TypeScript" },
	{ id: 3, name: "Charlie", language: "Python" },
];

// Function to fetch a developer by ID
async function fetchDeveloper(id: number): Promise<Developer> {
	// Simulate API call
	return new Promise((resolve) => {
		setTimeout(() => {
			const developer = developers.find((dev) => dev.id === id);
			if (developer) {
				resolve(developer);
			} else {
				throw new Error("Developer not found");
			}
		}, 2000);
	});
}

// Usage
(async () => {
	try {
		const developer = await fetchDeveloper(2);
		console.log(developer.id, developer.name, developer.language);
	} catch (error) {
		console.error(error);
	}
})();
