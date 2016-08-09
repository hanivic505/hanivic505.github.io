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
		angular.module("IVRY-App").controller("callLogFullViewCtrl", ["$scope", "$uibModalInstance", "utilitiesServices", "obj", function ($scope, $uibModalInstance, utilitiesServices, obj) {
			$scope.obj = obj;
			$scope.ok = function () {
				$uibModalInstance.close($scope.obj);
			};

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
		angular.module("IVRY-App").controller("CallLogCtrl", ["$rootScope", "$scope", "$log", "$timeout", "$filter", "linesFilter", "$uibModal", "callLogService", "linesTreeService", "utilitiesServices", "dbService", function ($rootScope, $scope, $log, $timeout, $filter, linesFilter, $uibModal, callLogService, linesTreeService, utilitiesServices, dbService) {
			/*jslint node: true */
			$rootScope.user = "DepAdmin";
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
				isMarked: 10
			};
			$scope.currentPage = 1;
			$scope.numPerPage = 10;
			this.advFltr = {
				params: [{
					attribute: null,
					operator: null,
					value: null
				}],
				isLocked: null,
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
				index = $scope.filteredCallsLog.indexOf(value);
				return (begin <= index && index < end);
			};

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
				var prnt = $(".picked")[0];
				if (prnt !== undefined) {
					//console.info($prnt.offsetTop);
					$("#columnsScroll").scrollTop($(prnt).position().top);//-$("#columnsScroll").offset().top);
				}
			};
			this.editObj = null;
			this.callsLog = [];
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
				var idx = $scope.filteredCallsLog.indexOf(_this.currentMiniAudio);
				_this.editObj = $scope.filteredCallsLog[idx + dir];
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
			};
			//Dummy database creation
			this.callsLog = callLogService;
			$scope.linesTreeObj = linesTreeService;
			$scope.columns = {
				childs: [
					{
						title: 'Mark',
						prop: "isMarked",
						isOn: true,
						drag: false,
						show: false
					},
					{
						title: "Locked",
						prop: "isBlocked",
						isOn: true,
						drag: false,
						show: false
					},
					{
						title: "Transcribed",
						prop: "isTranscribe",
						isOn: true,
						drag: false,
						show: false
					},
					{
						title: 'Case Name',
						prop: "caseName",
						isOn: true,
						drag: true,
						show: true
					},
					{
						title: 'Identity Name',
						prop: "identityName",
						isOn: true,
						drag: true,
						show: true
					},
					{
						title: 'Line Name',
						prop: "lineName",
						isOn: true,
						drag: true,
						show: true
					},
					{
						title: 'Line ID',
						prop: "lineId",
						isOn: true,
						drag: true,
						show: true
					},
					{
						title: 'Date',
						prop: "startDate",
						isOn: true,
						type: "date",
						drag: true,
						show: true
					},
					{
						title: 'Start Time',
						prop: "startDate",
						isOn: false,
						type: "time",
						drag: true,
						show: true
					},
					{
						title: 'End Time',
						prop: "endDate",
						isOn: false,
						type: "time",
						drag: true,
						show: true
					},
					{
						title: 'Duration',
						prop: "duration",
						isOn: false,
						type: "time",
						drag: true,
						show: true
					},
					{
						title: 'Comment',
						prop: "comment",
						isOn: false,
						drag: true,
						show: true
					},
					{
						title: 'Calling Number (a_number)',
						prop: "sipCallingParty",
						isOn: false,
						drag: true,
						show: true
					},
					{
						title: 'Called Number (b_number)',
						prop: "sipCalledParty",
						isOn: false,
						drag: true,
						show: true
					}
				]
			};
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
				treeObj: linesTreeService,
				multiSelect: true,
				selectedNode: null
			};
			$scope.lines = $scope.treeConfig.lines;

			$scope.filteredCallsLog = linesFilter(this.callsLog, $scope.lines);
			//            console.log($scope.filteredCallslog);
			//            $scope.$watchCollection("linesTreeObj",function(nVal,oVal){
			////                console.log("linesTreeObj.checked",nVal);
			//            });
			$scope.$watch("lines", function (nVal) {
				$scope.filteredCallsLog = linesFilter(_this.callsLog, nVal);
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
				angular.forEach($scope.filteredCallsLog, function (item) {
					item.Selected = $scope.checkAll;
					if ($scope.checkAll) {
						if ($scope.selectedItems.indexOf(item) == -1)
							$scope.selectedItems.push(item);
					} else
						$scope.selectedItems.splice($scope.selectedItems.indexOf(item), 1);
				});
				console.info($scope.selectedItems.length, $scope.selectedItems);
			};

			$scope.checkIfAllSelected = function (item) {
				$scope.checkAll = $scope.filteredCallsLog.every(function (item) {
					return item.Selected == true;
				});
				if (item.Selected) {
					if ($scope.selectedItems.indexOf(item) == -1)
						$scope.selectedItems.push(item);
				} else
					$scope.selectedItems.splice($scope.selectedItems.indexOf(item), 1);
				console.info($scope.selectedItems.length, $scope.selectedItems);
			};
			$scope.applyUpdates = function (obj, trgt) {
				console.info(obj, trgt, trgt.indexOf(obj))
			};
			$scope.markSelected = function (list, val) {
				angular.forEach(list, function (item) {
					item.isMarked = val;
				});
				console.info(list);
			};
        }]);
	})(CallsLogItem = app.CallsLogItem || (CallsLogItem = {}));
})(app || (app = {}));
