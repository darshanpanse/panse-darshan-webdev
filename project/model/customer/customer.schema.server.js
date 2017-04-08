module.exports = function () {
    var mongoose = require("mongoose");

    var CustomerSchema = mongoose.Schema({
        firstName: String,
        lastName: String,
        email: String,
        phone: Number,
        password: String,
        address: String,
        state: String,
        city: String,
        zipCode: Number,
        gender: String,
        dob: {type: Date},
        favourite_products: [String],
        liked_products: [String],
        products_commented_on: [String],
        followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'CustomerModel'}],
        following: [{type: mongoose.Schema.Types.ObjectId, ref: 'CustomerModel'}],
        favourite_stores: [String],
        liked_stores: [String],
        stores_commented_on: [String],
        display_picture_url: String,
        description: String,
        dateCreated: {type: Date, default: Date.now()}
    });

    return CustomerSchema;
};