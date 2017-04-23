(function() {
    angular
        .module("WebAppMaker")
        .config(Config);
    function Config($routeProvider) {

        $routeProvider
            .when("/login", {
                templateUrl: "views/actor/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/", {
                templateUrl: "views/actor/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("default", {
                templateUrl: "views/actor/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl: "views/actor/templates/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/actor/:uid", {
                templateUrl: "views/actor/templates/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model"
            })
            .when("/actor/:uid/website", {
                templateUrl: "views/website/templates/website-list.view.client.html",
                controller: "WebsiteListController",
                controllerAs: "model"
            })
            .when("/actor/:uid/website/new", {
                templateUrl: "views/website/templates/website-new.view.client.html",
                controller: "NewWebsiteController",
                controllerAs: "model"
            })
            .when("/actor/:uid/website/:wid", {
                templateUrl: "views/website/templates/website-edit.view.client.html",
                controller: "EditWebsiteController",
                controllerAs: "model"
            })
            .when("/actor/:uid/website/:wid/page", {
                templateUrl: "views/page/templates/page-list.view.client.html",
                controller: "PageListController",
                controllerAs: "model"
            })
            .when("/actor/:uid/website/:wid/page/new", {
                templateUrl: "views/page/templates/page-new.view.client.html",
                controller: "NewPageController",
                controllerAs: "model"
            })
            .when("/actor/:uid/website/:wid/page/:pid", {
                templateUrl: "views/page/templates/page-edit.view.client.html",
                controller: "EditPageController",
                controllerAs: "model"
            })
            .when("/actor/:uid/website/:wid/page/:pid/widget", {
                templateUrl: "views/widget/templates/widget-list.view.client.html",
                controller: "WidgetListController",
                controllerAs: "model"
            })
            .when("/actor/:uid/website/:wid/page/:pid/widget/new", {
                templateUrl: "views/widget/templates/widget-choose.view.client.html",
                controller: "NewWidgetController",
                controllerAs: "model"
            })
            .when("/actor/:uid/website/:wid/page/:pid/widget/:wgid", {
                templateUrl: "views/widget/templates/widget-edit.view.client.html",
                controller: "EditWidgetController",
                controllerAs: "model"
            })
            .when("/actor/:uid/website/:wid/page/:pid/widget/:wgid/flickrsearch", {
                templateUrl: "views/widget/templates/widget-flickr-search.view.client.html",
                controller: "FlickrImageSearchController",
                controllerAs: "model"
            });
    }
})();
