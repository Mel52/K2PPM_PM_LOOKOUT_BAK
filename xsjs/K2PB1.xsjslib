function replaceAll(find, replace, str)

{
	while (str.indexOf(find) > -1) {
		str = str.replace(find, replace);
	}
	return str;
}
// Initializes a new instance of the StringBuilder class
// and appends the given value if supplied
function StringBuilder(value) {
	this.strings = new Array();
	if (value) {
		this.strings.push(value);
	}
}

StringBuilder.prototype.str2ab = function(str) {
	var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
	var bufView = new Uint16Array(buf);
	for (var i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return buf;
};

// Appends the given value to the end of this instance.
StringBuilder.prototype.append = function(value) {
	if (value) {
		this.strings.push(value);
	}
};

// Appends the given value to the end of this instance with crlf.
StringBuilder.prototype.appendLine = function(value) {

	if (value) {
		this.strings.push(value);
	}
	this.strings.push(String.fromCharCode(13));
	this.strings.push(String.fromCharCode(10));
};

// Clears the string buffer
StringBuilder.prototype.clear = function() {
	this.strings.length = 1;
};

// Converts this instance to a String.
StringBuilder.prototype.toString = function() {
	return this.strings.join("");
};

function toUTF8Array(str) {
	var utf8 = [];
	for (var i = 0; i < str.length; i++) {
		var charcode = str.charCodeAt(i);
		if (charcode < 0x80) {
			utf8.push(charcode);
		} else if (charcode < 0x800) {
			utf8.push(0xc0 | (charcode >> 6),
				0x80 | (charcode & 0x3f));
		} else if (charcode < 0xd800 || charcode >= 0xe000) {
			utf8.push(0xe0 | (charcode >> 12),
				0x80 | ((charcode >> 6) & 0x3f),
				0x80 | (charcode & 0x3f));
		}
		// surrogate pair
		else {
			i++;
			// UTF-16 encodes 0x10000-0x10FFFF by
			// subtracting 0x10000 and splitting the
			// 20 bits of 0x0-0xFFFFF into two halves
			charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
			utf8.push(0xf0 | (charcode >> 18),
				0x80 | ((charcode >> 12) & 0x3f),
				0x80 | ((charcode >> 6) & 0x3f),
				0x80 | (charcode & 0x3f));
		}
	}
	return utf8;
}

function handleTupelList(inData) {
	var tupelList = [];
	var i, pName, pValue;

	if (inData) {
		for (i = 0; i < inData.length; ++i) {

			var oneParam = {};
			pName = inData[i].name;
			pValue = inData[i].value;
			try {
				oneParam[pName] = pValue;
			} catch (e) {
				oneParam[pName] = "";
			}

			tupelList.push(oneParam);
		}
	}
	return tupelList;

}

function parseB1RequestInfo() {

	$.trace.error("Start of parse");
	$.trace.error($.request.cookies.length);
	var requestInfo = {};
	var entityBody;
	requestInfo.destinationPath = "K2PPM_PM.xsjs";
	requestInfo.destination = "hanab1";
	requestInfo.method = $.request.method;
	requestInfo.contentType = $.request.headers.get("Content-Type");
	requestInfo.batch = false;
	$.trace.error("requestInfo.contentType: " + requestInfo.contentType);

	requestInfo.queryPath = $.request.queryPath;
	replaceAll(" ", "%20", requestInfo.queryPath);
	$.trace.error("Clean path:" + requestInfo.queryPath);
	if (requestInfo.queryPath) {
		if (requestInfo.queryPath.indexOf("$metadata") !== -1) {
			if (requestInfo.queryPath.indexOf("sml.svc") !== -1) {
				requestInfo.queryPath = "sml.svc/$metadata";
			} else {
				requestInfo.queryPath = "$metadata";
			}
		} else {
			var pos = requestInfo.queryPath.indexOf("$batch");
			if (pos !== -1) {
				requestInfo.batch = true;
				//"multipart/mixed;boundary=batch_id-1628778096163-237/r/n"; 
				//requestInfo.queryPath = requestInfo.queryPath.replace("/$batch", "");
				//requestInfo.method = 1;
			}
			//else blank
		}
		$.trace.error("requestInfo.queryPath");
		$.trace.error(requestInfo.queryPath);
		requestInfo.urlPath = $.request.path;

		requestInfo.filter = $.request.parameters.get('filter');
		requestInfo.actionURI = $.request.parameters.get('actionUri');
		requestInfo.host = $.request.headers.get("Host");
		requestInfo.origin = $.request.headers.get("origin");
		$.trace.error("begin test");
		$.trace.error($.request.entities.length);
		if ($.request.entities.length > 0) {
			entityBody = $.request.entities[0].body;
			if (entityBody) {
				$.trace.error($.request.entities[0].body.asString());
			} else {
				$.trace.error("Sub Entities: " + $.request.entities[0].entities.length);
			}

		} else {
			$.trace.error("NO Entities");
		}

		$.trace.error("test body");
		if ($.request.body) {
			$.trace.error("Body Exists");
			//$.trace.error($.request.body.asString());
			$.trace.error("test ArrayBuffer");
			if ($.request.body.asArrayBuffer()) {
				$.trace.error("test ArrayBuffer exists");
			} else {
				$.trace.error("No ArrayBuffer");
			}

			$.trace.error("test WebRequest()");
			if ($.request.body.asArrayBuffer()) {
				$.trace.error("test WebRequest exists");
			} else {
				$.trace.error("No WebRequest");
			}
		} else {
			$.trace.error("No Body");

		}
		/*		var cumulatedBody = "";
		try {
			for (i = 0; i < $.request.entities.length; ++i) {
				if ($.request.entities[i].body) {
					cumulatedBody = cumulatedBody + $.request.entities[i].body.asString();
				}
			}
		}
		catch (e)
		{
		 $.trace.error(e.message); 
		 throw e;
		}*/

		$.trace.error("parameters");
		if ($.request.parameters) {
			$.trace.error($.request.parameters.length);
		}
		$.trace.error("End test");

		try {

			if (requestInfo.batch) {

				requestInfo.body = $.request.body.asString();
				/*				
				var arContentType = requestInfo.contentType.split(";");
				requestInfo.boundary = arContentType[1];
				requestInfo.boundary = requestInfo.boundary.replace("boundary=", "--");
				var batchBody = requestInfo.boundary;
				batchBody = batchBody + lineFeed;
				batchBody = batchBody + lineFeed;
				var batchItem;
				i = 0;
				$.trace.error(i);
				$.trace.error($.request.parameters.length); //$.request.parameters.length
				for (i = 0; i < 8; ++i) {
					$.trace.error("i: " + i);
					batchItem = $.request.parameters[i].value;
					$.trace.error(batchItem);
					batchBody = batchBody + batchItem;
					batchBody = batchBody + " " + requestInfo.boundary + "--";
					batchBody = batchBody + lineFeed;
				}
				batchBody = batchBody + lineFeed;
				batchBody = batchBody + lineFeed;
				requestInfo.body = batchBody;*/
				//$.trace.error(requestInfo.body);
			} else {
				var encodedBody = $.request.body.asString();
				var decodedBody = JSON.parse(encodedBody);
				requestInfo.body = decodedBody;
				requestInfo.contentType = $.request.headers.get("content-type");
			}

		} catch (err) {
			$.trace.error(err.message);
		}
		//requestInfo.parameterCount = $.request.parameters.length;

		requestInfo.headers = handleTupelList($.request.headers);
		requestInfo.parameters = handleTupelList($.request.parameters);
		requestInfo.cookies = handleTupelList($.request.cookies);

		requestInfo.lastSlashIndex = requestInfo.urlPath.lastIndexOf("\/");

		if (requestInfo.lastSlashIndex === -1) {
			requestInfo.contextPath = "";
		} else {
			requestInfo.contextPath = requestInfo.urlPath.slice(0, requestInfo.lastSlashIndex);
		}

		$.trace.error("End of parse");

		return requestInfo;
	} else {
		$.trace.error("No Query Path");
		throw "No Query Path!";
	}
}

function runBatch(webInfo) {
	$.trace.error("runBatch");
	var requestInfo = webInfo.requestInfo;
	var destination = $.net.http.readDestination(requestInfo.destinationPath, requestInfo.destination);
	var i;
	var client = new $.net.http.Client();
	var path = requestInfo.queryPath;
	var newMethod = $.request.method;
	var ROUTEID_Request;
	//var linefeed = "\r\n";

	//COPY SOME HEADERS TO NEW SL REQUEST
	var req = new $.web.WebRequest(newMethod, $.request.queryPath);
	$.trace.error("--------------Request Headers-------------------------");
	$.trace.error("path: " + $.request.queryPath);
	$.trace.error($.request.headers.length);
	var name;
	var b1cookies;
	for (i in $.request.headers) {
		//$.trace.error($.request.headers[i].name);
		/*if ($.request.headers[i].name === "content-type"  || $.request.headers[i].name === "content-length" || $.request.headers[i].name ===
			"Odata-Version" || $.request.headers[i].name === "accept"  || $.request.headers[i].name === "accept-encoding" ) */
		name = $.request.headers[i].name;

		/*			if (!name.startsWith("~")) 
			{}*/
		if (name === "b1cookies") {
			b1cookies = $.request.headers[i].value;
		}
		if (name === "ROUTEID") {
			ROUTEID_Request = $.request.headers[i].value;
		}
		$.trace.error($.request.headers[i].name);
		$.trace.error($.request.headers[i].value);

		if ($.request.headers[i].name === "content-type") {

			requestInfo.contentType = $.request.headers[i].value;
			$.trace.error("batch " + requestInfo.batch);
			if (requestInfo.batch) {
				var split1 = requestInfo.contentType.split(";");
				$.trace.error("split1(1) :" + split1[1]);
				var part2 = split1[1];
				var split2 = part2.split("=");
				var headerBoundary = split2[1];
				requestInfo.boundary = "--" + headerBoundary; // "--batch_id-1628778096163-237";
				$.trace.error(requestInfo.boundary);
				req.headers.set("Content-Type", "multipart/mixed; charset=UTF-8;boundary=" + headerBoundary); //
			} else {
				req.headers.set("Content-Type", $.request.headers[i].value);
			}
		}

	}

	if (path.endsWith("Collection")) {
		//Service Layer uses PATCH not POST TO update a child collection
		newMethod = $.net.http.PATCH;
		$.trace.error("PATCH OVERRIDE!");
		req.headers.set("X-HTTP-Method-Override", "PATCH");

	} else {

		var header = "";
		// Wokraround for XS PATCH method 

		if ($.request.method === $.net.http.PATCH) {
			req.method = $.net.http.POST;
			header = "X-HTTP-Method-Override: PATCH";
		}
		if (header !== "") {
			req.headers.set("X-HTTP-Method-Override", "PATCH");
		}

	}

	//header = "X-HTTP-Method-Override: PATCH";

	$.trace.error("---------------End Request Headers------------------------");

	//COPY COOKIES TO NEW REQUEST
	if (b1cookies) {
		$.trace.error("b1cookies");
		var arCookies = b1cookies.split(";");
		var cookie1 = arCookies[0].split("=");
		req.cookies.set(cookie1[0], cookie1[1]);
		var cookie2 = arCookies[1].split("=");
		req.cookies.set(cookie2[0], cookie2[1]);
		$.trace.error(cookie1[0]);
		$.trace.error(cookie1[1]);

	} else {
		$.trace.error("!b1cookies");

		for (i in $.request.cookies) {
			$.trace.error($.request.cookies[i].name);
			$.trace.error($.request.cookies[i].value);
			if ($.request.cookies[i].name === "B1SESSION" || $.request.cookies[i].name === "ROUTEID") {
				req.cookies.set($.request.cookies[i].name, ($.request.cookies[i].value));
				if ($.request.cookies[i].name === "ROUTEID") {
					ROUTEID_Request = $.request.cookies[i].value;
				}

			}

		}
	}
	//COPY PARAMETERS TO NEW REQUEST
	for (i in $.request.parameters) {

		req.parameters.set($.request.parameters[i].name, ($.request.parameters[i].value));

	}

	//COPY BODY TO NEW REQUEST IF IT EXISTS
	var subEntity;
	var entityBoundary;
	var subEntityBoundary;
	var strBody = new StringBuilder();

	if ($.request.entities.length > 0) {
		//If batch with entities then separate requests in batch with boundary
		$.trace.error("Entities");

		for (i in $.request.entities) {
			//Write the boundary

			$.trace.error(i);
			strBody.appendLine(requestInfo.boundary);
			var entity = $.request.entities[i];
			if (entity.body) {
			
				strBody.appendLine("Content-Type:application/http");
				strBody.appendLine("Content-Transfer-Encoding:binary");
				strBody.appendLine();
				strBody.appendLine(entity.body.asString());
			} else {
				//process the sub entities here  
				var entityContentType = entity.headers.get("Content-Type");
                strBody.appendLine();
                strBody.appendLine(entityContentType);
                
				split1 = entityContentType.split(";");
				$.trace.error("split1(1) :" + split1[1]);
				part2 = split1[1];
				split2 = part2.split("=");
				entityBoundary = split2[1];
				
				subEntityBoundary = "--" +  entityBoundary; // --changeset_id-1629393581611-59
				//$.trace.error(requestInfo.boundary);

				for (var k in $.request.entities[i].entities) {
					subEntity = $.request.entities[i].entities[k];
					strBody.appendLine();
					strBody.appendLine(subEntityBoundary);
				    strBody.appendLine("Content-Type:application/http");
				    strBody.appendLine("Content-Transfer-Encoding:binary");
                    strBody.appendLine();
                    strBody.appendLine(subEntity.body.asString());
				}
				strBody.appendLine(subEntityBoundary + "--");
			}

			//write entity headers for this request
			/*for (var j in entity.headers) {
				cumulatedBody = cumulatedBody + entity.headers[j].name + ":" + entity.headers[j].value + linefeed;
			}*/

		}
		strBody.append(requestInfo.boundary);
		strBody.appendLine("--");
		var cumulatedBody = strBody.toString();
		$.trace.error("Batch Body!: " + cumulatedBody.length.toString());
		$.trace.error(requestInfo.contentType);
		$.trace.error(cumulatedBody);
		req.setBody(cumulatedBody);
		req.headers.set("Accept", "multipart/mixed");
		$.trace.error("content-type:" + req.headers.get("content-type"));

	} else {

		if ($.request.body) {
			$.trace.error("Body");
			var requestBody = $.request.body.asString();
			req.setBody(requestBody);
		} else {
			$.trace.error("No Body");
		}
	}
	/*	var thisBody = requestBody;
	if (requestBody) {
	    if (pos === -1) {
	      //JSON
	      $.trace.error("JSON");
		var decodedBody = JSON.parse(requestBody);
		thisBody = requestBody;  
	    }
	    else
	    {
	      //String
		thisBody = requestBody;  
	    }
	    $.trace.error(thisBody);
	    req.setBody(thisBody);
	}*/

	//Send REQUEST TO SERVICE LAYER AND GET RESPONSE
	/*	if (strCumulatedBody) {
		req.headers.set("Content-Length", strCumulatedBody.length.toString());
	}*/

	var cl = req.headers.get("Content-Length");
	$.trace.error("req: Content-Length");
	$.trace.error(cl);
	client.request(req, destination);
	var response = client.getResponse();

	//SET UP RESPONSE TO WEB CLIENT////////////////////////////

	//COPY SOME HEADERS TO RESPONSE 
	$.trace.error("--------------Resp Headers-------------------------");
	var contentType;
	for (i in response.headers) {
		//|| response.headers[i].name === "content-length"
		$.trace.error(response.headers[i].name);
		$.trace.error(response.headers[i].value);
		// || response.headers[i].name ==="set-cookie"
		if (response.headers[i].name === "content-type" || response.headers[i].name === "odata-version" || response.headers[i].name ===
			"set-cookie") {

			$.response.headers.set(response.headers[i].name, (response.headers[i].value));

			if (response.headers[i].name === "content-type") {
				contentType = response.headers[i].value;
			}
		}

	}
	var ROUTEID;
	var B1SESSION;
	for (i in response.cookies) {
		$.response.cookies.set(response.cookies[i].name, response.cookies[i].value);
		if (response.cookies[i].name === "ROUTEID") {
			ROUTEID = response.cookies[i].value;
			//$.response.headers.set("ROUTEID", ROUTEID);
		}
		if (response.cookies[i].name === "B1SESSION") {
			B1SESSION = response.cookies[i].value;
			//$.response.headers.set("B1SESSION", B1SESSION);
		}
	}

	//if ((ROUTEID) and (B1SESSION)) 
	if (!ROUTEID) {
		ROUTEID = ROUTEID_Request;
	}

	if (ROUTEID) {
		if (B1SESSION) {

			var cookieHeader = "B1SESSION=" + B1SESSION + "; ROUTEID=" + "" + ROUTEID;
			$.response.headers.set("cookie", cookieHeader);
		}
	}
	//HANDLE BODY AND OR ENTITIES
	var sb = new StringBuilder("\r\n");
	var newBody;

	if (response.entities.length) {

		var contentTypeArray = contentType.split("=");
		var EntityListBoundary = contentTypeArray[1];
		sb.append("\r\n");
		//loop through the entities 
		for (i = 0; i < (response.entities.length); ++i) {

			sb.append("--");
			sb.append(EntityListBoundary);
			sb.append("\r\n");
			sb.append("Content-Type: application/http");
			sb.append("\r\n");
			sb.append("Content-Transfer-Encoding: binary");
			sb.append("\r\n");
			sb.append("\r\n");
			var webResponse = response.entities[i];
			//$.trace.error("One WebResponse:");
			//$.trace.error(webResponse.body.asString());
			sb.append(webResponse.body.asString());
			sb.append("\r\n");
			/*
			sb.append("Content-Type: application/http");
			sb.append("\r\n");
			sb.append("Content-Transfer-Encoding: binary");
			sb.append("\r\n");
			sb.append("\r\n");
			JSON.parse(response.body.asString());
			
			
			sb.append(response.entities[i].body.asString());
			//webRequest = response.entities[i].body.asWebRequest;
			//sb.append(webRequest.asString());
			sb.append("\r\n");
			*/
		}
		sb.append("--");
		sb.append(EntityListBoundary);
		sb.append("--");
		sb.append("\r\n");
		newBody = sb.toString();
		$.trace.error("SL Entities");
		//$.response.headers.set("content-length", (newBody.length));

	} else {
		//just copy the body
		$.trace.error("SL Body");
		newBody = null;
		if (response.body) {
			newBody = response.body.asString();
		}

	}
	//$.response.status = $.request.status;
	//CORRECT THE METADATA LINKS
	$.response.status = response.status;
	if (newBody) {
		///correct metadata link to work externally
		var findContext = "hanab1:50000/b1s/v2";
		//var findRegx = new RexExp(findContext, "g")
		var replaceContext = requestInfo.host + requestInfo.contextPath;
		replaceContext = replaceAll(":443", "/xsengine", replaceContext);
		$.trace.error(replaceContext);
		//replaceAll
		var correctedBody = replaceAll(findContext, replaceContext, newBody);
		$.response.setBody(correctedBody);
	}

}