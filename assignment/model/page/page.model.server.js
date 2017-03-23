module.exports = function () {

    var model = null;

    var api = {
        createPage: createPage,
        findAllPagesForWebsite: findAllPagesForWebsite,
        findPageById: findPageById,
        updatePage: updatePage,
        deletePage: deletePage,
        setModel: setModel
    }

    var mongoose = require('mongoose');
    mongoose.Promise = require('q').Promise;
    var PageSchema = require("./page.schema.server")();
    var PageModel = mongoose.model('PageModel', PageSchema);

    return api;

    function createPage(websiteId, page) {
        return PageModel
            .create({
                _website: websiteId,
                name: page.name,
                title: page.title,
                description: page.description
            })
            .then(function (page) {
                return model.websiteModel
                    .findWebsiteById(websiteId)
                    .then(function (website) {
                        website.pages.push(page._id);
                        website.save();
                        return page;
                    }, function (error) {
                        return error;
                    });
            }, function (error) {
                return error;
            });
    }

    function findAllPagesForWebsite(websiteId) {
        return PageModel.find({_website: websiteId});
    }

    function findPageById(pageId) {
        return PageModel.findOne({_id: pageId});
    }

    function updatePage(pageId, page) {
        return PageModel.update({_id: pageId},
            {$set:
                {
                    name: page.name,
                    title: page.title,
                    description: page.description
                }
            });
    }

    function deletePage(pageId) {
        // return PageModel.remove({_id: pageId});
        return PageModel
            .findOne({_id: pageId})
            .then(function (page) {
                var pageWebsiteId = page._website;
                return deletePageFromWebsite(pageWebsiteId, pageId)
                    .then(function () {
                        return deletePageWidgets(pageId)
                            .then(function () {
                                return PageModel.remove({_id: pageId});
                            }, function (error) {
                                return error
                            });
                    }, function (error) {
                        return error;
                    });
            }, function (error) {
                return error;
            });
    }

    function deletePageFromWebsite(websiteId, pageId) {
        return model.websiteModel
            .findWebsiteById(websiteId)
            .then(function (website) {
                for(var p in website.pages) {
                    if(website.pages[p] == pageId) {
                        website.pages.splice(p,1);
                        website.save();
                        return;
                    }
                }
            }, function (error) {
                return error;
            });
    }

    function deletePageWidgets(pageId) {
        return model.widgetModel
            .deleteManyWidgets(pageId)
            .then(function () {
                return;
            }, function (error) {
                return error;
            });
    }

    function setModel(models) {
        model = models;
    }
};
