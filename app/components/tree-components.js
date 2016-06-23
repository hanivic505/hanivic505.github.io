angular.module("IVRY-App").component("tree",{
	templateUrl:"/app/components/tree.html",
	controller:treeComponent,
	bindings:{treeObj:"=",lines:"="}
});

function treeComponent($scope, $element, $attrs){
	var ctrl = this;
	$scope.handleChkAll = function (obj, prop, isHandleTree=false) {
		if (isHandleTree && obj.id !== undefined)
			ctrl.lines[obj.id] = obj.checked;
		if (obj.childs)
			for (var i = 0; i < obj.childs.length; i++) {
				obj.childs[i][prop] = obj.checked;
				if (isHandleTree && obj.childs[i].id !== undefined)
					ctrl.lines[obj.childs[i].id] = obj.checked;
				if (obj.childs[i].childs)
					$scope.handleChkAll(obj.childs[i], prop, isHandleTree);
			}
	};
	$scope.handleChkAll(this.treeObj[0], "checked", true);
}
