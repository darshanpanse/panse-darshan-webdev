(function () {
    angular
        .module("CatalogApp")
        .controller("StoreController", StoreController);

    function StoreController($window, $location, StoreService, ActorService, SearchService, LyftService, $routeParams) {
        var vm = this;
        var storeId;
        var radius;
        var sorting;
        var price;
        vm.favourites = [];
        vm.likes = [];
        vm.comments = [];
        vm.selectedDestination = false;
        vm.getRideTypes = getRideTypes;
        vm.chooseLocation = chooseLocation;
        vm.chooseRideType = chooseRideType;
        vm.requestLyft = requestLyft;
        vm.search = search;
        vm.addToFavourites = addToFavourites;
        vm.removeFromFavourites = removeFromFavourites;
        vm.addToLikes = addToLikes;
        vm.addToComments = addToComments;
        vm.checkLogProfNav = checkLogProfNav;
        vm.checkLogRegNav = checkLogRegNav;
        vm.backButton = backButton;
        vm.navToOtherProfile = navToOtherProfile;

        function init() {
            vm.productName = $routeParams['productName'];
            vm.location = $routeParams['location'];
            radius = $routeParams['radius'];
            sorting = $routeParams['sorting'];
            price = $routeParams['price'];
            storeId = $routeParams['storeId'];
            checkLogin();
            getGoodzerResults(storeId);
        }
        init();

        function navToOtherProfile(actorId) {
            ActorService
                .loggedIn()
                .then(function (actor) {
                    if(actor) {
                        if(actor == "0") {
                            console.log("Not logged in");
                        } else {
                            $location.url("/actor/profile/"+actorId+"/product/"+vm.productName+"/"+vm.productId+"/location/"+vm.location+"/store/"+storeId+"/radius/"+vm.radius+"/sorting/"+vm.sorting+"/price/"+vm.price);
                        }
                    }
                });
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

        function removeFromFavourites() {
            ActorService
                .loggedIn()
                .then(function (actor) {
                    if(actor) {
                        if(actor == "0") {
                            console.log("Not logged in");
                        }
                        else {
                            StoreService
                                .getStore(storeId)
                                .success(function (response) {
                                    StoreService
                                        .removeActorFromStoreFavourites(actor._id, response)
                                        .success(function (response) {
                                            getStore(actor);
                                        })
                                        .error(function (error) {
                                            console.log("error");
                                            console.log(error);
                                        });

                                    ActorService
                                        .removeStoreFromActorFavourites(actor, storeId)
                                        .success(function (response) {

                                        })
                                        .error(function (error) {
                                            console.log("error");
                                            console.log(error);
                                        });
                                })
                                .error(function (error) {
                                    console.log("error");
                                    console.log(error);
                                });
                        }
                    }
                });
        }

        function backButton() {
            $location.url("/search/product/"+vm.productName+"/location/"+vm.location+"/radius/"+radius+"/sorting/"+sorting+"/price/"+price);
        }

        function incrementViews(views) {
            StoreService
                .incrementViews(vm.store, views)
                .success(function (response) {
                    console.log("success in increment views");
                    console.log(response);
                })
                .error(function (error) {
                    console.log(error);
                    console.log("error in increment views");
                });
        }

        function getStore(actor) {      // gets likes, favourites and comments of the current store from local MongoDB
            var comments;
            vm.comments = [];
            StoreService
                .getStore(storeId)
                .success(function (response) {
                    if(response) {
                        console.log("success in getStore:");
                        vm.favourites = response.favourites;
                        vm.likes = response.likes;
                        comments = response.comments;
                    }
                    else {
                        console.log("nothing in getStore:");
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
                .then(function (actor) {
                    if(actor) {
                        if(actor == "0") {
                            $location.url("/actor/login/product/"+productName+"/"+storeId+"/location/"+location+"/store/"+storeId+"/radius/"+radius+"/sorting/"+sorting+"/price/"+price);
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
            ActorService
                .loggedIn()
                .then(function (actor) {
                    if(actor) {
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
                    }
                    getStore(actor);
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
            $location.url("/search/product/"+productName+"/location/"+location+"/radius/"+radius+"/sorting/"+sorting+"/price/"+price);
        }

        function addToComments() {
            ActorService
                .loggedIn()
                .then(function (actor) {
                    if(actor) {
                        if(actor == "0") {
                            $location.url("/actor/login/product/"+productName+"/"+storeId+"/location/"+location+"/store/"+storeId+"/radius/"+radius+"/sorting/"+sorting+"/price/"+price);
                        }
                        else {
                            StoreService
                                .addActorToStoreComments(actor._id, vm.store, vm.text, new Date())
                                .success(function (response) {
                                    getStore(actor);
                                    console.log("success in comment");
                                    console.log(response);
                                })
                                .error(function (error) {
                                    console.log("error");
                                    console.log(error);
                                });

                            ActorService
                                .addStoreToActorComments(actor._id, storeId, vm.text, new Date())
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
                            $location.url("/actor/login/product/"+productName+"/"+storeId+"/location/"+location+"/store/"+storeId+"/radius/"+radius+"/sorting/"+sorting+"/price/"+price);
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
                                StoreService
                                    .addActorToStoreLikes(actor._id, vm.store)
                                    .success(function (response) {
                                        getStore(actor);
                                        console.log("success in like");
                                        console.log(response);
                                    })
                                    .error(function (error) {
                                        console.log("error");
                                        console.log(error);
                                    });

                                ActorService
                                    .addStoreToActorLikes(actor._id, storeId)
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

        function addToFavourites() {
            ActorService
                .loggedIn()
                .then(function (actor) {
                    if(actor) {
                        if(actor == "0") {
                            $location.url("/actor/login/product/"+productName+"/"+storeId+"/location/"+location+"/store/"+storeId+"/radius/"+radius+"/sorting/"+sorting+"/price/"+price);
                        }
                        else {
                            StoreService
                                .addActorToStoreFavourites(actor._id, vm.store)
                                .success(function (response) {
                                    getStore(actor);
                                    console.log("success");
                                    console.log(response);
                                })
                                .error(function (error) {
                                    console.log("error");
                                    console.log(error);
                                });

                            ActorService
                                .addStoreToActorFavourites(actor._id, storeId)
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

        function getGoodzerResults(storeId) {
            SearchService
                .searchProduct(vm.productName, vm.location, radius, sorting, price)
                .success(function (searchResult) {
                    vm.userLocation = searchResult.userLocation;
                    var goodzerResults = JSON.parse(searchResult.goodzerResults);

                    var stores = goodzerResults.stores;
                    for(var s in stores) {
                        if (stores[s].id === storeId) {
                            vm.store = stores[s];
                        }
                    }
                    if(vm.store.views){
                        incrementViews(vm.store.views);
                    }
                    else {
                        incrementViews(0);
                    }

                })
                .error(function () {
                    vm.error = "No products to display";
                });
        }

    }
})();