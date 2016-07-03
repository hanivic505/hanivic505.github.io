angular.module("IVRY-App").component("manageLine", {
	templateUrl: "/app/components/manage-line.html",
	controller: manageLineComponent,
	bindings: {
		data: "="
	}
});

function manageLineComponent($scope, $element, $attrs, usersService) {
	var ctrl = this;
	this.editObj = {
		isRecordCalls: false,
		recordingDate: {
			from: new Date()
		}
	};
	$scope.popup1 = new app.DatePicker(false);
	$scope.popup2 = new app.DatePicker(false, "dd/MM/yyyy", ctrl.editObj.recordingDate.from, new Date());


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
	this.getStatusClass = function (mode) {
		var state = ctrl.data.status.state;
		if (mode == 2)
			return state == 0 ? "label-danger" : state == 1 ? "label-success" : state == 2 ? "label-warning" : "label-default";
		else
			return state == 0 ? "text-danger" : state == 1 ? "text-success" : state == 2 ? "text-warning" : "text-default";

	};
	this.loadAssignedUsers = function (line) {
		$scope.$emit("lineNodeSelected", usersService);
	};
}
