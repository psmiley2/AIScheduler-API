var supertest = require("supertest"),
    api = supertest(process.env.URL + process.env.PORT),
    expect = require("chai").expect;

describe("create a preferences and then fetch it", () => {
    let userid;
    let preferenceid;

    // NOTE - This test will fail if unable to create a user
    // SECTION - Valid vanilla part of test
    it("creates a user", (done) => {
        let body = {
            email: "test_delete_later",
            password: "P@ssword",
        };
        api.post("/users/register")
            .type("form")
            .send(body)
            .expect(201)
            .end((err, res) => {
                if (err) {
                    console.error("error: ", err);
                    expect.fail();
                }
                userid = res.body._id;
                done();
            });
    });

    it("fetches the zero preferences from the user", (done) => {
        api.get(`/preferences/${userid}`)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.error("error: ", err);
                    expect.fail();
                }
                expect(res.body).to.have.length(0);
                done();
            });
    });

    it("creates a preference for that user", (done) => {
        body = {
            title: "dark mode",
        };
        api.post(`/preferences/${userid}`)
            .type("form")
            .send(body)
            .expect(201)
            .end((err, res) => {
                if (err) {
                    console.error("error: ", err);
                    expect.fail();
                }
                expect(res.body._id).to.have.length(24);
                expect(res.body.title).to.equal("dark mode");
                preferenceid = res.body._id;
                done();
            });
    });

    it("fetches the preference that was just created (first)", (done) => {
        api.get(`/preferences/${userid}/${preferenceid}`)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    expect.fail();
                }
                expect(res.body.title).to.equal("dark mode");
                done();
            });
    });

    it("fetches all (only one) preferences from the user", (done) => {
        api.get(`/preferences/${userid}`)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.error("error: ", err);
                    expect.fail();
                }
                expect(res.body[0].title).to.equal("dark mode");
                expect(res.body).to.have.length(1);
                done();
            });
    });

    it("creates a second preference for that user", (done) => {
        body = {
            title: "rapid tasks",
        };
        api.post(`/preferences/${userid}`)
            .type("form")
            .send(body)
            .expect(201)
            .end((err, res) => {
                if (err) {
                    console.error("error: ", err);
                    expect.fail();
                }
                expect(res.body._id).to.have.length(24);
                expect(res.body.title).to.equal("rapid tasks");
                preferenceid = res.body._id;
                done();
            });
    });

    it("fetches the preference that was just created (second)", (done) => {
        api.get(`/preferences/${userid}/${preferenceid}`)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    expect.fail();
                }
                expect(res.body.title).to.equal("rapid tasks");
                done();
            });
    });

    it("fetches all (two) preferences from the user", (done) => {
        api.get(`/preferences/${userid}`)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.error("error: ", err);
                    expect.fail();
                }
                expect(res.body[1].title).to.equal("rapid tasks");
                expect(res.body).to.have.length(2);
                done();
            });
    });

    // SECTION - Bug / Error handling part of test

    let fakeid = "5ecf18b6c6ecf6c00c";
    let invalid = "5ecf18ecf6c00c";

    it("creates a preference for an invalid user", (done) => {
        body = {
            title: "dark mode",
        };
        api.post(`/preferences/${fakeid}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });

    it("creates a preference with an invalid id", (done) => {
        body = {
            title: "dark mode",
        };
        api.post(`/preferences/${invalid}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });

    it("fetches a preference with a fake user", (done) => {
        api.get(`/preferences/${fakeid}/${preferenceid}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });

    it("fetches a preference with an invalid user id", (done) => {
        api.get(`/preferences/${invalid}/${preferenceid}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });

    it("fetches a preference from a valid user but fake preference id", (done) => {
        api.get(`/preferences/${userid}/${fakeid}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });

    it("fetches a preference from a valid user but invalid preference id", (done) => {
        api.get(`/preferences/${userid}/${invalid}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });

    it("fetches all preferences with a fake user", (done) => {
        api.get(`/preferences/${fakeid}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });

    it("fetches all preferences with an invalid user id", (done) => {
        api.get(`/preferences/${invalid}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });

    it("deletes the created user", (done) => {
        api.delete(`/users/${userid}`).type("form").send().expect(200, done);
    });
});
