angular.module("IVRY-App").component("manageCase", {
	templateUrl: "/app/components/manage-case.html",
	controller: manageCaseComponent,
	bindings: {
		data:"="
	}
});

function manageCaseComponent($scope, $element, $attrs) {
	var ctrl = this;
	$scope.$watch(function () {
		return ctrl.data;
	}, function (nVal) {
		ctrl.load();
	});
	this.load = function () {
		this.editObj = angular.copy(this.data);
	};
	this.cancel = function () {
		this.editObj = angular.copy(this.data);
	};
}
