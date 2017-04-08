module.exports = function () {
    var model = null;
    var mongoose = require('mongoose');
    mongoose.Promise = require('q').Promise;
    var StoreSchema = require("./store.schema.server")();
    var StoreModel = mongoose.model('StoreModel', StoreSchema);

    var api = {
        setModel: setModel
    };

    function setModel(models) {
        model = models;
    }
};