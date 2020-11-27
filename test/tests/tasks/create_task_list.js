var supertest = require("supertest"),
    api = supertest(process.env.URL + process.env.PORT),
    expect = require("chai").expect;

describe("wrong requests when creating a tasklist", () => {
    it("returns 404 when no userid is set in the url parameter", (done) => {
        let body = {
            title: "weekly tasks",
        };
        api.post("/tasks/list").type("form").send(body).expect(404, done);
    });
    it("returns 400 when userid url parameter is invalid", (done) => {
        let body = {
            title: "weekly tasks",
        };
        let fake_but_valid_id = "123213df";
        api.post(`/tasks/list/${fake_but_valid_id}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });
});
