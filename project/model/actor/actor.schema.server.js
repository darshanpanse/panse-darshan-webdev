module.exports = function () {
    var mongoose = require("mongoose");

    var ActorSchema = mongoose.Schema({
        username: {type: String, required:true},
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
        products_commented_on: [{_apiID: String, text: String, timestamp: Date}],
        followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'ActorModel'}],
        following: [{type: mongoose.Schema.Types.ObjectId, ref: 'ActorModel'}],
        favourite_stores: [String],
        liked_stores: [String],
        stores_commented_on: [{_apiID: String, text: String, timestamp: Date}],
        display_picture_url: String,
        description: String,
        role: {type: String, enum:['CUSTOMER', 'STOREOWNER', 'ADMIN']},
        storeId: String,
        storeName: String,
        storeAddress: String,
        accountStatus: {type: String, enum: ['EXISTS', 'DELETED']},
        requestStatus: {type: String, enum: ['PENDING', 'APPROVED']},
        google: {
            id:    String,
            token: String
        },
        // facebook: {
        //     id:    String,
        //     token: String
        // },
        dateCreated: {type: Date, default: Date.now()}
    });

    return ActorSchema;
};