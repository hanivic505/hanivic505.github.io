var app;
(function (app) {
	'use strict';
	var Department;
	(function (Department) {
		var cntrlFn = (function () {
			function cntrlFn($scope, $rootScope, $uibModal, ctrlData, $log, dbService, departmentsService, usersService) {
				var _this = this;
				$scope.columns = {
					childs: [
						{
							title: "Department Name",
							prop: "departmentName",
							isOn: true
						},
						{
							title: "Maximum Number of Recording Lines",
							prop: "maxNoOfRecLines",
							isOn: true
						},
						{
							title: "Teams Count",
							prop: "teamsCount",
							isOn: true,
						},
						{
							title: "Assigned Lines",
							prop: "assignedLines",
							isOn: true,
						},
						{
							title: "Comment",
							prop: "comment",
							isOn: true,
						},
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
					index = _this.filteredList.searchResults.indexOf(value);
					return (begin <= index && index < end);
				};
				$scope.isFilterOn = false;
				$scope.fltrObj = {};
				this.editObj = {};
				this.filteredList = [];


				this.initData = function () {
					departmentsService.get().then(function (response) {
						$log.debug("departmentsService", response);
						_this.filteredList = response;
					});
				};
				this.filteredList = ctrlData;
				$rootScope.$on("refresh_data", function (e) {
					$log.debug("refresh_data :: depCtrl");
					_this.initData();
				});
				//				var i;
				//				for (i = 0; i < 23; i++)
				//					this.filteredList.push(new Department("Department " + i, "comment no " + i, 7));

				$scope.addNew = function () {
					$scope.openPopup(null, '/app/pages/departments/popup-edit.html', 'DepartmentEditCtrl', 'lg')
				};
				$scope.edit = function (obj) {
					departmentsService.getDep(obj.id).then(function (response) {
						console.log(response);
						$scope.openPopup(response, '/app/pages/departments/popup-edit.html', 'DepartmentEditCtrl', 'lg');

					});
				};
				$scope.delete = function (obj) {
					departmentsService.delete(obj);
				};
				$scope.openPopup = function (_obj, tmpltURL, cntrl, size = "") {
					var modalInstance = $uibModal.open({
						animation: $scope.animationsEnabled,
						templateUrl: tmpltURL,
						controller: cntrl,
						size: size,
						resolve: {
							obj: function () {
								if (_obj != null)
									return departmentsService.getDep(_obj.id).then(function (response) {
										$log.debug("Resolve Department", response);
										return response;
									});
							},
							adminsFree: function () {
								var condition = [
									{
										"column": "ACCESS_ROLE_CODE",
										"operatorCode": "EQUAL",
										"value": "ADMIN"
 										},
									{
										column: "DEPARTMENT_ID",
										operatorCode: "EQUAL",
										value: null
										}
									];
								$log.debug("condition", condition);
								return usersService.get(1, condition, 7000, true).then(function (res) {
									$log.debug("Free Admins", res);
									return res.searchResults;
								});
							},
							adminsAssigned: function () {
								if (_obj != null) {
									var assignedCondition = [
										{
											column: "ACCESS_ROLE_CODE",
											operatorCode: "EQUAL",
											value: "ADMIN"
										},
										{
											column: "TEAM_ID",
											operatorCode: "EQUAL",
											value: _obj.id
										}
									];
									$log.debug("assignedCondition", assignedCondition, _obj);
									return usersService.get(1, assignedCondition, 7000, true).then(function (res) {
										$log.debug("Assigned Admins", res);
										return res.searchResults;
									});
								}
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

		angular.module("IVRY-App").controller("DepartmentsCtrl", ["$scope", "$rootScope", "$uibModal", "ctrlData", "$log", "dbService", "departmentsService", "usersService", cntrlFn]);
		angular.module("IVRY-App").controller("DepartmentEditCtrl", ["$scope", "$rootScope", "$log", "$uibModalInstance", "dbService", "utilitiesServices", "departmentsService", "obj", "adminsFree", "adminsAssigned", function ($scope, $rootScope, $log, $uibModalInstance, dbService, utilitiesServices, departmentsService, obj, adminsFree, adminsAssigned) {
			$scope.obj = {};
			$scope.obj.department = obj;
			$log.debug("obj", obj)

			if ($scope.obj.systemUsers == undefined)
				$scope.obj.systemUsers = [];

			if ($scope.systemUsers == undefined)
				$scope.systemUsers = [];

			$scope.systemUsers = adminsAssigned == undefined ? [] : adminsAssigned;

			this.mode = $scope.obj.department == undefined ? 1 /*Add Mode*/ : 2 /*Update Mode*/ ;
			var _this = this;
			console.info("mode", _this.mode, obj);
			$scope.ok = function () {
				var sysUsers = $scope.systemUsers == undefined ? [] : $scope.systemUsers;
				$scope.obj.systemUsers = [];
				for (var i = 0; i < sysUsers.length; i++) {
					$scope.obj.systemUsers.push(sysUsers[i].id);
				}
				var editObj = {
					department: {},
					systemUsers: []
				};
				if ($scope.obj.department.id != undefined)
					editObj.department.id = $scope.obj.department.id;
				editObj.department.departmentName = $scope.obj.department.departmentName;
				editObj.department.maxNoOfRecLines = parseInt($scope.obj.department.maxNoOfRecLines);
				editObj.department.maxNoOfUsers = parseInt($scope.obj.department.maxNoOfUsers);
				editObj.department.comment = $scope.obj.department.comment;

				editObj.systemUsers = $scope.obj.systemUsers;

				$log.debug("Department Object", editObj);
				if (_this.mode == 1) {
					departmentsService.addWithUsers(editObj).then(
						function (response) {
							$rootScope.$broadcast("refresh_data");
							$uibModalInstance.close($scope.obj);
						},
						function (error) {
							$rootScope.message = {
								body: error.data.data.message,
								type: 'danger',
								duration: 5000,
							};
						}
					);
				} else {
					departmentsService.updateWithUsers(editObj).then(
						function (response) {
							$rootScope.$broadcast("refresh_data");
							$uibModalInstance.close($scope.obj);
						},
						function (error) {
							$rootScope.message = {
								body: error.data.data.message,
								type: 'danger',
								duration: 5000,
							};
						}
					);
				}
			};

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
			$scope.selectedDepAdmins = adminsAssigned;
			$scope.depAdmins = adminsFree;

			$scope.moveItems = utilitiesServices.moveItems;
		}]);


	})(Department = app.Department || (Department = {}));
})(app || (app = {}));
