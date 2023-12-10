//C

// Create a function that converts the format of this variable
// Input: [
// 	{ name: “A”, age: “30”},
// 	{ name: “B”, age: “9”},
// 	{ name: “C”, age: “20”},
// 	{ name: “D”, age: “18”},
// 	{ name: “E”, age: “11”},
// 	{ name: “F”, age: “60”},
// 	{ name: “G”, age: “27”},
// 	{ name: “H”, age: “90”},
// 	{ name: “I”, age: “21”},
// 	{ name: “J”, age: “12”}
// 	]
// Output: [“B”, “J”, “D”, “I”, “G”, “A”]
const input = [
  { name: "A", age: "30" },
  { name: "B", age: "9" },
  { name: "C", age: "20" },
  { name: "D", age: "18" },
  { name: "E", age: "11" },
  { name: "F", age: "60" },
  { name: "G", age: "27" },
  { name: "H", age: "90" },
  { name: "I", age: "21" },
  { name: "J", age: "12" },
];

function filterAndExtractNames(data) {
  return data
    .filter((person) => person.age <= 30)
    .sort((a, b) => a.age - b.age)
    .map((person) => person.name);
}

// Example usage

const outputData = filterAndExtractNames(input);
console.log(outputData);
