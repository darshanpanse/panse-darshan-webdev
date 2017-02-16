/**
 * Created by darshan on 2/10/17.
 */

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
            vm.pageList = PageService.findPageByWebsiteId(vm.websiteId);
        }
        init();
    }

    function NewPageController($routeParams, PageService) {
        var vm = this;
        vm.createPage = createPage;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageList = PageService.findPageByWebsiteId(vm.websiteId);
        }
        init();

        function createPage(newPage) {
            PageService.createPage(vm.websiteId, newPage);
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
            vm.pageList = PageService.findPageByWebsiteId(vm.websiteId);
            vm.page = PageService.findPageById(vm.pageId);
        }
        init();

        function updatePage(newPage) {
            var page = PageService.updatePage(vm.pageId, newPage);
        }

        function deletePage() {
            PageService.deletePage(vm.pageId);
            $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
        }
    }
})();
