var app;
(function (app) {
	'use strict';
	var Team;
	(function (Team) {
		var cntrlFn = (function () {
			function cntrlFn($scope, $rootScope, $uibModal,dbService) {
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

				$scope.addNew=function(){
					$scope.openPopup(new Team('','',''),'/app/pages/teams/popup-edit.html','TeamEditCtrl','lg')
				};
				$scope.delete=function(obj){
					dbService.delete(_this.filteredList,obj);
				};
				$scope.openPopup = function (_obj, tmpltURL, cntrl, size = "") {
					var modalInstance = $uibModal.open({
						animation: $scope.animationsEnabled,
						templateUrl: tmpltURL,
						controller: cntrl,
						size: size,
						resolve: {
							obj: function () {
								return {data:_obj,
								repo:_this.filteredList};
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

		angular.module("IVRY-App").controller("TeamsCtrl", ["$scope", "$rootScope", "$uibModal","dbService", cntrlFn]);

		angular.module("IVRY-App").controller("TeamEditCtrl", ["$scope", "$uibModalInstance", "dbService", "obj", function ($scope, $uibModalInstance, dbService, obj) {
			$scope.obj = obj;
			this.mode = obj == null ? 1 /*Add Mode*/ : 2 /*Update Mode*/ ;
			var _this = this;
			console.info("mode", _this.mode);
			$scope.ok = function () {
//				if (_this.mode == 1) {
					dbService.add(obj.repo,obj.data);
//				}
				$uibModalInstance.close($scope.obj);
			};

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
			$scope.selectedDepTeamLeads = [];
			$scope.depTeamLeads = [
				{
					id: 1,
					name: "Team Lead One"
				},
				{
					id: 2,
					name: "Team Lead Two"
				},
				{
					id: 3,
					name: "Team Lead Three"
				},
				{
					id: 4,
					name: "Team Lead Four"
				},
				{
					id: 5,
					name: "Team Lead Five"
				},
				{
					id: 6,
					name: "Team Lead Six"
				},
				{
					id: 7,
					name: "Team Lead Seven"
				},
				{
					id: 8,
					name: "Team Lead Eight"
				},
				{
					id: 9,
					name: "Team Lead Nine"
				},
			];
			$scope.moveItems = function (src, items, trgt) {
				console.log("before", src, items, trgt);
				if (src == items)
					items = angular.copy(items);
				if(trgt==undefined)
					trgt=[];
				angular.forEach(items, function (item) {
					trgt.push(item);
				});
				angular.forEach(items, function (item) {
					src.splice(src.indexOf(item), 1);
				});
				console.log("after", src, items, trgt);
			};
		}]);
	})(Team = app.Team || (Team = {}));
})(app || (app = {}));
