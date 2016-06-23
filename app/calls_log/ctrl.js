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
		angular.module("IVRY-App").controller("callLogFullViewCtrl", ["$scope", "$uibModalInstance", "obj", function ($scope, $uibModalInstance, obj) {
			$scope.obj = obj;
			$scope.ok = function () {
				$uibModalInstance.close($scope.obj);
			};

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
        }]);
		angular.module("IVRY-App").controller("CallLogCtrl", ["$rootScope","$scope", "$log", "linesFilter", "$uibModal","linesTreeService", function ($rootScope,$scope, $log, linesFilter, $uibModal,linesTreeService) {
			/*jslint node: true */
			$rootScope.user="Analyst";
			var _this = this,
				idx = 1;
			$scope.isOn = false;
			$scope.$watch(function () {
				return _this.editObj;
			}, function (nVal) {
				if (nVal !== null) {
					$scope.isOn = false;
					$scope.isOn = true;
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

			$scope.maxSize = 5;
			$scope.bigTotalItems = 175;
			$scope.bigCurrentPage = 1;

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
					});
				}
			});
			var i, j, k;
			for (i = 0; i < 3; i = i + 1) {
				for (j = 0; j < 3; j = j + 1) {
					for (k = 0; k < 3; k = k + 1) {
						this.callsLog.push(new CallsLogItem("New Case Name" + (i + 1), "New Identity Name" + (((i + 1) * (j + 1))), "New Line Name" + idx, 1200 + i + j + k, new Date("5/28/2016 12:09"), new Date("5/28/2016 12:41"), 23, 13, false, "", "/assets/libs/wavesurfer.js-master/example/split-channels/stereo.mp3"));
						idx = idx + 1;
					}
				}
			}
			$scope.linesTreeObj = linesTreeService;
			$scope.columns = {
				childs: [
					{
						title: 'Case Name',
						prop: "caseName",
						isOn: true
					},
					{
						title: 'Identity Name',
						prop: "identityName",
						isOn: true
					},
					{
						title: 'Line Name',
						prop: "lineName",
						isOn: true
					},
					{
						title: 'Line ID',
						prop: "lineId",
						isOn: true
					},
					{
						title: 'Date',
						prop: "startDate",
						isOn: true,
						type: "date"
					},
					{
						title: 'Start Time',
						prop: "startDate",
						isOn: false,
						type: "time"
					},
					{
						title: 'End Time',
						prop: "endDate",
						isOn: false,
						type: "time"
					},
					{
						title: 'Duration',
						prop: "duration",
						isOn: false,
						type: "time"
					},
					{
						title: 'Comment',
						prop: "comment",
						isOn: false
					},
					{
						title: 'Calling Number (a_number)',
						prop: "sipCallingParty",
						isOn: false
					},
					{
						title: 'Called Number (b_number)',
						prop: "sipCalledParty",
						isOn: false
					}
				]
			};
			$scope.lines={};
			this.filteredCallsLog = linesFilter(this.callsLog, $scope.lines);
			//            console.log($scope.filteredCallslog);
			//            $scope.$watchCollection("linesTreeObj",function(nVal,oVal){
			////                console.log("linesTreeObj.checked",nVal);
			//            });
			$scope.$watch("lines", function (nVal) {
				_this.filteredCallsLog = linesFilter(_this.callsLog, nVal);
				//console.info(_this.filteredCallsLog);
			}, true);
			$scope.$watch("linesTreeObj", function (nVal) {
				//                angular.forEach(nVal,function(val,key){
				//                    if(nVal.checked)
				//                        $scope.lines[nVal.lineId]=true;
				//                });
				//console.info(nVal,$scope.lines);
			}, true);
			//            $scope.linesFilter=function(value,index){
			//                //var filter=value.lineId && $scope.lines.indexOf(value.lineId) !== -1;
			////                console.info(filter);
			//                var filter=$scope.lines[value.lineId];
			//                console.log(filter);
			//                return filter;
			//            };
			$scope.getLineName = function (value) {
				var idx = 0;
				/* jshint node: true */
				angular.forEach(value, function (val, key) {
					if (val) {
						idx = idx + 1;
					}
				});
				return idx;
			};

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

			this.getTimeDiff = function (end, start) {
				var hourDiff = end - start;
				var diffHrs = Math.floor((hourDiff % 86400000) / 3600000);
				var diffMins = Math.floor(((hourDiff % 86400000) % 3600000) / 60000);
				//diffMins = diffMins + (diffHrs * 60);

				//var timeDiff=end.getTime()-start.getTime();
				return diffHrs + ":" + diffMins;
			};
			this.getIcon = function (param) {
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
				case 10:
					obj.icon = "fa-circle-o";
					obj.title = "UnMarked";
					break;
				case 11:
					obj.icon = "fa-exclamation fg-red";
					obj.title = "Important";
					break;
				case 12:
					obj.icon = "fa-search";
					obj.title = "Revise Later";
					break;
				case 13:
					obj.icon = "fa-check fg-green";
					obj.title = "Reviewed";
					break;
				case 14:
					obj.icon = "fa-times fg-red";
					obj.title = "Irrelevent";
					break;
				default:
					break;
				}
				return obj;
			};
        }]);
	})(CallsLogItem = app.CallsLogItem || (CallsLogItem = {}));
})(app || (app = {}));
