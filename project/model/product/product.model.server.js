module.exports = function () {
    var model = null;
    var mongoose = require('mongoose');
    mongoose.Promise = require('q').Promise;
    var ProductSchema = require("./product.schema.server")();
    var ProductModel = mongoose.model('ProductModel', ProductSchema);

    var api = {
        findProductByApiId: findProductByApiId,
        getFavourites: getFavourites,
        getProductsByIds: getProductsByIds,
        addActorToProductFavourites: addActorToProductFavourites,
        addActorToProductLikes: addActorToProductLikes,
        addActorToProductComments: addActorToProductComments,
        getProduct: getProduct,
        incrementViews: incrementViews,
        getProductsForStore: getProductsForStore,
        removeActorFromProductFavourites: removeActorFromProductFavourites,
        setModel: setModel
    };

    return api;

    function removeActorFromProductFavourites(actorId, product) {
        for(var i in product.favourites){
            if(product.favourites[i] == actorId){
                product.favourites.splice(i, 1);
                break;
            }
        }
        return ProductModel.update({apiID: product.apiID}, {$set: product});
    }

    function getProductsForStore(storeId) {
        return ProductModel.find({storeApiID: storeId});
    }

    function incrementViews(product, storeId, views) {
        views = parseInt(views);
        views = views + 1;
        return ProductModel.update({apiID: product.id}, {$set: {
            storeApiID: storeId,
            views: views,
            image: product.image,
            original_price: product.original_price,
            price: product.price,
            title: product.title,
            url: product.url
        }}, {upsert: true});
    }

    function getProduct(productId) {
        return ProductModel.findOne({apiID: productId});
    }

    function addActorToProductFavourites(actorId, product, storeId) {
        return ProductModel.update({apiID: product.id}, {$push: {favourites: actorId}, $set:{
            storeApiID: storeId,
            image: product.image,
            original_price: product.original_price,
            price: product.price,
            title: product.title,
            url: product.url
        }}, {upsert: true});
    }

    function addActorToProductLikes(actorId, product, storeId) {
        return ProductModel.update({apiID: product.id}, {$push: {likes: actorId}, $set:{
            storeApiID: storeId,
            image: product.image,
            original_price: product.original_price,
            price: product.price,
            title: product.title,
            url: product.url
        }}, {upsert: true});
    }

    function addActorToProductComments(actorId, product, text, timestamp, storeId) {
        if(product.id){
            return ProductModel.update({apiID: product.id}, {$push: {comments: {_user: actorId, text: text, timestamp: timestamp}}, $set:{
                storeApiID: storeId,
                image: product.image,
                original_price: product.original_price,
                price: product.price,
                title: product.title,
                url: product.url
            }}, {upsert: true});
        }
        else {
            return ProductModel.update({apiID: product.apiID}, {$push: {comments: {_user: actorId, text: text, timestamp: timestamp}}, $set:{
                storeApiID: storeId,
                image: product.image,
                original_price: product.original_price,
                price: product.price,
                title: product.title,
                url: product.url
            }}, {upsert: true});
        }

    }

    function getProductsByIds(productIds) {
        console.log(productIds);
        var count = productIds.length;
        var result = [];
        return getProductsFromModel(productIds, count, result);
    }

    function getProductsFromModel(productIds, count, result) {
        if(count == 0) {
            return result;
        }
        return findProductByApiId(productIds.shift())
            .then(function (product) {
                result.push(product);
                return getProductsFromModel(productIds, --count, result);
            }, function (error) {
                return error;
            })
    }

    function getFavourites(productId) {
        return ProductModel.findOne({apiID: productId});
    }

    function findProductByApiId(productId) {
        return ProductModel.findOne({apiID: productId});
    }


    function setModel(models) {
        model = models;
    }
};