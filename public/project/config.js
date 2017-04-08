(function () {
    angular
        .module('CatalogApp')
        .config(Config);

    function Config($routeProvider) {
        $routeProvider
            .when("/login", {
                templateUrl: "views/customer/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/", {
                templateUrl: "views/main/templates/main.view.client.html",
                controller: "SearchController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl: "views/customer/templates/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/customer/:customerId", {
                templateUrl: "views/customer/templates/profile-self.view.client.html",
                // controller: "ProfileSelfController",
                // controllerAs: "model"
            })
            .when("/search/product/:productName/location/:location", {
                templateUrl: "views/product/templates/list.view.client.html",
                controller: "SearchController",
                controllerAs: "model"
            });
    }
})();