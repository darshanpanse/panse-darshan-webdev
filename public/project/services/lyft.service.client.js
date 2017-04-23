(function () {
    angular
        .module("CatalogApp")
        .factory("LyftService", LyftService);

    function LyftService($http) {

        var api = {
            requestRide: requestRide,
            getETA: getETA,
            getCostEstimates: getCostEstimates
        };

        return api;

        function requestRide(ride_type, start_lat, start_lng, end_lat, end_lng) {
            return $http.get("/api/requestRide?ride_type="+ride_type+"&start_lat="+start_lat+"start_lng="+start_lng+"end_lat="+end_lat+"&end_lng="+end_lng);
        }

        function getCostEstimates(ride_type, start_lat, start_lng, end_lat, end_lng) {
            return $http.get("/api/getCostEstimates?ride_type="+ride_type+"&start_lat="+start_lat+"&start_lng="+start_lng+"&end_lat="+end_lat+"&end_lng="+end_lng);
        }

        function getETA(lat, lng) {
            return $http.get("/api/getETA?lat="+lat+"&lng="+lng);
        }

    }
})();