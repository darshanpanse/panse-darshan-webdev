module.exports = function (app, widgetModel) {
    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.put("/page/:pageId/widget", reorderWidget);

    var multer = require('multer');
    var fs = require("fs");
    var uploadsDirectory = __dirname+"/../../public/uploads";
    var publicDirectory =__dirname+"/../../public";
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if(!fs.existsSync(uploadsDirectory)){
                fs.mkdir(uploadsDirectory, function(error){
                    if (error) {
                        return error;
                    }
                });
            }
            cb(null, uploadsDirectory);
        },
        filename: function (req, file, cb) {
            var extArray = file.mimetype.split("/");
            var extension = extArray[extArray.length - 1];
            cb(null, 'widget_image_' + Date.now()+ '.' +extension)
        }
    });
    var upload = multer({storage: storage});

    app.post("/api/upload",upload.single('myFile'), uploadImage);
    function createWidget(req, res) {
        var pageId = req.params.pageId;
        var widget = req.body;
        widgetModel
            .createWidget(pageId, widget)
            .then(function (widget) {
                if(widget) {
                    res.json(widget);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;
        widgetModel
            .findAllWidgetsForPage(pageId)
            .then(function (widgets) {
                if(widgets.length > 0) {
                    res.json(widgets);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.widgetId;
        widgetModel
            .findWidgetById(widgetId)
            .then(function (widget) {
                if(widget) {
                    res.json(widget);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function widgetUpdateRequest(widgetId, updatedWidget, res) {
        widgetModel
            .updateWidget(widgetId, updatedWidget)
            .then(function (response) {
                if(response.ok === 1 && response.n === 1){
                    res.sendStatus(200);
                }
                else{
                    res.sendStatus(404);
                }
            }, function (error) {
                res.sendStatus(404).send(error);
            });
    }
    function updateWidget(req, res){
        var widgetId = req.params.widgetId;
        var updatedWidget = req.body;

        if(updatedWidget.type == "IMAGE"){
            if(updatedWidget.url.search('http') != -1){
                widgetModel
                    .findWidgetById(widgetId)
                    .then(function (widget) {
                        if(widget.url != "" && widget.url.search('http') == -1){
                            deleteUploadedImage(widget.url);
                        }
                        widgetUpdateRequest(widgetId, updatedWidget, res);
                    }, function (error) {
                        res.sendStatus(404).send(error);
                    });
            }
            else{
                widgetUpdateRequest(widgetId, updatedWidget, res);
            }
        }
        else{
            widgetUpdateRequest(widgetId, updatedWidget, res);
        }
    }


    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;
        widgetModel
            .deleteWidget(widgetId)
            .then(function (status) {
                res.sendStatus(200);
            }, function (error) {
                res.sendStatus(400).send(error);
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

    function uploadImage(req, res){
        var widgetId = req.body.widgetId;
        var width = req.body.width;
        var uid = req.body.userId;
        var websiteId = req.body.websiteId;
        var pageId = req.body.pageId;
        var imageWidget = {
            width: width,
            _id:widgetId
        };

        if(req.file){
            var myFile = req.file;
            var originalname = myFile.originalname;
            var filename = myFile.filename;
            var path = myFile.path;
            var destination = myFile.destination;
            var size = myFile.size;
            var mimetype = myFile.mimetype;
            if(imageWidget.url){
                deleteUploadedImage(imageWidget.url);
            }
            imageWidget.url = "/uploads/" + filename;

            widgetModel
                .updateWidget(widgetId, imageWidget)
                .then(function (response) {
                    if(response.ok === 1 && response.n === 1){
                        res.redirect("/assignment/#/user/"+uid+"/website/"+websiteId+"/page/"+pageId+"/widget");
                    }
                    else{
                        res.sendStatus(404);
                    }
                }, function (err) {
                    res.sendStatus(404);
                });

        }
        else{
            // File was not uploaded
            // Return the user to widget list page
            res.redirect("/assignment/#/user/"+uid+"/website/"+websiteId+"/page/"+pageId+"/widget");
        }
    }

    function reorderWidget(req, res) {
        var pageId = req.params.pageId;
        var start = req.query.start;
        var end = req.query.end;

        widgetModel
            .reorderWidget(pageId, start, end)
            .then(function (status) {
                res.sendStatus(200);
            }, function (error) {
                res.sendStatus(400).send(error);
            })
    }
};
