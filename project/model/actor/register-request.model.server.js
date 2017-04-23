module.exports = function () {
    var model = null;
    var mongoose = require('mongoose');
    mongoose.Promise = require('q').Promise;
    var RegisterRequestSchema = require("./register-request.schema.server")();
    var RegisterRequestModel = mongoose.model('RegisterRequestModel', RegisterRequestSchema);

    var api = {
        "createOwner": createOwner,
        "findAllRegistrationRequests": findAllRegistrationRequests,
        "deleteRequest": deleteRequest,
        "findActorByUsername": findActorByUsername,
        "setModel": setModel
    };

    return api;

    function findActorByUsername(username) {
        return RegisterRequestModel.findOne({username: username});
    }
    
    function deleteRequest(requestId) {
        return RegisterRequestModel.remove({_id: requestId});
    }

    function findAllRegistrationRequests() {
        return RegisterRequestModel.find();
    }

    function createOwner(owner) {
        return RegisterRequestModel.create(owner);
    }

    function setModel(models) {
        model = models;
    }
};