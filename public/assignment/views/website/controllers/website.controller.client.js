(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("NewWebsiteController", NewWebsiteController)
        .controller("EditWebsiteController", EditWebsiteController);

    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;

        function init() {
            vm.userId = $routeParams['uid'];

            WebsiteService
                .findWebsitesByUser(vm.userId)
                .success(function (websites) {
                    vm.websites = websites;
                })
                .error(function () {
                    vm.message = "No websites to display";
                    console.log(vm.message);
                });
        }
        init();
    }

    function NewWebsiteController($routeParams, WebsiteService) {
        var vm = this;

        vm.createWebsite = createWebsite;

        function init() {
            vm.userId = $routeParams['uid'];

            WebsiteService
                .findWebsitesByUser(vm.userId)
                .success(function (websites) {
                    vm.websites = websites;
                })
                .error(function () {
                    vm.message = "No websites to display";
                });
        }
        init();

        function createWebsite(newWebsite) {
            WebsiteService
                .createWebsite(vm.userId, newWebsite)
                .error(function () {
                    vm.error = "Could not create new Website, Server not responding"
                });
        }
    }

    function EditWebsiteController($location, $routeParams, WebsiteService) {
        var vm = this;

        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams["wid"];

            WebsiteService
                .findWebsitesByUser(vm.userId)
                .success(function (websites) {
                    vm.websites = websites;
                })
                .error(function () {
                    vm.message = "No websites to display";
                });
            WebsiteService
                .findWebsiteById(vm.websiteId)
                .success(function (website) {
                    vm.website = website;
                });
        }
        init();

        function updateWebsite(newWebsite) {
            WebsiteService
                .updateWebsite(vm.websiteId, newWebsite)
                .success(function () {
                    vm.message = "Website Updated Successfully!";
                })
                .error(function () {
                    vm.error = "Website not updated!";
                });
        }

        function deleteWebsite () {
            WebsiteService
                .deleteWebsite(vm.websiteId)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website");
                })
                .error(function () {
                    vm.error = "Could not delete website, Server not responding";
                });
        }
    }
})();
