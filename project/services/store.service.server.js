module.exports = function (app, storeModel) {

    app.post("/api/addActorToStoreFavourites", addActorToStoreFavourites);
    app.put("/api/removeActorFromStoreFavourites", removeActorFromStoreFavourites);
    app.post("/api/addActorToStoreLikes", addActorToStoreLikes);
    app.post("/api/addActorToStoreComments", addActorToStoreComments);
    app.get("/api/favouriteStores", getStoresByIds);
    app.get("/api/getStore", getStore);
    app.put("/api/incrementStoreViews", incrementViews);
    app.post("/api/store/create", createStore);
    app.put("/api/store/update", updateStore);

    function removeActorFromStoreFavourites(req, res) {
        var actorId = req.body.actorId;
        var store = req.body.store;
        storeModel
            .removeActorFromStoreFavourites(actorId, store)
            .then(function (response) {
                if(response) {
                    res.json(response);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function updateStore(req, res) {
        var store = req.body;
        storeModel
            .updateStore(store)
            .then(function (response) {
                res.sendStatus(200);
            }, function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function incrementViews(req, res) {
        var store = req.body;
        var views = req.query.views;
        storeModel
            .incrementViews(store, views)
            .then(function (response) {
                res.send(response);
            }, function (error) {
                res.send(error);
            });
    }

    function createStore(req, res) {
        var store = req.body;
        storeModel
            .createStore(store)
            .then(function (store) {
                if(store) {
                    res.json(store);
                } else {
                    res.sendStatus(400);
                }
            }, function (error) {
                res.sendStatus(400).send(error);
            });
    }

    function getStore(req, res) {
        var storeId = req.query.storeId;
        storeModel
            .getStore(storeId)
            .then(function (response) {
                if(response) {
                    res.json(response);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.send(error);
            })
    }

    function getStoresByIds(req, res) {
        var storeIds = req.query.storeIds.split(",");
        storeModel
            .getStoresByIds(storeIds)
            .then(function (stores) {
                if(stores) {
                    res.json(stores);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.sendStatus(400).send(error)
            });
    }

    function addActorToStoreFavourites(req, res) {
        var info = req.body;
        var actorId = info.actorId;
        var store = info.store;
        return storeModel
            .addActorToStoreFavourites(actorId, store)
            .then(function (response) {
                if(response.ok == 1) {
                    res.json(response);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                console.log("error");
                res.send(error)
            })
    }

    function addActorToStoreLikes(req, res) {
        var info = req.body;
        var actorId = info.actorId;
        var store = info.store;
        return storeModel
            .addActorToStoreLikes(actorId, store)
            .then(function (response) {
                if(response.ok == 1) {
                    res.json(response);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                console.log("error");
                res.send(error)
            })
    }

    function addActorToStoreComments(req, res) {
        var info = req.body;
        var actorId = info.actorId;
        var store = info.store;
        var text = info.text;
        var timestamp = info.timestamp;
        return storeModel
            .addActorToStoreComments(actorId, store, text, timestamp)
            .then(function (response) {
                if(response.ok == 1) {
                    res.json(response);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                console.log("error");
                res.send(error)
            })
    }
};