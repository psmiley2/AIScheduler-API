var supertest = require("supertest"),
    api = supertest(process.env.URL + process.env.PORT),
    expect = require("chai").expect;

describe("creating a user and then gives them a tasklist and then a task", () => {
    // NOTE - This test will fail if unable to create a user
    let userid;
    let listid;

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

    it("adds a tasklist for the created user", (done) => {
        body = {
            title: "daily tasks",
        };
        api.post(`/tasks/list/${userid}`)
            .type("form")
            .send(body)
            .expect(201)
            .end((err, res) => {
                if (err) {
                    console.error("error: ", err);
                    expect.fail();
                }
                expect(res.body._id).to.have.length(24);
                expect(res.body.title).to.equal("daily tasks");
                expect(res.body.tasks).to.exist;
                expect(res.body.tasks).to.have.length(0);
                listid = res.body._id;
                done();
            });
    });

    it("adds a task to this task list", (done) => {
        body = {
            title: "a new task",
        };
        api.post(`/tasks/${userid}/${listid}`)
            .type("form")
            .send(body)
            .expect(201)
            .end((err, res) => {
                if (err) {
                    console.error("error: ", err);
                    expect.fail();
                }
                expect(res.body._id).to.have.length(24);
                expect(res.body.title).to.equal("a new task");
                expect(res.body.completed).to.be.false;
                expect(res.body.created).to.exist;
                done();
            });
    });

    let fakeid = "5ecf18b6c6ecf6c00c";

    it("rejects an invalid userid", (done) => {
        body = {
            title: "a new task",
        };
        api.post(`/tasks/${fakeid}/${listid}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });

    it("rejects an invalid tasklist", (done) => {
        body = {
            title: "a new task",
        };
        api.post(`/tasks/${userid}/${fakeid}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });

    let fakebutvalidid = "5ecf1b3eb00ba65b2456bc45";

    it("rejects valid IDs that are not found in the database", (done) => {
        body = {
            title: "a new task",
        };
        api.post(`/tasks/${fakebutvalidid}/${fakebutvalidid}`)
            .type("form")
            .send(body)
            .expect(400, done);
    });

    it("fetches the tasklist that was just created", (done) => {
        api.get(`/tasks/list/${userid}/${listid}`)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    expect.fail();
                }
                expect(res.body.title).to.equal("daily tasks");
                expect(res.body.tasks).to.have.length(1);
                expect(res.body.tasks[0].title).to.equal("a new task");
                done();
            });
    });

    it("throws 400 on a listid that doens't exist", (done) => {
        api.get(`/tasks/list/${userid}/${fakebutvalidid}`).expect(400, done);
    });

    it("deletes the created user", (done) => {
        api.delete(`/users/${userid}`).type("form").send().expect(200, done);
    });
});
