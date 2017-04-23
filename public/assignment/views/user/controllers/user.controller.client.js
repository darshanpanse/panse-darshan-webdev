(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        function login(user) {
            if (user.username == "" && user.password != "") {
                vm.alert = "Username cannot be empty";
            }
            else if (user.password == "" && user.username != "") {
                vm.alert = "Password cannot be empty";
            }
            else if(user.username == "" && user.password == "") {
                vm.alert = "Username and Password cannot be empty";
            }
            else {
                var promise = UserService.findUserByCredentials(user.username, user.password);
                promise
                    .success(function (loginUser) {
                        $location.url("/actor/" + loginUser._id);
                    })
                    .error(function () {
                        vm.alert = "Unable to login";
                    });
            }
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(newUser) {
            if(newUser.password === newUser.verifyPassword) {
                UserService
                    .findUserByUsername(newUser.username)
                    .success(function (user) {
                        vm.error = "Username is already taken"
                    })
                    .error(function () {
                        UserService
                            .createUser(newUser)
                            .success(function (user) {
                                $location.url('/actor/' + user._id);
                            })
                            .error(function () {
                                vm.error = "Could not Register User. Server not responding!"
                            })
                    });
            } else {
                vm.error = "Passwords do not match";
            }
        }
    }

    function ProfileController($routeParams, UserService, $location) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;

        function init() {
            vm.userId = $routeParams["uid"];

            var promise = UserService.findUserById(vm.userId);
            promise.success(function (loginUser) {
                vm.user = loginUser;
            });
        }
        init();

        function updateUser(newUser) {
            UserService
                .updateUser(vm.userId, newUser)
                .success(function () {
                    vm.message = "User Updated Successfully!";
                })
                .error(function () {
                    vm.error = "User not updated!";
                });

        }

        function deleteUser() {
            UserService
                .deleteUser(vm.userId)
                .success(function () {
                    $location.url("/login");
                })
                .error(function () {
                    vm.error = "Could not delete account";
                });
        }
    }
})();
