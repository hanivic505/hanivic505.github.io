angular.module("IVRY-App").component("manageLine", {
	templateUrl: "/app/components/manage-line.html",
	controller: manageLineComponent,
	bindings: {
		data: "="
	}
});

function manageLineComponent($rootScope, $scope, $element, $attrs, targetService, usersService) {
	var ctrl = this;
	this.lookups = $rootScope.lookups;
	this.editObj = {};
	$scope.popup1 = new app.DatePicker(false);
	$scope.popup2 = new app.DatePicker(false, "dd/MM/yyyy", ctrl.editObj.recordingPeriodFrom);

	$scope.myTime = new Date();
	$scope.$watch(function () {
		return ctrl.data;
	}, function (nVal) {
		ctrl.load();
		ctrl.loadAssignedUsers(ctrl.data);
	});
	this.load = function () {
		this.editObj = angular.copy(this.data);
		this.editObj.rercordingPeriodFrom = new Date(this.editObj.rercordingPeriodFrom);
		this.editObj.rercordingPeriodTo = new Date(this.editObj.rercordingPeriodTo);
		this.editObj.rercordingTimeFrom = new Date(this.editObj.rercordingTimeFrom);
		this.editObj.rercordingTimeTo = new Date(this.editObj.rercordingTimeTo);
	};
	this.cancel = function () {
		this.editObj = angular.copy(this.data);
		this.editObj.rercordingPeriodFrom = new Date(this.editObj.rercordingPeriodFrom);
		this.editObj.rercordingPeriodTo = new Date(this.editObj.rercordingPeriodTo);
		this.editObj.rercordingTimeFrom = new Date(this.editObj.rercordingTimeFrom);
		this.editObj.rercordingTimeTo = new Date(this.editObj.rercordingTimeTo);
	};
	this.getStatusClass = function (mode) {
		//		commented until we agree on the status
		//		var state = ctrl.data.status.state;
		//		if (mode == 2)
		//			return state == 0 ? "label-danger" : state == 1 ? "label-success" : state == 2 ? "label-warning" : "label-default";
		//		else
		//			return state == 0 ? "text-danger" : state == 1 ? "text-success" : state == 2 ? "text-warning" : "text-default";
		return "text-success";
	};
	this.loadAssignedUsers = function (line) {
		$scope.$emit("lineNodeSelected", line);
	};
	this.save = function (obj) {
		targetService.update(3, obj);
	};
}
