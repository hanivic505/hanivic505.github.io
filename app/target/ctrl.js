var app;
(function(app){
	var Target;
	(function(Target){
		var cntrlFn = (function () {
			function cntrlFn($scope, $rootScope,linesTreeService) {
				$rootScope.user = "DepAdmin";

				$scope.linesTreeObj = linesTreeService;
			}
			return cntrlFn;
		})();

		angular.module("IVRY-App").controller("TargetCtrl", ["$scope", "$rootScope","linesTreeService", cntrlFn]);

	})(Target=app.Target ||(Target={}));
})(app || (app={}));
