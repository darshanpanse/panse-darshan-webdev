(function () {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($routeParams, PageService) {
        var vm = this;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];

            PageService
                .findPageByWebsiteId(vm.websiteId)
                .success(function (pages) {
                    vm.pageList = pages;
                })
                .error(function () {
                    vm.message = "No Pages to display";
                });
        }
        init();
    }

    function NewPageController($routeParams, PageService) {
        var vm = this;

        vm.createPage = createPage;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];

            PageService
                .findPageByWebsiteId(vm.websiteId)
                .success(function (pages) {
                    vm.pageList = pages;
                })
                .error(function () {
                    vm.message = "No Pages to display";
                });
        }
        init();

        function createPage(newPage) {
            PageService
                .createPage(vm.websiteId, newPage)
                .error(function () {
                    vm.error = "Could not create new page, Server not responding";
                });
        }
    }

    function EditPageController($location, $routeParams, PageService) {
        var vm = this;

        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];

            PageService
                .findPageByWebsiteId(vm.websiteId)
                .success(function (pages) {
                    vm.pageList = pages;
                })
                .error(function () {
                    vm.message = "No Pages to display";
                });

            PageService
                .findPageById(vm.pageId)
                .success(function (page) {
                    vm.page = page;
                });
        }
        init();

        function updatePage(newPage) {
            PageService
                .updatePage(vm.pageId, newPage)
                .success(function () {
                    vm.message = "Page updated successfully";
                })
                .error(function () {
                    vm.error = "Page not updated!";
                });
        }

        function deletePage() {
            PageService
                .deletePage(vm.pageId)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                })
                .error(function () {
                    vm.error = "Could not delete Page, Server not responding";
                });
        }
    }
})();
