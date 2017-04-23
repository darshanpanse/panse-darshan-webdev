(function () {
    angular
        .module("CatalogApp")
        .factory("AdminService", AdminService);

    function AdminService($http) {

        var api = {
            findAdminByCredentials: findAdminByCredentials,
            findAllCustomers: findAllCustomers
        };
        return api;

        function findAdminByCredentials(username, password) {
            return $http.get("/api/admin?username="+username+"&password="+password);
        }

        function findAllCustomers() {
            return $http.get("/api/customers");
        }
    }
})();