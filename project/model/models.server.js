module.exports = function () {
    var actorModel = require("./actor/actor.model.server.js")();
    var productModel = require("./product/product.model.server")();
    var storeModel = require("./store/store.model.server")();
    var ownerModel = require("./owner/owner.model.server")();
    var adminModel = require("./admin/admin.model.server")();
    var registerRequestModel = require("./actor/register-request.model.server")();

    var model = {
        actorModel: actorModel,
        productModel: productModel,
        storeModel: storeModel,
        ownerModel: ownerModel,
        adminModel: adminModel,
        registerRequestModel: registerRequestModel
    };

    actorModel.setModel(model);
    adminModel.setModel(model);
    productModel.setModel(model);
    storeModel.setModel(model);
    registerRequestModel.setModel(model);
    //ownerModel.setModel(model);

    return model;
};