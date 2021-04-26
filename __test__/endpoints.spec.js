import "babel-polyfill";
// import { app } from '../src/server/endpoints'
const request = require('supertest')
const app = require("../src/server/endpoints");



it('should route to index.html', async done => {
  const res = await request(app)
  .get('/')
  .send('../dist/index.html')
  expect(res.status).toBe(200)
  done()
})

// describe("GET / ", () => {
//   test("Server should respond", async () => {
//       const response = await request(app).get("/")
//       expect(response.statusCode).toBe(200);
//   });
// });