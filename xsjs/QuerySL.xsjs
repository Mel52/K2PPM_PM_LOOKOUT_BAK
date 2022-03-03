    var B1SLAddress = "/b1s/v2/";
     //var path = B1SLAddress + "Login";
    var slPath = B1SLAddress + "Items()?$select=ItemCode,ItemName";
    var slChrgtype = B1SLAddress + "UDO_K2P_CHRGTYPE()";
    var metaDataUrl = "/K2PPM_PM/xsjs/QuerySL.xsjs/$metadata";
    var metadataPath = "/K2PPM_PM/localservice/metadataK2P_CHRGTYPE.xml";
     //metadataPath = "http://hanab1vm2:8000/K2PPM_PM/localservice/metadataK2P_CHRGTYPE.xml";
     //https://hanab1vm2:50000/b1s/v1/Items?$select=ItemCode,ItemName,ItemsGroupCode,CommissionPercent
    var destinationSL = $.net.http.readDestination("K2PPM_PM.xsjs", "hanab1vm2");
    var destinationXS = $.net.http.readDestination("K2PPM_PM.xsjs", "hanab1vm2XS"); //"http://hanab1vm2:8000"; //
    var metadataText;

    var myBody = null;

    var fullpath = destinationSL + slPath;

    var sessionID;
    var routeID;
    var queryPath;
    var urlPath;
    var host;
    var filter = $.request.parameters.get('filter');
    var actionURI = $.request.parameters.get('actionUri');
    var path1 = B1SLAddress + actionURI;
    var req;
    var baseEntity;
    var entityRequested;
    var bMetadata = false;

    host = $.request.headers.get("Host");
    queryPath = $.request.queryPath;
    baseEntity = queryPath.split("(");
    var urlAction = baseEntity[0];
    var switcher = urlAction;
    if (urlAction.startsWith("$metadata")) {
    	switcher = "$metadata";
    }

    urlPath = $.request.path;

    sessionID = $.request.headers.get("B1SESSION");
    routeID = $.request.headers.get("ROUTEID");
    if (!sessionID) {
    	sessionID = "";
    }
    if (!routeID) {
    	routeID = "";
    }

    /*    sessionID = "499a94aa-ccf6-11ea-8000-000c294df046";
    routeID = "node1";*/

    var response, branch = 0;

    try {
    	entityRequested = baseEntity[1];
    } catch (e) {
    	entityRequested = "";
    }

    var client = new $.net.http.Client();
    switch (switcher) {
    	case "$metadata":
    		branch = switcher;
    		bMetadata = true;

    		req = new $.web.WebRequest($.request.method, metadataPath);
    		client.request(req, destinationXS);

    		response = client.getResponse();

    		if (response.body) {
    			try {
    				//myBody = JSON.parse(response.body.asString());
    				myBody = response.body.asString();
    				//var newBody = {};
    				//delete myBody[1];
    				//delete myBody.odata.metadata;

    			} catch (e) {
    				myBody = response.body.asString();
    			}
    			myBody.metadataPath = metadataPath;
    			$.response.setBody(myBody);

    			$.response.contentType = "application/xml;odata.metadata=minimal;charset=utf-8";

    			$.response.status = response.status;

    			$.response.headers.set("OData-Version", "4.0");

    			$.response.headers.set("metadataPath", metadataPath);

    			//$.response.headers.set("Content-Type", "application/xml;odata.metadata=minimal;charset=utf-8");

    			$.response.headers.set("Vary", "Accept-Encoding");

    			//$.response.headers.set("Connection", "Keep-Alive");

    			//$.response.headers.set("Transfer-Encoding", "chunked");
    		}

    		break;
    	case "People":

    		branch = switcher;

    		req = new $.web.WebRequest($.request.method, slChrgtype);

    		if (sessionID) {
    			req.cookies.set("B1SESSION", sessionID);
    		}
    		if (routeID) {
    			req.cookies.set("ROUTEID", routeID);
    		}

    		client.request(req, destinationSL);

    		response = client.getResponse();

    		break;

    	case "UDO_K2P_CHRGTYPE":

    		branch = switcher;

    		req = new $.web.WebRequest($.request.method, slChrgtype);

    		/*    		if (sessionID) {
    			req.cookies.set("B1SESSION", sessionID);
    		}
    		if (routeID) {
    			req.cookies.set("ROUTEID", routeID);
    		}*/

    		client.request(req, destinationSL);

    		response = client.getResponse();

    		break;

    	case "Items":
    		branch = switcher;

    		//method = $.net.http.POST;

    		req = new $.web.WebRequest($.request.method, slPath);

    		if (sessionID) {
    			req.cookies.set("B1SESSION", sessionID);
    		}
    		if (routeID) {
    			req.cookies.set("ROUTEID", routeID);
    		}

    		client.request(req, destinationSL);

    		response = client.getResponse();

    		//The rest of the file (attached) is just a default forward of the response  
    		//
    		var myCookies = [],
    			myHeader = [];

    		break;

    	default:

    		branch = "default";

    		response = $.web.WebResponse;
    		var xbody = {};
    		xbody.msg = "not found";

    		$.response.setBody(JSON.stringify(xbody));

    }

     //Cookies  
    /*    for (var c in response.cookies) {
    	myCookies.push(response.cookies[c]);
    }
     //Headers  
    for (var h in response.headers) {
    	myHeader.push(response.headers[h]);
    }*/
    if (bMetadata) {

    	$.response.contentType = "application/xml;odata.metadata=minimal;charset=utf-8";
    	//$.response.setBody(JSON.stringify(newBody));

    } else {
    	var newBody = {};
    	if (branch.toString() === "default") {
    		newBody["@odata.context"] = "https://" + host + "/K2PPM_PM/xsjs/QuerySL.xsjs/$metadata";
    		newBody.branch = branch;
    		newBody.switcher = switcher;
    		newBody.sessionID = sessionID;
    		newBody.routeID = routeID;
    		newBody.value = [{
    			"name": "UDO_K2P_CHRGTYPE",
    			"kind": "EntitySet",
    			url: "UDO_K2P_CHRGTYPE"
    		}, {
    			"name": "People",
    			"kind": "EntitySet",
    			url: "People"
    		}];

    	} else {
    		newBody["@odata.context"] = "https://" + host + "/K2PPM_PM/xsjs/QuerySL.xsjs/$metadata#" + urlAction;
    		newBody.sessionID = sessionID;
    		newBody.routeID = routeID;
    		newBody.host = host;
    		//Body  
    		/*    	newBody.action = urlAction;
    	newBody.slChrgtype = slChrgtype;
    	newBody.urlPath = urlPath;
    	newBody.queryPath = queryPath;

    	newBody.switcher = switcher;
    	newBody.branch = branch;
    	*/

    		/*    			newBody.slHost = slHost;
    			newBody.xsHost = xsHost;*/

    		if (response.body) {

    			try {
    				myBody = JSON.parse(response.body.asString());
    			} catch (e) {
    				myBody = response.body.asString();
    			}

    			//newBody.destinationSL = destinationSL;
    			//newBody.destinationXS = destinationXS;
    			newBody.value = myBody.value;

    			//delete myBody[1];
    			//delete myBody.odata.metadata;
    		}

    	}
    	$.response.contentType = "application/json";
    	$.response.setBody(JSON.stringify(newBody));
    }
    $.response.headers.set("OData-Version", "4.0");

    /* 

//var req = new $.web.WebRequest($.net.http.POST, "{"UserName":"manager", "Password":"Duffy01!", "CompanyDB":"DMJPROP"}");
client.request(req, destination);
var response = client.webReponse();

var co = [], he = [];
for(var c in response.cookies) {
co.push(response.cookies[c]);
}
for(var c in response.headers) {
he.push(response.headers[c]);
}
var body;
if(response.body)
{
body = response.body.asString();
}
$.response.contentType = "application/json";



var res = parseInt(response.body.asString()) * amount;
$.response.setBody(amount + " of your " + stock + " are worth: " + res);

//var greeting = $.K2PLib.greetlib.greet("Dolly");



   


$.response.setBody(greeting);



var destination = $.net.http.readDestination("K2PPM_PM.xsjs", "B1SL");


//$.response.setBody(destination);

*/

     //var s = "Hello World";
     //$.response.setBody(greeting);
     //login to XS Engine?