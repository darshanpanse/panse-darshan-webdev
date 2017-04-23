module.exports = function () {
    var mongoose = require("mongoose");

    var StoreSchema = mongoose.Schema({
        apiID: String,
        locations: [{address: String, city: String, id: String, lat: Number, lng: Number, phone: String, state: String, zipcode: String}],
        locations_found: Number,
        name: String,
        website: String,
        _owner: {type: mongoose.Schema.Types.ObjectId, ref: 'ActorModel'},
        views: {type: Number, default: '0'},
        likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'ActorModel'}],
        comments: [{_user: {type: mongoose.Schema.Types.ObjectId, ref: 'ActorModel'}, text: String, timestamp: Date}],
        favourites: [{type: mongoose.Schema.Types.ObjectId, ref: 'ActorModel'}]
    });

    return StoreSchema;
};
