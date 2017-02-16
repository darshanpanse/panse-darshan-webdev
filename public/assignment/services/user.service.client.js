/**
 * Created by darshan on 2/10/17.
 */

(function () {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);

    function UserService() {
        var users = [
            {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder"  },
            {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley"  },
            {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia"  },
            {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi" }
        ]

        var api = {
            "createUser" : createUser,
            "findUserById" : findUserById,
            "findUserByUsername" : findUserByUsername,
            "findUserByCredentials" : findUserByCredentials,
            "updateUser" : updateUser,
            "deleteUser" : deleteUser
        };

        return api;

        function createUser(user) {
            var newUser = {_id: (new Date()).getTime(),
                           username: user.username,
                           passsword: user.password,
                           firstName: "",
                           lastName: ""};
            users.push(user);
            return user;
        }

        function findUserById(userId) {

            for(var u in users) {
                var user = users[u];
                if(user._id === userId) {
                    return user;
                }
            }

            return null;
        }

        function findUserByUsername(username) {

            for(var u in users) {
                var user = users[u];
                if(user.username === username) {
                    return user;
                }
            }

            return null;
        }

        function findUserByCredentials(username, password) {

            for(var u in users) {
                var user = users[u];
                if(user.username === username && user.password === password) {
                    return user;
                }
            }

            return null;
        }

        function updateUser(userId, user) {

            for(var u in users) {
                if(users[u]._id === userId) {
                    users[u].firstName = user.firstName;
                    users[u].lastName = user.lastName;
                    return angular.copy(users[u]);
                }
            }

            return null;
        }

        function deleteUser(userId) {

            for(var u in users) {
                if(users[u]._id === userId) {
                    users.splice(u, 1);
                }
            }
        }
    }
})();
