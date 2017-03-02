module.exports = function (app) {
    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);

    var multer = require('multer');

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + "/../../public/uploads")
        },
        filename: function (req, file, cb) {
            var extArray = file.mimetype.split("/");
            var extension = extArray[extArray.length - 1];
            cb(null, 'widget_image_' + Date.now() + '.' + extension)
        }
    });
    var upload = multer({storage: storage});

    app.post("/api/upload", upload.single('myFile'), uploadImage);

    var widgets = [
        { "_id": "123", "widgetType": "HEADER", "pageId": "321", "size": 2, "text": "GIZMODO"},
        { "_id": "234", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
            "url": "http://lorempixel.com/400/200/", "index": 2},
        { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
        { "_id": "567", "widgetType": "HEADER", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
            "url": "https://youtu.be/AM2Ivdi9c4E"},
        { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
    ];

    function createWidget(req, res) {
        var pageId = req.params.pageId;
        var widget = req.body;

        widget.pageId = pageId;
        widgets.push(widget);
        res.sendStatus(200);
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;
        var widgetList = [];

        for(var wd in widgets) {
            if(widgets[wd].pageId === pageId) {
                widgetList.push(widgets[wd]);
            }
        }

        res.json(widgetList);
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.widgetId;

        var widget = widgets.find(function (wd) {
            return wd._id === widgetId;
        });

        if(widget) {
            res.json(widget);
        } else {
            res.sendStatus(404);
        }
    }

    function updateWidget(req, res) {
        var widgetId = req.params.widgetId;
        var widget = req.body;
        for(var wd in widgets) {
            if(widgets[wd]._id === widgetId) {
                if(widgets[wd].widgetType === "HEADER") {
                    widgets[wd].size = widget.size;
                    widgets[wd].text = widget.text;
                }
                if(widgets[wd].widgetType === "IMAGE") {
                    widgets[wd].width = widget.width;
                    widgets[wd].url = widget.url;
                }
                if(widgets[wd].widgetType === "HTML") {
                    widgets[wd].text = widget.text;
                }
                if(widgets[wd].widgetType === "YOUTUBE") {
                    widgets[wd].width = widget.width;
                    widgets[wd].url = widget.url;
                }
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }

    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;

        for(var wd in widgets) {
            if(widgets[wd]._id === widgetId) {
                widgets.splice(wd, 1);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }

    function uploadImage(req, res) {
        var pageId = null;
        var widgetId = req.body.widgetId;
        var width = req.body.width;
        var userId = req.body.userId;
        var websiteId = req.body.websiteId;
        var myFile = req.file;
        var destination = myFile.destination; // folder where file is saved to

        for (var i in widgets) {
            if (widgets[i]._id === widgetId) {
                widgets[i].width = width;
                widgets[i].url = req.protocol + '://' + req.get('host') + "/uploads/" + myFile.filename;
                pageId = widgets[i].pageId;
            }
        }

        res.redirect("/assignment/#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget/");
    }
};

