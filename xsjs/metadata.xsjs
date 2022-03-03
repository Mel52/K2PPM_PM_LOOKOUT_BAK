    var B1SLAddress = "/b1s/v2/";
    var path = B1SLAddress + "$metadata#Items";
     //var path = B1SLAddress + "Items()?$select=ItemCode,ItemName";
     //https://hanab1vm2:50000/b1s/v1/Items?$select=ItemCode,ItemName,ItemsGroupCode,CommissionPercent
    var destination = $.net.http.readDestination("Helloxsjs.xsjs", "B1SL");
    var fullpath = destination + path;

    var body1 = {};
    body1.CompanyDB = "DMJPROP";
    body1.UserName = "manager";
    body1.Password = "Duffy01!";

    var sessionID = "db26ddb0-c171-11ea-8000-000c294df046";
    var routeID = ".node1";

    var client = new $.net.http.Client();

    var req = new $.web.WebRequest($.request.method, path);
    req.contenType = "text/xml";

    if (sessionID) {
    	req.cookies.set("B1SESSION", sessionID);
    }
    if (routeID) {
    	req.cookies.set("ROUTEID", routeID);
    }

    client.request(req, destination);

    var response = client.getResponse();

    var myBody = response.body.asString();
    //response.contentType = "text/xml";

    /*    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(myBody,"text/xml");*/

    /*     if (response.body) {
    	  	try {
    		myBody = JSON.parse(response.body.asString());

    	} catch (e) {
    		myBody = response.body.asString();
    	}*/
    $.response.setBody(myBody);

    /*    	$.response.setBody(JSON.stringify({
    		"method": method,
    		"status": response.status,
    		"cookies": myCookies,
    		"headers": myHeader,
    		"body": myBody,
    		"reqcookies": myReqCookies,
    		"ReqHeaders": myReqHeaders
    	}));*/

     //$.response.headers = 

    $.response.status = response.status;
    //$.response.headers.set("OData-Version" , "4.0");

     //$.response.setBody(JSON.stringify(myBody));