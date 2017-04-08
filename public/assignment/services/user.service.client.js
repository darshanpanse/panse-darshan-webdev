(function () {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);

    function UserService($http) {

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
            return $http.post("/api/customer/", user);
        }

        function findUserById(userId) {
            return $http.get("/api/customer/" + userId);
        }

        function findUserByUsername(username) {
            return $http.get("/api/customer?username=" + username);
        }

        function findUserByCredentials(username, password) {
            return $http.get("/api/customer?username="+username+"&password="+password);
        }

        function updateUser(userId, newUser) {
            return $http.put("/api/customer/"+userId, newUser);
        }

        function deleteUser(userId) {
            return $http.delete("/api/customer/"+userId);
        }
    }
})();
