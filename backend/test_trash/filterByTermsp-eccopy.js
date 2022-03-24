const filterByTerm = require("../src/filterByTerm");
// import filterByTerm from "../src/filterByTerm";

describe("Filter function", () => {
  const input = [
    { id: 1, url: "https://www.url1.dev" },
    { id: 2, url: "https://www.url2.dev" },
    { id: 3, url: "https://www.link3.dev" }
  ];
  test("it should filter by a search term (link)", () => {
    const output = [{ id: 3, url: "https://www.link3.dev" }];

    expect(filterByTerm(input, "link")).toEqual(output);
    expect(filterByTerm(input, "LINK")).toEqual(output);

  });
  test("it should filter by a search term (uRL)", () => {
    const output = [{ id: 1, url: "https://www.url1.dev" }, { id: 2, url: "https://www.url2.dev" }];
    expect(filterByTerm(input, "uRL")).toEqual(output);

  });
  test("it should throwErrors for empty strings", () => {
    const output = Error("searchTerm cannot be empty");

    expect(() => {
      filterByTerm(input, "");
    }).toThrow(output);
  });
});


// describe("Login", () => {

//   test("it should handle valid login info", () => { 

//   });

//   test("it should handle invalid login info", () => { 

//   });

// });


// const util = require('util');////////////////////

// const resToWrite={};
// console.log(res);
// console.log("\n\n\n");
// resToWrite["before"]=util.inspect(res).replace(/[\\n]/g," ").replace(/\s\s+/g," ");////////////////////////////////
// resToWrite["blank"]={"":""," ":" ", "  ":"  "};////////////////////
res.status(200).json({
  status: "success",
  data: {
    token: userToken[0],
    expiration: userToken[1]
  }
});
  // resToWrite["after"]=util.inspect(res).replace(/[\\n]/g," ").replace(/\s\s+/g," ");///////////////////////////
  // console.log(res);
  // console.log(resToWrite);
  // fs.writ