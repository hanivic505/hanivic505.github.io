var app;
(function (app) {
	'use strict';
	var Users;
	(function (Users) {
		var cntrlFn = (function () {
			function cntrlFn($scope, $rootScope) {
				$rootScope.user = "DepAdmin";
				$scope.switchStatus = true;
			}
			return cntrlFn;
		})();

		angular.module("IVRY-App").controller("UsersCtrl", ["$scope", "$rootScope", cntrlFn]);

	})(Users = app.Users || (Users = {}));
})(app || (app = {}));
