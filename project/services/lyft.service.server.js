var lyftClientID = "2JtO2UT8G2qT";
var lyftSecret = "W65W1DP31fceKo4bsU30rNc33Xt9_fes";

module.exports = function (app) {
    var https = require("https");

    app.get("/api/requestRide", requestRide);
    app.get("/api/getETA", getETA);
    app.get("/api/getCostEstimates", getCostEstimates);
    app.get("/lyft/auth/callback", lyftCallback);

    var ride_type;
    var start_lat;
    var start_lng;
    var end_lat;
    var end_lng;

    function lyftCallback(req, res) {
        var client_ID = "2JtO2UT8G2qT";
        var secret = "W65W1DP31fceKo4bsU30rNc33Xt9_fes";
        var code = req.query.code;

        var request = require('request');

        var headers = {
            'Content-Type': 'application/json'
        };

        var dataString = '{"grant_type": "authorization_code", "code": "CODE"}';
        var temp = JSON.parse(dataString);
        temp.code = code;
        dataString = JSON.stringify(temp);

        var options = {
            url: 'https://api.lyft.com/oauth/token',
            method: 'POST',
            headers: headers,
            body: dataString,
            auth: {
                'user': client_ID,
                'pass': secret
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var token_type = JSON.parse(body).token_type;
                var access_token = JSON.parse(body).access_token;
                var request = require('request');

                var authorization = "TOKEN_TYPE ACCESS_TOKEN";
                authorization = authorization
                    .replace("TOKEN_TYPE", token_type)
                    .replace("ACCESS_TOKEN", access_token);

                var headers = {
                    "Authorization": authorization,
                    'Content-Type': 'application/json'
                };

                var dataString = '{"ride_type" : "RIDE_TYPE", "origin" : {"lat" : START_LAT, "lng" : START_LNG }, "destination": {"lat": END_LAT, "lng": END_LNG, }';
                dataString = dataString
                    .replace("RIDE_TYPE", ride_type)
                    .replace(START_LAT, start_lat)
                    .replace(START_LNG, start_lng)
                    .replace(END_LAT, end_lat)
                    .replace(END_LNG, end_lng);


                var options = {
                    url: 'https://api.lyft.com/v1/rides',
                    method: 'POST',
                    headers: headers,
                    body: dataString
                };

                function callback(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body);
                    }
                }
                request(options, callback);
            }
        }

        request(options, callback);
    }

    function requestRide(req, res) {
        ride_type = req.query.ride_type;
        start_lat = req.query.start_lat;
        start_lng = req.query.start_lng;
        end_lat = req.query.end_lat;
        end_lng = req.query.end_lng;
        info = {"ride_type": ride_type, "start_lat": start_lat, "start_lng": start_lng, "end_lat": end_lat, "end_lng": end_lng};
        return info;
    }

    function getCostEstimates(req, res) {

        var client_ID = "2JtO2UT8G2qT";
        var secret = "W65W1DP31fceKo4bsU30rNc33Xt9_fes";
        var request = require('request');

        var headers = {
            'Content-Type': 'application/json'
        };

        var dataString = '{"grant_type": "client_credentials", "scope": "public"}';

        var options = {
            url: 'https://api.lyft.com/oauth/token',
            method: 'POST',
            headers: headers,
            body: dataString,
            auth: {
                'user': client_ID,
                'pass': secret
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var token_type = JSON.parse(body).token_type;
                var access_token = JSON.parse(body).access_token;
                var authorization = "TOKEN_TYPE ACCESS_TOKEN";
                authorization = authorization
                    .replace("TOKEN_TYPE", token_type)
                    .replace("ACCESS_TOKEN", access_token);

                var str1 = "";
                var client_ID = "Fy7prF8Kz1qO";
                var secret = "Lx47Hczpr03EjuMm8at_oQbc-NpQO5Xw";
                var urlBase = "https://api.lyft.com/v1/cost?ride_type=RIDE_TYPE&start_lat=START_LAT&start_lng=START_LNG&end_lat=END_LAT&end_lng=END_LNG";
                var ride_type = req.query.ride_type;
                var start_lat = req.query.start_lat;
                var start_lng = req.query.start_lng;
                var end_lat = req.query.end_lat;
                var end_lng = req.query.end_lng;

                var lyftPath = urlBase
                    .replace("RIDE_TYPE", ride_type)
                    .replace("START_LAT", start_lat)
                    .replace("START_LNG", start_lng)
                    .replace("END_LAT", end_lat)
                    .replace("END_LNG", end_lng);

                // var request = require('request');

                var headers = {
                    'Authorization': authorization
                };


                var options = {
                    url: lyftPath,
                    headers: headers
                };

                function callback(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        res.json(JSON.parse(body));
                    }
                }
                request(options, callback);
            }
        }

        request(options, callback);
    }

    function getETA(req, res) {

        var client_ID = "2JtO2UT8G2qT";
        var secret = "W65W1DP31fceKo4bsU30rNc33Xt9_fes";
        var request = require('request');

        var headers = {
            'Content-Type': 'application/json'
        };

        var dataString = '{"grant_type": "client_credentials", "scope": "public"}';

        var options = {
            url: 'https://api.lyft.com/oauth/token',
            method: 'POST',
            headers: headers,
            body: dataString,
            auth: {
                'user': client_ID,
                'pass': secret
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var token_type = JSON.parse(body).token_type;
                var access_token = JSON.parse(body).access_token;
                var authorization = "TOKEN_TYPE ACCESS_TOKEN";
                authorization = authorization
                    .replace("TOKEN_TYPE", token_type)
                    .replace("ACCESS_TOKEN", access_token);

                var str1 = "";
                var urlBase = "https://api.lyft.com/v1/eta?lat=LAT&lng=LNG";
                var lat = req.query.lat;
                var lng = req.query.lng;

                var lyftPath = urlBase
                    .replace("LAT", lat)
                    .replace("LNG", lng);

                var request = require('request');

                var headers = {
                    'Authorization': 'Bearer gAAAAABY-o6JJojeZqCCuzhaXK2duSviafgYNkdAWq-CvqMPONcv_snRU57x9DsmlLK45KnI0Cu6IAeww2jQUtz-Ej3c9PLsDMZJJ9Mz95i3ufkOxK0rB5dFCjwtTp2KtxKVcMCyrrEzctA-SbpXTiyQ3unigeFTEgcOSNKhdf1PDL2vNmuOtDxTmLr5bz3jE2XopC8qyLcVyHmETJyhPK_gPCv5Z9PSnQ=='
                };

                var options = {
                    url: lyftPath,
                    headers: headers
                };

                function callback(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        res.json(body);
                    }
                }

                request(options, callback);
            }
        }

        request(options, callback);
    }

};