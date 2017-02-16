/**
 * Created by darshan on 2/10/17.
 */

(function () {
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);

    function PageService() {

        var pages = [
            { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem" },
            { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem" },
            { "_id": "543", "name": "Post 3", "websiteId": "456", "description": "Lorem" }
        ];

        var api = {
            "createPage" : createPage,
            "findPageByWebsiteId" : findPageByWebsiteId,
            "findPageById" : findPageById,
            "updatePage" : updatePage,
            "deletePage" : deletePage
        };

        return api;

        function createPage(websiteId, page) {
            var newPage = {"_id": (new Date()).getTime(),
                           "name": page.name,
                           "websiteId": websiteId,
                           "description": page.description};

            pages.push(newPage);
        }

        function findPageByWebsiteId(websiteId) {

            var pageList = [];
            for(var p in pages) {
                if(pages[p].websiteId === websiteId) {
                    pageList.push(pages[p]);
                }
            }

            return angular.copy(pageList);
        }

        function findPageById(pageId) {

            for(var p in pages) {
                var page = pages[p];
                if(page._id === pageId) {
                    return angular.copy(page);
                }
            }

            return null;
        }

        function updatePage(pageId, page) {

            for(var p in pages) {
                if(pages[p]._id === pageId) {
                    pages[p].name = page.name;
                    pages[p].description = page.description;
                    return angular.copy(pages[p]);
                }
            }
        }

        function deletePage(pageId) {

            for(var p in pages) {
                if(pages[p]._id === pageId) {
                    pages.splice(p, 1);
                }
            }
        }
    }
})();
