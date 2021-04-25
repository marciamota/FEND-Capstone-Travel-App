// import "babel-polyfill";
// import { sentiment } from "../src/client/js/formHandler";

// describe("Testing sentiment function", () => {
//     test("Testing sentiment function", () => {
//         expect(sentiment("P+")).toEqual("strong positive");
//     })
// });

import { app } from '../src/server/index' // link to server/index.js file
const req = require('supertest')

it('should route to index.html', async done => {
  const res = await req(app)
  .get('/')
  .send('../dist/index.html')
  expect(res.status).toBe(200)
  done()
})