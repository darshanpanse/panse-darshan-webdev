(function () {
    angular
        .module("CatalogApp")
        .controller("ProductListController", ProductListController)
        .controller("ProductViewController", ProductViewController);

    function ProductListController($location, SearchService, $routeParams, NgMap, ActorService) {
        var vm = this;
        vm.search = search;
        vm.searchInStore = searchInStore;
        vm.checkLogProfNav = checkLogProfNav;
        vm.checkLogRegNav = checkLogRegNav;
        vm.backButton = backButton;
        //vm.sortedSearch = sortedSearch;
        //vm.searchLatLng = searchLatLng;
        var radius1 = 10;
        // var radChangeFlag = false;
        // var centerChangeFlag = false;

        function init() {
            vm.productName = $routeParams['productName'];
            vm.location = $routeParams['location'];
            vm.radius = $routeParams['radius'];
            vm.sorting = $routeParams['sorting'];
            vm.price = $routeParams['price'];

            console.log(vm.radius);
            console.log(vm.sorting);
            console.log(vm.price);
            checkLogin();
            googleMapHandler();

            // $('#ex1').slider({
            //     formatter: function(value) {
            //         return 'Current value: ' + value;
            //     }
            // });

            $( function() {
                $( "#slider-radius" )
                    .slider({
                        range: "min",
                        min: 1,
                        max: 20,
                        change: function(event, ui) {
                            vm.radius = ui.value;
                            // radChangeFlag = true;
                            // centerChangeFlag = true;
                            search(vm.productName, vm.location, vm.radius, vm.sorting, vm.price);
                        }
                    })
                    .slider('value', vm.radius);
            });

            // $("#slider-price").slider({
            //     range: true,
            //     min: 30,
            //     max: 120,
            //     step: 1,
            //     values: [30, 120],
            //     slide: function(event, ui) {
            //         var delay = function() {
            //             var handleIndex = $(ui.handle).data('index.uiSliderHandle');
            //             var label = handleIndex == 0 ? '#min' : '#max';
            //             $(label).html('$' + ui.value).position({
            //                 my: 'center top',
            //                 at: 'center bottom',
            //                 of: ui.handle,
            //                 offset: "0, 10"
            //             });
            //         };
            //
            //         // wait for the ui.handle to set its position
            //         setTimeout(delay, 5);
            //     }
            // });
            //
            // $('#min').html('$' + $('#slider-price').slider('values', 0)).position({
            //     my: 'center top',
            //     at: 'center bottom',
            //     of: $('#slider-price a:eq(0)'),
            //     offset: "0, 10"
            // });
            //
            // $('#max').html('$' + $('#slider-price').slider('values', 1)).position({
            //     my: 'center top',
            //     at: 'center bottom',
            //     of: $('#slider-price a:eq(1)'),
            //     offset: "0, 10"
            // });
        }
        init();
        //console.log(vm.radius);

        function backButton() {
            $location.url("/");
        }

        function checkLogProfNav(productName, location, radius, sorting, price) {
            ActorService
                .loggedIn()
                .then(function (actor) {
                    if(actor) {
                        if(actor == "0") {
                            $location.url("/actor/login/product/"+productName+"/location/"+location+"/radius/"+radius+"/sorting/"+sorting+"/price/"+price);
                        } else {
                            $location.url("/actor/profile");
                        }
                    }
                });
        }

        function checkLogRegNav() {
            ActorService
                .loggedIn()
                .then(function (actor) {
                    if(actor) {
                        if(actor == "0") {
                            $location.url("/actor/register");
                        } else {
                            logout();
                        }
                    }
                });
        }

        function checkLogin() {
            //var deferred = $q.defer();
            ActorService
                .loggedIn()
                .then(function (actor) {
                    if(actor) {
                        vm.currentActor = actor;
                        if(actor == "0") {
                            vm.logProf = "login";
                            vm.logReg = "register";
                            vm.logProf_icon = "fa-sign-in";
                            vm.logReg_icon = "fa-user";
                        } else {
                            vm.logProf = "profile";
                            vm.logReg = "logout";
                            vm.logProf_icon = "fa-user";
                            vm.logReg_icon = "fa-sign-out";
                        }
                    }
                });
            //return deferred.promise;
        }

        function logout() {
            ActorService
                .logout()
                .then(function (response) {
                    location.reload();
                    // $location.url("search/product/"+productName+"/location/"+location);
                });
        }

        function search(productName, location, radius, sortMode, price) {
            vm.sorting = sortMode;
            SearchService
                .searchProduct(productName, location, radius, vm.sorting, price)
                .success(function (searchResult) {
                    $location.url("/search/product/"+productName+"/location/"+location+"/radius/"+vm.radius+"/sorting/"+vm.sorting+"/price/"+vm.price);
                    displayStoreInfo(searchResult);
                })
                .error(function () {
                    vm.error = "No products to display";
                });
        }

        function searchLatLng(productName, lat, lng, radius, sortMode, price) {
            SearchService
                .searchProductLatLng(productName, lat, lng, radius, sortMode, price)
                .success(function (searchResult) {
                    displayStoreInfo(searchResult);
                })
                .error(function () {
                    vm.error = "No products to display";
                });
        }
        
        function searchInStore(storeId) {
            for(var s in vm.allGoodzerResults.stores) {
                var store = vm.allGoodzerResults.stores[s];
                if(store.id === storeId) {
                    vm.goodzerResults.stores = [store];
                    break;
                }
            }
        }

        // function sortedSearch(productName, location, radius, sortMode) {
        //     if(sortMode === "distance"){
        //
        //     } else if(sortMode === "price_asc") {
        //         SearchService
        //             .search
        //     } else if(sortMode === "price_desc") {
        //
        //     } else {
        //         console.log("Do Nothing");
        //     }
        // }

        function displayStoreInfo(searchResult) {
            vm.userLocation = searchResult.userLocation;
            vm.goodzerResults = JSON.parse(searchResult.goodzerResults);
            vm.allGoodzerResults = JSON.parse(searchResult.goodzerResults);

            var stores = vm.goodzerResults.stores;
            var prodFound = 0;
            for(var s in stores) {
                prodFound = prodFound + stores[s].products.length;
            }
            vm.productsFound = prodFound;

            vm.storeInfo = [];
            var i = 0;
            for(var s in stores) {
                var storeName = stores[s].name;
                var storeId = stores[s].id;
                var storeLocs =  stores[s].locations;
                for(var loc in stores[s].locations) {
                    vm.storeInfo[i] = {
                        'name': storeName,
                        'address': storeLocs[loc].address,
                        'city': storeLocs[loc].city,
                        'state': storeLocs[loc].state,
                        'lat': storeLocs[loc].lat,
                        'lng': storeLocs[loc].lng
                    };
                    i = i + 1;
                }
            }

            console.log(vm.goodzerResults);
        }

        function googleMapHandler() {
            NgMap
                .getMap()
                .then(function(map) {
                    var circle = map.shapes.circle;
                    circle.addListener('radius_changed', function () {
                        // if(radChangeFlag) {
                        //     radChangeFlag = false;
                        // } else {
                            radChangeFlag = true;
                            centerChangeFlag = true;
                            vm.radius = Math.ceil(circle.radius / 1609.344);
                            search(vm.productName, vm.location, vm.radius, vm.sorting, vm.price);
                        //}
                    });
                    circle.addListener('center_changed', function () {
                        // if(centerChangeFlag) {
                        //     centerChangeFlag = false;
                        // } else {
                            centerChangeFlag = true;
                            searchLatLng(vm.productName, circle.center.lat(), circle.center.lng(), vm.radius, vm.sorting, vm.price);
                            getAddress(circle.center.lat(), circle.center.lng());
                        //}
                    })
                });
        }

        function getAddress(lat, lng) {
            SearchService
                .getAddress(lat, lng)
                .success(function (response) {
                    //console.log(response);
                    vm.location = response.results[0].formatted_address;
                    $location.url("/search/product/"+vm.productName+"/location/"+vm.location+"/radius/"+vm.radius+"/sorting/"+vm.sorting+"/price/"+vm.price);
                    //console.log(vm.location);
                })
                .error(function (error) {
                    console.log(error);
                });
        }
    }

    function ProductViewController($window, $location, $routeParams, SearchService, LyftService, ActorService, ProductService) {
        var vm = this;
        var productId;
        var storeId;
        vm.relatedProductsList = [];
        vm.favourites = [];
        vm.likes = [];
        vm.comments = [];
        vm.selectedDestination = false;
        vm.search = search;
        vm.chooseLocation = chooseLocation;
        vm.chooseRideType = chooseRideType;
        vm.requestLyft = requestLyft;
        vm.addToFavourites = addToFavourites;
        vm.removeFromFavourites = removeFromFavourites;
        vm.addToLikes = addToLikes;
        vm.addToComments = addToComments;
        vm.checkLogProfNav = checkLogProfNav;
        vm.checkLogRegNav = checkLogRegNav;
        vm.backButton = backButton;
        vm.navToOtherProfile = navToOtherProfile;
        vm.getRideTypes = getRideTypes;

        function init() {
            vm.productName = $routeParams['productName'];
            vm.productId = $routeParams['productId'];
            productId = $routeParams['productId'];
            vm.location = $routeParams['location'];
            vm.radius = $routeParams['radius'];
            vm.sorting = $routeParams['sorting'];
            vm.price = $routeParams['price'];
            storeId = $routeParams['storeId'];
            checkLogin();
            getGoodzerResults(storeId, productId);
        }
        init();

        function backButton() {
            $location.url("/search/product/"+vm.productName+"/location/"+vm.location+"/radius/"+vm.radius+"/sorting/"+vm.sorting+"/price/"+vm.price);
        }

        function navToOtherProfile(actorId) {
            ActorService
                .loggedIn()
                .then(function (actor) {
                    if(actor) {
                        if(actor == "0") {
                            console.log("Not logged in");
                        } else {
                            var flag = 0;
                            for(var c in vm.comments) {
                                if(vm.comments[c].user._id == actorId && vm.comments[c].user.accountStatus == 'DELETED') {
                                    flag = 1;
                                    break;
                                }
                            }
                            if(flag == 1){
                                console.log("Account No longer exists");
                            } else {
                                $location.url("/actor/profile/"+actorId+"/product/"+vm.productName+"/"+vm.productId+"/location/"+vm.location+"/store/"+storeId+"/radius/"+vm.radius+"/sorting/"+vm.sorting+"/price/"+vm.price);
                            }
                        }
                    }
                });
        }

        function incrementViews(views, storeId) {
            ProductService
                .incrementViews(vm.product, storeId, views)
                .success(function (response) {
                    console.log("success in increment views");
                    console.log(response);
                })
                .error(function (error) {
                    console.log("error in increment views")
                });
        }

        function getProduct(actor) {      // gets likes, favourites and comments of the current product from local MongoDB
            var comments;
            vm.comments = [];
            ProductService
                .getProduct(productId)
                .success(function (response) {
                    if(response) {
                        console.log("success in getProduct:");
                        vm.favourites = response.favourites;
                        vm.likes = response.likes;
                        comments = response.comments;
                    }
                    else {
                        console.log("nothing in getProduct:");
                        vm.favourites = [];
                        vm.likes = [];
                        comments = [];
                    }
                    vm.isFavourite = 0;
                    vm.isLiked = 0;
                    for(var f in vm.favourites) {
                        if (vm.favourites[f] == actor._id) {
                            vm.isFavourite = 1;
                        }
                    }
                    for(var l in vm.likes) {
                        if(vm.likes[l] == actor._id) {
                            vm.isLiked = 1;
                        }
                    }
                    var userIdsOfComments = [];
                    for(var c in comments) {
                        userIdsOfComments.push(comments[c]._user);
                    }
                    ActorService
                        .findActorsByIds(userIdsOfComments)
                        .success(function (response) {
                            for(var a in response) {
                                vm.comments.push({"user": response[a], "text": comments[a].text, "timestamp": comments[a].timestamp});
                            }
                        })
                        .error(function (error) {
                            console.log("error in comments of actor service");
                        });
                })
                .error(function (error) {
                    console.log("error in getStore");
                });
        }

        function checkLogProfNav(productName, location) {
            ActorService
                .loggedIn()
                .then(function (customer) {
                    if(customer) {
                        if(customer == "0") {
                            $location.url("/actor/login/product/"+productName+"/"+productId+"/location/"+location+"/store/"+storeId+"/radius/"+vm.radius+"/sorting/"+vm.sorting+"/price/"+vm.price);
                        } else {
                            $location.url("/actor/profile");
                        }
                    }
                });
        }

        function checkLogRegNav() {
            ActorService
                .loggedIn()
                .then(function (customer) {
                    if(customer) {
                        if(customer == "0") {
                            $location.url("/actor/register");
                        } else {
                            logout();
                        }
                    }
                });
        }

        function checkLogin() {
            ActorService
                .loggedIn()
                .then(function (actor) {
                    if(actor) {
                        vm.currentActor = actor;
                        if(actor == "0") {
                            vm.logProf = "login";
                            vm.logReg = "register";
                            vm.logProf_icon = "fa-sign-in";
                            vm.logReg_icon = "fa-user";
                        }
                        else {
                            vm.logProf = "profile";
                            vm.logReg = "logout";
                            vm.logProf_icon = "fa-user";
                            vm.logReg_icon = "fa-sign-out";
                        }
                        getProduct(actor);
                    }
                });
        }

        function logout() {
            ActorService
                .logout()
                .then(function (response) {
                    location.reload();
                });
        }

        function search(productName, location) {
            $location.url("/search/product/"+productName+"/location/"+location+"/radius/"+vm.radius+"/sorting/"+vm.sorting+"/price/"+vm.price);
        }

        function addToComments() {
            ActorService
                .loggedIn()
                .then(function (actor) {
                    if(actor) {
                        if(actor == "0") {
                            $location.url("/actor/login/product/"+productName+"/"+productId+"/location/"+location+"/store/"+storeId+"/radius/"+vm.radius+"/sorting/"+vm.sorting+"/price/"+vm.price);
                        }
                        else {
                            ProductService
                                .addActorToProductComments(actor._id, vm.product, vm.text, new Date(), storeId)
                                .success(function (response) {
                                    console.log("success in comment");
                                    console.log(response);
                                    getProduct(actor);
                                })
                                .error(function (error) {
                                    console.log("error");
                                    console.log(error);
                                });
                            ActorService
                                .addProductToActorComments(actor._id, productId, vm.text, new Date())
                                .success(function (response) {
                                    console.log("success");
                                    console.log(response);
                                })
                                .error(function (error) {
                                    console.log("error");
                                    console.log(error);
                                });
                            vm.text = null;
                        }
                    }
                });
        }

        function addToLikes() {
            ActorService
                .loggedIn()
                .then(function (actor) {
                    if(actor) {
                        if(actor == "0") {
                            $location.url("/actor/login/product/"+vm.productName+"/"+productId+"/location/"+vm.location+"/store/"+storeId+"/radius/"+vm.radius+"/sorting/"+vm.sorting+"/price/"+vm.price);
                        }
                        else {
                            var flag = 0;
                            console.log(vm.likes);
                            for(var l in vm.likes) {
                                if(vm.likes[l] == actor._id) {
                                    flag = 1;
                                    break;
                                }
                            }
                            if(flag == 0) {
                                ProductService
                                    .addActorToProductLikes(actor._id, vm.product, storeId)
                                    .success(function (response) {
                                        console.log("success in like");
                                        console.log(response);
                                        getProduct(actor);
                                    })
                                    .error(function (error) {
                                        console.log("error");
                                        console.log(error);
                                    });

                                ActorService
                                    .addProductToActorComments(actor._id, productId)
                                    .success(function (response) {
                                        console.log("success");
                                        console.log(response);
                                    })
                                    .error(function (error) {
                                        console.log("error");
                                        console.log(error);
                                    });
                            }
                        }
                    }
                });
        }

        function removeFromFavourites() {
            ActorService
                .loggedIn()
                .then(function (actor) {
                    if(actor) {
                        if(actor == "0") {
                            $location.url("/actor/login/product/"+vm.productName+"/"+productId+"/location/"+vm.location+"/store/"+storeId+"/radius/"+vm.radius+"/sorting/"+vm.sorting+"/price/"+vm.price);
                        }
                        else {
                            ProductService
                                .findProductById(vm.product.id)
                                .success(function (response) {
                                    ProductService
                                        .removeActorFromProductFavourites(actor._id, response)
                                        .success(function (response) {
                                            console.log("success");
                                            getProduct(actor);
                                        })
                                        .error(function (error) {
                                            console.log("error");
                                            console.log(error);
                                        });

                                    ActorService
                                        .removeProductFromActorFavourites(actor, productId)
                                        .success(function (response) {
                                            console.log("success");
                                            console.log(response);
                                        })
                                        .error(function (error) {
                                            console.log("error");
                                            console.log(error);
                                        });
                                })
                                .error(function (error) {
                                   console.log(error);
                                });



                        }
                    }
                });
        }

        function addToFavourites() {
            ActorService
                .loggedIn()
                .then(function (actor) {
                    if(actor) {
                        if(actor == "0") {
                            $location.url("/actor/login/product/"+vm.productName+"/"+productId+"/location/"+vm.location+"/store/"+storeId+"/radius/"+vm.radius+"/sorting/"+vm.sorting+"/price/"+vm.price);
                        }
                        else {
                            ProductService
                                .addActorToProductFavourites(actor._id, vm.product, storeId)
                                .success(function (response) {
                                    console.log("success");
                                    console.log(response);
                                    getProduct(actor);
                                })
                                .error(function (error) {
                                    console.log("error");
                                    console.log(error);
                                });

                            ActorService
                                .addProductToActorFavourites(actor._id, productId)
                                .success(function (response) {
                                    console.log("success");
                                    console.log(response);
                                })
                                .error(function (error) {
                                    console.log("error");
                                    console.log(error);
                                });
                        }
                    }
                });
        }


        function getGoodzerResults(storeId, productId) {
            SearchService
                .searchProduct(vm.productName, vm.location, vm.radius, vm.sorting, vm.price)
                .success(function (searchResult) {
                    vm.userLocation = searchResult.userLocation;
                    var goodzerResults = JSON.parse(searchResult.goodzerResults);
                    var stores = goodzerResults.stores;
                    for(var s in stores) {
                        if (stores[s].id === storeId) {
                            vm.store = stores[s];
                            vm.locations = stores[s].locations;
                            vm.products = stores[s].products;
                            for (var p in vm.products) {
                                if (vm.products[p].id == productId) {
                                    vm.product = vm.products[p];
                                }
                            }
                        }
                    }
                    if(vm.product.views) {
                        incrementViews(vm.product.views, vm.store.id);
                    }
                    else {
                        incrementViews(0, vm.store.id);
                    }

                    findRelatedProducts(storeId);
                })
                .error(function () {
                    vm.error = "No products to display";
                });
        }

        function login() {
            $location.url();
        }

        function getRideTypes(lat, lng, rideId) {
            LyftService
                .getRideTypes(lat, lng, rideId)
                .success(function (rides) {
                    console.log(rides);
                })
                .error(function () {
                    console.log("error in getting ride types");
                });
        }

        function chooseLocation(location) {
            vm.selectedDestination = true;
            vm.destLocation = location;
            LyftService
                .getETA(vm.userLocation.lat, vm.userLocation.lng)
                .success(function (response) {
                    var eta = JSON.parse(response).eta_estimates;
                    for(var e in eta) {
                        if(eta[e].ride_type == "lyft") {
                            vm.lyftETA = eta[e].eta_seconds;
                            if(vm.lyftETA >= 60) {
                                vm.lyftETA = vm.lyftETA / 60;
                                vm.lyftETA = vm.lyftETA + " min";
                            }
                            else {
                                vm.lyftETA = vm.lyftETA + " sec";
                            }
                        }
                        else if(eta[e].ride_type == "lyft_line") {
                            vm.lyftLineETA = eta[e].eta_seconds;
                            if(vm.lyftLineETA >= 60) {
                                vm.lyftLineETA = vm.lyftLineETA / 60;
                                vm.lyftLineETA = vm.lyftLineETA + " min";
                            }
                            else {
                                vm.lyftLineETA = vm.lyftLineETA + " sec";
                            }
                        }
                        else if(eta[e].ride_type == "lyft_plus") {
                            vm.lyftPlusETA = eta[e].eta_seconds;
                            if(vm.lyftPlusETA >= 60) {
                                vm.lyftPlusETA = vm.lyftPlusETA / 60;
                                vm.lyftPlusETA = vm.lyftPlusETA + " min";
                            }
                            else {
                                vm.lyftPlusETA = vm.lyftPlusETA + " sec";
                            }
                        }
                    }
                })
                .error(function (error) {
                    console.log(error);
                });

            LyftService
                .getCostEstimates("lyft", vm.userLocation.lat, vm.userLocation.lng, vm.destLocation.lat, vm.destLocation.lng)
                .success(function (response) {
                    var lyftCostMin = response.cost_estimates[0].estimated_cost_cents_min/100;
                    var lyftCostMax = response.cost_estimates[0].estimated_cost_cents_max/100;
                    if(lyftCostMax == lyftCostMin) {
                        vm.lyftCost = "$"+lyftCostMax;
                    }
                    else {
                        vm.lyftCost = "$"+lyftCostMin+" - "+"$"+lyftCostMax;
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
            LyftService
                .getCostEstimates("lyft_line", vm.userLocation.lat, vm.userLocation.lng, vm.destLocation.lat, vm.destLocation.lng)
                .success(function (response) {
                    var lyftLineCostMin = response.cost_estimates[0].estimated_cost_cents_min/100;
                    var lyftLineCostMax = response.cost_estimates[0].estimated_cost_cents_max/100;
                    if(lyftLineCostMax == lyftLineCostMin) {
                        vm.lyftLineCost = "$"+lyftLineCostMax;
                    }
                    else {
                        vm.lyftLineCost = "$"+lyftLineCostMin+" - "+"$"+lyftLineCostMax;
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
            LyftService
                .getCostEstimates("lyft_plus", vm.userLocation.lat, vm.userLocation.lng, vm.destLocation.lat, vm.destLocation.lng)
                .success(function (response) {
                    var lyftPlusCostMin = response.cost_estimates[0].estimated_cost_cents_min/100;
                    var lyftPlusCostMax = response.cost_estimates[0].estimated_cost_cents_max/100;
                    if(lyftPlusCostMax == lyftPlusCostMin) {
                        vm.lyftPlusCost = "$"+lyftPlusCostMax;
                    }
                    else {
                        vm.lyftPlusCost = "$"+lyftPlusCostMin+" - "+"$"+lyftPlusCostMax;
                    }
                })
                .error(function (error) {
                    console.log(error);
                });
        }

        function chooseRideType(ride_type) {
            vm.ride_type = ride_type;
        }

        function requestLyft(ride_type) {
            vm.ride_type = ride_type;
            var ride;
            if(ride_type == "LYFT") {
                ride = "lyft";
            }
            else if(ride_type == "LYFT Line") {
                ride = "lyft_line";
            }
            else if(ride_type == "LYFT Plus") {
                ride = "lyft_plus";
            }

            LyftService
                .requestRide(ride, vm.userLocation.lat, vm.userLocation.lng, vm.destLocation.lat, vm.destLocation.lng)
                .success(function (result) {
                    console.log("success: ");
                    console.log(result);
                })
                .error(function (error) {
                    console.log("error: ");
                    console.log(error);
                });
            $window.location.href = "https://api.lyft.com/oauth/authorize?client_id=2JtO2UT8G2qT&scope=public%20profile%20rides.read%20rides.request%20offline&state=ShopSmart&response_type=code";

        }

        function findRelatedProducts(storeId) {
            SearchService
                .findRelatedProducts(storeId,vm.productName,vm.price)
                .success(function (response) {
                    var flag = 0;
                    for(var p1 in response.products){
                        var product1 = response.products[p1];
                        for(var p2 in vm.products) {
                            var product2 = vm.products[p2];
                            if(product1.id == product2.id) {
                                vm.relatedProductsList.push(product1);
                                flag = 1;
                            }
                        }
                    }
                    if(vm.relatedProductsList == []) {
                        vm.relProds = "No Related Products to display";
                    }
                    if(flag == 0) {
                        vm.relProds = "No Related Products to display";
                    }
                })
                .error(function (error) {
                    vm.relProds = "No Related Products to display";
                })
        }


    }

})();