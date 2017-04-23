module.exports = function () {
    var model = null;
    var mongoose = require('mongoose');
    mongoose.Promise = require('q').Promise;
    var AdminSchema = require("./admin.schema.server.js")();
    var AdminModel = mongoose.model('AdminModel', AdminSchema);

    var api = {
        findAdminByCredentials: findAdminByCredentials,
        findAllCustomers: findAllCustomers,
        setModel: setModel
    };
    return api;

    function findAdminByCredentials(username, password) {
        return AdminModel.findOne({username: username, password: password});
    }

    function findAllCustomers() {
        return model.customerModel
                .findCustomers()
                .then(function (customers) {
                if(customers) {
                    res.json(customers)
                }
                else {
                    res.sendStatus(404);
                }
            }, function (error) {
                res.send(error);
            });
    }

    function setModel(models) {
        model = models;
    }
};