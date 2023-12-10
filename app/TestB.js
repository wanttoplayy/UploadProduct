// B.

// Create a function that converts the format of this variable
// Input: {
// customer: "Xsurface",
// contact: [
// {name: “Max”},
// {name: “Mike”},
// {name: “Adam”}],
// address: “Sukhumvit 62”,
//   }
// Output: [ {
// name: “Max”,
// customer: "Xsurface",
// address: “Sukhumvit 62”,
//  	},{
// name: “Mike”,
// customer: "Xsurface",
// address: “Sukhumvit 62”,
//  	 },{
// name: “Adam”,
// customer: "Xsurface",
// address: “Sukhumvit 62”,
//   }]

const input = {
  customer: "Xsurface",
  contact: [{ name: "Max" }, { name: "Mike" }, { name: "Adam" }],
  address: "Sukhumvit 62",
};

function convertData(data) {
  const output = [];

  const customer = data.customer;
  const address = data.address;

  for (let i = 0; i < data.contact.length; i++) {
    let contact = data.contact[i];

    let newEntry = {
      name: contact.name,
      customer: customer,
      address: address,
    };

    output.push(newEntry);
  }

  return output;
}

// Example usage

console.log(convertData(input));
