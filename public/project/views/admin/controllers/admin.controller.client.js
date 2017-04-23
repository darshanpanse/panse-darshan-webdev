(function () {
    angular
        .module("CatalogApp")
        .controller("AdminController", AdminController)
        .controller("AdminCustomerProfileController", AdminCustomerProfileController)
        .controller("AdminOwnerProfileController", AdminOwnerProfileController);

    function AdminController($location, ActorService, StoreService) {
        var vm = this;
        vm.getCustomerProfile = getCustomerProfile;
        vm.getOwnerProfile = getOwnerProfile;
        vm.acceptRegistrationRequest = acceptRegistrationRequest;
        vm.declineRegistrationRequest = declineRegistrationRequest;
        vm.deleteAccount = deleteAccount;
        vm.logout = logout;
        vm.showCustomerTable = false;
        vm.showStoreOwnerTable = false;
        vm.showRequestsTable = false;

        function init() {
            findAllCustomers();
            findAllStoreOwners();
            findAllRegistrationRequests();
        }
        init();

        function logout() {
            ActorService
                .logout()
                .then(function (response) {
                    $location.url("/");
                });
        }

        function deleteAccount(actorId) {
            ActorService
                .deleteAccount(actorId)
                .success(function (actor) {
                    console.log("hello");
                    vm.message = "Account deleted successfully!";
                    findAllCustomers();
                    findAllStoreOwners();
                    findAllRegistrationRequests();
                    //$location.url("/actor/admin");
                })
                .error(function () {
                    vm.error = "Could not delete account";
                });
        }

        function declineRegistrationRequest(requestId) {
            ActorService
                .removeRegistrationRequest(requestId)
                .success(function (response) {
                    //location.reload();
                    //$location.url("/actor/admin");
                    findAllCustomers();
                    findAllStoreOwners();
                    findAllRegistrationRequests();
                })
                .error(function () {

                });
        }

        function acceptRegistrationRequest(request) {
            request.requestStatus = 'APPROVED';
            ActorService
                .createActor(request)
                .success(function (response) {
                    StoreService
                        .getStore(request.storeId)
                        .success(function (response) {
                            var store = response;
                            store._owner = response._id;
                            StoreService
                                .updateStore(store)
                                .success(function (response) {
                                    findAllCustomers();
                                    findAllStoreOwners();
                                    findAllRegistrationRequests();
                                })
                                .error(function () {
                                    console.log("could not update store");
                                });
                        })
                        .error(function () {
                            var store = {apiID: request.storeId, name: request.storeName, _owner: response._id};
                            StoreService
                                .createStore(store)
                                .success(function (response) {
                                    ActorService
                                        .removeRegistrationRequest(request._id)
                                        .success(function () {
                                            // location.reload();
                                            // $location.url("/actor/admin");
                                            findAllCustomers();
                                            findAllStoreOwners();
                                            findAllRegistrationRequests();
                                        })
                                        .error(function () {
                                            vm.error = "Could not delete request";
                                        });
                                })
                                .error(function () {
                                    vm.error = "Could not create store";
                                });
                        });
                })
                .error(function () {
                    vm.error = "Could not create store owner";
                })
        }

        function getCustomerProfile(customerId) {
            $location.url("/admin/customer/profile/"+customerId);
        }

        function getOwnerProfile(ownerId) {
            $location.url("/admin/owner/profile/"+ownerId);
        }

            function findAllRegistrationRequests() {
            ActorService
                .findAllRegistrationRequests()
                .success(function (requests) {
                    vm.showCustomerTable = false;
                    vm.showStoreOwnerTable = false;
                    vm.showRequestsTable = true;
                    vm.allRequests = requests;
                    console.log(vm.allRequests);
                })
                .error(function (error) {
                    vm.error = "Could not get request info.";
                });
        }

        function findAllCustomers() {
            ActorService
                .findAllCustomers()
                .success(function (customers) {
                    vm.showStoreOwnerTable = false;
                    vm.showRequestsTable = false;
                    vm.showCustomerTable = true;
                    vm.allCustomers = customers;
                })
                .error(function (error) {
                    vm.error = "Could not get customer info.";
                });
        }

        function findAllStoreOwners() {
            ActorService
                .findAllStoreOwners()
                .success(function (owners) {
                    vm.showCustomerTable = false;
                    vm.showRequestsTable = false;
                    vm.showStoreOwnerTable = true;
                    vm.allOwners = owners;
                })
                .error(function (error) {
                    vm.error = "Could not get owners info.";
                });
        }
    }

    function AdminCustomerProfileController($location, $routeParams, ActorService, ProductService, StoreService) {
        var vm = this;
        var customerId = $routeParams['customerId'];
        vm.logout = logout;
        vm.disableReadOnly = disableReadOnly;
        vm.enableState = enableState;
        vm.favProducts = [];
        vm.search = search;
        vm.enableRadio = enableRadio;
        vm.changePassword = changePassword;
        vm.cancelChangePassword = cancelChangePassword;
        vm.updateProfile = updateProfile;
        vm.deleteAccount = deleteAccount;
        $(".radio").attr('disabled', true);

        function init() {
            getCurrentActor(customerId);
        }
        init();

        function deleteAccount() {
            ActorService
                .deleteAccount(vm.actor._id)
                .success(function (actor) {
                    vm.message = "Account deleted successfully!";
                    $location.url("/actor/admin");
                })
                .error(function () {
                    vm.error = "Could not delete account";
                });
        }

        function updateProfile(actor) {
            ActorService
                .updateProfile(actor)
                .success(function (response) {
                    vm.message = "Profile updated successfully!";
                    location.reload();
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
            $location.url("/search/product/"+productName+"/location/"+location);
        }

        function getCurrentActor(currentActorId) {
            ActorService
                .findActorById(currentActorId)
                .success(function (actor) {
                    vm.actor = actor;
                    // if(vm.actor.favourite_products.length > 0)
                    // {
                    //     ProductService
                    //         .getProductsByIds(vm.actor.favourite_products)
                    //         .success(function (products) {
                    //             vm.fav_products = products;
                    //         })
                    //         .error(function () {
                    //             vm.error = "Could not get favourite products";
                    //         });
                    // } else {
                    //     vm.message = "No products to display";
                    // }
                    //
                    // if(vm.actor.favourite_stores.length > 0)
                    // {
                    //     StoreService
                    //         .getStoresByIds(vm.actor.favourite_stores)
                    //         .success(function (stores) {
                    //             vm.fav_stores = stores;
                    //         })
                    //         .error(function () {
                    //             vm.error = "Could not get favourite stores";
                    //         });
                    // } else {
                    //     vm.message = "No stores to display";
                    // }

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

        function getFollowing() {
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

        function enableRadio() {
            $('.radio').attr('disabled', false);
        }

        function enableState() {
            $('#state').prop('disabled', false);
        }

        function disableReadOnly(id) {
            document.getElementById(id).readOnly = false;
        }

        function logout() {
            ActorService
                .logout()
                .then(function (response) {
                    $location.url("/");
                });
        }


    }

    function AdminOwnerProfileController($routeParams, ActorService, StoreService, ProductService) {
        var vm = this;
        var ownerId = $routeParams['ownerId'];
        var storeId;
        vm.storeViews = 0;
        vm.storeFavourites = 0;
        vm.storeLikes = 0;
        vm.storeComments = [];
        vm.addToStoreComments = addToStoreComments;
        vm.addToProductComments = addToProductComments;
        vm.logout = logout;

        function init() {
            ActorService
                .findActorById(ownerId)
                .success(function (owner) {
                    vm.actor = owner;
                    storeId = owner.storeId;
                    getStore();
                    getProducts();
                })
                .error(function () {
                    vm.error = "Cannot find owner";
                });
        }init();

        function logout() {
            ActorService
                .logout()
                .then(function (response) {
                    $location.url("/");
                });
        }

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
})();