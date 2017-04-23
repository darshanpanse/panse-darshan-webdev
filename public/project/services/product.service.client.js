(function () {
    angular
        .module("CatalogApp")
        .factory("ProductService", ProductService);

    function ProductService($http) {
        var api = {
            "findProductById": findProductById,
            "addActorToProductFavourites": addActorToProductFavourites,
            "removeActorFromProductFavourites": removeActorFromProductFavourites,
            "addActorToProductLikes": addActorToProductLikes,
            "addActorToProductComments": addActorToProductComments,
            "getProductsByIds": getProductsByIds,
            "getProduct": getProduct,
            "incrementViews": incrementViews,
            "getProductsForStore": getProductsForStore
        };

        return api;

        function getProductsForStore(storeId) {
            return $http.get("/api/getProductsForStore?storeId="+storeId);
        }

        function incrementViews(product, storeId, views) {
            return $http.put("/api/incrementProductViews?storeId="+storeId+"&views="+views, product);
        }

        function getProduct(productId) {
            return $http.get("/api/getProduct?productId="+productId);
        }

        function getProductsByIds(productIds) {
            console.log(productIds);
            return $http.get("/api/favouriteProducts?productIds="+productIds);
        }

        function findProductById(productId) {
            return $http.get("/api/productById?productId="+productId);
        }

        function addActorToProductFavourites(actorId, product, storeId) {
            var info = {"actorId": actorId, "product": product, "storeId": storeId};
            return $http.post("/api/addActorToProductFavourites", info);
        }

        function removeActorFromProductFavourites(actorId, product) {
            var info = {"actorId": actorId, "product": product};
            console.log(info);
            return $http.put("/api/removeActorFromProductFavourites", info);
        }

        function addActorToProductLikes(actorId, product, storeId) {
            var info = {"actorId": actorId, "product": product, "storeId": storeId};
            return $http.post("/api/addActorToProductLikes", info);
        }

        function addActorToProductComments(actorId, product, text, timestamp, storeId) {
            var info = {"actorId": actorId, "product": product, "text": text, "timestamp": timestamp, "storeId": storeId};
            return $http.post("/api/addActorToProductComments", info);
        }
    }
})();
