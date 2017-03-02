/**
 * Created by darshan on 2/10/17.
 */

(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("NewWidgetController",NewWidgetController)
        .controller("EditWidgetController",EditWidgetController);

    function WidgetListController($sce, $routeParams, WidgetService) {
        var vm = this;

        vm.getYouTubeEmbedUrl = getYouTubeEmbedUrl;
        vm.getTrustedHtml = getTrustedHtml;
        vm.getWidgetTemplateUrl = getWidgetTemplateUrl;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];

            WidgetService
                .findWidgetsByPageId(vm.pageId)
                .success(function (widgets) {
                    vm.widgets = widgets;
                })
                .error(function () {
                    vm.error = "No widgets to display";
                });
        }
        init();

        function getWidgetTemplateUrl(widgetType) {
            var url = 'views/widget/templates/widget-'+widgetType+'.view.client.html';
            return url;
        }

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function getYouTubeEmbedUrl(widgetUrl) {
            var urlParts = widgetUrl.split('/');
            var id = urlParts[urlParts.length - 1];
            var url = "https://www.youtube.com/embed/"+id;
            return $sce.trustAsResourceUrl(url);
        }
    }

    function NewWidgetController($location, $routeParams, WidgetService) {
        var vm = this;

        vm.createNewHeader = createNewHeader;
        vm.createNewHtml = createNewHtml;
        vm.createNewImage = createNewImage;
        vm.createNewYoutube = createNewYoutube;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];
        }
        init();

        function createNewHeader(){

            var newWidget = {"_id": (new Date()).getTime().toString(), "widgetType": "HEADER", "pageId": "", "size": "", "text": ""};
            WidgetService
                .createWidget(vm.pageId, newWidget)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+newWidget._id);
                })
                .error(function () {
                    vm.error = "Could not create new widget, Server not responding";
                });
        }

        function createNewHtml(){
            var newWidget = {"_id": (new Date()).getTime().toString(), "widgetType": "HTML", "pageId": "", "size": "", "text": ""};
            WidgetService
                .createWidget(vm.pageId, newWidget)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+newWidget._id);
                })
                .error(function () {
                    vm.error = "Could not create new widget, Server not responding";
                });
        }

        function createNewImage(){
            var newWidget = {"_id": (new Date()).getTime().toString(), "widgetType": "IMAGE", "pageId": "", "size": "", "text": ""};
            WidgetService
                .createWidget(vm.pageId, newWidget)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+newWidget._id);
                })
                .error(function () {
                    vm.error = "Could not create new widget, Server not responding";
                });
        }

        function createNewYoutube(){
            var newWidget = {"_id": (new Date()).getTime().toString(), "widgetType": "YOUTUBE", "pageId": "", "size": "", "text": ""};
            WidgetService
                .createWidget(vm.pageId, newWidget)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+newWidget._id);
                })
                .error(function () {
                    vm.error = "Could not create new widget, Server not responding";
                });
        }
    }

    function EditWidgetController($location, $routeParams, WidgetService) {
        var vm = this;
        vm.getEditorTemplateUrl = getEditorTemplateUrl;
        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];
            vm.widgetId = $routeParams['wgid'];

            WidgetService
                .findWidgetById(vm.widgetId)
                .success(function (widget) {
                    vm.widget = widget;
                })
                .error(function () {
                    vm.error = "Could not find widget, Server not responding";
                });
        }
        init();

        function getEditorTemplateUrl(type) {
            return 'views/widget/templates/editors/widget-'+type+'-editor.view.client.html';
        }

        function updateWidget(newWidget) {
            WidgetService
                .updateWidget(vm.widgetId, newWidget)
                .error(function () {
                    vm.error = "Could not edit widget";
                });
        }

        function deleteWidget() {
            WidgetService
                .deleteWidget(vm.widgetId)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
                })
                .error(function () {
                    vm.error = "Could not delete widget, Server not responding";
                });
        }
    }
})();
