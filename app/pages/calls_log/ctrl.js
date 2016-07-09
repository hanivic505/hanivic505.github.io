/*global angular*/
/*global WaveSurfer*/
/*jslint nomen: true*/
/*jshint esversion: 6*/
var app;
(function (app) {
	"use strict";

	var CallsLogItem;
	(function (CallsLogItem) {
		angular.module("IVRY-App").controller("exportCallLogCtrl", ["$scope", "$uibModalInstance", "obj", function ($scope, $uibModalInstance, obj) {
			$scope.obj = obj;
			$scope.ok = function () {
				$uibModalInstance.close($scope.obj);
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
			$scope.getIcon = utilitiesServices.getIcon;
        }]);
		angular.module("IVRY-App").controller('PlaylistController', function ($scope) {
			var activeUrl = null;
			var _this = this;
			this.paused = true;

			$scope.$on('wavesurferInit', function (e, wavesurfer) {
				$scope.wavesurfer = wavesurfer;
				console.info(wavesurfer);
				$scope.wavesurfer.on('play', function () {
					_this.paused = false;
				});

				$scope.wavesurfer.on('pause', function () {
					_this.paused = true;
				});

				$scope.wavesurfer.on('finish', function () {
					_this.paused = true;
					$scope.wavesurfer.seekTo(0);
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
		});
		angular.module("IVRY-App").controller("CallLogCtrl", ["$rootScope", "$scope", "$log", "linesFilter", "$uibModal", "callLogService", "linesTreeService", "utilitiesServices", function ($rootScope, $scope, $log, linesFilter, $uibModal, callLogService, linesTreeService, utilitiesServices) {
			/*jslint node: true */
			$rootScope.user = "Analyst";
			$scope.paused = true;
			var _this = this,
				idx = 1;
			this.isOn = false;
			this.isVisible = false;
			$scope.$watch(function () {
				return _this.editObj;
			}, function (nVal) {
				if (nVal !== null) {
					_this.isOn = false;
					_this.isVisible = true;
					_this.isOn = true;
				}
			});
			$scope.currentPage = 1;
			$scope.numPerPage = 10;
			$scope.advancedFilter = [{
				attribute: null,
				operator: null,
				value: null
			}];
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
				index = _this.filteredCallsLog.indexOf(value);
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
			this.editObj = null;
			this.callsLog = [];
			this.wavesurfer = {};
			//this.wavesurfer.load('/app/audio/g711-ulaw-25s.wav');

			$scope.$watch(function () {
				return _this.editObj;
			}, function (nVal) {
				if (nVal !== undefined || nVal !== null) {
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
							$scope.duration=_this.wavesurfer.getDuration();
							$scope.$apply();
						});
						_this.wavesurfer.on('play', function () {
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
			$scope.play = function (url) {
				if (!_this.wavesurfer) {
					return;
				}

				_this.wavesurfer.on('ready', function () {
					_this.wavesurfer.play();
					$scope.$apply();
				});

				_this.wavesurfer.load(url);
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
						title: 'Case Name',
						prop: "caseName",
						isOn: true,
						order: 1
					},
					{
						title: 'Identity Name',
						prop: "identityName",
						isOn: true,
						order: 2
					},
					{
						title: 'Line Name',
						prop: "lineName",
						isOn: true,
						order: 3
					},
					{
						title: 'Line ID',
						prop: "lineId",
						isOn: true,
						order: 4
					},
					{
						title: 'Date',
						prop: "startDate",
						isOn: true,
						type: "date",
						order: 5
					},
					{
						title: 'Start Time',
						prop: "startDate",
						isOn: false,
						type: "time",
						order: 6
					},
					{
						title: 'End Time',
						prop: "endDate",
						isOn: false,
						type: "time",
						order: 7
					},
					{
						title: 'Duration',
						prop: "duration",
						isOn: false,
						type: "time",
						order: 8
					},
					{
						title: 'Comment',
						prop: "comment",
						isOn: false,
						order: 9
					},
					{
						title: 'Calling Number (a_number)',
						prop: "sipCallingParty",
						isOn: false,
						order: 10
					},
					{
						title: 'Called Number (b_number)',
						prop: "sipCalledParty",
						isOn: false,
						order: 11
					}
				]
			};
			$scope.treeConfig = {
				lines: {},
				treeObj: linesTreeService,
				multiSelect: true,
				selectedNode: null
			};
			$scope.lines = $scope.treeConfig.lines;

			this.filteredCallsLog = linesFilter(this.callsLog, $scope.lines);
			//            console.log($scope.filteredCallslog);
			//            $scope.$watchCollection("linesTreeObj",function(nVal,oVal){
			////                console.log("linesTreeObj.checked",nVal);
			//            });
			$scope.$watch("lines", function (nVal) {
				_this.filteredCallsLog = linesFilter(_this.callsLog, nVal);
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
				$scope[scopeListName].push(obj);
			};
			this.popOut = function (scopeListName, obj) {
				$scope[scopeListName].splice($scope[scopeListName].indexOf(obj), 1);
			};

			this.getTimeDiff = utilitiesServices.getTimeDiff;
			this.getIcon = utilitiesServices.getIcon;
        }]);
	})(CallsLogItem = app.CallsLogItem || (CallsLogItem = {}));
})(app || (app = {}));
