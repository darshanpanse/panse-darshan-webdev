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
            vm.widgets = WidgetService.findWidgetsByPageId(vm.pageId);
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
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];
        vm.getEditorTemplateUrl = getEditorTemplateUrl;
        vm.createNewHeader = createNewHeader;
        vm.createNewHtml = createNewHtml;
        vm.createNewImage = createNewImage;
        vm.createNewYoutube = createNewYoutube;

        function getEditorTemplateUrl(type) {
            vm.url = 'views/widget/templates/editors/widget-'+type+'-editor.view.client.html';
        }

        function createNewHeader(){
            var newWidget = {"_id": "", "widgetType": "HEADER", "pageId": "", "size": "", "text": ""};
            vm.widget = WidgetService.createWidget(vm.pageId, newWidget);
            $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+vm.widget._id);
        }

        function createNewHtml(){
            var newWidget = {"_id": "", "widgetType": "HTML", "pageId": "", "size": "", "text": ""};
            vm.widget = WidgetService.createWidget(vm.pageId, newWidget);
            $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+vm.widget._id);
        }

        function createNewImage(){
            var newWidget = {"_id": "", "widgetType": "IMAGE", "pageId": "", "size": "", "text": ""};
            vm.widget = WidgetService.createWidget(vm.pageId, newWidget);
            $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+vm.widget._id);
        }

        function createNewYoutube(){
            var newWidget = {"_id": "", "widgetType": "YOUTUBE", "pageId": "", "size": "", "text": ""};
            vm.widget = WidgetService.createWidget(vm.pageId, newWidget);
            $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+vm.widget._id);
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
            vm.widget = WidgetService.findWidgetById(vm.widgetId);
        }
        init();

        function getEditorTemplateUrl(type) {
            return 'views/widget/templates/editors/widget-'+type+'-editor.view.client.html';
        }

        function updateWidget(newWidget) {
            var widget = WidgetService.updateWidget(vm.widgetId, newWidget);
        }

        function deleteWidget() {
            WidgetService.deleteWidget(vm.widgetId);
            $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
        }
    }
})();
