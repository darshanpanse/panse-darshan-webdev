module.exports = function () {

    var model = null;

    var api = {
        createWebsiteForUser: createWebsiteForUser,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById: findWebsiteById,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite,
        setModel: setModel
    };

    var mongoose = require('mongoose');
    mongoose.Promise = require('q').Promise;
    var WebsiteSchema = require('./website.schema.server')();
    var WebsiteModel = mongoose.model('WebsiteModel', WebsiteSchema);

    return api;

    function createWebsiteForUser(userId, website) {
        return WebsiteModel
            .create({
                _user: userId,
                name: website.name,
                description: website.description
            })
            .then(function (website) {
                return model.userModel
                    .findUserById(userId)
                    .then(function (user) {
                        user.websites.push(website._id);
                        user.save();
                        return website;
                    }, function (error) {
                        return error;
                    });
            }, function (error) {
                return error;
            });
    }

    function findAllWebsitesForUser(userId) {
        return WebsiteModel.find({_user: userId});
    }

    function findWebsiteById(websiteId) {
        return WebsiteModel.findOne({_id: websiteId});
    }

    function updateWebsite(websiteId, website) {
        return WebsiteModel.update({_id: websiteId},
            {$set:
                {
                    name: website.name,
                    description: website.description
                }
            });
    }

    function deleteWebsite(websiteId) {
        console.log("hello");
        // return WebsiteModel.remove({_id: websiteId});
        return WebsiteModel
            .findOne({_id: websiteId})
            .then(function (website) {
                console.log("1");
                var websiteUserId = website._user;
                return deleteWebsiteFromUser(websiteUserId, websiteId)
                    .then(function () {
                        console.log("2");
                        var count = website.pages.length;
                        return deleteWebsitePages(website.pages, count)
                            .then(function (response) {
                                return WebsiteModel.remove({_id: websiteId});
                            }, function (error) {
                                return error;
                            });
                    }, function (error) {
                        return error;
                    });
            }, function (error) {
                return error;
            });
    }

    function deleteWebsiteFromUser(userId, websiteId) {
        return model.userModel
            .findUserById(userId)
            .then(function (user) {
                for(var u in user.websites) {
                    if(user.websites[u] == websiteId) {
                        user.websites.splice(u,1);
                        user.save();
                        return;
                    }
                }
            }, function (error) {
                return error;
            });
    }

    function deleteWebsitePages(pages, count) {
        if(count == 0) {
            return "hello";
        }
        --count;
        return model.pageModel
            .deletePage(pages[count])
            .then(function () {
                return deleteWebsitePages(pages, count);
            }, function (error) {
                return error;
            });
    }

    function setModel(models) {
        model = models;
    }
};
