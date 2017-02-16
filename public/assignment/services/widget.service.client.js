/**
 * Created by darshan on 2/10/17.
 */

(function () {
    angular
        .module("WebAppMaker")
        .factory("WidgetService", WidgetService);

    function WidgetService() {

        var widgets = [
            { "_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
            { "_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
            { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
                "url": "http://lorempixel.com/400/200/"},
            { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
            { "_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
            { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
                "url": "https://youtu.be/AM2Ivdi9c4E" },
            { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
        ];

        var api = {
            "createWidget" : createWidget,
            "findWidgetsByPageId" : findWidgetsByPageId,
            "findWidgetById" : findWidgetById,
            "updateWidget" : updateWidget,
            "deleteWidget" : deleteWidget
        };

        return api;

        function createWidget(pageId, widget) {
            widget._id = (new Date()).getTime();
            widget.pageId = pageId;
            widgets.push(widget);
            return angular.copy(widget);
        }

        function findWidgetsByPageId(pageId) {

            var widgetList = [];

            for(var wd in widgets) {
                if(widgets[wd].pageId === pageId) {
                    widgetList.push(widgets[wd]);
                }
            }

            return angular.copy(widgetList);
        }

        function findWidgetById(widgetId) {

            for(var wd in widgets) {
                if(widgets[wd]._id == widgetId) {
                    return angular.copy(widgets[wd]);
                }
            }

            return null;
        }

        function updateWidget(widgetId, widget) {

            for(var wd in widgets) {
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

            return null;
        }

        function deleteWidget(widgetId) {

            for(var wd in widgets) {
                if(widgets[wd]._id === widgetId) {
                    widgets.splice(wd, 1);
                }
            }
        }
    }
})();
