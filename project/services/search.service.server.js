module.exports = function (app) {
    var https = require("https");

    app.get("/api/searchProduct", searchProduct);
    app.get("/api/searchProductLatLng", searchProductLatLng);
    app.get("/api/address", getAddress);
    app.get("/api/relatedProducts", findRelatedProducts);

    var goodzerAPI_KEY = "0145bd15e506414874838cabae63c41e";
    var googleAPI_KEY = "AIzaSyB-tg-qSAqeQumjQ1k2Q8CgtazCYay4uOA";

    //var key = "0145bd15e506414874838cabae63c41e";
    //var urlBase = "https://api.goodzer.com/products/v0.1/search_stores/?query=productName&lat=40.714353&lng=-74.005973&radius=5&priceRange=30:120&apiKey=API_KEY";

    function searchProduct(req, res) {
        var productName = req.query.productName;
        var location = req.query.location;
        var radius = req.query.radius;
        var sortMode = req.query.sortMode;
        var price = req.query.price;
        var str1 = "";
        // var goodzerBasePath = "/products/v0.1/search_stores/?query=productName&lat=40.714353&lng=-74.005973&radius=5&priceRange=30:120&apiKey=goodzerAPI_KEY";
        var goodzerBasePath = "/products/v0.1/search_stores/?query=productName&lat=latitude&lng=longitude&radius=distance&priceRange=price_range&sorting=sortMode&apiKey=goodzerAPI_KEY";
        // var googleBasePath = "/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyB-tg-qSAqeQumjQ1k2Q8CgtazCYay4uOA";
        var googleBasePath = "/maps/api/geocode/json?address=location&key=AIzaSyB-tg-qSAqeQumjQ1k2Q8CgtazCYay4uOA";
        var googlePath = googleBasePath.replace("location", location).split(' ').join('+');

        var options = {
            host: "maps.googleapis.com",
            path: googlePath,
            json: true
        };

        callback = function(response) {
            response.on('data', function (chunk) {
                str1 += chunk;
            });

            response.on('end', function () {
                var jsonData = JSON.parse(str1);
                var str2 = "";
                jsonData = jsonData.results[0].geometry.location;

                var path = goodzerBasePath
                    .replace("goodzerAPI_KEY", goodzerAPI_KEY)
                    .replace("productName", productName)
                    .replace("latitude", jsonData.lat)
                    .replace("longitude", jsonData.lng)
                    .replace("distance", radius)
                    .replace("sortMode", sortMode)
                    .replace("price_range", price)
                    .split(' ')
                    .join('%20');
                var options = {
                    host: "api.goodzer.com",
                    path: path
                };

                callback = function(response) {
                    response.on('data', function (chunk) {
                        str2 += chunk;
                    });

                    response.on('end', function () {
                        res.json({"userLocation": jsonData, "goodzerResults": str2});
                    });
                };

                var req2 = https.request(options, callback).end();
            });
        };

        var req1 = https.request(options, callback).end();
    }

    function searchProductLatLng(req, res) {
        var productName = req.query.productName;
        var lat = req.query.lat;
        var lng = req.query.lng;
        var radius = req.query.radius;
        var sortMode = req.query.sortMode;
        var price = req.query.price;
        var str = "";
        var goodzerBasePath = "/products/v0.1/search_stores/?query=productName&lat=latitude&lng=longitude&radius=distance&priceRange=price_range&sorting=sortMode&apiKey=goodzerAPI_KEY";

        var path = goodzerBasePath
            .replace("goodzerAPI_KEY", goodzerAPI_KEY)
            .replace("productName", productName)
            .replace("latitude", lat)
            .replace("longitude", lng)
            .replace("distance", radius)
            .replace("sortMode", sortMode)
            .replace("price_range", price)
            .split(' ')
            .join('%20');

        var options = {
            host: "api.goodzer.com",
            path: path
        };

        callback = function(response) {
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                res.json({"userLocation": {lat: lat, lng: lng}, "goodzerResults": str});
            });
        };

        var req = https.request(options, callback).end();
    }

    function getAddress(req, res) {
        var lat = req.query.lat;
        var lng = req.query.lng;
        var googleBasePath = "/maps/api/geocode/json?latlng=latitude,longitude&key=AIzaSyB-tg-qSAqeQumjQ1k2Q8CgtazCYay4uOA";
        var path = googleBasePath
                    .replace("latitude", lat)
                    .replace("longitude", lng);
        var str = "";

        var options = {
            host: "maps.googleapis.com",
            path: path,
            json: true
        };

        callback = function(response) {
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                var jsonData = JSON.parse(str);
                res.json(jsonData);
            });
        };

        var req = https.request(options, callback).end();
    }

    function findRelatedProducts(req, res) {
        var str="";
        var storeId = req.query.storeId;
        var productName = req.query.productName;
        var price = req.query.price;

        var goodzerBasePath = "https://api.goodzer.com/products/v0.1/search_in_store/?storeId=123&query=productName&priceRange=price_range&apiKey=goodzerAPI_KEY";
        var goodzerPath = goodzerBasePath
            .replace("goodzerAPI_KEY", goodzerAPI_KEY)
            .replace("123", storeId)
            .replace("productName", productName)
            .replace("price_range", price)
            .split(' ')
            .join('%20');

        var options = {
            host: "api.goodzer.com",
            path: goodzerPath,
            json: true
        };

        callback = function(response) {
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                res.json(JSON.parse(str));
            });
        };

        var req = https.request(options, callback).end();

    }
};