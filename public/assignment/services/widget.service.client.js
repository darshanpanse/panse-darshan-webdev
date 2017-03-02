/**
 * Created by darshan on 2/10/17.
 */

(function () {
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);

    function WidgetService($http) {

        var api = {
            "createWidget" : createWidget,
            "findWidgetsByPageId" : findWidgetsByPageId,
            "findWidgetById" : findWidgetById,
            "updateWidget" : updateWidget,
            "deleteWidget" : deleteWidget
        };

        return api;

        function createWidget(pageId, widget) {
            return $http.post("/api/page/"+pageId+"/widget", widget);
            /*widget._id = (new Date()).getTime().toString();
            widget.pageId = pageId;
            widgets.push(widget);
            return angular.copy(widget);*/
        }

        function findWidgetsByPageId(pageId) {
            return $http.get("/api/page/"+pageId+"/widget");
            /*var widgetList = [];

            for(var wd in widgets) {
                if(widgets[wd].pageId === pageId) {
                    widgetList.push(widgets[wd]);
                }
            }

            return angular.copy(widgetList);*/
        }

        function findWidgetById(widgetId) {
            return $http.get("/api/widget/"+widgetId);
            /*for(var wd in widgets) {
                if(widgets[wd]._id == widgetId) {
                    return angular.copy(widgets[wd]);
                }
            }

            return null;*/
        }

        function updateWidget(widgetId, widget) {
            return $http.put("/api/widget/"+widgetId, widget);
            /*for(var wd in widgets) {
                if(widgets[wd]._id === widgetId) {
                    if(widgets[wd].widgetType === "HEADER") {
                        widgets[wd].size = widget.size;
                        widgets[wd].text = widget.text;
                        return angular.copy(widgets[wd]);
                    }
                    if(widgets[wd].widgetType === "IMAGE") {
                        widgets[wd].width = widget.width;
                        widgets[wd].url = widget.url;
                        return angular.copy(widgets[wd]);
                    }
                    if(widgets[wd].widgetType === "HTML") {
                        widgets[wd].text = widget.text;
                        return angular.copy(widgets[wd]);
                    }
                    if(widgets[wd].widgetType === "YOUTUBE") {
                        widgets[wd].width = widget.width;
                        widgets[wd].url = widget.url;
                        return angular.copy(widgets[wd]);
                    }
                }
            }

            return null;*/
        }

        function deleteWidget(widgetId) {
            return $http.delete("/api/widget/"+widgetId);
            /*for(var wd in widgets) {
                if(widgets[wd]._id === widgetId) {
                    widgets.splice(wd, 1);
                }
            }*/
        }
    }
})();
