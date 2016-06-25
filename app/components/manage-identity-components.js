angular.module("IVRY-App").component("manageIdentity", {
	templateUrl: "/app/components/manage-identity.html",
	controller: manageIdentityComponent,
	bindings: {
		data:"="
	}
});

function manageIdentityComponent($scope, $element, $attrs) {
	var ctrl = this;
	this.editObj=angular.copy(this.data);
}
