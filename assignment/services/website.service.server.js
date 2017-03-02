module.exports = function (app) {
    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.put("/api/website/:websiteId", updateWebsite);
    app.post("/api/user/:userId/website", createWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);

    var websites = [
        { "_id": "123", "name": "Facebook",    "developerId": "456", "description": "Lorem" },
        { "_id": "234", "name": "Tweeter",     "developerId": "456", "description": "Lorem" },
        { "_id": "456", "name": "Gizmodo",     "developerId": "456", "description": "Lorem" },
        { "_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Lorem" },
        { "_id": "678", "name": "Checkers",    "developerId": "123", "description": "Lorem" },
        { "_id": "789", "name": "Chess",       "developerId": "234", "description": "Lorem" }
    ];

    function findAllWebsitesForUser(req, res) {
        var userId = req.params.userId;

        var sites = [];
        for(var w in websites) {
            if(websites[w].developerId === userId) {
                sites.push(websites[w]);
            }
        }
        res.json(sites);
    }

    function findWebsiteById(req, res) {
        var websiteId = req.params.websiteId;

        var website = websites.find(function (w) {
            return w._id === websiteId;
        });

        if(website) {
            res.json(website);
        } else {
            res.sendStatus(404);
        }
    }

    function updateWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var website = req.body;

        for(var w in websites) {
            if(websites[w]._id === websiteId) {
                websites[w].name = website.name;
                websites[w].description = website.description;
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }

    function createWebsite(req, res) {
        var userId = req.params.userId;
        var newWebsite = req.body;
        newWebsite.developerId = userId;
        newWebsite._id = (new Date().getTime()).toString();
        websites.push(newWebsite);
        res.sendStatus(200);
    }

    function deleteWebsite(req, res) {
        var websiteId = req.params.websiteId;

        for (var w in websites) {
            if (websites[w]._id === websiteId) {
                websites.splice(w, 1);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }
};
