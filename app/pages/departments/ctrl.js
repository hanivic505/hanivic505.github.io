var app;
(function (app) {
	'use strict';
	var Department;
	(function (Department) {
		var cntrlFn = (function () {
			function cntrlFn($scope, $rootScope, $uibModal, dbService) {
				var _this = this;
				$scope.columns = {
					childs: [
						{
							title: "Department Name",
							prop: "title",
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
							type: "func"
						},
						{
							title: "Assigned Lines",
							prop: "assignedLines",
							isOn: true,
							type: "func"
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
					index = _this.filteredList.indexOf(value);
					return (begin <= index && index < end);
				};
				$scope.isFilterOn = false;
				$scope.fltrObj = {};
				this.editObj = {};
				this.filteredList = [];
				var i;
				for (i = 0; i < 23; i++)
					this.filteredList.push(new Department("Department " + i, "comment no " + i, 7));

				$scope.addNew = function () {
					$scope.openPopup(new Department('', '', 0), '/app/pages/departments/popup-edit.html', 'DepartmentEditCtrl', 'lg')
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

		angular.module("IVRY-App").controller("DepartmentsCtrl", ["$scope", "$rootScope", "$uibModal", "dbService", cntrlFn]);
		angular.module("IVRY-App").controller("DepartmentEditCtrl", ["$scope", "$uibModalInstance", "dbService", "utilitiesServices", "obj", function ($scope, $uibModalInstance, dbService, utilitiesServices, obj) {
			$scope.obj = obj.data;
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

			$scope.moveItems = utilitiesServices.moveItems;
		}]);


	})(Department = app.Department || (User = {}));
})(app || (app = {}));
