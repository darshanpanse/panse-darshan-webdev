(function () {
    angular
        .module("CatalogApp")
        .controller("LoginMainPageController", LoginMainPageController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileSelfController", ProfileSelfController)
        .controller("LoginProductListController", LoginProductListController)
        .controller("LoginProductViewController", LoginProductViewController)
        .controller("LoginStoreViewController", LoginStoreViewController)
        .controller("ProfileOtherController", ProfileOtherController)
        .controller("StoreOwnerController", StoreOwnerController);

    function StoreOwnerController(currentOwner, $routeParams, StoreService, ActorService, ProductService) {
        var vm = this;
        var storeId = currentOwner.storeId;
        vm.actor = currentOwner;
        vm.storeViews = 0;
        vm.storeFavourites = 0;
        vm.storeLikes = 0;
        vm.storeComments = [];
        vm.addToStoreComments = addToStoreComments;
        vm.addToProductComments = addToProductComments;
        function init() {
            getStore();
            getProducts();
        }
        init();

        function addToProductComments($index) {
            console.log(vm.text[$index]);
            ProductService
                .getProduct(vm.productComments[$index].commentProduct.apiID)
                .success(function (response) {
                    vm.product = response;
                    console.log(response);
                    ProductService
                        .addActorToProductComments(vm.actor._id, vm.product, vm.text[$index], Date.now(), storeId)
                        .success(function (response) {
                            console.log(response);
                            getProducts();
                        })
                        .error(function (error) {
                            console.log("error");
                            console.log(error);
                        });
                    ActorService
                        .addProductToActorComments(vm.actor._id, vm.product.apiID, vm.text[$index], Date.now())
                        .success(function (response) {
                            console.log(response);
                        })
                        .error(function (error) {
                            console.log("error");
                            console.log(error);
                        });
                    vm.text = null;
                })
                .error(function (error) {
                    console.log("error");
                    console.log(error);
                })
        }



        function addToStoreComments() {
            StoreService
                .getStore(storeId)
                .success(function (response) {
                    vm.store = response;
                    console.log(vm.store);
                    StoreService
                        .addActorToStoreComments(vm.actor._id, vm.store, vm.text, new Date())
                        .success(function (response) {
                            getStore();
                            console.log("success in comment");
                            console.log(response);
                        })
                        .error(function (error) {
                            console.log("error");
                            console.log(error);
                        });

                    ActorService
                        .addStoreToActorComments(vm.actor._id, storeId, vm.text, new Date())
                        .success(function (response) {
                            console.log("success");
                            console.log(response);
                        })
                        .error(function (error) {
                            console.log("error");
                            console.log(error);
                        });
                    vm.text = null;
                })
                .error(function (error) {
                    console.log("error!!");
                    console.log(error);
                });
        }

        function getStore() {
            var storeComments;
            StoreService
                .getStore(storeId)
                .success(function (response) {
                    if(response) {
                        console.log(response);
                        vm.storeViews = response.views;
                        vm.storeFavourites = response.favourites.length;
                        vm.storeLikes = response.likes.length;
                        storeComments = response.comments;
                    }
                    else {
                        console.log("nothing in getStore:");
                        vm.storeViews = 0;
                        vm.storeFavourites = 0;
                        vm.storeLikes = 0;
                        storeComments = [];
                    }
                    var userIdsOfComments = [];
                    for(var c in storeComments) {
                        userIdsOfComments.push(storeComments[c]._user);
                    }
                    console.log(storeComments);
                    if(userIdsOfComments.length > 0) {
                        ActorService
                            .findActorsByIds(userIdsOfComments)
                            .success(function (response) {
                                vm.storeComments = [];
                                for(var a in response) {
                                    vm.storeComments.push({"user": response[a], "text": storeComments[a].text, "timestamp": storeComments[a].timestamp});
                                }
                                console.log(vm.storeComments);
                            })
                            .error(function (error) {
                                console.log(error);
                            });
                    }
                    else {
                        vm.storeComments = [];
                    }
                })
                .error(function (error) {
                    console.log("error in getStore in storeowner");
                });
        }

        function getProducts() {
            var productComments = [];
            var userIdsOfComments = [];
            vm.productComments = [];
            ProductService
                .getProductsForStore(vm.actor.storeId)
                .success(function (response) {
                    vm.products = response;
                    for(var p in vm.products) {
                        var temp = [];
                        for(var c in vm.products[p].comments) {
                            temp.push(vm.products[p].comments[c]._user);
                        }
                        userIdsOfComments.push(temp);
                    }
                    var users = [];
                    if(userIdsOfComments.length > 0) {
                        ActorService
                            .findActorsByArraysOfIds(userIdsOfComments)
                            .success(function (response) {
                                users = response;
                                for(var p in users) {
                                    var temp = [];
                                    for (var c in vm.products[p].comments) {
                                        temp.push({
                                            "user": users[p][c],
                                            "text": vm.products[p].comments[c].text,
                                            "timestamp": vm.products[p].comments[c].timestamp
                                        });
                                    }
                                    productComments.push(temp);
                                }
                                for(var p in productComments) {
                                    vm.productComments.push({"commentProduct": vm.products[p], "commentUser": productComments[p]});
                                }
                            })
                            .error(function (error) {
                                console.log("ERROR");
                            });
                    }
                    else {
                        vm.productComments = [];
                    }

                })
                .error(function (error) {
                    console.log("error in getProductsForStore");
                    console.log(error);
                })
        }
    }
    
    function LoginMainPageController($routeParams, $location, ActorService) {
        var vm = this;
        vm.login = login;
        vm.backButton = backButton;

        function login(actor) {
            ActorService
                .findActorByCredentials(actor)
                .success(function (loginActor) {
                    $location.url("/");
                })
                .error(function () {
                    vm.error = "Incorrect Username or Password";
                    console.log(vm.error);
                });
        }

        function backButton() {
            $location.url("/");
        }
    }

    function LoginProductListController($routeParams, $location, ActorService) {
        var vm = this;
        vm.login = login;
        vm.backButton = backButton;
        var productName = $routeParams['productName'];
        var location = $routeParams['location'];
        var radius = $routeParams['radius'];
        var sorting = $routeParams['sorting'];
        var price = $routeParams['price'];

        function login(actor) {
            ActorService
                .findActorByCredentials(actor)
                .success(function (loginActor) {
                    $location.url("/search/product/"+productName+"/location/"+location+"/radius/"+radius+"/sorting/"+sorting+"/price/"+price);
                })
                .error(function () {
                    vm.error = "Incorrect Username or Password";
                    console.log(vm.error);
                });
        }

        function backButton() {
            $location.url("/search/product/"+productName+"/location/"+location);
        }
    }

    function LoginProductViewController($routeParams, $location, ActorService) {
        var vm = this;
        vm.login = login;
        vm.backButton = backButton;
        var productName = $routeParams['productName'];
        var productId = $routeParams['productId'];
        var location = $routeParams['location'];
        var storeId = $routeParams['storeId'];
        var radius = $routeParams['radius'];
        var sorting = $routeParams['sorting'];
        var price = $routeParams['price'];


        function login(actor) {
            ActorService
                .findActorByCredentials(actor)
                .success(function (loginActor) {
                    $location.url("/product/"+productName+"/"+productId+"/location/"+location+"/store/"+storeId+"/radius/"+radius+"/sorting/"+sorting+"/price/"+price);
                })
                .error(function () {
                    vm.error = "Incorrect Username or Password";
                    console.log(vm.error);
                });
        }

        function backButton() {
            $location.url("/product/"+productName+"/"+productId+"/location/"+location+"/store/"+storeId+"/radius/"+radius+"/sorting/"+sorting+"/price/"+price);
        }
    }

    function LoginStoreViewController($routeParams, $location, ActorService) {
        var vm = this;
        vm.login = login;
        vm.backButton = backButton;
        var productName = $routeParams['productName'];
        var productId = $routeParams['productId'];
        var location = $routeParams['location'];
        var storeId = $routeParams['storeId'];
        var radius = $routeParams['radius'];
        var sorting = $routeParams['sorting'];
        var price = $routeParams['price'];

        function login(actor) {
            ActorService
                .findActorByCredentials(actor)
                .success(function (loginActor) {
                    $location.url("/store/"+productName+"/"+productId+"/location/"+location+"/store/"+storeId+"/radius/"+radius+"/sorting/"+sorting+"/price/"+price);
                })
                .error(function () {
                    vm.error = "Incorrect Username or Password";
                    console.log(vm.error);
                });
        }

        function backButton() {
            $location.url("/store/"+productName+"/"+productId+"/location/"+location+"/store/"+storeId+"/radius/"+radius+"/sorting/"+sorting+"/price/"+price);
        }
    }

    function ProfileOtherController(currentActor, ActorService, $location, ProductService, $routeParams, StoreService) {
        var vm = this;
        vm.currentActor = currentActor;
        var actorId;
        vm.addToFollowing = addToFollowing;
        vm.removeFromFollowing = removeFromFollowing;

        function init() {
            actorId = $routeParams['actorId'];
            findActorById();
        }

        init();

        function removeFromFollowing() {
            ActorService
                .removeFromFollowing(vm.currentActor, actorId) //remove actor from current actor's following
                .success(function (response) {
                    getFollowing();
                    location.reload();
                })
                .error(function (error) {
                    console.log(error);
                });
            ActorService
                .removeFromFollowers(vm.currentActor._id, vm.actor) //remove current actor from actor's followers
                .success(function (response) {
                    getFollowers();
                    location.reload();
                })
                .error(function (error) {
                    console.log(error);
                });
        }

        function findActorById() {
            ActorService
                .findActorById(actorId)
                .success(function (response) {
                    if(response.accountStatus == 'DELETED') {
                        console.log("Account no longer exists");
                    } else {
                        vm.actor = response;
                        getFollowers();
                        getFollowing();
                        getFavProductsByIds();
                        getFavStoresByIds();
                    }
                })
                .error(function (error) {
                    console.log("error")
                })
        }

        function getFavStoresByIds() {
            StoreService
                .getStoresByIds(vm.actor.favourite_stores)
                .success(function (favStores) {
                    vm.favStores = favStores;
                    console.log(vm.favStores);
                })
                .error(function () {
                    console.log("Could not find favourite stores");
                });
        }

        function getFavProductsByIds() {
            console.log(vm.actor.favourite_products);
            ProductService
                .getProductsByIds(vm.actor.favourite_products)
                .success(function (favProds) {
                    vm.favProducts = favProds;
                })
                .error(function () {
                    console.log("could not find products");
                });
        }

        function getFollowers() {
            if(vm.actor.followers.length > 0) {
                console.log("a");
                ActorService
                    .findActorsByIds(vm.actor.followers)
                    .success(function (actors) {
                        vm.followers = actors;
                        console.log(actors);
                        isFollowing();         //whether currentActor is following vm.actor
                    })
                    .error(function (error) {
                        console.log(error);
                        vm.isFollowing = 0;
                    });
            }
            else {
                console.log("b");
                vm.actor.followers = [];
                vm.isFollowing = 0;
            }

        }

        function getFollowing() {
            if(vm.actor.following.length > 0) {
                ActorService
                    .findActorsByIds(vm.actor.following)
                    .success(function (actors) {
                        vm.following = actors;
                        console.log(actors);
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            }
            else {
                vm.actor.following = [];
            }
        }

        function isFollowing() {
            console.log(vm.followers);
            vm.isFollowing = 0;
            for (var f in vm.followers) {
                if (vm.followers[f]._id == vm.currentActor._id) {
                    vm.isFollowing = 1;
                }
            }
        }

        function addToFollowing() {
            ActorService
                .addToFollowing(vm.currentActor._id, vm.actor._id)  //add actor to currentActor's following
                .success(function (response) {
                    getFollowing();
                    console.log(response);
                })
                .error(function (error) {
                    console.log("error");
                    console.log(error);
                });
            ActorService
                .addToFollowers(vm.currentActor._id, vm.actor._id) //add currentActor to actor's followers
                .success(function (response) {
                    vm.actor.followers.push(vm.currentActor._id);
                    getFollowers();
                    console.log(response);
                })
                .error(function (error) {
                    console.log("error");
                    console.log(error);
                });
        }
    }

    function RegisterController($location, ActorService) {
        var vm = this;
        vm.register = register;
        vm.showInput = showInput;
        vm.hideInput = hideInput;
        vm.backButton = backButton;
        var role;
        vm.storeOwnerSelected = false;

        function showInput() {
            role = 'STOREOWNER';
            vm.storeOwnerSelected = true;
        }

        function hideInput() {
            role = 'CUSTOMER';
            vm.storeOwnerSelected = false;
        }

        function register(newActor) {
            newActor.role = role;
            vm.passwordsMatch = false;
            if(newActor.role == 'STOREOWNER') {
                newActor.requestStatus = 'PENDING';
            } else {
                newActor.requestStatus = 'APPROVED';
            }

            if(newActor.password === newActor.confirmPassword) {
                vm.passwordsMatch = true;
                newActor.accountStatus = 'EXISTS';
                ActorService
                    .findActorByUsername(newActor.username)
                    .success(function (actor) {
                        vm.message = "This Username is taken";
                    })
                    .error(function () {
                        ActorService
                            .register(newActor)
                            .success(function (actor) {
                                if(actor.role == 'CUSTOMER') {
                                    $location.url("/actor/profile");
                                } else {
                                    $location.url("/store-owner/registration/status");
                                }
                            })
                            .error(function () {
                                vm.error = "Could not register. Server not responding"
                            });
                    });
            }
            // else {
            //     vm.error = "Passwords do not match"
            // }
        }

        function backButton() {
            $location.url("/");
        }
    }
    
    function ProfileSelfController(currentActor, ActorService, $location, ProductService, StoreService) {
        var vm = this;
        vm.logout = logout;
        vm.disableReadOnly = disableReadOnly;
        // vm.enableState = enableState;
        vm.fav_products = [];
        vm.search = search;
        // vm.enableRadio = enableRadio;
        vm.changePassword = changePassword;
        vm.cancelChangePassword = cancelChangePassword;
        vm.updateProfile = updateProfile;
        vm.deleteAccount = deleteAccount;
        // $(".radio").attr('disabled', true);

        function init() {
            getCurrentActor(currentActor._id);
        }
        init();

        function deleteAccount() {
            ActorService
                .deleteAccount(vm.actor._id)
                .success(function (actor) {
                    vm.message = "Account deleted successfully!";
                    logout();
                })
                .error(function () {
                    vm.error = "Could not delete account";
                });
        }

        function updateProfile(actor) {
            ActorService
                .updateProfile(actor)
                .success(function (actor) {
                    vm.message = "Profile updated successfully!";
                    location.reload();
                    // $location.url("/actor/profile");
                })
                .error(function () {
                    vm.error = "Could not update profile";
                });
        }

        function changePassword(oldPassword, newPassword, confirmPassword) {
            if(newPassword != confirmPassword) {

            } else {
                ActorService
                    .verifyActorByPassword(vm.actor._id, oldPassword)
                    .success(function (response) {
                        ActorService
                            .changePassword(vm.actor._id, newPassword)
                            .success(function (response) {
                                location.reload();
                                vm.message = "Password Changed Successfully";
                            })
                            .error(function () {
                                vm.message = "Could not change Password";
                            })
                    })
                    .error(function () {

                    });
            }
        }

        function cancelChangePassword() {
            vm.oldPassword = null;
            vm.newPassword = null;
            vm.confirmPassword = null;
        }

        function search(productName, location) {
            $location.url("/search/product/"+productName+"/location/"+location+"/radius/10/sorting/relevance/price/0:1000");
        }

        function getCurrentActor(currentActorId) {
            ActorService
                .findActorById(currentActorId)
                .success(function (actor) {
                    vm.actor = actor;
                    getFollowers();
                    getFollowing();
                    getFavProductsByIds();
                    getFavStoresByIds();
                })
                .error(function () {
                    vm.error = "Could not get Actor info";
                });
        }

        function getFavStoresByIds() {
            if(vm.actor.favourite_stores.length > 0) {
                StoreService
                    .getStoresByIds(vm.actor.favourite_stores)
                    .success(function (favStores) {
                        vm.favStores = favStores;
                        console.log(vm.favStores);
                    })
                    .error(function () {
                        console.log("Could not find favourite stores");
                    });
            }
            else {
                vm.actor.favourite_stores = [];
            }

        }

        function getFavProductsByIds() {
            if(vm.actor.favourite_products.length > 0) {
                console.log("1");
                ProductService
                    .getProductsByIds(vm.actor.favourite_products)
                    .success(function (favProds) {
                        vm.favProducts = favProds;
                    })
                    .error(function () {
                        console.log("could not find products");
                    });
            }
            else  {
                console.log("2");
                vm.actor.favourite_products = [];
            }

        }

        function getFollowers() {
            console.log(vm.actor.followers);
            if(vm.actor.followers.length > 0) {
                console.log("3");
                ActorService
                    .findActorsByIds(vm.actor.followers)
                    .success(function (actors) {
                        vm.followers = actors;
                        console.log(actors);
                        isFollowing();         //whether currentActor is following vm.actor
                    })
                    .error(function (error) {
                        vm.isFollowing = 0;
                    });
            }
            else {
                console.log("4");
                vm.actor.followers = [];
            }

        }

        function getFollowing() {
            console.log(vm.actor.following);
            if(vm.actor.following.length > 0) {
                ActorService
                    .findActorsByIds(vm.actor.following)
                    .success(function (actors) {
                        vm.following = actors;
                        console.log(actors);
                    })
                    .error(function (error) {
                        console.log(error);
                    });
            }
            else  {
                vm.actor.following = [];
            }
        }

        function disableReadOnly(id) {

            if(id == "state") {
                $("#state").prop('disabled', false).focus();
            }
            else if(id == "gender") {
                $('.radio').attr('disabled', false);
            }
            else {
                document.getElementById(id+"1").readOnly = false;
                document.getElementById(id+"1").focus();
            }

            var $elem1 = $("#"+id+"2");
            $elem1.addClass("col-xs-12").removeClass("col-xs-9 col-sm-10");

            var $elem2 = $("#"+id+"3");
            $elem2.hide();
        }

        function logout() {
            ActorService
                .logout()
                .then(function (response) {
                    $location.url("/");
                });
        }
    }
})();