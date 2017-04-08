module.exports = function () {
    var model = null;
    var mongoose = require('mongoose');
    mongoose.Promise = require('q').Promise;
    var StoreOwnerSchema = require("./owner.schema.server")();
    var StoreOwnerModel = mongoose.model('StoreOwnerModel', StoreOwnerSchema);

    var api = {
        setModel: setModel
    };

    function setModel(models) {
        model = models;
    }
};