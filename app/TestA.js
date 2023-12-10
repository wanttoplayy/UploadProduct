// Part 1

// A.

// Basic JS, CSS
// Create a function that converts the format of this variable
// Input: [
// { name: "Alex", tel: "0991112222", code: "xsf0001"},
// { name: "Jane", tel: "0812221234", code: "xsf0002"},
// { name: "Alex", tel: "0832214433", code: "xsf0001"},
// { name: "Alex", tel: "0991113122", code: "xsf0003"}
// ]
// Output: [
// { name: "Alex", tel: ["0991112222", "0832214433"], code: "xsf0001"},
// { name: "Jane", tel: "0812221234", code: "xsf0002"},
// { name: "Alex", tel: "0991113122", code: "xsf0003"}
// ]

const input = [
  { name: "Alex", tel: "0991112222", code: "xsf0001" },
  { name: "Jane", tel: "0812221234", code: "xsf0002" },
  { name: "Alex", tel: "0832214433", code: "xsf0001" },
  { name: "Alex", tel: "0991113122", code: "xsf0003" },
];

function convertData(data) {
  const result = [];

  for (let i = 0; i < data.length; i++) {
    let item = false;

    for (let j = 0; j < result.length; j++) {
      if (data[i].name === result[j].name && data[i].code === result[j].code) {
        if (typeof result[j].tel === "string") {
          result[j].tel = [result[j].tel];
        }
        result[j].tel.push(data[i].tel);
        item = true;
        break;
      }
    }

    if (!item) {
      let newItem = {
        name: data[i].name,
        tel: data[i].tel,
        code: data[i].code,
      };
      result.push(newItem);
    }
  }

  return result;
}

console.log(convertData(input));
