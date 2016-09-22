var app;
(function (app) {
	var Target;
	(function (Target) {
		function cntrlFn($scope, $rootScope, $uibModal, linesData, targetService, linesTreeService, usersService) {
			//				$rootScope.user = "DepAdmin";
			var _this = this;
			$scope.treeConfig = {
				lines: {},
				treeObj: linesData,
				multiSelect: false,
				selectedNode: null,
				allowEdit: true,
				allowFilter: true
			};
			$scope.linesTreeObj = linesData;
			$scope.dbService = targetService;
			$rootScope.$on("dbServiceAdded", function () {
				$scope.editObj = null;
			});
			$scope.addCase = function (obj) {
				$scope.dbService.add(1, obj);
				$scope.editObj = null;
			}
			$scope.$on("treeNodeSelected", function (e, node) {
				console.info("treeNodeSelected", e, node)
				$scope.lineAssignedUsers = null;
				$scope.selectedNode = node;
			});
			$scope.$on("lineNodeSelected", function (e, line) {
				console.info("lineNodeSelected");
				usersService.get().then(function (data) {
					console.log(data);
					$scope.lineAssignedUsers = data.searchResults;
				})
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
						},
						linesData: function () {
							return linesData;
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

		angular.module("IVRY-App").controller("TargetCtrl", ["$scope", "$rootScope", "$uibModal", "linesData", "targetService", "linesTreeService", "usersService", cntrlFn]);

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
