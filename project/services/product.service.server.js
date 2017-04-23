module.exports = function (app, productModel) {

    app.get("/api/productById", findProductById);
    app.post("/api/addActorToProductFavourites", addActorToProductFavourites);
    app.post("/api/addActorToProductLikes", addActorToProductLikes);
    app.post("/api/addActorToProductComments", addActorToProductComments);
    app.get("/api/getFavourites", getFavourites);
    app.get("/api/favouriteProducts", getProductsByIds);
    app.get("/api/getProduct", getProduct);
    app.put("/api/incrementProductViews", incrementViews);
    app.get("/api/getProductsForStore", getProductsForStore);
    app.put("/api/removeActorFromProductFavourites", removeActorFromProductFavourites);

    function removeActorFromProductFavourites(req, res) {

        var actorId = req.body.actorId;
        var product = req.body.product;
        productModel
            .removeActorFromProductFavourites(actorId, product)
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

    function getProductsForStore(req, res) {
        var storeId = req.query.storeId;
        productModel
            .getProductsForStore(storeId)
            .then(function (response) {
                if(response) {
                    res.json(response);
                }
                else {
                    res.sendStatus(404);
                }

            }, function (error) {
                res.send(error)
            })
    }

    function incrementViews(req, res) {
        var product = req.body;
        var storeId = req.query.storeId;
        var views = req.query.views;
        productModel
            .incrementViews(product, storeId, views)
            .then(function (response) {
                res.send(response);
            }, function (error) {
                res.send(error);
            })
    }

    function getProduct(req, res) {
        var productId = req.query.productId;
        productModel
            .getProduct(productId)
            .then(function (response) {
                res.json(response);
            }, function (error) {
                res.send(error);
            })
    }

    function getProductsByIds(req, res) {
        var productIds = req.query.productIds.split(",");

        console.log(productIds);
        productModel
            .getProductsByIds(productIds)
            .then(function (products) {
                if(products) {
                    res.json(products);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.sendStatus(400).send(error)
            });
    }

    function getFavourites(req, res) {
        var productId = req.query.productId;
        productModel
            .getFavourites(productId)
            .then(function (response) {
                res.json(response);
            }, function (error) {
                res.send(error);
            })
    }

    function findProductById(req, res) {
        var productId = req.query.productId;

        productModel
            .findProductByApiId(productId)
            .then(function (product) {
                if(product) {
                    res.json(product);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.sendStatus(404).send(error);
            });
    }

    function addActorToProductFavourites(req, res) {
        var info = req.body;
        var actorId = info.actorId;
        var product = info.product;
        var storeId = info.storeId;
        return productModel
            .addActorToProductFavourites(actorId, product, storeId)
            .then(function (response) {
                if(response.ok == 1) {
                    res.json(response);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.send(error)
            })
    }

    function addActorToProductLikes(req, res) {
        var info = req.body;
        var actorId = info.actorId;
        var product = info.product;
        var storeId = info.storeId;
        return productModel
            .addActorToProductLikes(actorId, product, storeId)
            .then(function (response) {
                if(response.ok == 1) {
                    res.json(response);
                } else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.send(error)
            })
    }

    function addActorToProductComments(req, res) {
        var info = req.body;
        var actorId = info.actorId;
        var product = info.product;
        var text = info.text;
        var timestamp = info.timestamp;
        var storeId = info.storeId;
        return productModel
            .addActorToProductComments(actorId, product, text, timestamp, storeId)
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