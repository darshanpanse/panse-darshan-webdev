(function () {
    angular
        .module("CatalogApp")
        .factory("CustomerService", CustomerService);

    function CustomerService($http) {
        var api = {
            "createCustomer" : createCustomer,
            //"findCustomerById" : findCustomerById,
            //"findCustomerByUsername" : findCustomerByUsername,
            "findCustomerByEmail" : findCustomerByEmail,
            "findCustomerByPhone" : findCustomerByPhone,
            "findCustomerByCredentials" : findCustomerByCredentials
            //"updateCustomer" : updateCustomer,
            //"deleteCustomer" : deleteCustomer
        };

        return api;

        function createCustomer(customer) {
            console.log("service client");
            return $http.post("/api/customer", customer);
        }

        function findCustomerByEmail(email) {
            return $http.get("/api/customer-email?email="+email);
        }

        function findCustomerByPhone(phone) {
            return $http.get("/api/customer-phone?phone="+phone);
        }

        function findCustomerByCredentials(identification, password) {
            return $http.get("/api/customer?identification="+identification+"&password="+password);
        }
    }
})();