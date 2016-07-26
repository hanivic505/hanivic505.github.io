var app;
(function (app) {
	var Rights;
	(function (Rights) {
		var cntrlFn = (function () {
			function cntrlFn($scope, $rootScope, $uibModal, linesTreeService, departmentsService, dbService) {
				$rootScope.user = "DepAdmin";
				$scope.treeConfig = {
					lines: {},
					treeObj: linesTreeService,
					multiSelect: true,
					selectedNode: null,
					allowEdit: false,
					allowFilter: true
				};
				$scope.treeUsersConfig = {
					lines: {},
					treeObj: departmentsService,
					multiSelect: false,
					selectedNode: null,
					allowEdit: false,
					allowFilter: true,
					secondLevel: 'teams',
					thirdLevel: 'teamAnalysts',
					thirdLevelTitle: 'loginName'
				};
				$scope.config = {
					rights: [
						{
							id:1,
							name: "Media Playback"
					},
						{
							id:2,
							name: "Media Export"
					},
						{
							id:3,
							name: "Mark"
					},
						{
							id:4,
							name: "Tag"
					},
						{
							id:5,
							name: "Transcribe"
					},
						{
							id:6,
							name: "Comment"
					},
						{
							id:7,
							name: "lock"
					},
						{
							id:8,
							name: "Delete"
					},
						{
							id:9,
							name: "Edit"
					},
						{
							id:10,
							name: "Create"
					},

					]
				};
			}
			return cntrlFn;
		})();
		angular.module("IVRY-App").controller("RightsCtrl", ["$scope", "$rootScope", "$uibModal", "linesTreeService", "departmentsService", "dbService", cntrlFn]);

	})(Rights = app.Rights || (Rights = {}));
})(app || (app = {}));
