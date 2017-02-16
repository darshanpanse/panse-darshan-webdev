/**
 * Created by darshan on 2/10/17.
 */

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
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
        }
        init();
    }

    function NewWebsiteController($routeParams, WebsiteService) {
        var vm = this;
        vm.createWebsite = createWebsite;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
        }
        init();

        function createWebsite(newWebsite) {
            WebsiteService.createWebsite(vm.userId, newWebsite);
        }
    }

    function EditWebsiteController($location, $routeParams, WebsiteService) {
        var vm = this;
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams["wid"];
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
            vm.website = WebsiteService.findWebsiteById(vm.websiteId);
        }
        init();

        function updateWebsite(newWebsite) {
            var website = WebsiteService.updateWebsite(vm.websiteId, newWebsite);
            if(website != null) {
                vm.message = "Website Updated Successfully!";
            }
            else {
                vm.error = "Website not updated!";
            }
        }

        function deleteWebsite () {
            WebsiteService.deleteWebsite(vm.websiteId);
            $location.url("/user/"+vm.userId+"/website");
        };
    }
})();
