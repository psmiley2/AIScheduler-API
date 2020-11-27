var supertest = require("supertest"),
    api = supertest(process.env.URL + process.env.PORT),
    expect = require("chai").expect;

describe("create an event and then fetch it", () => {
    let userid;
    let eventid;

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

    it("fetches all events before any are posted", (done) => {
        api.get(`/events/${userid}`)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    expect.fail();
                }
                expect(res.body).to.have.length(0);
                done();
            });
    });

    it("creates an event for that user", (done) => {
        body = {
            title: "go swimming",
        };
        api.post(`/events/${userid}`)
            .type("form")
            .send(body)
            .expect(201)
            .end((err, res) => {
                if (err) {
                    console.error("error: ", err);
                    expect.fail();
                }
                eventid = res.body._id;
                done();
            });
    });

    it("fetches the event that was just created", (done) => {
        api.get(`/events/${userid}/${eventid}`)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    expect.fail();
                }
                expect(res.body.title).to.equal("go swimming");
                done();
            });
    });

    it("fetches all events after one is posted", (done) => {
        api.get(`/events/${userid}`)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    expect.fail();
                }
                expect(res.body[0].title).to.equal("go swimming");
                expect(res.body).to.have.length(1);
                done();
            });
    });

    it("creates a second event for that user", (done) => {
        body = {
            title: "buy grapes",
        };
        api.post(`/events/${userid}`)
            .type("form")
            .send(body)
            .expect(201)
            .end((err, res) => {
                if (err) {
                    console.error("error: ", err);
                    expect.fail();
                }
                expect(res.body._id).to.have.length(24);
                expect(res.body.title).to.equal("buy grapes");
                eventid = res.body._id;
                done();
            });
    });

    it("fetches the event that was just created", (done) => {
        api.get(`/events/${userid}/${eventid}`)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    expect.fail();
                }
                expect(res.body.title).to.equal("buy grapes");
                done();
            });
    });

    it("gets both events", (done) => {
        api.get(`/events/${userid}`)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    expect.fail();
                }
                expect(res.body).to.have.length(2);
                done();
            });
    });

    // SECTION - Bug / Error handling part of test

    let fakeid = "5ecf18b6c6ecf6c00c";
    let invalid = "5ecf18ecf6c00c";

    it("creates an event for an fake user", (done) => {
        body = {
            title: "buy a cookbook",
        };
        api.post(`/events/${fakeid}`).type("form").send(body).expect(400, done);
    });

    it("creates an event with an invalid id", (done) => {
        body = {
            title: "buy a cookbook",
        };
        api.post(`/events/${invalid}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });

    it("fetches an event with an fake user", (done) => {
        api.get(`/events/${fakeid}/${eventid}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });

    it("fetches an event with an invalid user id", (done) => {
        api.get(`/events/${invalid}/${eventid}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });

    it("fetches an event from a valid user but fake event id", (done) => {
        api.get(`/events/${userid}/${fakeid}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });

    it("fetches an event from a valid user but invalid event id", (done) => {
        api.get(`/events/${userid}/${invalid}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });

    it("fetches all events with an fake user", (done) => {
        api.get(`/events/${fakeid}`).type("form").send(body).expect(400, done);
    });

    it("fetches all events with an invalid user id", (done) => {
        api.get(`/events/${invalid}`).type("form").send(body).expect(400, done);
    });

    it("deletes the created user", (done) => {
        api.delete(`/users/${userid}`).type("form").send().expect(200, done);
    });

    it("can no longer find the user in the database", (done) => {
        api.get(`/users/find/${userid}`).type("form").send().expect(400, done);
    });
});
