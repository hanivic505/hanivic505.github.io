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
			$scope.$on("refresh_data", function (e, line) {
				$log.debug("refresh_data :: targetCtrl", line);
				if (line != undefined)
					$rootScope.$broadcast("lineNodeSelected", line);
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
							return usersService.getUsersInDep().then(function (response) {
								return response;
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
			$scope.openRightsPopup = function (_obj, tmpltURL, cntrl, size = "") {
				var modalInstance = $uibModal.open({
					animation: $scope.animationsEnabled,
					templateUrl: tmpltURL,
					controller: cntrl,
					controllerAs: "vmRight",
					size: size,
					resolve: {
						settings: function () {
							var o = {
								user: _obj,
								//								linesData: linesData,
								//								rights:
								line: $scope.selectedLine
							}
							return o;
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
			$scope.filterNotAssigned = function (item) {
				var notExist = true;
				for (i = 0; i < $scope.modalObj.team.assigned.length; i++) {
					//					console.info("$scope.modalObj.team.assigned["+i+"].id",$scope.modalObj.team.assigned[i].id,"item",item)
					if ($scope.modalObj.team.assigned[i].id == item.id) {
						$scope.modalObj.team.available.splice($scope.modalObj.team.available.indexOf(item), 1)
						$log.debug("filtered out::", $scope.modalObj.team.available, item);
						//						notExist = false;
					}
				}
				return notExist;
			}
			$log.log($scope.modalObj);
			$scope.ok = function () {
				$log.info($scope.modalObj.team.assigned);
				var users = [];
				for (i = 0; i < $scope.modalObj.team.assigned.length; i++)
					users.push($scope.modalObj.team.assigned[i].id);
				usersService.assignUsers(obj, users).then(function (response) {
					$rootScope.$broadcast("refresh_data", obj);
					$uibModalInstance.close();
				});
			};
			$scope.moveItems = utilitiesServices.moveItems;

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
		}]);
		angular.module("IVRY-App").controller("ACLCtrl", ["$rootScope", "$scope", "$uibModalInstance", "utilitiesServices", "settings", "$log", "usersService", function ($rootScope, $scope, $uibModalInstance, utilitiesServices, settings, $log, usersService) {
			//			$scope.treeConfigs = {
			//				lines: {},
			//				treeObj: settings.linesData,
			//				multiSelect: true,
			//				selectedNode: {
			//					data: settings.line,
			//					type: "line"
			//				},
			//				allowEdit: false,
			//				allowFilter: true,
			//				collapsed: false
			//			};
			//			$log.debug("ACLCTRL", $scope.treeConfigs);
			//			$rootScope.$on("treeNodeSelected", function (e, line) {
			//				line.data.checked = true;
			//			});
			$log.debug(settings);

			this.rights = [];
			var _this = this;
			$scope.rightsOn = {};
			for (var j = 0; j < settings.user.accessRights.length; j++) {
				this.rights.push(settings.user.accessRights[j].id);
				$scope.rightsOn[settings.user.accessRights[j].id] = true;
			}
			$scope.ok = function () {
				_this.rights = [];
				angular.forEach($scope.rightsOn, function (val, key) {
					$log.debug("rightsOn", key, val);
					if (val)
						_this.rights.push(parseInt(key));
				});
				$log.debug($scope.rightsOn, _this.rights);
				usersService.assignRights(settings.user.id, _this.rights).then(function (response) {
					$rootScope.$broadcast("refresh_data", settings.line);
					$uibModalInstance.close();
				}, function (error) {});
			};
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
			$scope.modalObj = {
				user: settings.user.user,
				rights: $rootScope.lookups.accessRightLus
			}
		}]);
	})(Target = app.Target || (Target = {}));
})(app || (app = {}));
