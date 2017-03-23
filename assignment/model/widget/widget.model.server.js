module.exports = function () {

    var model = null;

    var api = {
        createWidget: createWidget,
        findAllWidgetsForPage: findAllWidgetsForPage,
        findWidgetById: findWidgetById,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget,
        deleteManyWidgets: deleteManyWidgets,
        reorderWidget: reorderWidget,
        setModel: setModel
    };

    var mongoose = require('mongoose');
    mongoose.Promise = require('q').Promise;

    var WidgetSchema = require("./widget.schema.server")();
    var WidgetModel = mongoose.model('WidgetModel', WidgetSchema);
    var fs = require("fs");
    var publicDirectory =__dirname+"/../../../public";

    return api;

    function createWidget(pageId, widget) {
        return WidgetModel
            .create({
                _page: pageId,
                type: widget.type
            })
            .then(function (widget) {
                return model.pageModel
                    .findPageById(pageId)
                    .then(function (page) {
                        page.widgets.push(widget._id);
                        page.save();
                        return widget;
                    }, function (error) {
                        return error;
                    })
            }, function () {
                return error;
            });
    }

    function findAllWidgetsForPage(pageId) {
        // return WidgetModel.find({_page: pageId});
        return model.pageModel
            .findPageById(pageId)
            .then(function (page) {
                var pageWidgets = page.widgets;
                var widgetCount = pageWidgets.length;
                var result = [];
                return getWidgetsFromModel(pageWidgets, widgetCount, result);
            }, function (error) {
                return error;
            });
    }

    function getWidgetsFromModel(pageWidgets, widgetCount, result) {
        if(widgetCount == 0) {
            return result;
        }
        return findWidgetById(pageWidgets.shift())
            .then(function (widget) {
                result.push(widget);
                return getWidgetsFromModel(pageWidgets, --widgetCount, result);
            }, function (error) {
                return error;
            })
    }

    function findWidgetById(widgetId) {
        return WidgetModel.findOne({_id: widgetId});
    }

    function updateWidget(widgetId, widget) {
        return WidgetModel.update({_id: widgetId}, {$set: widget});
    }

    function deleteWidget(widgetId) {
        // return WidgetModel.remove({_id: widgetId});
        return WidgetModel
            .findOne({_id: widgetId})
            .then(function (widget) {
                var widgetPageId = widget._page;
                return deleteWidgetFromPage(widgetPageId, widgetId)
                    .then(function () {
                        if(widget.type == "IMAGE"){
                            deleteUploadedImage(widget.url);
                        }
                        return WidgetModel.remove({_id: widgetId});
                    }, function (error) {
                        return error;
                    });
            }, function (error) {
                return error;
            });
    }

    function deleteWidgetFromPage(widgetPageId, widgetId) {
        return model.pageModel
            .findPageById(widgetPageId)
            .then(function (page) {
                for(var wd in page.widgets) {
                    if(page.widgets[wd] == widgetId) {
                        page.widgets.splice(wd, 1);
                        page.save();
                        return;
                    }
                }
            }, function (error) {
                return error;
            });
    }

    function deleteUploadedImage(url) {
        if(url && url.search('http') == -1) {
            fs.unlink(publicDirectory + url, function (error) {
                if(error) {
                    return error;
                }
            });
        }

    }

    function deleteManyWidgets(pageId) {
        return WidgetModel.remove({_page: pageId});
    }

    function reorderWidget(pageId, start, end) {
        return model.pageModel
            .findPageById(pageId)
            .then(function (page) {
                page.widgets.splice(end, 0, page.widgets.splice(start, 1)[0]);
                page.save();
                return 200;
            }, function (error) {
                return error;
            })
    }

    function setModel(models) {
        model = models;
    }
};
