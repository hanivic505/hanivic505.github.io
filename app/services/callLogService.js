var app;
(function (app) {
	var services;
	var CallsLogItem;
	(function (services, CallsLogItem) {
		var serviceFn = (function ($rootScope, $http, store, API_BASE_URL) {
			function serviceFn($rootScope, $http, store, API_BASE_URL) {
				return {
					conditions: [],
					orders: [],
					get: function (pgSize, pgNum, condition, order) {
						console.info("callLogService.get:before", this.conditions);
						this.conditions = condition;
						this.orders = order;
						console.info("callLogService.get:after", this.conditions);
						return $http.post(API_BASE_URL + "/call-log/search", {
							pageSize: 10,
							pageNumber: pgNum,
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
							id: obj.id,
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
							id: obj.id,
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
							id: obj.id,
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
						return $http.delete(API_BASE_URL + "/session-log/" + obj.id, {
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
						return $http.get(API_BASE_URL + "/call-log/" + obj.id, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (data) {
							return data.data.data;
						});
					},
					getSessionLog: function (obj) {
						return $http.get(API_BASE_URL + "/session-log/" + obj.id, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (data) {
							return data.data.data;
						});
					},
				}
			}
			return serviceFn;
		})();
		angular.module("IVRY-App").factory("callLogService", ["$rootScope", "$http", "store", "API_BASE_URL", serviceFn]);
	})(services = app.services || (services = {}), CallsLogItem = app.CallsLogItem || (CallsLogItem = {}));
})(app || (app = {}));
