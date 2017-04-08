module.exports = function () {
    var customerModel = require("./customer/customer.model.server.js")();
    var productModel = require("./product/product.model.server")();
    var storeModel = require("./store/store.model.server")();
    var ownerModel = require("./owner/owner.model.server")();

    var model = {
        customerModel: customerModel,
        productModel: productModel,
        storeModel: storeModel,
        ownerModel: ownerModel
    };

    customerModel.setModel(model);
    //productModel.setModel(model);
    //storeModel.setModel(model);
    //ownerModel.setModel(model);

    return model;
};