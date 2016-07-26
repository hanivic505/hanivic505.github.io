var app;
(function (app) {
	var Rights;
	(function (Rights) {
		angular.module("IVRY-App").component("rights", {
			templateUrl: "/app/components/rights.html",
			controller: rightsComponent,
			bindings: {
				config: "="
			}
		});

		function rightsComponent($scope, $element, $attrs, dbService) {

			var ctrl = this;
			this.rights = this.config.rights;

			this.saveRights = function (obj) {
				console.log(obj);
			};
		}
	})(Rights = app.Rights || (Rights = {}));
})(app || (app = {}));
