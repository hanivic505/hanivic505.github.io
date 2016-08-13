var app;
(function (app) {
	'use strict';
	var System;
	(function (System) {
		var cntrlFn = (function () {
			function cntrlFn($scope, $rootScope) {
//				$rootScope.user = "SysAdmin";
				$scope.switchStatus = true;
			}
			return cntrlFn;
		})();

		angular.module("IVRY-App").controller("SystemCtrl", ["$scope", "$rootScope", cntrlFn]);

	})(System = app.System || (System = {}));
})(app || (app = {}));
