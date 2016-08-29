var app;
(function (app) {
	var services;
	var CallsLogItem;
	(function (services, CallsLogItem) {
		var serviceFn = (function ($rootScope, $http, store, API_BASE_URL) {
			function serviceFn($rootScope, $http, store, API_BASE_URL) {
				return {
					get: function (pgSize, pgNum, condition) {
						return $http.post(API_BASE_URL + "/call-log/search", {
							pageSize: 20000,
							pageNumber: pgNum,
							andConditions: condition
						}, {
							headers: {
								"X-Access-Token": store.get("token")
							},
						}).then(function (response) {
							console.info(response, response.data.data.searchResults);
							return response.data.data.searchResults;
						}, function (error) {
							console.info(error);
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
						}).then(null, function (error) {
							console.info(error);
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
						}).then(null, function (error) {
							console.info(error);
							$rootScope.message = {
								body: error.data.data.message,
								type: 'danger',
								duration: 5000,
							};
						});
					},
				}
			}
			return serviceFn;
		})();
		angular.module("IVRY-App").factory("callLogService", ["$rootScope", "$http", "store", "API_BASE_URL", serviceFn]);
	})(services = app.services || (services = {}), CallsLogItem = app.CallsLogItem || (CallsLogItem = {}));
})(app || (app = {}));
