require("dotenv").config();
var chai = require("chai");

describe("load enviroment variables", () => {
    it("loads PORT", () => {
        chai.expect(process.env.PORT).to.equal("8080");
    });
    it("loads MONGODBURI", () => {
        chai.expect(process.env.MONGODB_URI).to.equal(
            "mongodb://localhost:27017"
        );
    });
});
