import { titleCase } from "../src/client/js/app";

describe("Testing titleCase function", () => {
    test("Testing titleCase function", () => {
        expect(titleCase("HELLO UDACITY")).toEqual('Hello Udacity');
    })
});