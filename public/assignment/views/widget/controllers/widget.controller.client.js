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
                    vm.message = "No widgets to display";
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

        vm.createWidget = createWidget;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];
        }
        init();

        function createWidget(widgetType) {
            var newWidget = {type: widgetType};
            WidgetService
                .createWidget(vm.pageId, newWidget)
                .success(function (newWidget) {
                    $location.url("/customer/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+newWidget._id);
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
            if(newWidget.type == "HEADING" && (!newWidget.text || !newWidget.size)) {
                vm.error = "Heading text or size cannot be empty!";
            } else if(newWidget.type == "HTML" && !newWidget.text) {
                vm.error = "HTML text cannot be empty!";
            } else if(newWidget.type == "IMAGE" && !newWidget.url) {
                vm.error = "Image URL cannot be empty";
            } else if(newWidget.type == "YOUTUBE" && !newWidget.url) {
                vm.error = "YouTube URL cannot be empty";
            } else {
                WidgetService
                    .updateWidget(vm.widgetId, newWidget)
                    .success(function (widget) {
                        $location.url("/customer/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
                    })
                    .error(function () {
                        vm.error = "Could not edit widget";
                    });
            }
        }

        function deleteWidget() {
            WidgetService
                .deleteWidget(vm.widgetId)
                .success(function () {
                    $location.url("/customer/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
                })
                .error(function () {
                    vm.error = "Could not delete widget, Server not responding";
                });
        }
    }
})();
