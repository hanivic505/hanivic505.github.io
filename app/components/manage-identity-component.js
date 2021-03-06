angular.module("IVRY-App").component("manageIdentity", {
	templateUrl: "/app/components/manage-identity.html",
	controller: manageIdentityComponent,
	bindings: {
		data: "="
	}
});

function manageIdentityComponent($scope, $element, $attrs,targetService) {
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
	this.save = function (obj) {
		targetService.update(2, obj);
	};
}
