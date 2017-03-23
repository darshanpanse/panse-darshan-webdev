(function () {
    angular
        .module('WebAppMaker')
        .directive('wbdvSortable', sortableDir);

    function sortableDir() {
        function linkFunc(scope, element, attributes, controller) {
            var start = -1;
            var end = -1;
            element.sortable({
                start: function (update, ui) {
                    start = $(ui.item).index();
                },
                stop: function (update, ui) {
                    end = $(ui.item).index();
                    controller.reorderWidget(start, end);
                },

                axis: 'y',
                handle:".handle"
            });
        }
        return {
            link: linkFunc,
            controller: sortableController
        };
    }

    function sortableController(WidgetService, $routeParams) {
        var vm = this;
        vm.reorderWidget = reorderWidget;

        function reorderWidget(start, end) {
            var pageId = $routeParams['pid'];
            WidgetService
                .reorderWidget(pageId, start, end)
                .success(function () {

                })
                .error(function () {

                });
        }
    }
})();

