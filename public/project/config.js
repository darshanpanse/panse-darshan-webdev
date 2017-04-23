(function () {
    angular
        .module('CatalogApp')
        .config(Config);

    function Config($routeProvider) {
        $routeProvider
            .when("/actor/login", {
                templateUrl: "views/actor/templates/login.view.client.html",
                resolve: {
                    currentActor: checkLoginForLoginRegister
                },
                controller: "LoginMainPageController",
                controllerAs: "model"
            })
            .when("/actor/login/product/:productName/location/:location/radius/:radius/sorting/:sorting/price/:price", {
                templateUrl: "views/actor/templates/login.view.client.html",
                resolve: {
                    currentActor: checkLoginForLoginRegister
                },
                controller: "LoginProductListController",
                controllerAs: "model"
            })
            .when("/actor/login/product/:productName/:productId/location/:location/store/:storeId/radius/:radius/sorting/:sorting/price/:price", {
                templateUrl: "views/actor/templates/login.view.client.html",
                resolve: {
                    currentActor: checkLoginForLoginRegister
                },
                controller: "LoginProductViewController",
                controllerAs: "model"
            })
            .when("/actor/login/store/:productName/:productId/location/:location/store/:storeId/radius/:radius/sorting/:sorting/price/:price", {
                templateUrl: "views/actor/templates/login.view.client.html",
                resolve: {
                    currentActor: checkLoginForLoginRegister
                },
                controller: "LoginStoreViewController",
                controllerAs: "model"
            })
            .when("/", {
                templateUrl: "views/main/templates/main.view.client.html",
                controller: "MainPageController",
                controllerAs: "model"
            })
            .when("/actor/register", {
                templateUrl: "views/actor/templates/register.view.client.html",
                resolve: {
                    currentActor: checkLoginForLoginRegister
                },
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/actor/profile", {
                templateUrl: "views/actor/templates/profile-self.view.client.html",
                resolve: {
                    currentActor: checkLoginForProfile
                },
                controller: "ProfileSelfController",
                controllerAs: "model"
            })
            .when("/search/product/:productName/location/:location/radius/:radius/sorting/:sorting/price/:price", {
                templateUrl: "views/product/templates/list.view.client.html",
                controller: "ProductListController",
                controllerAs: "model"
            })
            .when("/product/:productName/:productId/location/:location/store/:storeId/radius/:radius/sorting/:sorting/price/:price", {
                templateUrl: "views/product/templates/item.view.client.html",
                controller: "ProductViewController",
                controllerAs: "model"
            })
            .when("/store/:productName/:productId/location/:location/store/:storeId/radius/:radius/sorting/:sorting/price/:price", {
                templateUrl: "views/store/templates/store.view.client.html",
                controller: "StoreController",
                controllerAs: "model"
            })
            .when("/admin/login", {
                templateUrl: "views/admin/templates/admin-login.view.client.html",
                controller: "AdminLoginController",
                controllerAs: "model"
            })
            .when("/admin/customer/profile/:customerId", {
                templateUrl: "views/admin/templates/admin-customer-profile.view.client.html",
                resolve: {
                    currentActor: isAdmin
                },
                controller: "AdminCustomerProfileController",
                controllerAs: "model"
            })
            .when("/admin/owner/profile/:ownerId", {
                templateUrl: "views/admin/templates/admin-owner-profile.view.client.html",
                resolve: {
                    currentActor: isAdmin
                },
                controller: "AdminOwnerProfileController",
                controllerAs: "model"
            })
            .when("/product/:productName/location/:location/store/:storeId", {
                templateUrl: "views/store/templates/store.view.client.html",
                controller: "StoreController",
                controllerAs: "model"
            })
            .when("/actor/admin", {
                templateUrl: "views/admin/templates/admin.view.client.html",
                resolve: {
                    adminActor: isAdmin
                },
                controller: "AdminController",
                controllerAs: "model"
            })
            .when("/store-owner/registration/status", {
                templateUrl: "views/actor/templates/registration-status.view.client.html",
                resolve: {
                    registeredOwner: isRegisteredOwner
                }
            })
            .when("/actor/storeowner", {
                templateUrl: "views/owner/templates/owner-profile.view.client.html",
                resolve: {
                    currentOwner: isRegisteredOwner
                },
                controller: "StoreOwnerController",
                controllerAs: "model"
            })
            .when("/actor/profile/:actorId/product/:productName/:productId/location/:location/store/:storeId/radius/:radius/sorting/:sorting/price/:price", {
                templateUrl: "views/actor/templates/profile-other.view.client.html",
                resolve: {
                    currentActor: checkLoginForProfile
                },
                controller: "ProfileOtherController",
                controllerAs: "model"
            });
    }

    function checkLoginForProfile($q, ActorService, $location) {
        var deferred = $q.defer();
        ActorService
            .loggedIn()
            .then(function (actor) {
                if(actor) {
                    if(actor == "0") {
                        deferred.reject();
                        $location.url("/actor/login");
                    }
                    deferred.resolve(actor);
                }
            });
        return deferred.promise;
    }

    function checkLoginForLoginRegister($q, ActorService, $location) {
        var deferred = $q.defer();
        ActorService
            .loggedIn()
            .then(function (actor) {
                if(actor) {
                    if(actor == "0") {
                        deferred.resolve(actor);
                    } else {
                        deferred.reject();
                        $location.url("/");
                    }
                }
            });
        return deferred.promise;
    }

    function isAdmin($q, ActorService, $location) {
        var deferred = $q.defer();
        ActorService
            .isAdmin()
            .then(function (actor) {
                if(actor) {
                    if(actor == "0") {
                        deferred.reject();
                        $location.url("/actor/login");
                    }
                    deferred.resolve(actor);
                }
            });
        return deferred.promise;
    }

    function isRegisteredOwner($q, ActorService, $location) {
        var deferred = $q.defer();
        ActorService
            .isRegisteredOwner()
            .then(function (actor) {
                if(actor) {
                    if(actor == "0") {
                        deferred.reject();
                        $location.url("/actor/register");
                    }
                    deferred.resolve(actor);
                }
            });
        return deferred.promise;
    }
})();