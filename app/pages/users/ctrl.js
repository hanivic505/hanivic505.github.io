var app;
(function (app) {
	'use strict';
	var User;
	(function (User) {
		var cntrlFn = (function () {
			function cntrlFn($scope, $rootScope, $log, $uibModal, dbService, usersService) {
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

				usersService.get().then(function (response) {
					$log.debug("Teams List", response);
					_this.filteredList = response.searchResults;
				});
				//				var i;
				//				for (i = 0; i < 23; i++)
				//					this.filteredList.push(new User(i + 1, "User " + i, "LName" + i, "01010101010", "user@email.com", "loginName" + i, "P@ssw0rd", "Analyst", "Department name", "Team Name"));

				$scope.addNew = function () {
					$scope.openPopup(null, '/app/pages/users/popup-edit.html', 'UserEditCtrl', 'lg')
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

		angular.module("IVRY-App").controller("UsersCtrl", ["$scope", "$rootScope", "$log", "$uibModal", "dbService", "usersService", cntrlFn]);
		angular.module("IVRY-App").controller("UserEditCtrl", ["$scope", "$uibModalInstance", "dbService", "utilitiesServices", "obj", "usersService", function ($scope, $uibModalInstance, dbService, utilitiesServices, obj, usersService) {
			$scope.obj = obj.data;
			this.mode = $scope.obj == null ? 1 /*Add Mode*/ : 2 /*Update Mode*/ ;
			var _this = this;
			console.info("mode", _this.mode);
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
