var supertest = require("supertest"),
    api = supertest(process.env.URL + process.env.PORT),
    app = require("../../api").app;

describe("loading server", () => {
    it("returns 200 on api root", (done) => {
        api.get("/").expect(200, done);
    });
    it("returns 404 on invalid endpoint", (done) => {
        api.get("/i/am/invalid").expect(404, done);
    });
});
