/**
 * Created by darshan on 2/9/17.
 */

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
            var loginUser = UserService.findUserByCredentials(user.username, user.password);
            if(loginUser != null) {
                $location.url("/user/" + loginUser._id);
            }
            else {
                vm.alert = "Unable to login";
            }
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(newUser) {
            var user = UserService.createUser(newUser);
            if(user != null) {
                $location.url("/user/" + user._id);
            }
            else {
                vm.alert = "Unable to register!"
            }
        }
    }

    function ProfileController($routeParams, UserService) {
        var vm = this;
        vm.updateUser = updateUser;

        vm.userId = $routeParams["uid"];

        function init() {
            vm.user = UserService.findUserById(vm.userId);
        }
        init();

        function updateUser(newUser) {
            var user = UserService.updateUser(vm.userId, newUser);
            if(user != null) {
                vm.message = "User Updated Successfully!";
            }
            else {
                vm.error = "User not updated!";
            }
        }
    }
})();
