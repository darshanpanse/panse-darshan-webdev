module.exports = function () {
    var model = null;
    var mongoose = require('mongoose');
    mongoose.Promise = require('q').Promise;
    var ProductSchema = require("./product.schema.server")();
    var ProductModel = mongoose.model('ProductModel', ProductSchema);

    var api = {
        setModel: setModel
    };

    function setModel(models) {
        model = models;
    }
};