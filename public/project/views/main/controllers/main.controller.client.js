(function () {
    angular
        .module("CatalogApp")
        .controller("MainPageController", MainPageController)

    function MainPageController($location, ActorService) {
        var vm = this;
        vm.search = search;
        vm.checkLogProfNav = checkLogProfNav;
        vm.checkLogRegNav = checkLogRegNav;

        function init() {
            $('.scroller-1').click(function(event) {
                // Preventing default action of the event
                event.preventDefault();
                // Getting the height of the document
                $('html, body').animate({ scrollTop: $("#about").offset().top }, 600);
            });

            $('.scroller-2').click(function(event) {
                // Preventing default action of the event
                event.preventDefault();
                // Getting the height of the document
                $('html, body').animate({ scrollTop: $("#contact-us").offset().top }, 600);
            });

            $('#scroller-3').click(function(event) {
                // Preventing default action of the event
                event.preventDefault();
                // Getting the height of the document
                $('html, body').animate({ scrollTop: $("#search").offset().top }, 600);
            });
            checkLogin();
        }init();

        function search(productName, location) {
            $location.url("/search/product/"+productName+"/location/"+location+"/radius/10/sorting/relevance/price/0:10000");
        }

        function checkLogin() {
            //var deferred = $q.defer();
            ActorService
                .loggedIn()
                .then(function (actor) {
                    if(actor) {
                        vm.currentActor = actor;
                        if(actor == "0") {
                            vm.logProf = "login";
                            vm.logReg = "register";
                            vm.logProf_icon = "fa-sign-in";
                            vm.logReg_icon = "fa-user";
                        } else {
                            vm.logProf = "profile";
                            vm.logReg = "logout";
                            vm.logProf_icon = "fa-user";
                            vm.logReg_icon = "fa-sign-out";
                        }
                    }
                });
            //return deferred.promise;
        }

        function checkLogProfNav() {
            ActorService
                .loggedIn()
                .then(function (actor) {
                    if(actor) {
                        if(actor == "0") {
                            $location.url("/actor/login");
                        } else {
                            if(actor.role == "STOREOWNER") {
                                $location.url("/actor/storeowner");
                            } else {
                                $location.url("/actor/profile");
                            }
                        }
                    }
                });
        }

        function checkLogRegNav() {
            ActorService
                .loggedIn()
                .then(function (actor) {
                    if(actor) {
                        if(actor == "0") {
                            $location.url("/actor/register");
                        } else {
                            logout();
                        }
                    }
                });
        }

        function logout() {
            ActorService
                .logout()
                .then(function (response) {
                    checkLogin();
                    $location.url("/");
                });
        }
    }
})();
