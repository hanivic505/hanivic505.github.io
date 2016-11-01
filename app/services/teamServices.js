var app;
(function (app) {
	var services;
	var Team;
	(function (services, Team) {
		var serviceFn = (function ($rootScope, $http, store, API_BASE_URL) {
			function serviceFn($rootScope, $http, store, API_BASE_URL) {
				return {
					conditions: [],
					orders: [],
					pageSize: 10,
					currentPage: 1,
					get: function (pgNum, condition, pSize, resetCondition) {
						console.info("teamService.get:before", this.currentPage, this.conditions, this.orders);
						this.conditions = condition == undefined ? resetCondition || resetCondition == undefined ? [] : this.conditions : condition;
						//this.orders = order;
						this.pageSize = pSize == undefined ? this.pageSize : pSize;
						this.currentPage = pgNum == undefined ? this.currentPage : pgNum;
						console.info("teamService.get:after", this.currentPage, this.conditions, this.orders);
						return $http.post(API_BASE_URL + "/team-list/search", {
							pageSize: this.pageSize,
							pageNumber: this.currentPage,
							andConditions: this.conditions,
							order: this.orders
						}, {
							headers: {
								"X-Access-Token": store.get("token")
							},
						}).then(function (response) {
							return response.data.data;
						}, function (error) {
							$rootScope.message = {
								body: error.data.message,
								type: 'danger',
								duration: 5000,
							};
							return [];
						});
					},
					getTeam: function (objID) {
						return $http.get(API_BASE_URL + "/team/" + objID, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (response) {
							return response.data.data;
						}, function (error) {
							$rootScope.message = {
								body: error.data.data.message,
								type: 'danger',
								duration: 5000,
							};
						});
					},
					add: function (obj) {
						return $http.post(API_BASE_URL + "/team", obj, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (response) {
							$rootScope.message = {
								body: "Record Inserted Successfuly",
								type: 'success',
								duration: 5000,
							};
							$rootScope.$broadcast("refresh_data");
						}, function (error) {
							$rootScope.message = {
								body: error.data.data.message,
								type: 'danger',
								duration: 5000,
							};
						});
					},
					addWithUsers: function (obj) {
						return $http.post(API_BASE_URL + "/team/user", obj, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (response) {
							$rootScope.message = {
								body: "Record Inserted Successfuly",
								type: 'success',
								duration: 5000,
							};
							$rootScope.$broadcast("refresh_data");
						}, function (error) {
							$rootScope.message = {
								body: error.data.data.message,
								type: 'danger',
								duration: 5000,
							};
						});
					},
					update: function (obj) {
						return $http.put(API_BASE_URL + "/team", obj, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (response) {
							$rootScope.message = {
								body: "Record Updated Successfuly",
								type: 'success',
								duration: 5000,
							};
							$rootScope.$broadcast("refresh_data");
						}, function (error) {
							$rootScope.message = {
								body: error.data.data.message,
								type: 'danger',
								duration: 5000,
							};
						});
					},
					updateWithUsers: function (obj) {
						return $http.put(API_BASE_URL + "/team/user", obj, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (response) {
							$rootScope.message = {
								body: "Record Updated Successfuly",
								type: 'success',
								duration: 5000,
							};
							$rootScope.$broadcast("refresh_data");
						}, function (error) {
							$rootScope.message = {
								body: error.data.data.message,
								type: 'danger',
								duration: 5000,
							};
						});
					},
					delete: function (obj) {
						if (confirm("Are you sure, you want to delete this record?"))
							return $http.delete(API_BASE_URL + "/team/" + obj.id, {
								headers: {
									"X-Access-Token": store.get("token")
								}
							}).then(function (response) {
								$rootScope.message = {
									body: "Record Deleted Successfuly",
									type: 'success',
									duration: 5000,
								};
								$rootScope.$broadcast("refresh_data");
							}, function (error) {
								$rootScope.message = {
									body: error.data.data.message,
									type: 'danger',
									duration: 5000,
								};
							});
					},
				};
			}
			return serviceFn;
		})();
		angular.module("IVRY-App").factory("teamService", ["$rootScope", "$http", "store", "API_BASE_URL", serviceFn]);
	})(services = app.services || (services = {}), Team = app.Team || (Team = {}));
})(app || (app = {}));
