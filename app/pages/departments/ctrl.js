var app;
(function (app) {
	'use strict';
	var Department;
	(function (Department) {
		var cntrlFn = (function () {
			function cntrlFn($scope, $rootScope, $uibModal, ctrlData, $log, dbService, departmentsService) {
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
								return {
									data: _obj
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

		angular.module("IVRY-App").controller("DepartmentsCtrl", ["$scope", "$rootScope", "$uibModal", "ctrlData", "$log", "dbService", "departmentsService", cntrlFn]);
		angular.module("IVRY-App").controller("DepartmentEditCtrl", ["$scope", "$rootScope", "$uibModalInstance", "dbService", "utilitiesServices", "departmentsService", "obj", function ($scope, $rootScope, $uibModalInstance, dbService, utilitiesServices, departmentsService, obj) {
			$scope.obj = obj.data;
			this.mode = $scope.obj == null ? 1 /*Add Mode*/ : 2 /*Update Mode*/ ;
			var _this = this;
			console.info("mode", _this.mode, obj);
			$scope.ok = function () {
				if (_this.mode == 1) {
					departmentsService.add($scope.obj).then(
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
					departmentsService.update($scope.obj).then(
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
			$scope.selectedDepTeamLeads = [];
			$scope.depTeamLeads = [];

			$scope.moveItems = utilitiesServices.moveItems;
		}]);


	})(Department = app.Department || (Department = {}));
})(app || (app = {}));
