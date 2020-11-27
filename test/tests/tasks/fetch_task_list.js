var supertest = require("supertest"),
    api = supertest(process.env.URL + process.env.PORT),
    expect = require("chai").expect;

describe("status code 400 responses with invalid requests", () => {
    let fakeValidID = "5ecfbe4776819431e0fd7227";
    let fakeInvalidID = "5ecfbe4719431e0fd7227";
    it("Throws 400 on fake valid userid", (done) => {
        api.get(`/tasks/list/${fakeValidID}/${fakeValidID}`).expect(400, done);
    });
    it("Throws 400 on invalid userid", (done) => {
        api.get(`/tasks/list/${fakeInvalidID}/${fakeValidID}`).expect(
            400,
            done
        );
    });
});
