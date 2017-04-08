(function () {
    angular
        .module("CatalogApp")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileSelfController", ProfileSelfController);
    
    function LoginController($location, CustomerService) {
        var vm = this;
        vm.login = login;

        function login(customer) {
            var promise = CustomerService.findCustomerByCredentials(customer.identification, customer.password);
            promise
                .success(function (loginCustomer) {
                    $location.url("/customer/" + loginCustomer._id);
                })
                .error(function () {
                    vm.alert = "Incorrect Email ID / Phone Number or Password";
                });
        }
    }
    
    function RegisterController($location, CustomerService) {
        var vm = this;
        vm.register = register;
        function register(newCustomer) {
            if(newCustomer.password === newCustomer.confirmPassword) {
                CustomerService
                    .findCustomerByEmail(newCustomer.email)
                    .success(function (customer) {
                        vm.message = "Account with this email id already exists";
                    })
                    .error(function () {
                        CustomerService
                            .findCustomerByPhone(newCustomer.phone)
                            .success(function (customer) {
                                vm.message = "Account with this phone number already exists";
                            })
                            .error(function () {
                                CustomerService
                                    .createCustomer(newCustomer)
                                    .success(function (customer) {
                                        console.log(customer);
                                        $location.url("/customer/"+ customer._id);
                                    })
                                    .error(function () {
                                        vm.error = "Could not register. Server not responding"
                                    })
                            })
                    })
            } else {
                vm.error = "Passwords do not match"
            }
        }
    }
    
    function ProfileSelfController() {
        var vm = this;
    }
})();