       //Main api for Key2P odata web service.

      var B1SLAddress = "/b1s/v2/";
      var metadataShortPath = "OData/K2Pmetadata.xml";
      var myBody = null;
      var destinationSL;
      var fullpath = destinationSL + B1SLAddress;
      var sessionID;
      var routeID;
      var queryPath;
      var urlPath;
      var host;
      var rootDir;
      var urlSegments;
      var path1SL;

      urlPath = $.request.path;
      urlSegments = urlPath.split("/");
      rootDir = urlSegments[1];
      host = $.request.headers.get("Host");
      var metadataPath = "https://" + host + "/" + rootDir + "/" + metadataShortPath;
      destinationSL = $.net.http.readDestination("K2PPM_PM.xsjs", "B1SL");
      sessionID = $.request.headers.get("B1SESSION");
      routeID = $.request.headers.get("ROUTEID");
      var filter = $.request.parameters.get('filter');
      if (!filter) {
      	filter = "blank";
      }
      var actionURI = $.request.parameters.get('actionUri');
      if (!actionURI) {
      	actionURI = "blank";
      }

       //var path = B1SLAddress + "Login";
       //var slPath = B1SLAddress + "Items()?$select=ItemCode,ItemName";
       //var slChrgtype = B1SLAddress + "UDO_K2P_CHRGTYPE()";

       //https://hanab1vm2:50000/b1s/v1/Items?$select=ItemCode,ItemName,ItemsGroupCode,CommissionPercent
       //var destinationXS;
       //destinationXS = $.net.http.readDestination("/destinations", "hanab1vm2XS");

       //destinationSL = $.net.http.readDestination("/destinations", "hanab1vm2");

       //$.net.http.readDestination("K2PPM_PM.xsjs", "B1SL");

      var path1 = B1SLAddress + actionURI;
      var req;
      var baseEntity;
      var entityRequested;
      var bMetadata = false;
      var querySL;

      queryPath = $.request.queryPath;

      baseEntity = queryPath.split("(");
      var urlAction = baseEntity[0];
      var switcher = "query";
      if (urlAction.startsWith("$metadata")) {

      	switcher = "$metadata";
      }

      querySL = B1SLAddress + urlAction;

      var client = new $.net.http.Client();

      if (!sessionID) {
      	sessionID = "blank";
      }
      if (!routeID) {
      	routeID = "blank";
      }

       //sessionID = "636f1138-123a-11eb-8000-000c294df046";
       //routeID = ".node3";

      var xsHost, slHost;

      var response, branch = 0;

      try {
      	entityRequested = baseEntity[1];
      } catch (e) {
      	entityRequested = "";
      }

       // fullpath = destinationSL + B1SLAddress + ;

      switch (switcher) {
      	/*     	case "$metadata":
     		branch = switcher;
     		bMetadata = true;

     		req = new $.web.WebRequest($.request.method, metadataPath);
     		client.request(req, destinationXS);

     		response = client.getResponse();

     		xsHost = $.response.headers.get("Host");

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

     		break;*/
      	case "query":

      		branch = switcher;

      		req = new $.web.WebRequest($.request.method, B1SLAddress + queryPath);

      		if (sessionID) {
      			req.cookies.set("B1SESSION", sessionID);
      		}
      		if (routeID) {
      			req.cookies.set("ROUTEID", routeID);
      		}

      		try {
      			client.request(req, destinationSL);
      			response = client.getResponse();
      		} catch (ex) {
      			myBody = response.body.asString();
      		}

      		break;

      	default:

      		branch = "default";

      		response = $.web.WebResponse;
      		var xbody = {};
      		xbody.msg = "not found";

      		$.response.setBody(JSON.stringify(xbody));

      		/*     	case "People":

     		branch = switcher;

     		req = new $.web.WebRequest($.request.method, switcher);

     		if (sessionID) {
     			req.cookies.set("B1SESSION", sessionID);
     		}
     		if (routeID) {
     			req.cookies.set("ROUTEID", routeID);
     		}

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

     		slHost = $.response.headers.get("Host");

     		//The rest of the file (attached) is just a default forward of the response  
     		//
     		var myCookies = [],
     			myHeader = [];

     		break;*/

      }

       //Cookies  
      /*    for (var c in response.cookies) {
    	myCookies.push(response.cookies[c]);
    }
     //Headers  
    for (var h in response.headers) {
    	myHeader.push(response.headers[h]);
    }*/
      var newBody = {};
      if (bMetadata) {
      	$.response.contentType = "application/xml;odata.metadata=minimal;charset=utf-8";
      	newBody["@odata.context"] = metadataPath + "#" + urlAction;

      } else {

      	newBody["@odata.context"] = metadataPath + "#" + urlAction;
      	if (branch.toString() === "default") {
      		newBody["@odata.context"] = metadataPath;
      		/*    		newBody.value = [{
    			"name": "UDO_K2P_CHRGTYPE",
    			"kind": "EntitySet",
    			url: "UDO_K2P_CHRGTYPE"
    		}, {
    			"name": "People",
    			"kind": "EntitySet",
    			url: "People"
    		}];*/

      	} else {
      		newBody["@odata.context"] = metadataPath + "#" + urlAction;

      		//Body  
      		/*    	newBody.action = urlAction;
    	newBody.slChrgtype = slChrgtype;
    	newBody.urlPath = urlPath;
    	newBody.queryPath = queryPath;
    	newBody.host = host;
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
      	$.response.contentType = "application/json;odata.metadata=minimal;charset=utf-8";
      	$.response.setBody(JSON.stringify(newBody));
      }
      $.response.headers.set("OData-Version", "4.0");
      $.response.headers.set("branch", branch);
       //$.response.headers.set("sessionID", sessionID);
       //$.response.headers.set("routeID", routeID);
      $.response.headers.set("filter", filter);
      $.response.headers.set("actionURI", actionURI);
      $.response.headers.set("queryPath", queryPath);
      $.response.headers.set("host", host);
      $.response.headers.set("urlPath", urlPath);
      $.response.headers.set("rootDir", rootDir);
      $.response.headers.set("metadataPath", metadataPath);
      $.response.headers.set("querySL", querySL);
       //destinationSL

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



var destination = $.net.http.readDestination("helloxsjs.xsjs", "B1SL");


//$.response.setBody(destination);

*/

       //var s = "Hello World";
       //$.response.setBody(greeting);
       //login to XS Engine?