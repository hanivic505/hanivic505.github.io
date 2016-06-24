var app;
(function(app){
	var Target;
	(function(Target){
		var cntrlFn = (function () {
			function cntrlFn($scope, $rootScope,linesTreeService,dbService) {
				$rootScope.user = "DepAdmin";
				$scope.treeConfig={
					lines:{},
					treeObj:linesTreeService,
					multiSelect:false,
					selectedNode:null
				};
				$scope.linesTreeObj = linesTreeService;
				$scope.dbService=dbService;
				$rootScope.$on("dbServiceAdded",function(){
					$scope.editObj=null;
				});
				$scope.$on("treeNodeSelected",function(e,node){
					$scope.selectedNode=node;
				});
			}
			return cntrlFn;
		})();

		angular.module("IVRY-App").controller("TargetCtrl", ["$scope", "$rootScope","linesTreeService","dbService", cntrlFn]);

	})(Target=app.Target ||(Target={}));
})(app || (app={}));
