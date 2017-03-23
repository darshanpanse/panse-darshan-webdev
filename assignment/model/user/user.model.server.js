module.exports = function () {

    var model = null;
    var mongoose = require('mongoose');
    mongoose.Promise = require('q').Promise;
    var UserSchema = require('./user.schema.server')();
    var UserModel = mongoose.model('UserModel', UserSchema);

    var api = {
        createUser: createUser,
        findUserByUsername: findUserByUsername,
        findUserById: findUserById,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        deleteUser: deleteUser,
        setModel: setModel
    };

    return api;

    function createUser(user) {
        return UserModel.create(user);
    }

    function findUserByUsername(username) {
        return UserModel.findOne({username: username});
    }

    function findUserByCredentials(username, password) {
        return UserModel.findOne({username: username, password: password});
    }

    function findUserById(userId) {
        return UserModel.findOne({_id: userId});
    }

    function updateUser(userId, user) {
        return UserModel.update({_id: userId}, {$set: user});
    }

    function deleteUser(userId) {
        // return UserModel.remove({_id: userId});
        return UserModel
            .findOne({_id: userId})
            .then(function (user) {
                var count = user.websites.length;
                return deleteUserWebsites(user.websites, count)
                    .then(function () {
                        return UserModel.remove({_id: userId});
                    }, function (error) {
                        return error;
                    });
            }, function (error) {
                return error;
            });
    }

    function deleteUserWebsites(websites, count) {
        if(count == 0) {
            return;
        }
        --count;
        return model.websiteModel
            .deleteWebsite(websites[count])
            .then(function () {
                return deleteUserWebsites(websites, count);
            }, function (error) {
                return error;
            });
    }

    function setModel(models) {
        model = models;
    }
};
