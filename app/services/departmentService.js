var app;
(function (app) {
	var services;
	var Department;
	(function (services, Department) {
		var serviceFn = (function ($rootScope, $http, store, API_BASE_URL) {
			function serviceFn($rootScope, $http, store, API_BASE_URL) {
				return {
					conditions: [],
					orders: [],
					pageSize: 10,
					currentPage: 1,
					get: function (pgNum, condition, pSize) {
						console.info("departmentService.get:before", this.currentPage, this.conditions, this.orders);
						this.conditions = condition == undefined ? this.conditions : condition;
						//this.orders = order;
						this.pageSize = pSize != undefined ? pSize : this.pageSize;
						this.currentPage = pgNum == undefined ? this.currentPage : pgNum;
						console.info("departmentService.get:after", this.currentPage, this.conditions, this.orders);
						return $http.post(API_BASE_URL + "/department-list/search", {
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
					getDep: function (objID) {
						return $http.get(API_BASE_URL + "/department/" + objID, {
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
						return $http.post(API_BASE_URL + "/department", obj, {
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
						return $http.put(API_BASE_URL + "/department/user", obj, {
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
					addWithUsers: function (obj) {
						return $http.post(API_BASE_URL + "/department/user", obj, {
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
					updateWithUsers: function (obj) {
						return $http.put(API_BASE_URL + "/department", obj, {
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
							return $http.delete(API_BASE_URL + "/department/" + obj.id, {
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
		angular.module("IVRY-App").factory("departmentsService", ["$rootScope", "$http", "store", "API_BASE_URL", serviceFn]);
	})(services = app.services || (services = {}), Department = app.Department || (Department = {}));
})(app || (app = {}));
