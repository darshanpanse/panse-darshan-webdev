(function () {
    angular
        .module("CatalogApp")
        .factory("ActorService", ActorService);

    function ActorService($http) {
        var api = {
            "loggedIn": loggedIn,
            "isAdmin": isAdmin,
            "isRegisteredOwner": isRegisteredOwner,
            "createActor" : createActor,
            "register": register,
            "logout": logout,
            "findActorsByIds" : findActorsByIds,
            "findActorById" : findActorById,
            "findActorByUsername" : findActorByUsername,
            "findActorByEmail" : findActorByEmail,
            "findActorByPhone" : findActorByPhone,
            "findActorByCredentials" : findActorByCredentials,
            "addProductToActorFavourites": addProductToActorFavourites,
            "removeProductFromActorFavourites": removeProductFromActorFavourites,
            "removeStoreFromActorFavourites": removeStoreFromActorFavourites,
            "addProductToActorLikes": addProductToActorLikes,
            "addProductToActorComments": addProductToActorComments,
            "verifyActorByPassword": verifyActorByPassword,
            "changePassword": changePassword,
            "addStoreToActorFavourites": addStoreToActorFavourites,
            "addStoreToActorLikes": addStoreToActorLikes,
            "addStoreToActorComments": addStoreToActorComments,
            "findAllCustomers": findAllCustomers,
            "findAllStoreOwners": findAllStoreOwners,
            "findAllRegistrationRequests": findAllRegistrationRequests,
            "deleteAccount": deleteAccount,
            "updateProfile": updateProfile,
            "removeRegistrationRequest": removeRegistrationRequest,
            "findActorsByArraysOfIds": findActorsByArraysOfIds,
            "addToFollowing": addToFollowing,
            "addToFollowers": addToFollowers,
            "removeFromFollowing": removeFromFollowing,
            "removeFromFollowers": removeFromFollowers
            //"updateactor" : updateactor,
            //"deleteactor" : deleteactor
        };

        return api;

        function removeProductFromActorFavourites(actor, productId) {
            var info = {"actor": actor, "productId": productId};
            return $http.put("/api/removeProductFromActorFavourites", info);
        }

        function removeStoreFromActorFavourites(actor, storeId) {
            var info = {"actor": actor, "storeId": storeId};
            return $http.put("/api/removeStoreFromActorFavourites", info);
        }

        function addToFollowing(currentActorId, actorId) {
            return $http.post("/api/addToFollowing?currentActorId="+currentActorId+"&actorId="+actorId);
        }

        function addToFollowers(currentActorId, actorId) {
            return $http.post("/api/addToFollowers?currentActorId="+currentActorId+"&actorId="+actorId);
        }

        function removeFromFollowing(currentActor, actorId) {
            var info = {"currentActor": currentActor, "actorId": actorId};
            return $http.put("/api/removeFromFollowing", info);
        }

        function removeFromFollowers(currentActorId, actor) {
            var info = {"currentActorId": currentActorId, "actor": actor};
            return $http.put("/api/removeFromFollowers", info);
        }

        function findActorsByArraysOfIds(actorIds) {
            return $http.post("/api/actorsArray",actorIds);
        }

        function findActorsByIds(actorIds) {
            return $http.get("/api/actor?actorIds="+actorIds);
        }

        function removeRegistrationRequest(requestId) {
            return $http.delete("/api/delete/request?requestId="+requestId);
        }

        function deleteAccount(actorId) {
            return $http.delete("/api/actor/delete?actorId="+actorId);
        }

        function updateProfile(actor) {
            return $http.put("/api/actor/updateProfile", actor);
        }

        function findActorById(actorId) {
            return $http.get("/api/admin/findActorById?actorId="+actorId);
        }

        function findAllRegistrationRequests() {
            return $http.get("/api/admin/requests");
        }

        function findAllStoreOwners() {
            return $http.get("/api/admin/owners");
        }

        function findAllCustomers() {
            return $http.get("/api/admin/customers");
        }

        function isAdmin() {
            return $http.post("/api/actor/isAdmin")
                .then(function (response) {
                    return response.data;
                });
        }

        function isRegisteredOwner() {
            return $http.post("/api/actor/isRegisteredOwner")
                .then(function (response) {
                    return response.data;
                });
        }

        function addStoreToActorFavourites(actorId, storeId) {
            var info = {"actorId": actorId, "storeId": storeId};
            return $http.post("/api/addStoreToActorFavourites", info);
        }

        function addStoreToActorLikes(actorId, storeId) {
            var info = {"actorId": actorId, "storeId": storeId};
            return $http.post("/api/addStoreToActorLikes", info);
        }

        function addStoreToActorComments(actorId, storeId, text, timestamp) {
            var info = {"actorId": actorId, "storeId": storeId, "text": text, "timestamp": timestamp};
            return $http.post("/api/addStoreToActorComments", info);
        }

        function verifyActorByPassword(actorId, oldPassword) {
            return $http.get("/api/verifyActorByPassword?actorId="+actorId+"&oldPassword="+oldPassword);
        }

        function changePassword(actorId, newPassword) {
            var info = {"actorId": actorId, "newPassword": newPassword};
            return $http.put("/api/changePassword", info);
        }

        function loggedIn() {
            return $http.post("/api/actor/loggedIn")
                .then(function (response) {
                    return response.data;
                });
        }

        function createActor(actor) {
            return $http.post("/api/actor", actor);
        }

        function logout() {
            return $http.post("/api/actor/logout")
                .then(function (response) {
                    console.log(response.data);
                    return response.data;
                });
        }

        function register(actor) {
            return $http.post("/api/actor/register", actor);
        }

        function findActorByEmail(email) {
            return $http.get("/api/actor-email?email="+email);
        }

        function findActorByPhone(phone) {
            return $http.get("/api/actor-phone?phone="+phone);
        }

        function findActorByCredentials(actor) {
            return $http.post("/api/actor/login", actor);
        }

        function findActorByUsername(username) {
            return $http.get("/api/actor-username?username="+username);
        }

        function addProductToActorFavourites(actorId, productId) {
            var info = {"actorId": actorId, "productId": productId};
            return $http.post("/api/addProductToActorFavourites", info);
        }


        function addProductToActorLikes(actorId, productId) {
            var info = {"actorId": actorId, "productId": productId};
            return $http.post("/api/addProductToActorLikes", info);
        }

        function addProductToActorComments(actorId, productId, text, timestamp) {
            var info = {"actorId": actorId, "productId": productId, "text": text, "timestamp": timestamp};
            return $http.post("/api/addProductToActorComments", info);
        }
    }
})();