sap.ui.define(
	["K2PPM_PM/model/models", "sap/m/MessageBox", "sap/m/Dialog", "sap/m/Button", "sap/m/library", "sap/m/Text", "sap/m/MessageToast"],
	function(models, MessageBox, Dialog, Button, library, Text, MessageToast) {
		"use strict";

		return {
			appInit: function(component) {

				var oModel = new sap.ui.model.json.JSONModel();
				//var oList;
				//var thisView = this.getView();
				//$.sap.log.error("K2PUTILS.appInit");
				//K2PLogin.checkXS();

				/*			//set the invoice model - null
			if (thisView) {
				oList = thisView.byId("idProductsTable");
				oList.setModel(oModel);
			}*/

				// set the local model
				oModel = models.createLocalModel();
				component.setModel(oModel, "local");

				// set the device model
				oModel = models.createDeviceModel();
				component.setModel(oModel, "device");

				/*
				oModel = models.createMaintenanceViewModel();
				component.setModel(oModel, "maintenanceView");

				oModel = models.createWorkOrderModel();
				component.setModel(oModel, "newWO");


	           
				
				// set the BP model
				oModel = models.createBPModel();
				component.setModel(oModel, "bp");

				// set the Service model
				oModel = models.createServiceModel();
				component.setModel(oModel, "service");

				// set the Rent Roll model

				oModel = models.createRentRollModel();
				component.setModel(oModel, "rentroll");

				$.sap.log.error("K2PUtils.appInit");

				/*
				
				*/

				/*
			if (thisView) {
				oList = thisView.byId("idServiceTable");
				oList.setModel(oModel);
			}
			// set the BP model
			oModel = models.createBPModel();
			component.setModel(oModel, "BP");
			if (thisView) {
				oList = thisView.byId("idBPList");
				oList.setModel(oModel);
			}*/
				/*
            var loggedIn = this.checkSession();
            var lstatus;
            //var lLabel = thisView.byId("LabelLogin");
            if (loggedIn === true) {
                lstatus = "True";
            }
            else
            {
               lstatus = "False";
            }
            
            $.sap.log.error(lstatus) ;*/

			},

			getBPDetails: function(localModel, BPModel) {

				//var localModel = this.getOwnerComponent().getModel("local");
				var cardCode = localModel.getProperty("/cardCode");

				var surl =
					"/destinations/key2p/BusinessPartners?$select=CardCode,CardName,Address,Block,City,BillToState,Country,ZipCode,Password" +
					"&$filter=CardCode eq '" + cardCode + "'";
				$.ajax({
					type: "GET",
					url: surl,
					xhrFields: {
						withCredentials: true
					},
					error: function(a, b, c) {
						$.sap.log.error("K2PUtils.getBPDetails: error");
					}

				}).done(function(results) {
					if (results) {
						BPModel.setData(results);

						$.sap.log.error("K2PUtils.getBPDetails: success");

					} else {
						$.sap.log.error("K2PUtils.getBPDetails: no results");
					}
				});

			},

			getServiceDetails: function(localModel, MaintModel) {
				//var localModel = this.getOwnerComponent().getModel("local");
				var cardCode = localModel.getProperty("/cardCode");
				var destination = localModel.getProperty("/destination");
				//var B1SLAddress = "/b1s/v1/";
				//var path = destination + "/Login";
				var surl = destination +
					"ServiceCalls?$select=DocNum,Status,CreationDate,Subject,Description&$orderby=DocNum&$top=10&$filter=Status eq -3 and CustomerCode eq  '" +
					cardCode + "'";
				$.ajax({
					type: "GET",
					url: surl,
					xhrFields: {
						withCredentials: true
					},
					error: function(a, b, c) {
						$.sap.log.error("K2PUtils.getServiceDetails: error");
					}

				}).done(function(results) {
					if (results) {

						MaintModel.setData(results);

						$.sap.log.error("K2PUtils.getServiceDetails: success");

					} else {
						$.sap.log.error("K2PUtils.getServiceDetails: no results");
					}
				});
			},
			fetchRentRoll: function(rentRoleModel, localModel) {
				//thisView.setBusy(true);
				var destination = localModel.getProperty("/destination");

				var surl = destination + "sml.svc/K2P_RENTROLL";
				//var surl = "/destinations/key2p/sml.svc/K2P_VENDOR_UNION_ALL";
				//var surl = "/destinations/key2p/sml.svc/K2P_VENDOR_UNION_ALL&$filter=DocStatus eq 'O'";

				$.ajax({
					type: "GET",
					//url: "/destinations/hanab1vm2/Items",
					//url: "/destinations/hanab1vm2/Invoices?$select=DocNum,CardName,Address,DocDueDate,DocTotal&$orderby=DocEntry&$top=10&$skip=1$filter=DocumentStatus eq 'O'",
					url: surl,
					//url: "/destinations/hanab1vm2/Invoices",
					xhrFields: {
						withCredentials: true
					},
					error: function(a, b, c) {
						//thisView.setBusy(false);
						$.sap.log.error("RentRoll.fetchRentRoll: error " + c);
					}
				}).done(function(results1) {
					if (results1) {
						//sap.m.MessageToast.show("Results: " + results.ItemCode);
						//console.log(results.value);
						//var oTable = thisView.byId("idRentRollTable");
						//var oModel = new sap.ui.model.json.JSONModel();
						rentRoleModel.setData(results1);
						//oTable.setModel(rentRoleModel);

						$.sap.log.error("RentRoll.fetchRentRoll: success");
						//localModel.setProperty("/status", "Logged In");

						/*					var oController = sap.ui.controller("MyAppMyApp.controller.View1");
					var today = new Date();
					var dd = oController.addZero(today.getDate());
					var MM = oController.addZero(today.getMonth() + 1);
					var yyyy = today.getFullYear();
					var sToday = yyyy + "-" + MM + "-" + dd;*/

						//var localModel = thisView.getModel("local");
						//localModel.setProperty("/PmtDate", sToday);

					} else {
						$.sap.log.error("RentRoll.fetchRentRoll: No RentRoll Data!");
					}
					//thisView.setBusy(false);
				});

			},
			resetTotal: function(documentModel, lineArray, headerField, lineField) {

				var aItemArray;
				aItemArray = documentModel.getProperty(lineArray);
				var totalAmount = 0;
				var lineAmount;

				var i;
				for (i = 0; i < aItemArray.length; i++) {
					lineAmount = documentModel.getProperty(lineArray + "/" + i.toString() + lineField);
					totalAmount = totalAmount + parseFloat(lineAmount);
				}
				documentModel.setProperty(headerField, totalAmount);
				return totalAmount;
			},
			resetTotalQty: function(documentModel, lineArray, headerField, lineField, qtyField, priceField) {

				var aItemArray;
				aItemArray = documentModel.getProperty(lineArray);
				var totalAmount = 0;
				var lineAmount,qty,price,newLineAmount;
				var i;
				for (i = 0; i < aItemArray.length; i++) {
					lineAmount = documentModel.getProperty(lineArray + "/" + i.toString() + lineField);
					qty = documentModel.getProperty(lineArray + "/" + i.toString() + qtyField);
					price = documentModel.getProperty(lineArray + "/" + i.toString() + priceField);
					newLineAmount = qty * price;
					newLineAmount = Math.round(newLineAmount * 100) / 100;
					documentModel.getProperty(lineArray + "/" + i.toString() + lineField,newLineAmount );
					totalAmount = totalAmount + parseFloat(newLineAmount);
				}
				documentModel.setProperty(headerField, totalAmount);
				return totalAmount;
			},
			resetPmtTotal: function(localModel, statementModel) {

				var aItemArray;
				//var oTable = thisView.byId("idMainTable");
				//var oModel = oTable.getModel();
				//var statementModel = thisModule.getOwnerComponent().getModel("statement");
				aItemArray = statementModel.getProperty("/value/");
				var total = 0;
				var amount;
				var openamt;
				var balance = 0,
					i;
				for (i = 0; i < aItemArray.length; i++) {
					openamt = statementModel.getProperty("/value/" + i.toString() + "/DocTotal");
					balance = balance + parseFloat(openamt);
				}
				localModel.setProperty("/balance", balance, false);
				for (i = 0; i < aItemArray.length; i++) {
					amount = statementModel.getProperty("/value/" + i.toString() + "/U_JC1_Amount");

					if (amount) {
						total = total + parseFloat(amount);
					}
				}
				//var localModel = thisModule.getOwnerComponent().getModel("local");
				localModel.setProperty("/Payment", total, false);
			},
			getParameterByName: function(name) {
				var match = RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
				return match && match[1].replace(/\+/g, " ");
			},

			confirmAction: function(callingController, i18n, callback, callback2) {
				//var thisView = callingController.getView();
				//var oComponent = callingController.getOwnerComponent();
				var i18nModel = callingController.getOwnerComponent().getModel("i18n");
				//var i18nModel = callingController.getModel("i18n");
				var sMsg = i18nModel.getProperty(i18n);
				MessageBox.confirm(sMsg, {
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					onClose: function(sAction) {
						//MessageToast.show(sAction);
						if (sAction !== MessageBox.Action.CANCEL) {
							callback(callingController, callback2);
						}
					}
				});

			},
			slLogin: function(callingController, callbackOrigin) {
				//If called from the login form then callback will be to the login form
				//callback will not be null if this is a retry login from a failed fetch
				var thisView = callingController.getView();
				thisView.setBusy(true);
				var oComponent = callingController.getOwnerComponent();
				var localModel = oComponent.getModel("local");

				// set the queryParams 
				//var qParams = models.CreateQueryParameters();
				var loginInfo = {};
				loginInfo.UserName = localModel.getProperty("/B1UserName");
				loginInfo.Password = localModel.getProperty("/B1Password");
				loginInfo.CompanyDB = localModel.getProperty("/B1CompanyDB");

				var qParamsModel = thisView.getModel("qParams");
				qParamsModel.setProperty("/method", "POST");
				qParamsModel.setProperty("/command", "Login");
				qParamsModel.setProperty("/data", JSON.stringify(loginInfo));
				qParamsModel.setProperty("/loggingIn", true);

				this.getpostputpatch(callingController, this.slLoginCallBack, callbackOrigin, this);
			},
			slLoginCallBack: function(callingController, results, callbackOrigin, oThis) {
				var thisView = callingController.getView();
				thisView.setBusy(false);
				var component = callingController.getOwnerComponent();
				var localModel = component.getModel("local");

				var qParamsModel = thisView.getModel("qParams");
				var errorCode = qParamsModel.getProperty("/errorCode");
				var error = qParamsModel.getProperty("/error");
				var status = qParamsModel.getProperty("/status");
				var message;

				if (errorCode === 0) {

					var oResult = new sap.ui.model.json.JSONModel();
					oResult.setData(results);

					//oThis.getUserModel(callingController, callbackOrigin);

				} else {
					//stay on the login form
					//userLoginError
					if (status === 401) {
						if (errorCode === 100000055) {
							//user locked
							message = ""; // errorStr + " Code:" + errorCode.toString();
							oThis.errorMessageBox(component, "userLockedError", message, true);
						} else if (errorCode === 100000027) {
							//bad credentials
							message = ""; // errorStr + " Code:" + errorCode.toString();
							oThis.errorMessageBox(component, "userLoginError", message, true);

						} else {
							//generic 401	
							message = error + " Code:" + errorCode.toString();
							oThis.errorMessageBox(component, "serviceLayer401", message, true);
						}
					} else if (status === 405) {
						message = error + " Code:" + errorCode.toString();
						oThis.errorMessageBox(component, "serviceLayerURL", message, true);
					} else if (status === 500) {
						message = error + " Code:" + errorCode.toString();
						oThis.errorMessageBox(component, "userLoginConnection", message, true);
					} else {
						message = "Login Failed: " + error + " Code:" + errorCode.toString();
						oThis.errorMessageBox(component, "serviceLayerError", message);
					}

				}
				callbackOrigin(callingController, results);
			},
			getpostputpatch: function(callingController, callback, callback2, oThis, qNameIn) {
				var thisView = callingController.getView();
				var qName;
				var localModel = thisView.getModel("local");
				//var oComponent = callingController.getOwnerComponent();
				//var thisModule = this;
				var errorCode;
				var jsonResponse;
				if (!qNameIn) {
					qName = "qParams";
				} else {
					qName = qNameIn;
				}
				var qParamsModel = thisView.getModel(qName);
				var qParams = {};
				qParams.method = qParamsModel.getProperty("/method");
				qParams.data = qParamsModel.getProperty("/data");
				qParams.datatype = qParamsModel.getProperty("/datatype");
				qParams.contentType = qParamsModel.getProperty("/contentType");
				qParams.withCredentials = qParamsModel.getProperty("/withCredentials");
				qParams.nextLink = qParamsModel.getProperty("/nextLink");

				qParamsModel.setProperty("/errorCode", 0);
				qParamsModel.setProperty("/error", "");
				qParamsModel.setProperty("/status", "");

				var retry = qParamsModel.getProperty("/retry");
				var surl;
				var oheaders;
				if (qParamsModel.getProperty("/command") !== "Login") {
					var sCookieHeader = localModel.getProperty("/cookieHeader");
					//var oCookieHeader = JSON.parse("{" + "'cookie' : '" + sCookieHeader + "'}");
					var oCookieHeader = {};
					oCookieHeader.cookie = sCookieHeader;
					oheaders = oCookieHeader;
				}
				if (qParams.nextLink) {
					surl = qParamsModel.getProperty("/url") + qParams.nextLink;
				} else {
					surl = qParamsModel.getProperty("/url") + qParamsModel.getProperty("/sl") + qParamsModel.getProperty("/command") + qParamsModel.getProperty(
						"/queryParams");
				}
				$.ajax({
					type: qParams.method,
					//either of the following syntax should work for header
					/*					beforeSend: function(request){
											request.setRequestHeader("Prefer","odata.maxpagesize=11");
										},*/
					/*					headers: {
											"Prefer":"odata.maxpagesize=3"
										},*/
					url: surl,
					data: qParams.data,
					datatype: qParams.datatype,
					contentType: qParams.contentType,
					headers: {
						'b1cookies': sCookieHeader
					},

					xhrFields: {
						withCredentials: qParams.withCredentials
					},
					error: function(xhr, b, c) {
						var msg = "Error!";
						var bJson = false;
						var status = "";
						if (xhr.status) {
							status = xhr.status;
						}

						if (xhr.responseText) {
							try {
								jsonResponse = JSON.parse(xhr.responseText);
								bJson = true;
							} catch (err) {
								bJson = false;
							}
							if (bJson) {
								errorCode = jsonResponse.error.code;
								msg = jsonResponse.error.message;
								if ($.isNumeric(errorCode)) {
									qParams.errorCode = errorCode;
								} else {
									//should never happen
									errorCode = -1;
									msg = "Server Error - no error code";
								}
							} else {

								errorCode = -1;
								msg = xhr.responseText;
							}

						} else {
							if (c.code) {
								errorCode = c.code;
								msg = c.message;
							} else {
								errorCode = -1;
								msg = "Server Error - null xhr response";
							}
						}

						qParamsModel.setProperty("/errorCode", errorCode);
						qParamsModel.setProperty("/error", msg);
						qParamsModel.setProperty("/status", status);
						callback(callingController, null, callback2, oThis, qNameIn);
					}, //error:
					success: function(results, b, xhr) {
						var oErr;
						if (results) {
							oErr = results.error;
						}
						if (oErr) {
							qParamsModel.setProperty("/errorCode", oErr.code);
							qParamsModel.setProperty("/error", oErr.message.value);
							qParamsModel.setProperty("/status", "");
							callback(callingController, null, callback2, oThis, qNameIn);
						} else {
							qParamsModel.setProperty("/retry", retry);
							if (qParamsModel.getProperty("/command") === "Login") {
								var cookieHeader = xhr.getResponseHeader("cookie");
								localModel.setProperty("/cookieHeader", cookieHeader);
							}
							callback(callingController, results, callback2, oThis, qNameIn);
						}
					}
				});

			},
			setTitle: function(callingController, sTextId) {
				var title = this.geti18n(callingController, sTextId);
				var oView = callingController.getView();

				var oViewModel = models.createViewModel();
				oViewModel.setProperty("/headerText", title);
				oView.setModel(oViewModel, "view");
			},
			getByPath: function(callingController, dpath, queryParamsIn, callback2, qPath, sIndex) {
				//
				var thisView = callingController.getView();
				//var component = callingController.getOwnerComponent();
				// set the queryParams model
				var qParamsModel = models.createQueryModel();
				thisView.setModel(qParamsModel, qPath);
				qParamsModel.setProperty("/method", "GET");
				qParamsModel.setProperty("/command", dpath);
				qParamsModel.setProperty("/data", null);
				qParamsModel.setProperty("/firstFetch", true);
				qParamsModel.setProperty("/queryParams", queryParamsIn);
				qParamsModel.setProperty("/index", sIndex);

				this.getpostputpatch(callingController, this.getByPathCallBack, callback2, callingController, qPath);

			},
			getByPathCallBack: function(callingController, results, callback2, oThis, qNameIn) {
				var thisView = callingController.getView();
				var s;
				//thisView.setBusy(false);
				var component = callingController.getOwnerComponent();

				var qParamsModel = thisView.getModel(qNameIn);
				var errorCode = qParamsModel.getProperty("/errorCode");
				var error = qParamsModel.getProperty("/error");
				var status = qParamsModel.getProperty("/status");
				var message;

				//return the result or error
				callback2(callingController, results, null, oThis, qNameIn);

			},
			getUserModel: function(callingController, callbackOrigin) {
				//
				var thisView = callingController.getView();
				var component = callingController.getOwnerComponent();
				var localModel = component.getModel("local");
				// set the queryParams model
				var qParamsModel = models.createQueryModel();
				thisView.setModel(qParamsModel, "qParamsUser");
				qParamsModel.setProperty("/method", "GET");
				qParamsModel.setProperty("/command", "Users()");
				qParamsModel.setProperty("/data", null);
				qParamsModel.setProperty("/firstFetch", true);
				var queryParams = "?$filter=UserCode eq '" + localModel.getProperty("/B1UserName") + "'";
				qParamsModel.setProperty("/queryParams", queryParams);

				this.getpostputpatch(callingController, this.getUserModelCallBack, callbackOrigin, callingController, "qParamsUser");
			},
			getUserModelCallBack: function(callingController, results, callbackOrigin, oThis) {
				var thisView = callingController.getView();
				//thisView.setBusy(false);
				var component = callingController.getOwnerComponent();
				var qNameIn = "qParamsUser";

				var qParamsModel = thisView.getModel(qNameIn);
				var errorCode = qParamsModel.getProperty("/errorCode");
				var error = qParamsModel.getProperty("/error");
				var status = qParamsModel.getProperty("/status");
				var message;

				if (errorCode === 0) {

					var oResult = new sap.ui.model.json.JSONModel();
					oResult.setData(results);
					component.setModel(oResult, "userModel");
					var s = oResult.getProperty("value(1)/UserName");

				}
				callbackOrigin(callingController, results, null, callingController, qNameIn);
			},
			geti18n: function(callingController, sTextId, aArgs) {
				return callingController.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sTextId, aArgs);
			},
			formatDate: function(oDate) {
				var year = oDate.getFullYear();
				var month = oDate.getMonth() + 1;
				var day = oDate.getDate();
				if (month < 10) {
				    month = "0" + month;
				}
				if (day < 10) {
				    day = "0" + day;
				}
				var sDate =  year + "-" + month + "-" + day;
				return sDate;

			},
			getTodaysDate: function() {
				var today = new Date();
				var year = today.getFullYear();
				var month = today.getMonth() + 1;
				var day = today.getDate();
				if (month.length === 1) {
				    month = "0" + month;
				}
				if (day.length === 1) {
				    day = "0" + day;
				}
				var sDate =  year + "-" + month + "-" + day;
				return sDate;

			},
			errorMessageBox: function(component, i18nMsg, message, bFullMsg, callBack, status) {
				//var i18nModel = sap.ui.getCore().getModel("i18n");
				//
				var i18nModel = component.getModel("i18n");
				var errMsg;
				var i18nMsgText = "";
				if (i18nMsg) {

					if (bFullMsg) {
						i18nMsgText = i18nModel.getProperty(i18nMsg);
						errMsg = i18nMsgText + " " + message + " " + status;
					}
				} else {
					errMsg = message;
				}
				MessageBox.error(errMsg, {
					onClose: this.errorMessageBoxCallBack(callBack)
				});

			},
			errorDialogBox: function(callingController, i18nMsg, message, bFullMsg, callBack, status) {
				var oComponent = callingController.getOwnerComponent();
				var i18nModel = oComponent.getModel("i18n");
				//var title = i18nModel.getProperty("errorTitle");
				var ok = i18nModel.getProperty("ok");
				var errMsg;
				if (i18nMsg) {
					errMsg = i18nModel.getProperty(i18nMsg);
					if (bFullMsg) {
						errMsg = errMsg + " " + status + " " + message;
					}
				} else {
					errMsg = message + " " + status;
				}

				var oDialog = new Dialog({
					title: errMsg,
					content: new Text({
						text: errMsg
					}),
					beginButton: new Button({
						//type: DialogType.Message,
						text: ok,
						press: function() {
							oDialog.close();
						}
					}),
					afterClose: function() {
						oDialog.destroy();
						//oComponent.getRouter().navTo("login");
					}
				});
				oDialog.open();
				/*				var oDialog = new Dialog({
						title: errMsg,
						//type: DialogType.MessageBox, 
						content: new Text({
							text: errMsg
						})
											content: new Text{
						text: errMsg
					}
					}),
					beginButton: new Button({
						//type: DialogType.Message,
						text: ok,
						press: function() {
							oDialog.close();
						}
					}),
					afterClose: function() {
						oDialog.destroy();
						oComponent.getRouter().navTo("login");
					}*/

			},
			errorMessageBoxCallBack: function(callback) {
				if (callback) {
					callback();
				}
			},
			todaydate: function() {
				var todayDate = new Date();
				var myyear = todayDate.getYear();
				var mymonth = todayDate.getMonth() + 1;
				var mytoday = todayDate.getDate();
				document.write(myyear + "/" + mymonth + "/" + mytoday);
			},
			slLogout: function(callingController) {
				var thisView = callingController.getView();
				thisView.setBusy(true);
				var component = callingController.getOwnerComponent();
				var qParamsModel = models.createQueryModel();
				var qNameIn = "qLogOut";

				qParamsModel.setProperty("/method", "POST");
				qParamsModel.setProperty("/command", "Logout");
				qParamsModel.setProperty("/data", null);
				qParamsModel.setProperty("/loggingIn", false);
				component.setModel(qParamsModel, qNameIn);
				this.getpostputpatch(callingController, this.slLogoutCallBack, null, callingController, qNameIn);
			},

			slLogoutCallBack: function(callingController) {
				var thisView = callingController.getView();

				var oComponent = callingController.getOwnerComponent();
				var localModel = oComponent.getModel("local");
				var href = localModel.getProperty("/href");
				var qParamsModel = oComponent.getModel("qLogOut");

				var errorCode = qParamsModel.getProperty("/errorCode");
				var error = qParamsModel.getProperty("/error");
				var status = qParamsModel.getProperty("/status");
				var msg = error + " " + status;

				if (errorCode === 0) {

					localModel.setProperty("/loggedIn", "false");
				} else {
					var message = "SL Logout error! " + msg;
					//$.sap.log.error("SL Logout error! " + msg);
					callingController.errorDialogBox(oComponent, "slLogoutCallBack", message, true);
				}
				thisView.setBusy(false);
				window.location.assign(href);
				//callingController.getRouter().navTo("login"); //login
			},
			fetchNext: function(callingController, callback) {
				var thisView = callingController.getView();
				var qParamsModel = thisView.getModel("qParams");
				var page, totalPages;
				page = qParamsModel.getProperty("/page");
				totalPages = qParamsModel.getProperty("/totalPages");
				if (page !== totalPages) {
					thisView.setBusy(true);
					qParamsModel.setProperty("/firstFetch", false);
					this.getpostputpatch(callingController, callback);
				}
			},
			fetchPreviousPage: function(callingController, callback) {
				var thisView = callingController.getView();
				var qParamsModel = thisView.getModel("qParams");
				var page, newPage, newSkip;
				page = qParamsModel.getProperty("/page");
				var queryParams = qParamsModel.getProperty("/queryParams");
				if (page > 1) {
					thisView.setBusy(true);
					newPage = page - 1;
					var nextLink;
					if (newPage === 1) {
						nextLink = null;
					} else if (newPage > 1) {
						//determine the new skip value
						var pageSize = qParamsModel.getProperty("/pageSize");
						newSkip = (newPage - 1) * pageSize;
						var strSkip = "&$skip=" + newSkip.toString();

						nextLink = qParamsModel.getProperty("/sl") + qParamsModel.getProperty("/command") + queryParams + strSkip;
					}
					//calc the skip value for the previous page
					qParamsModel.setProperty("/nextLink", nextLink);
					qParamsModel.setProperty("/firstFetch", false);
					this.getpostputpatch(callingController, callback);
				}
			},
			fetchMainCallBack: function(callingController, result) {
				var thisView = callingController.getView();
				var component = callingController.getOwnerComponent();
				var qParamsModel = thisView.getModel("qParams");
				var i18nModel = callingController.getOwnerComponent().getModel("i18n");

				var retry = false; //qParamsModel.getProperty("/retry");
				var errorCode = qParamsModel.getProperty("/errorCode");

				var error = qParamsModel.getProperty("/error");
				var status = qParamsModel.getProperty("/status");

				if (errorCode === 0) {
					var oResult = new sap.ui.model.json.JSONModel();
					oResult.setData(result);
					var nextLink = oResult.getProperty("/@odata.nextLink");
					var firstFetch = qParamsModel.getProperty("/firstFetch");
					qParamsModel.setProperty("/nextLink", nextLink);
					//calc the page size and total pages
					var pageSize;
					var totalPages;
					var count;
					var skip;
					var page;
					if (nextLink) {
						var sLinkArray = nextLink.split("$");
						var skipItem = sLinkArray[sLinkArray.length - 1];
						var skipArray = skipItem.split("=");
						skip = skipArray[skipArray.length - 1];
					}
					if (firstFetch) {
						page = 1;
						count = oResult.getProperty("/@odata.count");
						if (skip) {
							pageSize = skip; //the first skip is the page size	
						} else {
							pageSize = count;
						}
						if (pageSize !== 0) {
							totalPages = Math.ceil(count / pageSize);
						} else {
							if (count === 0) {
								totalPages = 0;
							} else {
								totalPages = 1;
							}
						}
						//set the first time only
						qParamsModel.setProperty("/pageSize", pageSize);
						qParamsModel.setProperty("/totalPages", totalPages);
						qParamsModel.setProperty("/count", count);
						qParamsModel.setProperty("/firstFetch", false);
					} else {
						count = qParamsModel.getProperty("/count");
						pageSize = qParamsModel.getProperty("/pageSize");
						totalPages = qParamsModel.getProperty("/totalPages");
						if (nextLink) {
							if (pageSize !== 0) {
								page = skip / pageSize;
							} else {
								page = 0;
							}
						} else {
							page = qParamsModel.getProperty("/page");
							page = page + 1;
						}
					}
					if (page > totalPages) {
						page = totalPages;
					}
					qParamsModel.setProperty("/page", page);
					//set the page count text here
					var pageText = i18nModel.getProperty("page");
					var ofText = i18nModel.getProperty("of");
					var pageCountText = pageText + " " + page.toString() + " " + ofText + " " + totalPages.toString() + " ";
					qParamsModel.setProperty("/pageCountText", pageCountText);
					//set the model to the table
					var oTable = thisView.byId("idMainTable");
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(result);
					oTable.setModel(oModel);
					thisView.setBusy(false);
				} else {
					//issue error
					thisView.setBusy(false);
					var message = "fetchMain: " + error + " Code:" + errorCode.toString() + " status: " + status;
					callingController.errorDialogBox(component, "userLoginConnection", message, true);
				}
			},

			fetchRetryCallback: function(callingController) {
				//if login successful then try to display
				var thisView = callingController.getView();
				var qParamsModel = thisView.getModel("qParams");
				var errorCode = qParamsModel.getProperty("/errorCode");
				var error = qParamsModel.getProperty("/errorCode");
				var i18n;
				if (errorCode === 0) {
					//no problem so try to refresh page data one last time
					callingController.fetchMain(callingController, true);
				} else {
					//issue error
					var sMessage = "fetchMain: " + error + " Code:" + errorCode.toString();
					thisView.setBusy(false);
					i18n = "serviceLayerStatus";
					//var oRouter = callingController.getRouter();
					//oRouter.navTo("login");
					this.errorDialogBox(callingController, i18n, sMessage, true, null, status);
				}
			},
			getCookie: function getCookie(cname) {
				var name = cname + "=";
				var decodedCookie = decodeURIComponent(document.cookie);
				var ca = decodedCookie.split(';');
				for (var i = 0; i < ca.length; i++) {
					var c = ca[i];
					while (c.charAt(0) === ' ') {
						c = c.substring(1);
					}
					if (c.indexOf(name) === 0) {
						return c.substring(name.length, c.length);
					}
				}
				return "";
			},
			updateServerCallBack: function(callingController, results, callbackOrigin, controller2, qNameIn) {

				var thisView = callingController.getView();
				var qParamsModel = thisView.getModel(qNameIn);
				var errorCode = qParamsModel.getProperty("/errorCode");
				var error = qParamsModel.getProperty("/error");
				var oThis = this;
				//callingController.getRouter().navTo("home");
				var errorPos = results.search("\"error\" : {");
				if (errorPos !== -1) {
					errorCode = -1;
					error = "Error in Batch";
					errorPos = results.search("\"-2035\"");
					if (errorPos !== -1) {
						error = "Duplicate Not Allowed!";
					}
				}
				if (errorCode === 0) {
					//fetch data
					if (callbackOrigin) {
						callbackOrigin(callingController);
					} else {
						callingController.onRefresh(null, callingController, false);
					}
				} else //handle error
				{
					var sMessage = "updateServerCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
					thisView.setBusy(false);
					//i18n = "";
					//var oRouter = callingController.getRouter();
					//oRouter.navTo("login");
					MessageToast.show(sMessage);
				}

			}

		};
	});