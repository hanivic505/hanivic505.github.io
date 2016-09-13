/*global angular*/
/*global WaveSurfer*/
/*jslint nomen: true*/
/*jshint esversion: 6*/
var app;
(function (app) {
	"use strict";

	var CallsLogItem;
	(function (CallsLogItem) {
		angular.module("IVRY-App").controller("exportCallLogCtrl", ["$scope", "$filter", "$uibModalInstance", "callLogService", "obj", function ($scope, $filter, $uibModalInstance, callLogService, obj) {
			$scope.obj = obj;
			$scope.objType = Object.prototype.toString.call(obj);
			$scope.exported = false;
			if ($scope.objType == "[object Object]") {
				$scope.exp = {
					name: obj.lineName + '_' + $filter('date')(obj.startDate, 'dd.MM.yyyy.HH.mm')+".csv",
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
			$scope.download = function () {
				var condition = [];
				console.log("EXPORT", $scope.obj);
				if ($scope.objType == "[object Object]") {
					condition.push({
						column: "SESSION_LOG_ID",
						operatorCode: "EQUAL",
						value: $scope.obj.sessionLogId
					});
				} else {
					var ids = [];
					for (var i = 0; i < $scope.obj.length; i++)
						ids.push($scope.obj[i].sessionLogId);
					condition.push({
						column: "SESSION_LOG_ID",
						operatorCode: "IN",
						value: ids
					});
				}
				callLogService.export(1, condition).then(function (response) {
					console.log(response);
					var file = new Blob([response], {
						type: 'text/csv'
					});
					saveAs(file, $scope.exp.name);
				}, function (error) {
					$rootScope.message = {
						body: error.data.data.message,
						type: 'danger',
						duration: 5000,
					};
				});
			}
			$scope.ok = function () {
				if ($scope.exported)
					$uibModalInstance.close($scope.obj);
				else {
					$scope.exported = true;
				}
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
				$log.debug('Page changed to: ' + $scope.currentPage);
			};

			$scope.paginate = function (value) {
				var begin, end, index;
				begin = ($scope.currentPage - 1) * $scope.numPerPage;
				end = begin + $scope.numPerPage;
				index = _this.callsLog.searchResults.indexOf(value);
				return (begin <= index && index < end);
			};
			$scope.$watch("currentPage", function (nVal, oVal) {
				$log.debug("currentPage", nVal, oVal);
				if (nVal != oVal) {
					$scope.selectedItems = [];
					$scope.checkAll = false;
					callLogService.get(nVal)
						.then(function (data) {
							_this.callsLog = data;
						});
				}
			});
			$rootScope.$on("refresh_data", function () {
				$log.debug("refresh_data");
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
					//$log.debug($prnt.offsetTop);
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
			$scope.handleChkAll = utilitiesServices.checkAll;
			//			$scope.handleChkAll = function (obj, prop, isHandleTree = false) {
			//				if (isHandleTree && obj.id !== undefined)
			//					ctrl.lines[obj.id] = obj.checked;
			//				if (obj.childs)
			//					for (var i = 0; i < obj.childs.length; i++) {
			//						obj.childs[i][prop] = obj.checked;
			//						if (isHandleTree && obj.childs[i].id !== undefined)
			//							ctrl.lines[obj.childs[i].id] = obj.checked;
			//						if (obj.childs[i].childs)
			//							$scope.handleChkAll(obj.childs[i], prop, isHandleTree);
			//					}
			//
			//				if (obj.identities) {
			//					var idObjs = obj.identities;
			//					for (var i = 0; i < idObjs.length; i++) {
			//						idObjs[i][prop] = obj.checked;
			//						if (isHandleTree && idObjs[i].id !== undefined)
			//							ctrl.lines[idObjs[i].id] = obj.checked;
			//						if (idObjs[i].lines)
			//							$scope.handleChkAll(idObjs[i], prop, isHandleTree);
			//					}
			//				}
			//				if (obj.lines)
			//					for (var i = 0; i < obj.lines.length; i++) {
			//						obj.lines[i][prop] = obj.checked;
			//					}
			//			};
			this.filterByLines = [];
			$scope.filterLines = function (obj) {
				_this.filterByLines = [];
				angular.forEach(obj.lines, function (val, key, o) {

					$log.debug(key, val, o);
					if (val)
						_this.filterByLines.push(key);
				});
				$log.debug(_this.filterByLines);
				$scope.doAdvancedSearch($scope.advancedFilter);
			};
			linesData.map(function (currentValue, index, arr) {
				delete(currentValue.id);
				for (var i = 0; i < currentValue.identities.length; i++) {
					delete(currentValue.identities[i].id);
					if (currentValue.identities[i].lines.length < 1) {
						currentValue.identities.splice(i, 1);
						i--;
					}
				}
				//				$log.debug("CASE ::after", currentValue.identities, currentValue, index, arr);
				if (currentValue.identities.length < 1)
					arr.splice(index, 1);
			});
			$scope.linesTreeObj = linesData;
			//			$log.debug("linesTreeObj", $scope.linesTreeObj);
			$scope.columns = {
				childs: []
			};
			$scope.columns.childs = $rootScope.callsLogColumns;
			$scope.dragControlListeners = {
				accept: function (sourceItemHandleScope, destSortableScope, destItemScope) {
					//					$log.debug(sourceItemHandleScope,destSortableScope,destItemScope)
					if (destItemScope === undefined)
						return sourceItemHandleScope.itemScope.modelValue.drag;
					else
						return sourceItemHandleScope.itemScope.modelValue.drag && destItemScope.modelValue.drag;
				}, //override to determine drag is allowed or not. default is true.
				itemMoved: function (event) {
					//					$log.debug(event)
				},
				orderChanged: function (event) {
					//					$log.debug(event, $scope.columns)
				},
				containment: '#board', //optional param.
				clone: false, //optional param for clone feature.
				allowDuplicates: false //optional param allows duplicates to be dropped.
			};
			$scope.treeConfig = {
				lines: {},
				treeObj: linesData,
				multiSelect: true,
				selectedNode: null,
				filterOutEmptyIdentity: true,
			};
			$scope.lines = $scope.treeConfig.lines;

			//            $log.debug($scope.filteredCallslog);
			//            $scope.$watchCollection("linesTreeObj",function(nVal,oVal){
			////                $log.debug("linesTreeObj.checked",nVal);
			//            });
			$scope.$watch("lines", function (nVal) {
				//_this.callsLog = linesFilter(_this.callsLog, nVal);
				//$log.debug(_this.filteredCallsLog);
			}, true);
			//			$scope.$watch("linesTreeObj", function (nVal) {
			//                angular.forEach(nVal,function(val,key){
			//                    if(nVal.checked)
			//                        $scope.lines[nVal.lineId]=true;
			//                });
			//$log.debug(nVal,$scope.lines);
			//			}, true);
			//            $scope.linesFilter=function(value,index){
			//                //var filter=value.lineId && $scope.lines.indexOf(value.lineId) !== -1;
			////                $log.debug(filter);
			//                var filter=$scope.lines[value.lineId];
			//                $log.debug(filter);
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
					$log.debug('Modal dismissed at: ' + new Date());
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
				$log.debug("Select All", $scope.selectedItems.length, $scope.selectedItems);
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
				$log.debug("Check if All Selected", $scope.selectedItems.length, $scope.selectedItems);
			};

			//			$scope.selectedOptions = function (selectedList, key, op, val) {
			//				var optionExisted = false;
			//				angular.forEach(selectedList, function (nVal, nKey) {
			//					if (nVal["column"] == key) {
			//						nVal["value"] = val;
			//						nVal["operator"] = op;
			//						optionExisted = true;
			//					}
			//				});
			//				if (!optionExisted)
			//					selectedList.push({
			//						column: key,
			//						operator: op,
			//						value: val
			//					});
			//			};
			$scope.applyUpdates = function (obj, trgt) {
				$log.debug("Apply Updates", obj, trgt, trgt.indexOf(obj))
			};
			$scope.markSelected = function (list, val) {
				$log.debug(list, val);
				angular.forEach(list, function (item) {
					item.sessionFlagId = val;
					callLogService.updateSessionFlag(item.sessionLogId, val);
					$log.debug(item);
				});
				$scope.selectedItems = [];
				$scope.checkAll = false;
				//				$log.debug(list);
			};
			$scope.callLogService = callLogService;
			this.indexInArray = function (arr, key) {
				angular.forEach(arr, function (nVal, nKey) {
					if (nVal["column"] == key) {
						arr.splice(nKey, 1);
					}
				});
			};
			this.filterByDuration = [];
			$scope.filterDuration = function (obj) {
				_this.filterByDuration = [];
				if (!_this.durationOption)
					switch (obj.period) {
						case "1":
							obj.to = utilitiesServices.getSystemDate();
							obj.from = new Date(obj.to.getTime() - (1000 * 60 * 60));
							_this.filterByDuration.push({
								column: "START_DATE",
								operatorCode: "BETWEEN",
								value: [obj.from, obj.to]
							});
							break;
						case "2":
							obj.to = utilitiesServices.getSystemDate();
							obj.from = new Date(obj.to.getTime() - (24 * 1000 * 60 * 60));
							_this.filterByDuration.push({
								column: "START_DATE",
								operatorCode: "BETWEEN",
								value: [obj.from, obj.to]
							});
							break;
						case "3":
							obj.to = utilitiesServices.getSystemDate();
							obj.from = new Date(obj.to.getTime() - (7 * 24 * 1000 * 60 * 60));
							_this.filterByDuration.push({
								column: "START_DATE",
								operatorCode: "BETWEEN",
								value: [obj.from, obj.to]
							});
							break;
						case "4":
							obj.to = utilitiesServices.getSystemDate();
							obj.from = new Date(obj.to.getTime() - (30 * 24 * 1000 * 60 * 60));
							_this.filterByDuration.push({
								column: "START_DATE",
								operatorCode: "BETWEEN",
								value: [obj.from, obj.to]
							});
							break;
						default:
							obj.to = utilitiesServices.getSystemDate();
							obj.from = utilitiesServices.getSystemDate();
							_this.filterByDuration = [];
							break;
					} else
						_this.filterByDuration.push({
							column: "START_DATE",
							operatorCode: "BETWEEN",
							value: [obj.from, obj.to]
						});
				$log.debug(_this.durationOption, obj);
				$scope.doAdvancedSearch($scope.advancedFilter);
			};
			$scope.doAdvancedSearch = function (obj) {
				$log.debug("doAdvancedSearch", obj);
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
						if (key == "null")
							flagsObj.value.push(null);
						else
							flagsObj.value.push(key);
				});
				if (flagsObj.value.length > 0)
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
				$log.debug("_this.filterByLines", _this.filterByLines);
				if (_this.filterByLines.length > 0)
					searchCondition.push({
						column: 'LINE_ID',
						operatorCode: 'IN',
						value: _this.filterByLines
					});
				if (_this.filterByDuration.length > 0)
					searchCondition.push(_this.filterByDuration[0]);
				if (searchCondition[0].column == null)
					searchCondition.shift();
				callLogService.get(1, searchCondition).then(function (data) {
					_this.callsLog = data;
				});
				$log.debug("Advanced Filter", searchCondition);
			};
			$scope.delete = function (x) {
				if (confirm('Are you sure, you want to delete this record?')) {
					_this.editObj = null;
					callLogService.deleteSessionLog(x);
				}
			};
			$scope.deleteMulti = function (x) {
				$log.debug(x);
				if (confirm("Are you sure!, you want to delete this records?")) {
					var ids = [];
					for (var i = 0; i < x.length; i++)
						ids.push(x[i].sessionLogId)
					callLogService.deleteMultiSessionLog(ids);
				}
			}
			$scope.loadItem = function (x) {
				//				callLogService.getSessionLog(x).then(function (data) {
				_this.editObj = /*data*/ x;
				//				});
			};
		}
	})(CallsLogItem = app.CallsLogItem || (CallsLogItem = {}));
})(app || (app = {}));
