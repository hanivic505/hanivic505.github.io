var app;
(function (app) {
	var Target;
	(function (Target) {
		var cntrlFn = (function () {
			function cntrlFn($scope, $rootScope, $uibModal, linesTreeService, dbService) {
				$rootScope.user = "DepAdmin";
				$scope.treeConfig = {
					lines: {},
					treeObj: linesTreeService,
					multiSelect: false,
					selectedNode: null,
					allowEdit: true,
					allowFilter: true
				};
				$scope.linesTreeObj = linesTreeService;
				$scope.dbService = dbService;
				$rootScope.$on("dbServiceAdded", function () {
					$scope.editObj = null;
				});
				$scope.$on("treeNodeSelected", function (e, node) {
					console.info("treeNodeSelected", e, node)
					$scope.lineAssignedUsers = null;
					$scope.selectedNode = node;
				});
				$scope.$on("lineNodeSelected", function (e, list) {
					console.info("lineNodeSelected", e, list)
					$scope.lineAssignedUsers = list;
				});
				$scope.openPopup = function (_obj, tmpltURL, cntrl, size = "") {
					var modalInstance = $uibModal.open({
						animation: $scope.animationsEnabled,
						templateUrl: tmpltURL,
						controller: cntrl,
						size: size,
						resolve: {
							obj: function () {
								return _obj;
							}
						}
					});

					modalInstance.result.then(function (selectedItem) {
						$scope.selected = selectedItem;
					}, function () {
						console.info('Modal dismissed at: ' + new Date());
					});
				};
			}
			return cntrlFn;
		})();

		angular.module("IVRY-App").controller("TargetCtrl", ["$scope", "$rootScope", "$uibModal", "linesTreeService", "dbService", cntrlFn]);

		angular.module("IVRY-App").controller("AssignUsersCtrl", ["$scope", "$uibModalInstance", "obj", function ($scope, $uibModalInstance, obj) {
			console.info("AssignUsersCtrl", obj);
			$scope.modalObj = {
				line: {
					title: "Line 1"
				},
				team: {
					available: [{
						firstName: "Jack Nicklson"
					}, {
						firstName: "Adam Sandler"
					}, {
						firstName: "Tom Hanks"
					}],
					assigned: obj
				}
			};
			console.log($scope.modalObj);
			$scope.ok = function () {
				$uibModalInstance.close();
			};

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
		}]);
		angular.module("IVRY-App").controller("ACLCtrl", ["$scope", "$uibModalInstance", "linesTreeService", function ($scope, $uibModalInstance, linesTreeService) {
			$scope.treeConfigs = {
				lines: {},
				treeObj: linesTreeService,
				multiSelect: true,
				selectedNode: null,
				allowEdit: false,
				allowFilter: true
			};
			$scope.ok = function () {
				$uibModalInstance.close();
			};

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
			$scope.modalObj = {
				rights: [
					{
						name: "Media Playback"
					},
					{
						name: "Media Export"
					},
					{
						name: "Mark"
					},
					{
						name: "Tag"
					},
					{
						name: "Transcribe"
					},
					{
						name: "Comment"
					},
					{
						name: "lock"
					},
					{
						name: "Delete"
					},
					{
						name: "Edit"
					},
					{
						name: "Create"
					},

			]
			}
		}]);
	})(Target = app.Target || (Target = {}));
})(app || (app = {}));
