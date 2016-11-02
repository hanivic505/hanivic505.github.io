var app;
(function (app) {
	var services;
	(function (services) {
		var serviceFn = (function ($log, $rootScope, $http, store, API_BASE_URL) {
			function serviceFn($log, $rootScope, $http, store, API_BASE_URL) {
				return {
					conditions: [],
					orders: ["sessionLogId", "DESC"],
					pageSize: 10,
					currentPage: 1,
					get: function (mode, obj) {
						var url = "";
						switch (mode) {
							case 1:
								url = "/target-case";
								break;
							case 2:
								url = "/identity";
								break;
							default:
								url = "/line";
								break;
						}
						return $http.get(API_BASE_URL + url + obj.id, {
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
					add: function (mode, obj) {
						obj.departmentId = null;
						var url = "";
						switch (mode) {
							case 1:
								url = "/target-case";
								break;
							case 2:
								url = "/identity";
								break;
							default:
								url = "/line";
								break;
						}
						return $http.post(API_BASE_URL + url, obj, {
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
					update: function (mode, obj) {
						var url = "";
						switch (mode) {
							case 1:
								url = "/target-case";
								break;
							case 2:
								url = "/identity";
								break;
							default:
								url = "/line";
								delete(obj.rercordingTimeFrom);
								delete(obj.rercordingTimeTo);
								break;
						}
						return $http.put(API_BASE_URL + url, obj, {
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
					delete: function (mode, obj) {
						var url = "";
						switch (mode) {
							case 1:
								url = "/target-case/";
								break;
							case 2:
								url = "/identity/";
								break;
							default:
								url = "/line/";
								break;
						}
						if (confirm("Are you sure, you want to delete this record?"))
							return $http.delete(API_BASE_URL + url + obj.id, {
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
					extendRec:function(obj){
						return $http.put(API_BASE_URL + "/line/extend", obj, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (response) {
							$rootScope.message = {
								body: "Recording Extended Successfuly",
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
					terminateRec:function(obj){
						return $http.put(API_BASE_URL + "/line/terminate", obj, {
							headers: {
								"X-Access-Token": store.get("token")
							}
						}).then(function (response) {
							$rootScope.message = {
								body: "Recording Terminated Successfuly",
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
					}
				}
			}
			return serviceFn;
		})();
		angular.module("IVRY-App").factory("targetService", ["$log", "$rootScope", "$http", "store", "API_BASE_URL", serviceFn]);
	})(services = app.services || (services = {}));
})(app || (app = {}));
