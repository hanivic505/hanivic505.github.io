var app;
(function (app) {
	var services;
	(function (services) {
		var serviceFn = (function ($rootScope, $http, store, API_BASE_URL) {
			function serviceFn($rootScope, $http, store, API_BASE_URL) {
				return {
					get: function () {
						return $http.get(API_BASE_URL + "/target-case/tree", {
							headers: {
								'X-Access-Token': store.get("token")
							}
						}).then(function (response) {
							console.info(response);
							return response.data.data;
						});
					}
				};
			}
			return serviceFn;
		})();
		angular.module("IVRY-App").factory("linesTreeService", serviceFn);
	})(services = app.services || (services = {}));
})(app || (app = {}));
