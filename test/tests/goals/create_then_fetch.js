var supertest = require("supertest"),
    api = supertest(process.env.URL + process.env.PORT),
    expect = require("chai").expect;

describe("create a goal and then fetch it", () => {
    let userid;
    let goalid;

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

    it("fetches all goals before any are posted", (done) => {
        api.get(`/goals/${userid}`)
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

    it("creates a goal for that user", (done) => {
        body = {
            title: "get ripped",
            priority: 12,
        };
        api.post(`/goals/${userid}`)
            .type("form")
            .send(body)
            .expect(201)
            .end((err, res) => {
                if (err) {
                    console.error("error: ", err);
                    expect.fail();
                }
                expect(res.body._id).to.have.length(24);
                expect(res.body.title).to.equal("get ripped");
                expect(res.body.priority).to.equal("12");
                expect(res.body.created).to.exist;
                goalid = res.body._id;
                done();
            });
    });

    it("fetches the goal that was just created", (done) => {
        api.get(`/goals/${userid}/${goalid}`)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    expect.fail();
                }
                expect(res.body.title).to.equal("get ripped");
                expect(res.body.priority).to.equal(12);
                expect(res.body.created).to.exist;
                done();
            });
    });

    it("fetches all goals after one is posted", (done) => {
        api.get(`/goals/${userid}`)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    expect.fail();
                }
                expect(res.body[0].title).to.equal("get ripped");
                expect(res.body[0].priority).to.equal(12);
                expect(res.body[0].created).to.exist;
                expect(res.body).to.have.length(1);
                done();
            });
    });

    it("creates a second goal for that user", (done) => {
        body = {
            title: "get good grades in school",
            priority: 1,
        };
        api.post(`/goals/${userid}`)
            .type("form")
            .send(body)
            .expect(201)
            .end((err, res) => {
                if (err) {
                    console.error("error: ", err);
                    expect.fail();
                }
                expect(res.body._id).to.have.length(24);
                expect(res.body.title).to.equal("get good grades in school");
                expect(res.body.priority).to.equal("1");
                expect(res.body.created).to.exist;
                goalid = res.body._id;
                done();
            });
    });

    it("fetches the goal that was just created", (done) => {
        api.get(`/goals/${userid}/${goalid}`)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    expect.fail();
                }
                expect(res.body.title).to.equal("get good grades in school");
                expect(res.body.priority).to.equal(1);
                expect(res.body.created).to.exist;
                done();
            });
    });

    it("gets both goals", (done) => {
        api.get(`/goals/${userid}`)
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

    it("creates a goal for an fake user", (done) => {
        body = {
            title: "become a chef",
            priority: 1,
        };
        api.post(`/goals/${fakeid}`).type("form").send(body).expect(400, done);
    });

    it("creates a goal with an invalid id", (done) => {
        body = {
            title: "become a chef",
            priority: 1,
        };
        api.post(`/goals/${invalid}`).type("form").send(body).expect(400, done);
    });

    it("fetches a goal with an fake user", (done) => {
        api.get(`/goals/${fakeid}/${goalid}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });

    it("fetches a goal with an invalid user id", (done) => {
        api.get(`/goals/${invalid}/${goalid}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });

    it("fetches a goal from a valid user but fake goal id", (done) => {
        api.get(`/goals/${userid}/${fakeid}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });

    it("fetches a goal from a valid user but invalid goal id", (done) => {
        api.get(`/goals/${userid}/${invalid}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });

    it("fetches all goals with an fake user", (done) => {
        api.get(`/goals/${fakeid}`).type("form").send(body).expect(400, done);
    });

    it("fetches all goals with an invalid user id", (done) => {
        api.get(`/goals/${invalid}`).type("form").send(body).expect(400, done);
    });

    it("deletes the created user", (done) => {
        api.delete(`/users/${userid}`).type("form").send().expect(200, done);
    });
});
