/*global angular*/
/*global WaveSurfer*/
/*jslint nomen: true*/
/*jshint esversion: 6*/
var app;
(function (app) {
	"use strict";

	var CallsLogItem;
	(function (CallsLogItem) {
		angular.module("IVRY-App").controller("exportCallLogCtrl", ["$scope", "$filter", "$uibModalInstance", "obj", function ($scope, $filter, $uibModalInstance, obj) {
			$scope.obj = obj;
			$scope.objType = Object.prototype.toString.call(obj);
			$scope.exported = false;
			if ($scope.objType == "[object Object]") {
				$scope.exp = {
					name: obj.lineName + '_' + $filter('date')(obj.startDate, 'dd.MM.yyyy.HH.mm'),
					options: {
						audio: true,
						excel: false
					}
				}
			} else {
				$scope.exp = {
					options: {
						audio: false,
						excel: true
					}
				}
			}

			$scope.ok = function () {
				if ($scope.exported)
					$uibModalInstance.close($scope.obj);
				else
					$scope.exported = true;
			};

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
        }]);
		angular.module("IVRY-App").controller("callLogFullViewCtrl", ["$scope", "$uibModalInstance", "utilitiesServices", "callLogService", "obj", function ($scope, $uibModalInstance, utilitiesServices, callLogService, obj) {
			callLogService.getCallLog(obj).then(function (data) {
				$scope.obj = data;
				console.log("Load Full Call Log Data", data)
			});
			//			$scope.obj = obj;
			$scope.ok = function () {
				$uibModalInstance.close($scope.obj);
			};
			$scope.callLogService = callLogService;
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
			$scope.print = function () {
				$('textarea').each(function () {
					$(this).height($(this).prop('scrollHeight'));
				});
				window.print();
				$('textarea').each(function () {
					$(this).removeAttr("style");
				});
			};
			$scope.getIcon = utilitiesServices.getIcon;

			var activeUrl = null;

			$scope.paused = true;

			$scope.$on('wavesurferInit', function (e, wavesurfer) {
				console.info("wavesurferInit");
				$scope.wavesurfer = wavesurfer;

				$scope.wavesurfer.on('play', function () {
					$scope.paused = false;
				});

				$scope.wavesurfer.on('pause', function () {
					$scope.paused = true;
				});

				$scope.wavesurfer.on('finish', function () {
					$scope.paused = true;
					$scope.wavesurfer.seekTo(0);
					$scope.$apply();
				});

				$scope.wavesurfer.on('ready', function () {
					$scope.duration = $scope.wavesurfer.getDuration();
					$scope.$apply();
				});

				$scope.wavesurfer.on("audioprocess", function () {
					$scope.currentTime = $scope.wavesurfer.getCurrentTime();
					$scope.$apply();
				});
			});

			$scope.play = function (url) {
				if (!$scope.wavesurfer) {
					return;
				}

				activeUrl = url;

				$scope.wavesurfer.once('ready', function () {
					$scope.wavesurfer.play();
					$scope.$apply();
				});

				$scope.wavesurfer.load(activeUrl);
			};

			$scope.isPlaying = function (url) {
				return url == activeUrl;
			};

        }]);
		//		angular.module("IVRY-App").controller('PlaylistController', function ($scope) {
		//			var activeUrl = null;
		//			var _this = this;
		//			this.paused = true;
		//
		//			$scope.$on('wavesurferInit', function (e, wavesurfer) {
		//				$scope.wavesurfer = wavesurfer;
		//				console.info(wavesurfer);
		//				$scope.wavesurfer.on('play', function () {
		//					_this.paused = false;
		//				});
		//
		//				$scope.wavesurfer.on('pause', function () {
		//					_this.paused = true;
		//				});
		//
		//				$scope.wavesurfer.on('finish', function () {
		//					_this.paused = true;
		//					$scope.wavesurfer.seekTo(0);
		//					$scope.$apply();
		//				});
		//			});
		//
		//			$scope.play = function (url) {
		//				if (!$scope.wavesurfer) {
		//					return;
		//				}
		//
		//				activeUrl = url;
		//
		//				$scope.wavesurfer.once('ready', function () {
		//					$scope.wavesurfer.play();
		//					$scope.$apply();
		//				});
		//
		//				$scope.wavesurfer.load(activeUrl);
		//			};
		//
		//			$scope.isPlaying = function (url) {
		//				return url == activeUrl;
		//			};
		//		});
		angular.module("IVRY-App").controller("CallLogCtrl", ["$rootScope", "$scope", "$log", "$timeout", "$filter", "linesFilter", "$uibModal",
			"linesTreeService", "utilitiesServices", "dbService", "ctrlData", "linesData", "callLogService", CallLogCtrlFn]);

		function CallLogCtrlFn($rootScope, $scope, $log, $timeout, $filter, linesFilter, $uibModal, linesTreeService, utilitiesServices, dbService, ctrlData, linesData, callLogService) {

			/*jslint node: true */
			$scope.paused = true;
			var _this = this,
				idx = 1;
			this.isOn = false;
			this.isVisible = false;
			this.durationOption = 0;
			$scope.$watch(function () {
				return _this.editObj;
			}, function (nVal) {});
			$scope.markAll = {
				sessionFlagId: 0
			};
			$scope.currentPage = 1;
			$scope.numPerPage = 10;
			this.advFltr = {
				andConditions: [{
					column: null,
					operatorCode: null,
					value: null
				}],
				locked: null,
				isUnMarked: false,
				isImportant: false,
				isIrrelevent: false,
				isReviseLater: false,
				isReviewed: false,
				isTranscribe: false
			};
			$scope.advancedFilter = angular.copy(this.advFltr);
			$scope.savedSearch = [];
			$scope.search = {
				title: ''
			};
			this.tglSave = false;
			$scope.saveSearch = function (title) {
				if (title != '' && title != undefined) {
					$scope.advancedFilter["title"] = title;
					dbService.add($scope.savedSearch, $scope.advancedFilter);
					$scope.advancedFilter = angular.copy(_this.advFltr);
					_this.tglSave = false;
					$scope.search.title = "";
				}
			};
			$scope.loadSearch = function (obj) {
				$scope.advancedFilter = angular.copy(obj);
			};
			$scope.cancelSearch = function () {
				$scope.advancedFilter = angular.copy(_this.advFltr);
			};
			$scope.deleteSearch = function (obj) {
				$scope.savedSearch.splice($scope.savedSearch.indexOf(obj), 1);
				$scope.advancedFilter = angular.copy(_this.advFltr);
			};
			$scope.setPage = function (pageNo) {
				$scope.currentPage = pageNo;
			};

			$scope.pageChanged = function () {
				$log.log('Page changed to: ' + $scope.currentPage);
			};

			$scope.paginate = function (value) {
				var begin, end, index;
				begin = ($scope.currentPage - 1) * $scope.numPerPage;
				end = begin + $scope.numPerPage;
				index = _this.callsLog.searchResults.indexOf(value);
				return (begin <= index && index < end);
			};
			$scope.$watch("currentPage", function (nVal, oVal) {
				console.info("currentPage", nVal, oVal);
				if (nVal != oVal)
					callLogService.get(nVal)
					.then(function (data) {
						_this.callsLog = data;
					});
			});
			$rootScope.$on("refresh_data", function () {
				console.info("refresh_data");
				callLogService.get()
					.then(function (data) {
						_this.callsLog = data;
					});;
				//				$scope.doAdvancedSearch(callLogService.conditions);
			});
			$scope.open1 = function () {
				$scope.popup1.opened = true;
			};

			$scope.open2 = function () {
				$scope.popup2.opened = true;
			};

			$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
			$scope.format = $scope.formats[0];
			$scope.altInputFormats = ['M!/d!/yyyy'];

			$scope.popup1 = {
				opened: false
			};
			$scope.popup2 = {
				opened: false
			};
			this.fromToObj = {
				from: new Date(),
				to: new Date()
			};
			$scope.$watch(function () {
				return _this.fromToObj.from;
			}, function (nVal) {
				$scope.options2.minDate = nVal;
			});
			$scope.options1 = {
				//customClass: getDayClass,
				maxDate: new Date()
			};
			$scope.options2 = {
				//customClass: getDayClass,
				minDate: this.fromToObj.from,
				maxDate: new Date()
			};
			//			$rootScope.$on("columnsFiltered", function () {
			//				$timeout(checkCols,1000);
			//			});
			$scope.$watch("columns", function () {
				checkCols();
			}, true);
			var checkCols = function () {
				var parnt = $(".picked")[0];
				if (parnt !== undefined) {
					//console.info($prnt.offsetTop);
					$("#columnsScroll").scrollTop($(parnt).position().top); //-$("#columnsScroll").offset().top);
				}
			};
			this.editObj = null;
			this.callsLog = ctrlData;

			this.wavesurfer = {};
			this.wavesurferMini = {};
			$scope.miniPaused = true;
			//this.wavesurfer.load('/app/audio/g711-ulaw-25s.wav');

			$scope.$watch(function () {
				return _this.editObj;
			}, function (nVal) {
				if (nVal != null) {
					_this.isOn = false;
					_this.isVisible = true;
					_this.isOn = true;
				}
				if (nVal !== undefined || nVal !== null) {
					try {
						_this.wavesurferMini.stop();
					} catch (ex) {}
					try {
						_this.wavesurfer.destroy();
					} catch (ex) {}
					if (nVal && nVal.audio) {
						_this.wavesurfer = WaveSurfer.create({
							container: '#waveform',
							waveColor: 'violet',
							progressColor: 'purple',
							splitChannels: true,
							height: 64
						});
						//this.wavesurfer.load('/app/audio/g711-ulaw-25s.wav');
						//                    _this.wavesurfer.load("/assets/libs/wavesurfer.js-master/example/split-channels/stereo.mp3");
						_this.wavesurfer.load(nVal.audio);
						_this.wavesurfer.on('ready', function () {
							// Enable creating regions by dragging
							_this.wavesurfer.enableDragSelection();
							var timeline = Object.create(WaveSurfer.Timeline);

							timeline.init({
								wavesurfer: _this.wavesurfer,
								container: '#waveform-timeline'
							});
							$scope.duration = _this.wavesurfer.getDuration();
							$scope.$apply();
						});
						_this.wavesurfer.on('play', function () {
							try {
								_this.wavesurferMini.stop();
							} catch (ex) {}
							$scope.paused = false;
						});

						_this.wavesurfer.on('pause', function () {
							$scope.paused = true;
						});

						_this.wavesurfer.on('finish', function () {
							$scope.paused = true;
							_this.wavesurfer.seekTo(0);
							$scope.$apply();
						});
						_this.wavesurfer.on("audioprocess", function () {
							$scope.currentTime = _this.wavesurfer.getCurrentTime();
							$scope.$apply();
						});
					}
				}
			});
			this.currentMiniAudio = {};
			$scope.play = function (obj) {
				_this.currentMiniAudio = obj;
				if (!_this.wavesurferMini) {
					return;
				}
				try {
					_this.wavesurfer.stop();
				} catch (ex) {}
				//				try {
				//					_this.wavesurferMini.destroy();
				//				} catch (ex) {}
				if (_this.wavesurferMini.load == undefined)
					_this.wavesurferMini = WaveSurfer.create({
						container: '#mini-player',
						waveColor: 'gray',
						progressColor: 'white',
						splitChannels: false,
						height: 32
					});
				_this.wavesurferMini.on('ready', function () {
					_this.wavesurferMini.play();
					$scope.$apply();
				});

				_this.wavesurferMini.on('play', function () {
					$scope.miniPaused = false;
					$scope.miniIsPlaying = obj.caseName + ", " + obj.identityName + ", " + obj.lineName + " : " + $filter("date")(obj.startDate, "dd/MM/yyyy HH:mm");
					$scope.$apply();
				});

				_this.wavesurferMini.on('pause', function () {
					$scope.miniPaused = true;
					//					$scope.$apply();
				});
				_this.wavesurferMini.load(obj.audio);
			};

			$scope.playAudio = function (dir) {
				var idx = _this.callsLog.searchResults.indexOf(_this.currentMiniAudio);
				_this.editObj = _this.callsLog.searchResults[idx + dir];
				$scope.play(_this.editObj);
			};

			$scope.handleChkAll = function (obj, prop, isHandleTree = false) {
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
				if (obj.lines)
					for (var i = 0; i < obj.lines.length; i++) {
						obj.lines[i][prop] = obj.checked;
					}
			};
			$scope.filterLines = function (obj) {};
			$scope.linesTreeObj = linesData; //linesTreeService.linesTreeObj;
			//			console.info("linesTreeObj", $scope.linesTreeObj);
			$scope.columns = {
				childs: []
			};
			$scope.columns.childs = $rootScope.callsLogColumns;
			$scope.dragControlListeners = {
				accept: function (sourceItemHandleScope, destSortableScope, destItemScope) {
					//					console.info(sourceItemHandleScope,destSortableScope,destItemScope)
					if (destItemScope === undefined)
						return sourceItemHandleScope.itemScope.modelValue.drag;
					else
						return sourceItemHandleScope.itemScope.modelValue.drag && destItemScope.modelValue.drag;
				}, //override to determine drag is allowed or not. default is true.
				itemMoved: function (event) {
					//					console.info(event)
				},
				orderChanged: function (event) {
					//					console.log(event, $scope.columns)
				},
				containment: '#board', //optional param.
				clone: false, //optional param for clone feature.
				allowDuplicates: false //optional param allows duplicates to be dropped.
			};
			$scope.treeConfig = {
				lines: {},
				treeObj: linesData,
				multiSelect: true,
				selectedNode: null
			};
			$scope.lines = $scope.treeConfig.lines;

			//            console.log($scope.filteredCallslog);
			//            $scope.$watchCollection("linesTreeObj",function(nVal,oVal){
			////                console.log("linesTreeObj.checked",nVal);
			//            });
			$scope.$watch("lines", function (nVal) {
				//_this.callsLog = linesFilter(_this.callsLog, nVal);
				//console.info(_this.filteredCallsLog);
			}, true);
			//			$scope.$watch("linesTreeObj", function (nVal) {
			//                angular.forEach(nVal,function(val,key){
			//                    if(nVal.checked)
			//                        $scope.lines[nVal.lineId]=true;
			//                });
			//console.info(nVal,$scope.lines);
			//			}, true);
			//            $scope.linesFilter=function(value,index){
			//                //var filter=value.lineId && $scope.lines.indexOf(value.lineId) !== -1;
			////                console.info(filter);
			//                var filter=$scope.lines[value.lineId];
			//                console.log(filter);
			//                return filter;
			//            };
			$scope.getLineName = utilitiesServices.getLineName;

			$scope.openPopup = function (_obj, tmpltURL, cntrl, size = "") {
				var modalInstance = $uibModal.open({
					animation: $scope.animationsEnabled,
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
					$scope.selected = selectedItem;
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
				});
			};
			this.pushNew = function (scopeListName, obj) {
				scopeListName.push(obj);
			};
			this.popOut = function (scopeListName, obj) {
				scopeListName.splice(scopeListName.indexOf(obj), 1);
			};

			this.getTimeDiff = utilitiesServices.getTimeDiff;
			this.getIcon = utilitiesServices.getIcon;

			$scope.checkAll = false;
			$scope.selectedItems = [];
			$scope.selectAll = function () {
				angular.forEach(_this.callsLog.searchResults, function (item) {
					item.Selected = $scope.checkAll;
					if ($scope.checkAll) {
						if ($scope.selectedItems.indexOf(item) == -1)
							$scope.selectedItems.push(item);
					} else
						$scope.selectedItems.splice($scope.selectedItems.indexOf(item), 1);
				});
				console.info("Select All", $scope.selectedItems.length, $scope.selectedItems);
			};

			$scope.checkIfAllSelected = function (item) {
				$scope.checkAll = _this.callsLog.searchResults.every(function (item) {
					return item.Selected == true;
				});
				if (item.Selected) {
					if ($scope.selectedItems.indexOf(item) == -1)
						$scope.selectedItems.push(item);
				} else
					$scope.selectedItems.splice($scope.selectedItems.indexOf(item), 1);
				console.info("Check if All Selected", $scope.selectedItems.length, $scope.selectedItems);
			};

			$scope.selectedOptions = function (selectedList, key, op, val) {
				var optionExisted = false;
				angular.forEach(selectedList, function (nVal, nKey) {
					if (nVal["column"] == key) {
						nVal["value"] = val;
						nVal["operator"] = op;
						optionExisted = true;
					}
				});
				if (!optionExisted)
					selectedList.push({
						column: key,
						operator: op,
						value: val
					});
			};
			$scope.applyUpdates = function (obj, trgt) {
				console.info("Apply Updates", obj, trgt, trgt.indexOf(obj))
			};
			$scope.markSelected = function (list, val) {
				angular.forEach(list, function (item) {
					item.sessionFlagId = val;
				});
				//				console.info(list);
			};
			$scope.callLogService = callLogService;
			this.indexInArray = function (arr, key) {
				angular.forEach(arr, function (nVal, nKey) {
					if (nVal["column"] == key) {
						arr.pop(nKey);
					}
				});
			};
			$scope.doAdvancedSearch = function (obj) {
				console.info("doAdvancedSearch", obj);
				var searchCondition = [];
				if (obj.isImportant)
					searchCondition.push({
						column: "SESSION_FLAG_ID",
						operatorCode: "EQUAL",
						value: 1
					});
				if (obj.isReviseLater)
					searchCondition.push({
						column: "SESSION_FLAG_ID",
						operatorCode: "EQUAL",
						value: 2
					});
				if (obj.isReviewed)
					searchCondition.push({
						column: "SESSION_FLAG_ID",
						operatorCode: "EQUAL",
						value: 3
					});
				if (obj.isIrrelevent)
					searchCondition.push({
						column: "SESSION_FLAG_ID",
						operatorCode: "EQUAL",
						value: 4
					});
				var flagsObj = {
					column: "SESSION_FLAG_ID",
					operatorCode: "IN",
					value: []
				}
				angular.forEach(obj.flags, function (val, key, obj) {
					if (val)
						flagsObj.value.push(key);
				});
				searchCondition.push(flagsObj);
				if (obj.locked)
					searchCondition.push({
						column: "LOCKED",
						operatorCode: "EQUAL",
						value: true
					});
				else if (obj.locked == false)
					searchCondition.push({
						column: "LOCKED",
						operatorCode: "EQUAL",
						value: false
					});

				if (obj.isTranscribe)
					searchCondition.push({
						column: "HAS_TRANSCRIPT",
						operatorCode: "EQUAL",
						value: true
					});

				for (var i = 0; i < obj.andConditions.length; i++) {
					searchCondition.push(obj.andConditions[i]);
				};

				callLogService.get(1, searchCondition).then(function (data) {
					_this.callsLog = data;
				});
				console.log("Advanced Filter", searchCondition);
			};
			$scope.delete = function (x) {
				if (confirm('Are you sure, you want to delete this record?')) {
					_this.editObj = null;
					callLogService.deleteSessionLog(x);
				}
			};
			$scope.loadItem = function (x) {
				//				callLogService.getSessionLog(x).then(function (data) {
				_this.editObj = /*data*/ x;
				//				});
			};
		}
	})(CallsLogItem = app.CallsLogItem || (CallsLogItem = {}));
})(app || (app = {}));
