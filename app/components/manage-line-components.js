angular.module("IVRY-App").component("manageLine", {
	templateUrl: "/app/components/manage-line.html",
	controller: manageLineComponent,
	bindings: {
		data:"="
	}
});

function manageLineComponent($scope, $element, $attrs) {
	var ctrl = this;
	this.editObj=angular.copy(this.data);
}
