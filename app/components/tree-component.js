var app;
(function (app) {
	var Target;
	(function (Target) {
		angular.module("IVRY-App").component("tree", {
			templateUrl: "/app/components/tree.html",
			controller: treeComponent,
			bindings: {
				treeConfig: "=",
			}
		});

		function treeComponent($rootScope, $scope, $log, $element, $attrs, targetService, linesTreeService) {

			var ctrl = this;
			$scope.dbService = targetService;
			//			ctrl.$onChanges = function (changesObj) {
			//				console.info("ctrl.$onChanges", changesObj);
			//				ctrl.treeObj = changesObj.treeConfig.currentValue.treeObj;
			//			}
			$rootScope.$on("refresh_data", function () {
				console.info("TREE refresh data");
				linesTreeService.get().then(function (data) {
					ctrl.treeObj = data;
					console.info("ctrl.treeObj", ctrl.treeObj);
				});
			});
			this.collapsed = this.treeConfig.collapsed == undefined ? true : this.treeConfig.collapsed;
			console.info("TREE COLLAPSED PROPERTY", this.collapsed);
			//	this.selectedNode=this.treeConfig.selectedNode;
			this.lines = this.treeConfig.lines;
			//	this.treeObj=angular.copy(this.treeConfig.treeObj);
			this.treeObj = this.treeConfig.treeObj;
			this.treeScndLvl = this.treeConfig.secondLevel;
			this.treeScndLvlTitle = this.treeConfig.secondLevelTitle;
			this.treeThrdLvl = this.treeConfig.thirdLevel;
			this.treeThrdLvlTitle = this.treeConfig.thirdLevelTitle;
			//	this.filterBy=this.treeConfig.filterBy;
			this.multiSelect = this.treeConfig.multiSelect == undefined ? false : this.treeConfig.multiSelect;
			this.allowEdit = this.treeConfig.allowEdit == undefined ? false : this.treeConfig.allowEdit;
			$scope.$watch(function () {
				return ctrl.treeConfig.selectedNode;
			}, function (nVal) {
				$scope.$emit("treeNodeSelected", nVal);
			});
			this.addNewIdentity = function (caseObj) {
				console.log("add New Identity", caseObj)
				$scope.dbService.add(2, {
					identityName: 'NEW DRAFT IDENTITY',
					targetCaseId: caseObj.id
				});
			};
			this.addLine = function (trgt) {
				$scope.dbService.add(3, {
					"identityId": trgt.id,
					"lineNumber": "123456789",
					"lineTypeId": 1,
					"lineName": "NEW DRAFT LINE",
					"comment": "",
					"recordCalls": true,
					"rercordingTimeFrom": "10:18",
					"rercordingTimeTo": "11:18",
					"rercordingPeriodFrom": "09-26-2016",
					"rercordingPeriodTo": "10-20-2016",
					"recordCalls": false
				});
				console.info("treeComponent :: addLine", trgt);
			};
			this.toggleCollapsed = function () {
				ctrl.collapsed = !ctrl.collapsed;
				for (var i = 0, el = ctrl.treeObj; i < el.length; i++) {
					el[i].expand = !ctrl.collapsed;
					//el[i].childs = el[i].childs || el[i][this.treeScndLvl] || el[i][this.treeThrdLvl]
					//					if (el[i].childs != undefined)
					if (el[i].identities != undefined)
						for (var j = 0, sEl = el[i].identities; j < sEl.length; j++) {
							sEl[j].expand = !ctrl.collapsed;
						}
					if (el[i].lines != undefined)
						for (var j = 0, sEl = el[i].lines; j < sEl.length; j++) {
							sEl[j].expand = !ctrl.collapsed;
						}
				}
			};
			this.setSelectedNode = function (obj, typ) {
				ctrl.treeConfig.selectedNode = {
					data: obj,
					type: typ
				}
			};
			// enable checkboxes to select multiple elements
			if (this.multiSelect) {
				$scope.handleChkAll = function (obj, prop, isHandleTree = false) {
					$log.debug("treeComp", obj, prop);
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
					if (obj.identities) {
						var idObjs = obj.identities;
						for (var i = 0; i < idObjs.length; i++) {
							idObjs[i][prop] = obj.checked;
							if (isHandleTree && idObjs[i].id !== undefined)
								ctrl.lines[idObjs[i].id] = obj.checked;
							if (idObjs[i].lines)
								$scope.handleChkAll(idObjs[i], prop, isHandleTree);
						}
					}
					if (obj.lines) {
						var idObjs = obj.lines;
						for (var i = 0; i < idObjs.length; i++) {
							idObjs[i][prop] = obj.checked;
							ctrl.lines[idObjs[i].id] = obj.checked;
						}
					}
				};
				if (ctrl.lines != undefined)
					$scope.handleChkAll(this.treeObj[0], "checked", true);
			}
		}
	})(Target = app.Target || (Target = {}));
})(app || (app = {}));
