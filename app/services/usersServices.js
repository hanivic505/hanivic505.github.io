var app;
(function (app) {
	var services;
	(function (services, User) {
		var serviceFn = (function () {
			function serviceFn() {

				return this.usersList = [
					User("Fred1", "Castro", 0100383977, "fred@mail.com", "fred", "P@ssw0rd", 1, 1, 2),
					User("Fred2", "Castro", 0100383977, "fred@mail.com", "fred", "P@ssw0rd", 1, 1, 2),
					User("Fred3", "Castro", 0100383977, "fred@mail.com", "fred", "P@ssw0rd", 1, 1, 2),
					User("Fred4", "Castro", 0100383977, "fred@mail.com", "fred", "P@ssw0rd", 1, 1, 2),
					User("Fred5", "Castro", 0100383977, "fred@mail.com", "fred", "P@ssw0rd", 1, 1, 2),
					User("Fred5", "Castro", 0100383977, "fred@mail.com", "fred", "P@ssw0rd", 1, 1, 2),
					User("Fred5", "Castro", 0100383977, "fred@mail.com", "fred", "P@ssw0rd", 1, 1, 2),
					User("Fred5", "Castro", 0100383977, "fred@mail.com", "fred", "P@ssw0rd", 1, 1, 2),
					User("Fred5", "Castro", 0100383977, "fred@mail.com", "fred", "P@ssw0rd", 1, 1, 2),
					User("Fred5", "Castro", 0100383977, "fred@mail.com", "fred", "P@ssw0rd", 1, 1, 2),
					User("Fred5", "Castro", 0100383977, "fred@mail.com", "fred", "P@ssw0rd", 1, 1, 2),
					User("Fred5", "Castro", 0100383977, "fred@mail.com", "fred", "P@ssw0rd", 1, 1, 2),
					User("Fred5", "Castro", 0100383977, "fred@mail.com", "fred", "P@ssw0rd", 1, 1, 2),
					User("Fred5", "Castro", 0100383977, "fred@mail.com", "fred", "P@ssw0rd", 1, 1, 2),
					User("Fred5", "Castro", 0100383977, "fred@mail.com", "fred", "P@ssw0rd", 1, 1, 2),
					User("Fred5", "Castro", 0100383977, "fred@mail.com", "fred", "P@ssw0rd", 1, 1, 2),
					User("Fred5", "Castro", 0100383977, "fred@mail.com", "fred", "P@ssw0rd", 1, 1, 2),
            ];
			}
			return serviceFn;
		})();
		angular.module("IVRY-App").factory("usersService", serviceFn);
	})(services = app.services || (services = {}), User = app.User || (User = {}));
})(app || (app = {}));
