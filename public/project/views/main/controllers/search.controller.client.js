(function () {
    angular
        .module("CatalogApp")
        .controller("SearchController", SearchController);

    function SearchController($location, SearchService) {
        var vm = this;
        vm.search = search;

        function search(productName, location) {
            SearchService
                .searchProduct(productName, location)
                .success(function (searchResult) {
                    console.log(searchResult);
                    $location.url("/search/product/"+productName+"/location/"+location);
                })
                .error(function () {
                    vm.error = "No products to display";
                });
        }
    }
})();