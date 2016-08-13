var app;
(function (app) {
	'use strict';
	var Audit;
	(function (Audit) {
		var cntrlFn = (function () {
			function cntrlFn($scope, $rootScope, $uibModal, dbService) {
				var _this = this;
//				$rootScope.user = "DepAdmin";
				$scope.columns = {
					childs: [
						{
							title: "User",
							prop: "user",
							isOn: true
						},
						{
							title: "Role",
							prop: "role",
							isOn: true
						},
						{
							title: "Department",
							prop: "department",
							isOn: true,
						},
						{
							title: "Team",
							prop: "team",
							isOn: true,
						},
						{
							title: "Call Log",
							prop: "callLog",
							isOn: true,
						},
						{
							title: "Date",
							prop: "logDate",
							isOn: true,
							type: "date"
						},
						{
							title: "Time",
							prop: "logTime",
							isOn: true,
							type: "time"
						},
						{
							title: "Event",
							prop: "logEvent",
							isOn: true
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
					this.filteredList.push(new Audit(i + 1, "user"+i, "Analyst", "department"+i, "team"+i, "line Name"+i, "1/1/2016", "23:02", "Update Transcribe"));

			}
			return cntrlFn;
		})();
		angular.module("IVRY-App").controller("AuditCtrl", ["$scope", "$rootScope", "$uibModal", "dbService", cntrlFn]);

	})(Audit = app.Audit || (Audit = {}));
})(app || (app = {}));
