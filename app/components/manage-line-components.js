angular.module("IVRY-App").component("manageLine", {
	templateUrl: "/app/components/manage-line.html",
	controller: manageLineComponent,
	bindings: {
		data: "="
	}
});

function manageLineComponent($scope, $element, $attrs, usersService) {
	var ctrl = this;
	$scope.$watch(function () {
		return ctrl.data;
	}, function (nVal) {
		ctrl.load();
		ctrl.loadAssignedUsers(1);
	});
	this.load = function () {
		this.editObj = angular.copy(this.data);
	};
	this.cancel = function () {
		this.editObj = angular.copy(this.data);
	};
	this.getStatusClass = function () {
		var state = ctrl.data.status.state;
		return state == 0 ? "label-danger" : state == 1 ? "label-success" : state == 2 ? "label-warning" : "label-default";
	};
	this.loadAssignedUsers = function (line) {
		$scope.$emit("lineNodeSelected", usersService);
	};
}
