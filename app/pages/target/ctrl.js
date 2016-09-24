var app;
(function (app) {
	var Target;
	(function (Target) {
		function cntrlFn($log, $scope, $rootScope, $uibModal, linesData, targetService, linesTreeService, usersService) {
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
				$log.info("treeNodeSelected", e, node);
				$scope.lineSelected = false;
				$scope.selectedLine = null;
				$scope.lineAssignedUsers = null;
				$scope.selectedNode = node;
			});
			$scope.$on("lineNodeSelected", function (e, line) {
				$log.info("lineNodeSelected", line);
				$scope.lineSelected = true;
				$scope.selectedLine = line;
				usersService.getAssignedUsers(line).then(function (data) {
					$log.log(data);

					$scope.lineAssignedUsers = data;
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
					$log.info('Modal dismissed at: ' + new Date());
				});
			};
			$scope.openAssignPopup = function (_obj, tmpltURL, cntrl, size = "") {
				var modalInstance = $uibModal.open({
					animation: $scope.animationsEnabled,
					templateUrl: tmpltURL,
					controller: cntrl,
					size: size,
					resolve: {
						obj: function () {
							return _obj;
						},
						available: function () {
							return usersService.get().then(function (response) {
								return response.searchResults;
							});
						},
						assigned: function () {
							return usersService.getAssignedUsers(_obj).then(function (response) {
								$log.debug("AVAILABLE", response);
								var ass = [];
								for (i = 0; i < response.length; i++)
									ass.push(response[i].user);
								return ass;
							})
						}
					}
				});

				modalInstance.result.then(function (selectedItem) {
					$scope.selected = selectedItem;
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
				});
			};
		}

		angular.module("IVRY-App").controller("TargetCtrl", ["$log", "$scope", "$rootScope", "$uibModal", "linesData", "targetService", "linesTreeService", "usersService", cntrlFn]);

		angular.module("IVRY-App").controller("AssignUsersCtrl", ["$log", "$rootScope", "$scope", "$uibModalInstance", "utilitiesServices", "obj", "available", "assigned", "usersService", function ($log, $rootScope, $scope, $uibModalInstance, utilitiesServices, obj, available, assigned, usersService) {
			$log.info("AssignUsersCtrl", obj, available, assigned);
			$scope.modalObj = {
				line: {
					title: obj.lineName
				},
				team: {
					available: available,
					assigned: assigned
				}
			};
			$scope.filterNotAssigned=function(item){
				var notExist=true;
				for(i=0;i<$scope.modalObj.team.assigned.length;i++)
					if($scope.modalObj.team.assigned[i].id==item.id)
						notExist=false;
				return notExist;
			}
			$log.log($scope.modalObj);
			$scope.ok = function () {
				$log.info($scope.modalObj.team.assigned);
				var users = [];
				for (i = 0; i < $scope.modalObj.team.assigned.length; i++)
					users.push($scope.modalObj.team.assigned[i].id);
				usersService.assignUsers(obj, users).then(function (response) {
					$rootScope.message = {
						body: "User(s) Assigned Successfully to line " + obj.lineName,
						type: 'success',
						duration: 5000,
					};
					$uibModalInstance.close();
				}, function (error) {
					$rootScope.message = {
						body: error.data.message,
						type: 'danger',
						duration: 5000,
					};

				});
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
