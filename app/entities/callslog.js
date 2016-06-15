var app;
(function(app){
    var CallsLogItem=(function(){
        function CallsLogItem(caseName,identityName,lineName,lineId,startDate,endDate,duration,isMarked,isLocked,comment,audio){
            return {
                caseName:caseName,
                identityName:identityName,
                lineName:lineName,
                lineId:lineId,
                startDate:startDate,
                endDate:endDate,
                duration:duration,
                isMarked:isMarked,
                isLocked:isLocked,
                comment:comment,
                audio:audio,
            }
        }
        return CallsLogItem;
    })();
    app.CallsLogItem=CallsLogItem;
})(app || (app={}));