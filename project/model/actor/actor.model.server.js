module.exports = function () {
    var model = null;
    var mongoose = require('mongoose');
    mongoose.Promise = require('q').Promise;
    var ActorSchema = require("./actor.schema.server.js")();
    var ActorModel = mongoose.model('ActorModel', ActorSchema);
    var bcrypt = require("bcrypt-nodejs");
    ActorModel.create({username: "admin", password: bcrypt.hashSync("admin"), role: "ADMIN", accountStatus: 'EXISTS'});

    var api = {
        createActor: createActor,
        findActorByFirstName: findActorByFirstName,
        findActorByLastName: findActorByLastName,
        findActorById: findActorById,
        findActorByUsername: findActorByUsername,
        findActorByCredentials: findActorByCredentials,
        authenticateActorByEmail: authenticateActorByEmail,
        authenticateActorByPhone: authenticateActorByPhone,
        findActorByEmail: findActorByEmail,
        findActorByPhone: findActorByPhone,
        findActors: findActors,
        updateActor: updateActor,
        addProductToActorFavourites: addProductToActorFavourites,
        addProductToActorLikes: addProductToActorLikes,
        addProductToActorComments: addProductToActorComments,
        verifyActorByPassword: verifyActorByPassword,
        changePassword: changePassword,
        //deleteActor: deleteActor,
        addStoreToActorFavourites: addStoreToActorFavourites,
        addStoreToActorLikes: addStoreToActorLikes,
        addStoreToActorComments: addStoreToActorComments,
        findAllCustomers: findAllCustomers,
        findAllStoreOwners: findAllStoreOwners,
        findAllRegistrationRequests: findAllRegistrationRequests,
        updateProfile: updateProfile,
        deleteAccount: deleteAccount,
        removeRegistrationRequest: removeRegistrationRequest,
        findActorByGoogleId: findActorByGoogleId,
        findUserByFacebookId: findUserByFacebookId,
        findActorsByArraysOfIds: findActorsByArraysOfIds,
        findActorsByIds: findActorsByIds,
        addToFollowing: addToFollowing,
        addToFollowers: addToFollowers,
        removeProductFromActorFavourites: removeProductFromActorFavourites,
        removeStoreFromActorFavourites: removeStoreFromActorFavourites,
        removeFromFollowing: removeFromFollowing,
        removeFromFollowers: removeFromFollowers,
        setModel: setModel
    };

    return api;

    function removeProductFromActorFavourites(actor, productId) {
        for(var i in actor.favourite_products){
            if(actor.favourite_products[i] == productId){
                actor.favourite_products.splice(i, 1);
                break;
            }
        }
        return ActorModel.update({_id: actor._id}, {$set: actor});
    }

    function removeStoreFromActorFavourites(actor, storeId) {
        for(var i in actor.favourite_stores){
            if(actor.favourite_stores[i] == storeId){
                actor.favourite_stores.splice(i, 1);
                break;
            }
        }
        return ActorModel.update({_id: actor._id}, {$set: actor});
    }

    function findUserByFacebookId(facebookId) {
        return User.findOne({'facebook.id': facebookId});
    }

    function addToFollowing(currentActorId, actorId) {
        return ActorModel.update({_id: currentActorId}, {$push: {following: actorId}});
    }

    function addToFollowers(currentActorId, actorId) {
        return ActorModel.update({_id: actorId}, {$push: {followers: currentActorId}});
    }

    function removeFromFollowing(currentActor, actorId) {
        for(var i in currentActor.following){
            if(currentActor.following[i] == actorId){
                currentActor.following.splice(i, 1);
                break;
            }
        }
        return ActorModel.update({_id: currentActor._id}, {$set: currentActor});
    }

    function removeFromFollowers(currentActorId, actor) {
        for(var i in actor.followers){
            if(actor.followers[i] == currentActorId){
                actor.followers.splice(i, 1);
                break;
            }
        }
        return ActorModel.update({_id: actor._id}, {$set: actor});
    }

    function findActorsByArraysOfIds(actorIds) {
        var count = actorIds.length;
        var result1 = [];
        return findActorArrays(actorIds, count, result1);
    }

    function findActorArrays(actorIds, count, result1) {
        if(count == 0) {
            return result1;
        }
        return findActorsByIds(actorIds.shift())
            .then(function (response) {
                result1.push(response);
                return findActorArrays(actorIds, --count, result1);
            }, function (error) {
                return error;
            })
    }

    function findActorsByIds(actors) {
        var actorCount = actors.length;
        var result = [];
        return getActorsFromModel(actors, actorCount, result);
    }

    function getActorsFromModel(actors, actorCount, result) {
        if(actorCount == 0) {
            return result;
        }
        return findActorById(actors.shift())
            .then(function (response) {
                result.push(response);
                return getActorsFromModel(actors, --actorCount, result);
            }, function (error) {
                return error;
            })
    }

    function findActorByGoogleId(googleId) {
        return ActorModel.findOne({'google.id': googleId});
    }
    
    function removeRegistrationRequest(requestId) {
        return model.registerRequestModel.deleteRequest(requestId);
    }

    function deleteAccount(actorId) {
        return ActorModel.update({_id: actorId}, {$set: {accountStatus: "DELETED"}});
    }

    // function deleteAccount(actorId) {
    //     return findActorById(actorId)
    //         .then(function (actor) {
    //             var actorFavProds = actor.favourite_products;
    //             var actorLikedProds = actor.liked_products;
    //             var actorCommentedProds = actor.products_commented_on;
    //             var actorFavStores = actor.favourite_stores;
    //             var actorLikedStores = actor.liked_stores;
    //             var actorCommentedStores = actor.stores_commented_on;
    //             var actorFollowers = actor.followers;
    //             var actorFollowing = actor.following;
    //
    //             return deleteActorPreferences(actorId, actorFavProds, actorLikedProds, actorCommentedProds, actorFavStores, actorLikedStores, actorCommentedStores, actorFollowers, actorFollowing)
    //                 .then(function () {
    //                     return ActorModel.remove({_id: actorId});
    //                 }, function (error) {
    //                     return error;
    //                 });
    //
    //         }, function (error) {
    //             return error;
    //         });
    // }
    //
    // function deleteActorPreferences(actorId, actorFavProds, actorLikedProds, actorCommentedProds, actorFavStores, actorLikedStores, actorCommentedStores, actorFollowers, actorFollowing) {
    //     return deleteActorFromFavProducts(actorId, actorFavProds)
    //         .then(function (response) {
    //             return deleteActorFromLikedProducts(actorId, actorLikedProds)
    //                 .then(function () {
    //                     return deleteActorFromCommentedProducts(actorId, actorCommentedProds)
    //                         .then(function () {
    //                             return deleteActorFromFavStores(actorId, actorFavStores)
    //                                 .then(function () {
    //                                     return deleteActorFromLikedStores(actorId, actorLikedStores)
    //                                         .then(function () {
    //                                             return deleteActorFromCommentedStores(actorId, actorCommentedStores)
    //                                                 .then(function () {
    //                                                     return deleteActorFromFollowers(actorId, actorFollowers)
    //                                                         .then(function () {
    //                                                             return deleteActorFromFollowing(actorId, actorFollowing)
    //                                                                 .then(function (response) {
    //                                                                     return response.ok;
    //                                                                 }, function (error) {
    //                                                                     return error;
    //                                                                 });
    //                                                         }, function (error) {
    //                                                             return error;
    //                                                         });
    //                                                 }, function (error) {
    //                                                     return error;
    //                                                 });
    //                                         }, function (error) {
    //                                             return error;
    //                                         });
    //                                 }, function (error) {
    //                                     return error;
    //                                 });
    //                         }, function (error) {
    //                             return error;
    //                         });
    //                 }, function (error) {
    //                     return error;
    //                 });
    //         }, function (error) {
    //             console.log("hi");
    //             return error;
    //         });
    // }
    //
    // function getProductsByIds(array, count, result) {
    //     if(count == 0) {
    //         return result;
    //     }
    //     return model.productModel
    //         .findProductById(array.shift())
    //         .then(function (product) {
    //             result.push(product);
    //             return getProductsByIds(array, --count, result);
    //         }, function (error) {
    //             return error;
    //         })
    // }
    //
    // function getStoresByIds(array, count, result) {
    //     if(count == 0) {
    //         return result;
    //     }
    //     return model.storeModel
    //         .findProductById(array.shift())
    //         .then(function (store) {
    //             result.push(store);
    //             return getStoresByIds(array, --count, result);
    //         }, function (error) {
    //             return error;
    //         })
    // }
    //
    // function getActorsByIds(array, count, result) {
    //     if(count == 0) {
    //         return result;
    //     }
    //     return ActorModel
    //         .findProductById(array.shift())
    //         .then(function (actor) {
    //             result.push(actor);
    //             return getActorsByIds(array, --count, result);
    //         }, function (error) {
    //             return error;
    //         })
    // }
    //
    // function deleteActorFromFavProducts(actorId, actorFavProds) {
    //     var products = [];
    //     var count = actorFavProds.length;
    //     products = getProductsByIds(actorFavProds, count, products);
    //
    //     if(products.length > 0) {
    //         for(var p in products) {
    //             var product = products[p]
    //             for(var a in product.favourites) {
    //                 if(product.favourites[a] == actorId) {
    //                     product.favourites.splice(a, 1);
    //                     product.save();
    //                     break;
    //                 }
    //             }
    //         }
    //     } else {
    //         return true;
    //     }
    // }
    //
    // function deleteActorFromLikedProducts(actorId, actorLikedProds) {
    //     var products = [];
    //     var count = actorLikedProds.length;
    //     products = getProductsByIds(actorLikedProds, count, products);
    //     for(var p in products) {
    //         var product = products[p]
    //         for(var a in product.likes) {
    //             if(product.likes[a] == actorId) {
    //                 product.likes.splice(a, 1);
    //                 product.save();
    //                 break;
    //             }
    //         }
    //     }
    //     return;
    // }
    //
    // function deleteActorFromCommentedProducts(actorId, actorCommentedProds) {
    //     var products = [];
    //     var count = actorCommentedProds.length;
    //     products = getProductsByIds(actorCommentedProds, count, products);
    //     for(var p in products) {
    //         var product = products[p]
    //         for(var a in product.comments) {
    //             if(product.comments[a] == actorId) {
    //                 product.comments.splice(a, 1);
    //                 product.save();
    //                 break;
    //             }
    //         }
    //     }
    //     return;
    // }
    //
    // function deleteActorFromFavStores(actorId, actorFavStores) {
    //     var stores = [];
    //     var count = actorFavStores.length;
    //     stores = getStoresByIds(actorFavStores, count, stores);
    //     for(var s in stores) {
    //         var store = stores[s]
    //         for(var a in store.favourites) {
    //             if(store.favourites[a] == actorId) {
    //                 store.favourites.splice(a, 1);
    //                 store.save();
    //                 break;
    //             }
    //         }
    //     }
    //     return;
    // }
    //
    // function deleteActorFromLikedStores(actorId, actorLikedStores) {
    //     var stores = [];
    //     var count = actorLikedStores.length;
    //     stores = getStoresByIds(actorFavProds, count, stores);
    //     for(var s in stores) {
    //         var store = stores[s]
    //         for(var a in store.likes) {
    //             if(store.likes[a] == actorId) {
    //                 store.likes.splice(a, 1);
    //                 store.save();
    //                 break;
    //             }
    //         }
    //     }
    //     return;
    // }
    //
    // function deleteActorFromCommentedStores(actorId, actorCommentedStores) {
    //     var stores = [];
    //     var count = actorCommentedStores.length;
    //     stores = getStoresByIds(actorCommentedStores, count, stores);
    //     for(var s in stores) {
    //         var store = stores[s]
    //         for(var a in store.comments) {
    //             if(store.comments[a] == actorId) {
    //                 store.comments.splice(a, 1);
    //                 store.save();
    //                 break;
    //             }
    //         }
    //     }
    //     return;
    // }
    //
    // function deleteActorFromFollowers(actorId, actorFollowers) {
    //     var actors = [];
    //     var count = actorFollowers.length;
    //     actors = getActorsByIds(actorFollowers, count, actors);
    //     for(var p in actors) {
    //         var actor = actors[p]
    //         for(var a in actor.followers) {
    //             if(actor.followers[a] == actorId) {
    //                 actor.followers.splice(a, 1);
    //                 actor.save();
    //                 break;
    //             }
    //         }
    //     }
    //     return;
    // }
    //
    // function deleteActorFromFollowing(actorId, actorFollowing) {
    //     var actors = [];
    //     var count = actorFollowing.length;
    //     actors = getActorsByIds(actorFollowing, count, actors);
    //     for(var p in actors) {
    //         var actor = actors[p]
    //         for(var a in actor.following) {
    //             if(actor.following[a] == actorId) {
    //                 actor.following.splice(a, 1);
    //                 actor.save();
    //                 break;
    //             }
    //         }
    //     }
    //     return;
    // }

    function updateProfile(actor) {
        return ActorModel.update({_id: actor._id}, {$set: actor});
    }

    function findAllRegistrationRequests() {
        return model.registerRequestModel.findAllRegistrationRequests();
    }

    function findAllStoreOwners() {
        return ActorModel.find({role: 'STOREOWNER'});
    }

    function findAllCustomers() {
        return ActorModel.find({role: 'CUSTOMER'});
    }

    function addStoreToActorFavourites(ActorId, storeId) {
        return ActorModel.update({_id: ActorId}, {$push: {favourite_stores: storeId}});
    }

    function addStoreToActorLikes(ActorId, storeId) {
        return ActorModel.update({_id: ActorId}, {$push: {liked_stores: storeId}});
    }

    function addStoreToActorComments(ActorId, storeId, text, timestamp) {
        return ActorModel.update({_id: ActorId}, {$push: {stores_commented_on: {_apiID: storeId, text: text, timestamp: timestamp}}});
    }

    function verifyActorByPassword(ActorId, oldPassword) {
        return ActorModel.findOne({_id: ActorId, password: oldPassword});
    }

    function changePassword(ActorId, newPassword) {
        return ActorModel.update({_id: ActorId}, {$set: {password: newPassword}});
    }

    function findActorByUsername(username) {
        return ActorModel
            .findOne({username: username})
            .then(function (actor) {
                if(actor) {
                    return actor;
                } else {
                    console.log("hi");
                    return model.registerRequestModel.findActorByUsername(username);
                }
            });
    }

function findActorByCredentials(username, password) {
        console.log("in model");
        return ActorModel.findOne({username: username, password: password});
    }

    function findActors() {
        return ActorModel.find();
    }

    function createActor(actor) {
        if(actor.role == 'STOREOWNER' && actor.requestStatus == 'PENDING') {
            return model.registerRequestModel.createOwner(actor);
        } else {
            return ActorModel.create(actor);
        }
    }

    function findActorByFirstName(firstName) {
        return ActorModel.findOne({firstName: firstName});
    }

    function findActorByLastName(lastName) {
        return ActorModel.findOne({lastName: lastName});
    }

    function authenticateActorByEmail(email, password) {
        return ActorModel.findOne({email: email, password: password});
    }

    function authenticateActorByPhone(phone, password) {
        return ActorModel.findOne({phone: phone, password: password});
    }

    function findActorByEmail(email) {
        console.log("inside model");
        return ActorModel.findOne({email: email});
    }

    function findActorByPhone(phone) {
        console.log("inside model");
        return ActorModel.findOne({phone: phone});
    }

    function findActorById(actorId) {
        return ActorModel.findOne({_id: actorId});
    }

    function updateActor(actorId, actor) {
        return ActorModel.update({_id: actorId}, {$set: Actor});
    }

    function addProductToActorFavourites(actorId, productId) {
        return ActorModel.update({_id: actorId}, {$push: {favourite_products: productId}});
    }

    function addProductToActorLikes(actorId, productId) {
        return ActorModel.update({_id: actorId}, {$push: {liked_products: productId}});
    }

    function addProductToActorComments(actorId, productId, text, timestamp) {
        return ActorModel.update({_id: actorId}, {$push: {products_commented_on: {_apiID: productId, text: text, timestamp: timestamp}}});
    }

    function setModel(models) {
        model = models;
    }
};