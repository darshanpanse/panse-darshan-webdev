module.exports = function () {
    var mongoose = require("mongoose");

    var ProductSchema = mongoose.Schema({
        apiID: String,
        storeApiID: String,
        image: String,
        original_price: Number,
        price: Number,
        title: String,
        url: String,
        views: {type: Number, default: 0},
        likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'ActorModel'}],
        comments: [{_user: {type: mongoose.Schema.Types.ObjectId, ref: 'ActorModel'}, text: String, timestamp: Date}],
        favourites: [{type: mongoose.Schema.Types.ObjectId, ref: 'ActorModel'}]
    });

    return ProductSchema;
};
