import "babel-polyfill";
import { sentiment } from "../src/client/js/formHandler";

describe("Testing sentiment function", () => {
    test("Testing sentiment function", () => {
        expect(sentiment("P+")).toEqual("strong positive");
    })
});