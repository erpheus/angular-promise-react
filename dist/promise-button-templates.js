angular.module('templates-dist', ['promise-button.tpl.html']);

angular.module("promise-button.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("promise-button.tpl.html",
    "<ng-switch on=\"status\">\n" +
    "	<span ng-switch-default ng-transclude></span>\n" +
    "	<i class=\"fa fa-circle-o-notch icon-spin\" ng-switch-when=\"loading\"></i>\n" +
    "	<i class=\"fa fa-check\" ng-switch-when=\"done\"></i>\n" +
    "</ng-switch>");
}]);
