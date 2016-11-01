var app;
(function (app) {
	'use strict';
	var Team;
	var User;
	(function (Team, User) {
		var cntrlFn = (function () {
			function cntrlFn($scope, $rootScope, $log, $uibModal, ctrlData, dbService, teamService, departmentsService, usersService) {
				var _this = this;
				//				$rootScope.user = "DepAdmin";
				$scope.columns = {
					childs: []
				};
				$scope.columns.childs = $rootScope.teamsColumns;
				$scope.currentPage = 1;
				$scope.numPerPage = 10;
				$scope.setPage = function (pageNo) {
					$scope.currentPage = pageNo;
				};

				$scope.pageChanged = function () {
					$log.log('Page changed to: ' + $scope.currentPage);
				};
				$scope.maxSize = 5;
				$scope.bigTotalItems = 175;
				$scope.bigCurrentPage = 1;
				$scope.paginate = function (value) {
					var begin, end, index;
					begin = ($scope.currentPage - 1) * $scope.numPerPage;
					end = begin + $scope.numPerPage;
					index = _this.filteredList.searchResults.indexOf(value);
					return (begin <= index && index < end);
				};
				$scope.isFilterOn = false;
				$scope.fltrObj = {};
				this.editObj = {};
				this.filteredList = [];

				this.initData = function () {
					teamService.get().then(function (response) {
						$log.debug("Teams List", response);
						_this.filteredList = response;
					});
				}
				this.filteredList = ctrlData;
				//this.filteredList = ctrlData.searchResults;
				$rootScope.$on("refresh_data", function (e) {
					$log.debug("refresh_data :: usersCtrl");
					_this.initData();
				});
				$scope.addNew = function () {
					$scope.openPopup(null, '/app/pages/teams/popup-edit.html', 'TeamEditCtrl', 'lg', 1)
				};
				$scope.delete = function (obj) {
					teamService.delete(obj);
				};
				$scope.openPopup = function (_obj, tmpltURL, cntrl, size = "", opt) {
					if (opt == 1)
						var modalInstance = $uibModal.open({
							animation: $scope.animationsEnabled,
							templateUrl: tmpltURL,
							controller: cntrl,
							size: size,
							resolve: {
								obj: function () {
									if (_obj != null)
										return teamService.getTeam(_obj.id).then(function (response) {
											$log.debug("Resolve team", response);
											return response;
										});
								},
								depLookup: function () {
									return departmentsService.get(1, null, 1000).then(function (response) {
										return response.searchResults;
									});
								},
								teamLeadsFree: function () {
									var condition = [
										{
											"column": "ACCESS_ROLE_CODE",
											"operatorCode": "EQUAL",
											"value": "TEAM_LEADER"
 										},
										{
											column: "TEAM_ID",
											operatorCode: "EQUAL",
											value: null
										}
									];
									$log.debug("condition", condition);
									return usersService.get(1, condition, 7000, true).then(function (res) {
										$log.debug("Free TeamLeads", res);
										return res.searchResults;
									});
								},
								teamLeadsAssigned: function () {
									if (_obj != null) {
										var assignedCondition = [
											{
												column: "ACCESS_ROLE_CODE",
												operatorCode: "EQUAL",
												value: "TEAM_LEADER"
											},
											{
												column: "TEAM_ID",
												operatorCode: "EQUAL",
												value: _obj.id
											}
										];
										$log.debug("assignedCondition", assignedCondition, _obj);
										return usersService.get(1, assignedCondition, 7000, true).then(function (res) {
											$log.debug("Assigned TeamLeads", res);
											return res.searchResults;
										});
									}
								}

							}
						});
					else if (opt == 2)
						var modalInstance = $uibModal.open({
							animation: $scope.animationsEnabled,
							templateUrl: tmpltURL,
							controller: cntrl,
							size: size,
							resolve: {
								obj: function () {
									return teamService.getTeam(_obj.id).then(function (response) {
										$log.debug("Resolve team", response);
										return response;
									});
								},
								teamLeadsFree: function () {
									var condition = [
										{
											"column": "ACCESS_ROLE_CODE",
											"operatorCode": "EQUAL",
											"value": "TEAM_LEADER"
 										},
										{
											column: "TEAM_ID",
											operatorCode: "EQUAL",
											value: null
										}
									];
									$log.debug("condition", condition);
									return usersService.get(1, condition, 7000, true).then(function (res) {
										$log.debug("Free TeamLeads", res);
										return res.searchResults;
									});
								},
								teamLeadsAssigned: function () {
									var assignedCondition = [
										{
											column: "ACCESS_ROLE_CODE",
											operatorCode: "EQUAL",
											value: "TEAM_LEADER"
										},
										{
											column: "TEAM_ID",
											operatorCode: "EQUAL",
											value: _obj.id
										}
									];
									$log.debug("assignedCondition", assignedCondition, _obj);
									return usersService.get(1, assignedCondition, 7000, true).then(function (res) {
										$log.debug("Assigned TeamLeads", res);
										return res.searchResults;
									});
								},
								analystFree: function () {
									var condition = [
										{
											"column": "ACCESS_ROLE_CODE",
											"operatorCode": "EQUAL",
											"value": "ANALYST"
 										},
										{
											column: "TEAM_ID",
											operatorCode: "EQUAL",
											value: null
										}
									];
									$log.debug("condition", condition);
									return usersService.get(1, condition, 7000, true).then(function (res) {
										$log.debug("Free TeamLeads", res);
										return res.searchResults;
									});
								},
								analystAssigned: function () {
									var assignedCondition = [
										{
											column: "ACCESS_ROLE_CODE",
											operatorCode: "EQUAL",
											value: "ANALYST"
										},
										{
											column: "TEAM_ID",
											operatorCode: "EQUAL",
											value: _obj.id
										}
									];
									$log.debug("assignedCondition", assignedCondition, _obj);
									return usersService.get(1, assignedCondition, 7000, true).then(function (res) {
										$log.debug("Assigned TeamLeads", res);
										return res.searchResults;
									});
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
			return cntrlFn;
		})();

		angular.module("IVRY-App").controller("TeamsCtrl", ["$scope", "$rootScope", "$log", "$uibModal", "ctrlData", "dbService", "teamService", "departmentsService", "usersService", cntrlFn]);

		angular.module("IVRY-App").controller("TeamEditCtrl", ["$scope", "$rootScope", "$log", "$uibModalInstance", "dbService", "utilitiesServices", "obj", "teamService", "depLookup", "teamLeadsFree", "teamLeadsAssigned", function ($scope, $rootScope, $log, $uibModalInstance, dbService, utilitiesServices, obj, teamService, depLookup, teamLeadsFree, teamLeadsAssigned) {
			$scope.obj = {};
			$scope.obj.team = obj;
			$log.debug("obj", obj)
			if ($scope.systemUsers == undefined)
				$scope.systemUsers = [];

			$scope.systemUsers = teamLeadsAssigned == undefined ? [] : teamLeadsAssigned;

			this.mode = $scope.obj.team == undefined ? 1 /*Add Mode*/ : 2 /*Update Mode*/ ;
			var _this = this;
			$scope.depLookup = depLookup;
			$log.info("mode", _this.mode, "obj", $scope.obj, "depLookup", $scope.depLookup, "teamLeadsFree", teamLeadsFree, "teamLeadsAssigned", teamLeadsAssigned);
			$scope.ok = function () {
				var sysUsers = $scope.systemUsers == undefined ? [] : $scope.systemUsers;
				$scope.obj.systemUsers = [];
				for (var i = 0; i < sysUsers.length; i++) {
					$scope.obj.systemUsers.push(sysUsers[i].id);
				}
				$log.debug("Team Object", $scope.obj);
				if (_this.mode == 1) {
					teamService.addWithUsers($scope.obj).then(function () {
						$uibModalInstance.close($scope.obj);
					}, function (error) {
						$rootScope.message = {
							body: error.data.data.message,
							type: 'danger',
							duration: 5000,
						};
					});
				} else {
					teamService.updateWithUsers($scope.obj).then(function () {
						$uibModalInstance.close($scope.obj);
					}, function (error) {
						$rootScope.message = {
							body: error.data.data.message,
							type: 'danger',
							duration: 5000,
						};
					});
				}
			};

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
			$scope.selectedDepTeamLeads = teamLeadsAssigned;
			$scope.depTeamLeads = teamLeadsFree;

			$scope.moveItems = utilitiesServices.moveItems;
		}]);
		angular.module("IVRY-App").controller("TeamMembersCtrl", ["$scope", "$log", "$uibModalInstance", "dbService", "utilitiesServices", "obj", function ($scope, $log, $uibModalInstance, dbService, utilitiesServices, obj) {
			if (obj.systemUsers == undefined)
				obj.systemUsers = [];

			$scope.obj = obj;
			this.mode = obj == null ? 1 /*Add Mode*/ : 2 /*Update Mode*/ ;
			var _this = this;
			$log.info("mode", _this.mode);
			$scope.ok = function () {
				//				if (_this.mode == 1) {
				//					dbService.add(obj.repo,obj.data);
				//				}
				$uibModalInstance.close($scope.obj);
			};

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
			$scope.selectedDepTeamLeads = [];
			$scope.depTeamLeads = [];
			$scope.depAnalysts = [];

			//			for (var i = 6; i < 15; i++) {
			//
			//				$scope.depAnalysts.push(User(i + 1, "Team", "Analyst " + i, "0101010102", "teamAnalyst@mail.com", "TL_User" + i, 2, 1, 1));
			//				$scope.depTeamLeads.push(User(i + 1, "Team", "Lead " + i, "0101010102", "teamLead@mail.com", "TL_User" + i, 2, 1, 1));
			//			}
			$scope.moveItems = utilitiesServices.moveItems;
		}]);
	})(Team = app.Team || (Team = {}), User = app.User);
})(app || (app = {}));
