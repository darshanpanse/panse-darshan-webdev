/**
 * Created by darshan on 2/18/17.
 */
module.exports = function (app) {
    app.get("/api/user", findUser);
    app.post("/api/user", createUser);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);

    var users = [
        {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder"  },
        {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley"  },
        {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia"  },
        {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi" }
    ];

    function findUserByCredentials(req, res) {
        console.log("user.service.server.js 1");
        var username = req.query.username;
        var password = req.query.password;
        var user = users.find(function (u) {
            return u.username === username && u.password === password;
        });
        if(user) {
            res.json(user);
        } else {
            res.sendStatus(404);
        }
    }

    function createUser(req, res) {
        console.log("user.service.server.js 2");
        var newUser = req.body;
        newUser._id = (new Date().getTime()).toString();
        users.push(newUser);
        res.json(newUser);
    }

    function findUserByUsername(req,res) {
        console.log("user.service.server.js 3");
        var username = req.query.username;
        var user = users.find(function (u) {
            return u.username === username;
        });
        if(user) {
            res.json(user);
        } else {
            res.sendStatus(404);
        }

    }

    function findUser(req,res) {
        var username = req.query.username;
        var password = req.query.password;
        if(username && password) {
            findUserByCredentials(req,res);
        } else if (username) {
            findUserByUsername(req,res);
        }
    }

    function findUserById(req, res) {
        console.log("user.service.server.js 4");
        var userId = req.params.userId;
        for(var u in users) {
            if(users[u]._id === userId) {
                res.json(users[u]);
                return;
            }
        }
        res.sendStatus(404);
    }

    function updateUser(req, res) {
        console.log("user.service.server.js 5");
        var userId = req.params.userId;
        var newUser = req.body;
        for(var u in users) {
            if(users[u]._id === userId) {
                users[u].firstName = newUser.firstName;
                users[u].lastName = newUser.lastName;
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }

    function deleteUser(req, res) {
        console.log("user.service.server.js 6");
        var userId = req.params.userId;
        for(var u in users) {
            if(users[u]._id === userId) {
                users.splice(u, 1);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }
};
