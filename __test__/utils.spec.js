import { titleCase } from "../src/client/js/utils";

describe("Testing titleCase function", () => {
    test("Testing titleCase function", () => {
        expect(titleCase("HELLO UDACITY")).toEqual('Hello Udacity');
    })
});