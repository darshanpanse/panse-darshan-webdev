(function () {
    angular
        .module("CatalogApp")
        .factory("StoreService", StoreService);

    function StoreService($http) {

        var api = {
            "addActorToStoreFavourites": addActorToStoreFavourites,
            "removeActorFromStoreFavourites": removeActorFromStoreFavourites,
            "addActorToStoreLikes": addActorToStoreLikes,
            "addActorToStoreComments": addActorToStoreComments,
            "getStoresByIds": getStoresByIds,
            "getStore": getStore,
            "incrementViews": incrementViews,
            "updateStore": updateStore,
            "createStore": createStore
            // "findStoreById": findStoreById
        };
        return api;

        // function findStoreById(storeId) {
        //     return $http.get("/api/")
        // }

        function removeActorFromStoreFavourites(actorId, store) {
            var info = {"actorId": actorId, "store": store};
            return $http.put("/api/removeActorFromStoreFavourites", info);
        }

        function updateStore(store) {
            return $http.put("/api/store/update", store);
        }

        function createStore(store) {
            return $http.post("/api/store/create", store);
        }

        function incrementViews(store, views) {
            return $http.put("/api/incrementStoreViews?views="+views, store);
        }

        function getStore(storeId) {
            return $http.get("/api/getStore?storeId="+storeId);
        }


        function getStoresByIds(storeIds) {
            return $http.get("/api/favouriteStores?storeIds="+storeIds);
        }

        function addActorToStoreFavourites(actorId, store) {
            var info = {"actorId": actorId, "store": store};
            return $http.post("/api/addActorToStoreFavourites", info);
        }

        function addActorToStoreLikes(actorId, store) {
            var info = {"actorId": actorId, "store": store};
            return $http.post("/api/addActorToStoreLikes", info);
        }

        function addActorToStoreComments(actorId, store, text, timestamp) {
            var info = {"actorId": actorId, "store": store, "text": text, "timestamp": timestamp};
            return $http.post("/api/addActorToStoreComments", info);
        }
    }
})();
