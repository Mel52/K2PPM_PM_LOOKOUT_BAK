var webInfo = {};
var webInfoItems = [];
var requestInfo = {};
var qparameters = [];
var debugInfo = false;
var serviceLib = $.import("K2PPM_PM.xsjs.K2PB1", "B1SLLogic");

$.trace.error("********************************************************************************************************");
$.trace.error("Start of K2POdata Service");

requestInfo = serviceLib.parseB1RequestInfo();
//$.trace.error(JSON.stringify(requestInfo));
webInfo.requestInfo = requestInfo;

serviceLib.runBatch(webInfo);  

//webInfoItems.push(requestInfo);

/*if (requestInfo.batch) {
    serviceLib.runBatch(webInfo);  
}
else {
  serviceLib.callServiceLayer(webInfo);  
  
}*/


if (debugInfo) {
    $.trace.error(JSON.stringify(webInfo));
	$.response.headers.set("webInfo", JSON.stringify(webInfo));
}

$.trace.error("End of K2POdata Service");