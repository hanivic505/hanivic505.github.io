var app;
(function (app) {
	var services;
	var CallsLogItem;
	(function (services, CallsLogItem) {
		var serviceFn = (function ($rootScope, $http, store, API_BASE_URL) {
			function serviceFn($rootScope, $http, store, API_BASE_URL) {
				return {
					conditions: [],
					orders: ["sessionLogId", "DESC"],
					pageSize: 10,
					currentPage: 1,
					get: function (pgNum, condition) {
						console.info("callLogService.get:before", this.currentPage, this.conditions, this.orders);
						this.conditions = condition == undefined ? this.conditions : condition;
						//this.orders = order;
						this.currentPage = pgNum == undefined ? this.currentPage : pgNum;
						console.info("callLogService.get:after", this.currentPage, this.conditions, this.orders);
						return $http.post(API_BASE_URL + "/call-log/search", {
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
					updateSessionLock: function (id, val) {
						return $http.put(API_BASE_URL + "/session-log/lock", {
							id: id,
							locked: val
						}, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (data) {
							$rootScope.$broadcast("refresh_data");
						}, function (error) {
							$rootScope.message = {
								body: error.data.data.message,
								type: 'danger',
								duration: 5000,
							};
						});
					},
					updateSessionFlag: function (id, val) {
						return $http.put(API_BASE_URL + "/session-log/flag", {
							id: id,
							sessionFlagId: val
						}, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (data) {
							$rootScope.$broadcast("refresh_data");
						}, function (error) {
							$rootScope.message = {
								body: error.data.data.message,
								type: 'danger',
								duration: 5000,
							};
						});
					},
					updateSessionLog: function (obj) {
						return $http.put(API_BASE_URL + "/session-log", {
							id: obj.sessionLogId,
							sessionFlagId: obj.sessionFlagId,
							locked: obj.locked,
							comment: obj.comment,
							transcript: obj.transcript
						}, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (data) {
							$rootScope.$broadcast("refresh_data");
							$rootScope.message = {
								body: "Record Updated",
								type: "success",
								duration: 3000
							}
						}, function (error) {
							$rootScope.message = {
								body: error.data.data.message,
								type: 'danger',
								duration: 5000,
							};
						});
					},
					updateSessionLogComment: function (obj) {
						return $http.put(API_BASE_URL + "/session-log/comment", {
							id: obj.sessionLogId,
							comment: obj.comment
						}, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (data) {
							$rootScope.$broadcast("refresh_data");
							$rootScope.message = {
								body: "Record Updated",
								type: "success",
								duration: 3000
							}
						}, function (error) {
							$rootScope.message = {
								body: error.data.data.message,
								type: 'danger',
								duration: 5000,
							};
						});
					},
					updateSessionLogTranscript: function (obj) {
						return $http.put(API_BASE_URL + "/session-log/transcript", {
							id: obj.sessionLogId,
							transcript: obj.transcript
						}, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (data) {
							$rootScope.$broadcast("refresh_data");
							$rootScope.message = {
								body: "Record Updated",
								type: "success",
								duration: 3000
							}
						}, function (error) {
							$rootScope.message = {
								body: error.data.data.message,
								type: 'danger',
								duration: 5000,
							};
						});
					},
					deleteSessionLog: function (obj) {
						return $http.delete(API_BASE_URL + "/session-log/" + obj.sessionLogId, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (data) {
							$rootScope.$broadcast("refresh_data");
							$rootScope.message = {
								body: "Record Deleted!",
								type: "success",
								duration: 3000
							}
						}, function (error) {
							$rootScope.message = {
								body: error.data.data.message,
								type: 'danger',
								duration: 5000,
							};
						});
					},
					deleteMultiSessionLog: function (obj) {
						return $http({
							method: "DELETE",
							url: API_BASE_URL + "/session-log/",
							data: {
								ids: obj
							},
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (data) {
							$rootScope.$broadcast("refresh_data");
							$rootScope.message = {
								body: "Record Deleted!",
								type: "success",
								duration: 3000
							}
						}, function (error) {
							$rootScope.message = {
								body: error.data.data.message,
								type: 'danger',
								duration: 5000,
							};
						});
					},
					getCallLog: function (obj) {
						return $http.get(API_BASE_URL + "/call-log/" + obj.sessionLogId, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (data) {
							return data.data.data;
						});
					},
					getSessionLog: function (obj) {
						return $http.get(API_BASE_URL + "/session-log/" + obj.sessionLogId, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (data) {
							return data.data.data;
						});
					},
					export: function (pgNum, condition) {
						return $http.post(API_BASE_URL + "/call-log/download", {
							pageSize: this.pageSize,
							pageNumber: this.currentPage,
							andConditions: condition,
							order: this.orders
						}, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (response) {
							return response.data.data;
						}, function (error) {});
					},
					orderBy: function (order) {
						var dir = "DESC";
						if (this.orders.indexOf(order) > -1)
							dir = this.orders[1] == "DESC" ? "ASC" : "DESC";
						this.orders = [order, dir];
						//						this.get(1);
						console.info("orderBy Current Page", this.currentPage);
						$rootScope.$broadcast("refresh_data");
						return this.currentPage;
					},
				}
			}
			return serviceFn;
		})();
		angular.module("IVRY-App").factory("callLogService", ["$rootScope", "$http", "store", "API_BASE_URL", serviceFn]);
	})(services = app.services || (services = {}), CallsLogItem = app.CallsLogItem || (CallsLogItem = {}));
})(app || (app = {}));
