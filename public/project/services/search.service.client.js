(function () {
    angular
        .module("CatalogApp")
        .factory("SearchService", SearchService);

    function SearchService($http) {

        var key = "0145bd15e506414874838cabae63c41e";
        var urlBase = "https://api.goodzer.com/products/v0.1/search_stores/?query=productName&lat=40.714353&lng=-74.005973&radius=5&priceRange=30:120&apiKey=API_KEY";

        var api = {
            "searchProduct": searchProduct
        };

        return api;

        function createCORSRequest(method, url) {
            var xhr = new XMLHttpRequest();
            if ("withCredentials" in xhr) {
                // XHR for Chrome/Firefox/Opera/Safari.
                xhr.open(method, url, true);
            } else if (typeof XDomainRequest != "undefined") {
                // XDomainRequest for IE.
                xhr = new XDomainRequest();
                xhr.open(method, url);
            } else {
                // CORS not supported.
                xhr = null;
            }
            return xhr;
        }



        function searchProduct(productName, location) {
            //var url = urlBase.replace("API_KEY", key).replace("productName", productName);
            //return $http.get(url);
            var url = urlBase.replace("API_KEY", key).replace("productName", productName);

            var xhr = createCORSRequest('GET', url);
            if (!xhr) {
                alert('CORS not supported');
                return;
            }

            // Response handlers.
            xhr.onload = function() {
                var text = xhr.responseText;
                console.log(text);
                //alert('Response from CORS request to ' + url + ': ' + title);
            };

            xhr.onerror = function() {
                var text = xhr.responseText;
                console.log(text);
                console.log('Woops, there was an error making the request.');
            };

            xhr.send();

            // var url = urlBase.replace("API_KEY", key).replace("productName", productName);
            // return $http.get(url);
        }
    }
})();