module.exports = function () {
    var mongoose = require("mongoose");

    var RegisterRequestSchema = mongoose.Schema({
        username: {type: String, required:true},
        firstName: String,
        lastName: String,
        email: String,
        phone: Number,
        password: {type: String, required:true},
        storeId: String,
        storeName: String,
        storeAddress: String,
        role: {type: String, enum: ['STOREOWNER']},
        accountStatus: {type: String, enum: ['EXISTS', 'DELETED']},
        dateCreated: {type: Date, default: Date.now()}
    });

    return RegisterRequestSchema;
};