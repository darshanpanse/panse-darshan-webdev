module.exports = function (app, websiteModel) {

    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.put("/api/website/:websiteId", updateWebsite);
    app.post("/api/user/:userId/website", createWebsiteForUser);
    app.delete("/api/website/:websiteId", deleteWebsite);

    function findAllWebsitesForUser(req, res) {
        var userId = req.params.userId;
        websiteModel
            .findAllWebsitesForUser(userId)
            .then(function (websites) {
                if(websites.length > 0) {
                    res.json(websites);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function findWebsiteById(req, res) {
        var websiteId = req.params.websiteId;
        websiteModel
            .findWebsiteById(websiteId)
            .then(function (website) {
                if(website) {
                    res.json(website);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function createWebsiteForUser(req, res) {
        var userId = req.params.userId;
        var newWebsite = req.body;
        websiteModel
            .createWebsiteForUser(userId, newWebsite)
            .then(function (website) {
                if(website) {
                    res.json(website);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function updateWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var newWebsite = req.body;
        websiteModel
            .updateWebsite(websiteId, newWebsite)
            .then(function (status) {
                res.sendStatus(200);
            }, function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function deleteWebsite(req, res) {
        console.log("hi");
        var websiteId = req.params.websiteId;
        websiteModel
            .deleteWebsite(websiteId)
            .then(function (status) {
                res.sendStatus(200);
            }, function (error) {
                res.sendStatus(400).send(error);
            });
    }
};
