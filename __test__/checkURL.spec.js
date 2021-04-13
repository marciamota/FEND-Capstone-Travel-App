import { checkURL } from "../src/client/js/urlChecker";

describe("Testing checkURL function", () => {
    test("Testing checkURL function", () => {
        expect(checkURL("www.yahoo.com")).toEqual(true);
    })
});