var app;
(function (app) {
	'use strict';
	var Team;
	var User;
	(function (Team, User) {
		var cntrlFn = (function () {
			function cntrlFn($scope, $rootScope, $log, $uibModal, dbService, teamService) {
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
					index = _this.filteredList.indexOf(value);
					return (begin <= index && index < end);
				};
				$scope.isFilterOn = false;
				$scope.fltrObj = {};
				this.editObj = {};
				this.filteredList = [];
				teamService.get().then(function (response) {
					$log.debug("Teams List", response);
					_this.filteredList = response.searchResults;
				});
				$scope.addNew = function () {
					$scope.openPopup(null, '/app/pages/teams/popup-edit.html', 'TeamEditCtrl', 'lg')
				};
				$scope.delete = function (obj) {
					dbService.delete(_this.filteredList, obj);
				};
				$scope.openPopup = function (_obj, tmpltURL, cntrl, size = "") {
					var modalInstance = $uibModal.open({
						animation: $scope.animationsEnabled,
						templateUrl: tmpltURL,
						controller: cntrl,
						size: size,
						resolve: {
							obj: function () {
								return {
									data: _obj,
									repo: _this.filteredList
								};
							},

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

		angular.module("IVRY-App").controller("TeamsCtrl", ["$scope", "$rootScope", "$log", "$uibModal", "dbService", "teamService", cntrlFn]);

		angular.module("IVRY-App").controller("TeamEditCtrl", ["$scope", "$rootScope", "$log", "$uibModalInstance", "dbService", "utilitiesServices", "obj", "teamService", function ($scope, $rootScope, $log, $uibModalInstance, dbService, utilitiesServices, obj, teamService) {
			$scope.obj = obj.data;
			this.mode = $scope.obj == null ? 1 /*Add Mode*/ : 2 /*Update Mode*/ ;
			var _this = this;
			$log.info("mode", _this.mode);
			$scope.ok = function () {
				if (_this.mode == 1) {
					teamService.add($scope.obj).then(function () {
						$uibModalInstance.close($scope.obj);
					}, function (error) {
						$rootScope.message = {
							body: error.data.data.message,
							type: 'danger',
							duration: 5000,
						};
					});
				} else {
					teamService.update($scope.obj).then(function () {
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
			$scope.selectedDepTeamLeads = [];
			$scope.depTeamLeads = [];
			for (var i = 6; i < 15; i++)
				$scope.depTeamLeads.push(User(i + 1, "Team", "Lead " + i, "0101010102", "teamLead@mail.com", "TL_User" + i, 2, 1, 1));

			$scope.moveItems = utilitiesServices.moveItems;
		}]);
		angular.module("IVRY-App").controller("TeamMembersCtrl", ["$scope", "$log", "$uibModalInstance", "dbService", "utilitiesServices", "obj", function ($scope, $log, $uibModalInstance, dbService, utilitiesServices, obj) {
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

			for (var i = 6; i < 15; i++) {

				$scope.depAnalysts.push(User(i + 1, "Team", "Analyst " + i, "0101010102", "teamAnalyst@mail.com", "TL_User" + i, 2, 1, 1));
				$scope.depTeamLeads.push(User(i + 1, "Team", "Lead " + i, "0101010102", "teamLead@mail.com", "TL_User" + i, 2, 1, 1));
			}
			$scope.moveItems = utilitiesServices.moveItems;
		}]);
	})(Team = app.Team || (Team = {}), User = app.User);
})(app || (app = {}));
