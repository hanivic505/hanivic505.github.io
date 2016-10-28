var app;
(function (app) {
	'use strict';
	var User;
	(function (User) {
		var cntrlFn = (function () {
			function cntrlFn($scope, $rootScope, $log, $uibModal, ctrlData, dbService, usersService, departmentsService) {
				var _this = this;
				//				$rootScope.user = "DepAdmin";
				$scope.columns = {
					childs: [
						{
							title: "First Name",
							prop: "firstName",
							isOn: true
						},
						{
							title: "Last Name",
							prop: "lastName",
							isOn: true
						},
						{
							title: "Login Name",
							prop: "userName",
							isOn: true,
						},
						{
							title: "Department",
							prop: "departmentName",
							isOn: true,
						},
						{
							title: "Team",
							prop: "teamName",
							isOn: true,
						},
						{
							title: "Role",
							prop: "accessRoleDesc",
							isOn: true,
						}
					]
				};
				$scope.currentPage = 1;
				$scope.numPerPage = 10;
				$scope.setPage = function (pageNo) {
					$scope.currentPage = pageNo;
				};

				$scope.paginate = function (value) {
					var begin, end, index;
					begin = ($scope.currentPage - 1) * $scope.numPerPage;
					end = begin + $scope.numPerPage;
					index = _this.users.searchResults.indexOf(value);
					return (begin <= index && index < end);
				};
				$scope.$watch("currentPage", function (nVal, oVal) {
					$log.debug("currentPage", nVal, oVal);
					if (nVal != oVal) {
						usersService.get(nVal)
							.then(function (data) {
								$log.debug(data);
								_this.users = data;
							});
					}
				});
				$scope.isFilterOn = false;
				$scope.fltrObj = {};
				this.editObj = {};
				this.filteredList = [];

				this.initData = function () {
					usersService.get().then(function (response) {
						$log.debug("Users List", response);
						_this.users = response;
					});
				}
				this.users = ctrlData;
				//this.filteredList = ctrlData.searchResults;
				$rootScope.$on("refresh_data", function (e) {
					$log.debug("refresh_data :: usersCtrl");
					_this.initData();
				});
				//				var i;
				//				for (i = 0; i < 23; i++)
				//					this.filteredList.push(new User(i + 1, "User " + i, "LName" + i, "01010101010", "user@email.com", "loginName" + i, "P@ssw0rd", "Analyst", "Department name", "Team Name"));

				$scope.addNew = function () {
					$scope.openPopup(null, '/app/pages/users/popup-edit.html', 'UserEditCtrl', 'lg')
				};
				$scope.delete = function (obj) {
					usersService.delete(obj);
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
									data: _obj
								};
							},
							depLookup: function () {
								return departmentsService.get(1, null, 1000).then(function (response) {
									return response.searchResults;
								});
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

		angular.module("IVRY-App").controller("UsersCtrl", ["$scope", "$rootScope", "$log", "$uibModal", "ctrlData", "dbService", "usersService", "departmentsService", cntrlFn]);
		angular.module("IVRY-App").controller("UserEditCtrl", ["$scope", "$uibModalInstance", "dbService", "utilitiesServices", "obj", "depLookup", "usersService", function ($scope, $uibModalInstance, dbService, utilitiesServices, obj, depLookup, usersService) {
			$scope.obj = obj.data;
			this.mode = $scope.obj == null ? 1 /*Add Mode*/ : 2 /*Update Mode*/ ;
			var _this = this;
			$scope.depLookup = depLookup;
			console.info("mode", _this.mode, $scope.obj);
			$scope.ok = function () {
				if (_this.mode == 1) {
					usersService.add($scope.obj).then(function () {
						$uibModalInstance.close($scope.obj);
					}, function (error) {
						$rootScope.message = {
							body: error.data.data.message,
							type: 'danger',
							duration: 5000,
						};
					});
				} else {
					usersService.update($scope.obj).then(function () {
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
		angular.module("IVRY-App").controller("UserRightsCtrl", ["$scope", "$uibModalInstance", "dbService", "utilitiesServices", "obj", function ($scope, $uibModalInstance, dbService, utilitiesServices, obj) {

		}]);

	})(User = app.User || (User = {}));
})(app || (app = {}));
