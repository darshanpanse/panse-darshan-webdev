module.exports = function () {
    var mongoose = require("mongoose");

    var StoreOwnerSchema = mongoose.Schema({
        _store: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: Number,
        dob: {type: Date},
        password: String,
        address: String,
        state: String,
        city: String,
        zipCode: Number,
        gender: String,
        dateCreated: {type: Date, default: Date.now()}
    });

    return StoreOwnerSchema;
};