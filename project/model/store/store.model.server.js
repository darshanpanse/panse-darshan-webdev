module.exports = function () {
    var model = null;
    var mongoose = require('mongoose');
    mongoose.Promise = require('q').Promise;
    var StoreSchema = require("./store.schema.server")();
    var StoreModel = mongoose.model('StoreModel', StoreSchema);

    var api = {
        "addActorToStoreFavourites": addActorToStoreFavourites,
        "addActorToStoreLikes": addActorToStoreLikes,
        "addActorToStoreComments": addActorToStoreComments,
        "getStoresByIds": getStoresByIds,
        "getStore": getStore,
        "incrementViews": incrementViews,
        "createStore": createStore,
        "updateStore": updateStore,
        "removeActorFromStoreFavourites": removeActorFromStoreFavourites,
        "setModel": setModel
    };

    return api;

    function removeActorFromStoreFavourites(actorId, store) {
        console.log(actorId, store);
        for(var i in store.favourites){
            if(store.favourites[i] == actorId){
                store.favourites.splice(i, 1);
                break;
            }
        }
        return StoreModel.update({apiID: store.apiID}, {$set: store});
    }

    function updateStore(store) {
        return StoreModel.update({_id: store._id}, {$set: store});
    }

    function createStore(store) {
        return StoreModel.create(store);
    }

    function incrementViews(store, views) {
        views = parseInt(views);
        views = views + 1;
        return StoreModel.update({apiID: store.id}, {$push: {locations: {
            address: store.locations.address,
            city: store.locations.city,
            id: store.locations.id,
            lat: store.locations.lat,
            lng: store.locations.lng,
            phone: store.locations.phone,
            state: store.locations.state,
            zipcode: store.locations.zipcode
        }}, $set: {
            views: views,
            locations_found: store.locations_found,
            name: store.name,
            website: store.website
        }}, {upsert: true});
    }

    function getStore(storeId) {
        return StoreModel.findOne({apiID: storeId});
    }

    function getStoresByIds(storeIds) {
        var count = storeIds.length;
        var result = [];
        return getStoresFromModel(storeIds, count, result);
    }

    function getStoresFromModel(storeIds, count, result) {
        if(count == 0) {
            return result;
        }
        return findStoreById(storeIds.shift())
            .then(function (store) {
                result.push(store);
                return getStoresFromModel(storeIds, --count, result);
            }, function (error) {
                return error;
            })
    }

    function findStoreById(storeId) {
        return StoreModel.findOne({apiID: storeId});
    }

    function addActorToStoreFavourites(actorId, store) {
        return StoreModel.update({apiID: store.id}, {$push: {favourites: actorId, locations: {
            address: store.locations.address,
            city: store.locations.city,
            id: store.locations.id,
            lat: store.locations.lat,
            lng: store.locations.lng,
            phone: store.locations.phone,
            state: store.locations.state,
            zipcode: store.locations.zipcode
        }}, $set: {
            locations_found: store.locations_found,
            name: store.name,
            website: store.website
        }}, {upsert: true});
    }

    function addActorToStoreLikes(actorId, store) {
        return StoreModel.update({apiID: store.id}, {$push: {likes: actorId, locations: {
            address: store.locations.address,
            city: store.locations.city,
            id: store.locations.id,
            lat: store.locations.lat,
            lng: store.locations.lng,
            phone: store.locations.phone,
            state: store.locations.state,
            zipcode: store.locations.zipcode
        }}, $set: {
            locations_found: store.locations_found,
            name: store.name,
            website: store.website
        }}, {upsert: true});
    }

    function addActorToStoreComments(actorId, store, text, timestamp) {
        if(store.id) {
            return StoreModel.update({apiID: store.id}, {$push: {comments: {_user: actorId, text: text, timestamp: timestamp}, locations: {
                address: store.locations.address,
                city: store.locations.city,
                id: store.locations.id,
                lat: store.locations.lat,
                lng: store.locations.lng,
                phone: store.locations.phone,
                state: store.locations.state,
                zipcode: store.locations.zipcode
            }}, $set: {
                locations_found: store.locations_found,
                name: store.name,
                website: store.website
            }}, {upsert: true});
        }
        else {
            return StoreModel.update({apiID: store.apiID}, {$push: {comments: {_user: actorId, text: text, timestamp: timestamp}}}, {upsert: true});
        }

    }

    function setModel(models) {
        model = models;
    }
};