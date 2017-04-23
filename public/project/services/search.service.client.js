(function () {
    angular
        .module("CatalogApp")
        .factory("SearchService", SearchService);

    function SearchService($http) {

        var api = {
            "searchProduct": searchProduct,
            "searchProductLatLng": searchProductLatLng,
            "getAddress": getAddress,
            "findRelatedProducts": findRelatedProducts
        };

        return api;

        function searchProduct(productName, location, radius, sortMode, price) {
            return $http.get("/api/searchProduct?productName="+productName+"&location="+location+"&radius="+radius+"&sortMode="+sortMode+"&price="+price);
        }

        function searchProductLatLng(productName, lat, lng, radius, sortMode, price) {
            return $http.get("/api/searchProductLatLng?productName="+productName+"&lat="+lat+"&lng="+lng+"&radius="+radius+"&sortMode="+sortMode+"&price="+price);
        }

        function getAddress(lat, lng) {
            return $http.get("/api/address?lat="+lat+"&lng="+lng);
        }

        function findRelatedProducts(storeId, productName, price) {
            return $http.get("/api/relatedProducts?storeId="+storeId+"&productName="+productName+"&price="+price);
        }
    }
})();