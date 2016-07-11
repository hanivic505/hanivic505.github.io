var app;
(function (app) {
	var services;
	(function (services) {
		var serviceFn = (function () {
			function serviceFn($rootScope) {
				return {
					add: function (repo, obj) {
						repo.push(obj);
						$rootScope.$emit("dbServiceAdded");
					},
					delete: function (repo, obj) {
						repo.splice(repo.indexOf(obj), 1);
					},
					update: function (repo, obj, id) {},
					getAll: function (repo) {},
					get: function (repo, id) {}
				}
			}
			return serviceFn;
		})();
		angular.module("IVRY-App").factory("dbService", ["$rootScope", serviceFn]);
	})(services = app.services || (services = {}));
})(app || (app = {}));
