import "babel-polyfill";

const request = require('supertest')
const app = require("../src/server/endpoints");



it('should route to index.html', async done => {
  const res = await request(app)
  .get('/')
  .send('../dist/index.html')
  expect(res.status).toBe(200)
  done()
})
