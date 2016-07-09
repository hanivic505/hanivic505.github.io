var app;
(function (app) {
	'use strict';
	var Team;
	(function (Team) {
		var cntrlFn = (function () {
			function cntrlFn($scope, $rootScope, $uibModal) {
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
							optOutFilter:true
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

				$scope.openPopup = function (_obj, tmpltURL, cntrl, size = "") {
					var modalInstance = $uibModal.open({
						animation: $scope.animationsEnabled,
						templateUrl: tmpltURL,
						controller: cntrl,
						size: size,
						resolve: {
							obj: function () {
								return _obj;
							}
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

		angular.module("IVRY-App").controller("TeamsCtrl", ["$scope", "$rootScope", "$uibModal", cntrlFn]);

	})(Team = app.Team || (Team = {}));
})(app || (app = {}));
