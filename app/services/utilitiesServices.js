var app;
(function (app) {
	var services;
	(function (services) {
		var serviceFn = (function ($uibModal) {
			function serviceFn($uibModal) {
				return {
					getIcon: function (param) {
						var obj = {};
						switch (param) {
							case false:
								obj.icon = "fa-unlock fg-red";
								obj.title = "Unlocked";
								break;
							case true:
								obj.icon = "fa-lock fg-green";
								obj.title = "Locked";
								break;
							case null:
								obj.icon = "fa-circle-o";
								obj.title = "UnMarked";
								break;
							case 1:
								obj.icon = "fa-exclamation fg-red";
								obj.title = "Important";
								break;
							case 2:
								obj.icon = "fa-search";
								obj.title = "Revise Later";
								break;
							case 3:
								obj.icon = "fa-check fg-green";
								obj.title = "Reviewed";
								break;
							case 4:
								obj.icon = "fa-times fg-red";
								obj.title = "Irrelevent";
								break;
							case 5:
								obj.icon = "fa-circle-o";
								obj.title = "Un-Marked";
								break;
							default:
								break;
						}
						return obj;
					},
					getTimeDiff: function (end, start) {
						var hourDiff = end - start;
						var diffHrs = Math.floor((hourDiff % 86400000) / 3600000);
						var diffMins = Math.floor(((hourDiff % 86400000) % 3600000) / 60000);
						//diffMins = diffMins + (diffHrs * 60);

						//var timeDiff=end.getTime()-start.getTime();
						return diffHrs + ":" + diffMins;
					},
					getLineName: function (value) {
						var idx = 0;
						/* jshint node: true */
						angular.forEach(value, function (val, key) {
							if (val) {
								idx = idx + 1;
							}
						});
						return idx;
					},
					maxSize: 5,
					currentPage: 1,
					numPerPage: 10,
					dbList: [],
					paginate: function (value) {
						var _this = this;
						var begin, end, index;
						begin = (_this.currentPage - 1) * _this.numPerPage;
						end = begin + _this.numPerPage;
						index = _this.dbList.indexOf(value);
						return (begin <= index && index < end);
					},
					setPage: function (pageNo) {
						this.currentPage = pageNo;
					},
					moveItems: function (src, items, trgt) {
						console.log("before", src, items, trgt);
						if (src == items)
							items = angular.copy(items);
						if (trgt == undefined)
							trgt = [];
						angular.forEach(items, function (item) {
							trgt.push(item);
						});
						angular.forEach(items, function (item) {
							src.splice(src.indexOf(item), 1);
						});
						console.log("after", src, items, trgt);
					},
					columnsAdapterIn: function (columns) {
						var tempColumns = angular.copy(columns);
						angular.forEach(tempColumns, function (val, key) {
							angular.forEach(val, function (iVal, iKey, obj) {
								if (iKey == "code") {
									iVal = iVal.toLowerCase();
									if (iVal.indexOf("_") > -1) {
										var camelCased = iVal.replace(/_[a-z]/g, function (g) {
											return g[1].toUpperCase();
										});
										iVal = camelCased;
									}
									obj["prop"] = iVal;
								}
								if (iKey == "description") {
									obj["title"] = iVal;
								}
								if (iKey == "visible") {
									obj["drag"] = true;
									obj["isOn"] = iVal;
								}
							});
						});
						return tempColumns;
					},
					columnsAdapterOut: function (columns) {
						var tempColumns = angular.copy(columns);
						angular.forEach(tempColumns, function (val, key) {
							angular.forEach(val, function (iVal, iKey, obj) {
								delete obj["prop"];
								delete obj["title"];
								delete obj["drag"];
								delete obj["isOn"];
							});
						});
						return tempColumns;
					},
					checkAll: function (obj, prop) {
						if (obj.childs)
							for (var i = 0; i < obj.childs.length; i++) {
								obj.childs[i][prop] = obj.checked;
								if (obj.childs[i].childs)
									$scope.handleChkAll(obj.childs[i], prop);
							}
					},
					getSystemDate: function () {
						return new Date();
					},
					openPopup: function (_obj, tmpltURL, cntrl, size = "",animate=true) {
						var modalInstance = $uibModal.open({
							animation: animate,
							templateUrl: tmpltURL,
							controller: cntrl,
							size: size,
							resolve: {
								obj: function () {
									return _obj;
								}
							}
						});
						modalInstance.result.then(function (selectedItem) {
//							$scope.selected = selectedItem;
						}, function () {
//							$log.debug('Modal dismissed at: ' + new Date());
						});
					},
				}
			}
			return serviceFn;
		})();
		angular.module("IVRY-App").factory("utilitiesServices", ["$uibModal",serviceFn]);
	})(services = app.services || (services = {}));
})(app || (app = {}));
