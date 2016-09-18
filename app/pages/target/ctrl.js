var app;
(function (app) {
	var Target;
	(function (Target) {
		var cntrlFn = (function () {
			function cntrlFn($scope, $rootScope, $uibModal, linesData, dbService) {
//				$rootScope.user = "DepAdmin";
				$scope.treeConfig = {
					lines: {},
					treeObj: linesData,
					multiSelect: false,
					selectedNode: null,
					allowEdit: true,
					allowFilter: true
				};
				$scope.linesTreeObj = linesData;
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

		angular.module("IVRY-App").controller("TargetCtrl", ["$scope", "$rootScope", "$uibModal", "linesData", "dbService", cntrlFn]);

		angular.module("IVRY-App").controller("AssignUsersCtrl", ["$scope", "$uibModalInstance", "utilitiesServices", "obj", function ($scope, $uibModalInstance, utilitiesServices, obj) {
			console.info("AssignUsersCtrl", obj);
			$scope.modalObj = {
				line: {
					title: "Line 1"
				},
				team: {
					available: [{
						firstName: "Jack",
						lastName: "Nicklson"
					}, {
						firstName: "Adam",
						lastName: "Sandler"
					}, {
						firstName: "Tom",
						lastName: "Hanks"
					}],
					assigned: obj
				}
			};
			console.log($scope.modalObj);
			$scope.ok = function () {
				$uibModalInstance.close();
			};
			$scope.moveItems = utilitiesServices.moveItems;

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
		}]);
		angular.module("IVRY-App").controller("ACLCtrl", ["$scope", "$uibModalInstance", "utilitiesServices", "linesData", function ($scope, $uibModalInstance, utilitiesServices, linesData) {
			$scope.treeConfigs = {
				lines: {},
				treeObj: linesData,
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
