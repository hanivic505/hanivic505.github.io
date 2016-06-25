angular.module("IVRY-App").component("manageCase", {
	templateUrl: "/app/components/manage-case.html",
	controller: manageCaseComponent,
	bindings: {
		data:"="
	}
});

function manageCaseComponent($scope, $element, $attrs) {
	var ctrl = this;
	this.editObj=angular.copy(this.data);
	console.info(this.editObj);
}
