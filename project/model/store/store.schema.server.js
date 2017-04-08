module.exports = function () {
    var mongoose = require("mongoose");

    var StoreSchema = mongoose.Schema({
        _owner: {type: mongoose.Schema.Types.ObjectId, ref: 'StoreOwnerModel'},
        views: [{type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'}],
        likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'}],
        comments: [{_user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
            text: String}],
        favourite: [{type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'}],
    });

    return StoreSchema;
};
