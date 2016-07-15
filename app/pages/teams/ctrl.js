var app;
(function (app) {
	'use strict';
	var Team;
	var User;
	(function (Team, User) {
		var cntrlFn = (function () {
			function cntrlFn($scope, $rootScope, $uibModal, dbService) {
				var _this = this;
				$rootScope.user = "DepAdmin";
				$scope.columns = {
					childs: [
						{
							title: "Team Name",
							prop: "title",
							isOn: true
						},
						{
							title: "Department Name",
							prop: "department",
							isOn: true
						},
						{
							title: "Members Count",
							prop: "membersCount",
							isOn: true,
							type: "func",
							optOutFilter: true
						}
					]
				};
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
				var i;
				for (i = 0; i < 23; i++)
					this.filteredList.push(new Team("Team " + i, "Department Name", "no CommenT"));

				$scope.addNew = function () {
					$scope.openPopup(new Team('', '', ''), '/app/pages/teams/popup-edit.html', 'TeamEditCtrl', 'lg')
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
						console.info('Modal dismissed at: ' + new Date());
					});
				};
			}
			return cntrlFn;
		})();

		angular.module("IVRY-App").controller("TeamsCtrl", ["$scope", "$rootScope", "$uibModal", "dbService", cntrlFn]);

		angular.module("IVRY-App").controller("TeamEditCtrl", ["$scope", "$uibModalInstance", "dbService", "utilitiesServices", "obj", function ($scope, $uibModalInstance, dbService, utilitiesServices, obj) {
			$scope.obj = obj;
			this.mode = obj == null ? 1 /*Add Mode*/ : 2 /*Update Mode*/ ;
			var _this = this;
			console.info("mode", _this.mode);
			$scope.ok = function () {
				//				if (_this.mode == 1) {
				dbService.add(obj.repo, obj.data);
				//				}
				$uibModalInstance.close($scope.obj);
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
		angular.module("IVRY-App").controller("TeamMembersCtrl", ["$scope", "$uibModalInstance", "dbService", "utilitiesServices", "obj", function ($scope, $uibModalInstance, dbService, utilitiesServices, obj) {
			$scope.obj = obj;
			this.mode = obj == null ? 1 /*Add Mode*/ : 2 /*Update Mode*/ ;
			var _this = this;
			console.info("mode", _this.mode);
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
