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
            var promise = UserService.findUserByCredentials(user.username, user.password);
            promise
                .success(function (loginUser) {
                    $location.url("/user/" + loginUser._id);
                })
                .error(function () {
                    vm.alert = "Unable to login";
                });
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(newUser) {
            UserService
                .findUserByUsername(newUser.username)
                .success(function (user) {
                    vm.error = "Username is already taken"
                })
                .error(function () {
                    UserService
                        .createUser(newUser)
                        .success(function (user) {
                            $location.url('/user/' + user._id);
                        })
                });
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
