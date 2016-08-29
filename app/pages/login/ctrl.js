var app;
(function (app) {
	'use strict';

	angular.module("IVRY-App").controller("LoginCtrl", ["$rootScope", "$scope", "$state","AuthService", function ($rootScope, $scope, $state,AuthService) {
		$scope.user = {};
		$scope.doLogin = function () {
			AuthService.login($scope.user);
//			$rootScope.user = $scope.user.userName;
//			switch ($scope.user.userName) {
//				case "SysAdmin":
//					$state.go("system");
//					break;
//				case "DepAdmin":
//					$state.go("calls-log");
//					break;
//				case "TeamLead":
//					$state.go("calls-log");
//					break;
//				case "Analyst":
//					$state.go("calls-log");
//					break;
//				default:
//					$state.go("calls-log");
//					break;
//			}
		};
	}]);
})(app || (app = {}));
