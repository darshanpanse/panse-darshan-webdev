module.exports = function () {
    var model = null;
    var mongoose = require('mongoose');
    mongoose.Promise = require('q').Promise;
    var CustomerSchema = require("./customer.schema.server.js")();
    var CustomerModel = mongoose.model('CustomerModel', CustomerSchema);

    var api = {
        createCustomer: createCustomer,
        findCustomerByFirstName: findCustomerByFirstName,
        findCustomerByLastName: findCustomerByLastName,
        findCustomerById: findCustomerById,
        authenticateCustomerByEmail: authenticateCustomerByEmail,
        authenticateCustomerByPhone: authenticateCustomerByPhone,
        findCustomerByEmail: findCustomerByEmail,
        findCustomerByPhone: findCustomerByPhone,
        updateCustomer: updateCustomer,
        //deleteCustomer: deleteCustomer,
        setModel: setModel
    };

    return api;

    function createCustomer(customer) {
        console.log("inside model");
        return CustomerModel.create(customer);
    }

    function findCustomerByFirstName(firstName) {
        return CustomerModel.findOne({firstName: firstName});
    }

    function findCustomerByLastName(lastName) {
        return CustomerModel.findOne({lastName: lastName});
    }

    function authenticateCustomerByEmail(email, password) {
        return CustomerModel.findOne({email: email, password: password});
    }

    function authenticateCustomerByPhone(phone, password) {
        return CustomerModel.findOne({phone: phone, password: password});
    }

    function findCustomerByEmail(email) {
        console.log("inside model");
        return CustomerModel.findOne({email: email});
    }

    function findCustomerByPhone(phone) {
        console.log("inside model");
        return CustomerModel.findOne({phone: phone});
    }

    function findCustomerById(customerId) {
        return CustomerModel.findOne({_id: customerId});
    }

    function updateCustomer(customerId, customer) {
        return CustomerModel.update({_id: customerId}, {$set: customer});
    }

    function setModel(models) {
        model = models;
    }
};