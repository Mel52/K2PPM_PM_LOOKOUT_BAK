sap.ui.define([
	"K2PPM_PM/controller/BaseController",
	"K2PPM_PM/K2PUtils/K2PUtils",
	"K2PPM_PM/K2PUtils/K2PLogin",
	"K2PPM_PM/model/models"
], function(BaseController, K2PUtils, K2PLogin, models) {
	"use strict";

	return BaseController.extend("K2PPM_PM.controller.Home", {

		onInit: function() {

			//this.getView().setBusy(true);

			var oRouter = this.getRouter();
			oRouter.getRoute("home").attachMatched(this._onRouteMatched, this);
			var thisView = this.getView();
			thisView.setModel(models.createQueryModel(), "qParams");
			//var propertyModel =  this.getOwnerComponent().getModel("property");

			var localModel = this.getOwnerComponent().getModel("local");
			var cookieHeader = localModel.getProperty("/cookieHeader");
			//var userCode = localModel.getProperty("/B1UserName");
			var newHttpHeaders;
			var s;

			var serviceLayerModel = this.getOwnerComponent().getModel();
			var httpHeaders = serviceLayerModel.getHttpHeaders();
			httpHeaders.b1cookies = cookieHeader;
			s = JSON.stringify(httpHeaders);
			newHttpHeaders = JSON.parse(s);
			serviceLayerModel.changeHttpHeaders(newHttpHeaders);
			serviceLayerModel.setSizeLimit(562);

			var semanticLayerModel = this.getOwnerComponent().getModel("semanticLayer");
			httpHeaders = semanticLayerModel.getHttpHeaders();
			httpHeaders.b1cookies = cookieHeader;
			s = JSON.stringify(httpHeaders);
			newHttpHeaders = JSON.parse(s);
			semanticLayerModel.changeHttpHeaders(newHttpHeaders);
			semanticLayerModel.setSizeLimit(562);
			//$select=Code,U_OnOff,U_Value

		},
		_onRouteMatched: function() {
			//var title = K2PUtils.geti18n(this, "homePageTitle");
			//var thisheaderFrag = this.getView().byId("headerFrag");
			//thisheaderFrag.Text = title;
			this.getView().setBusy(true);
			// set the queryParams model
			/*				var queryModel = models.createQueryModel();
				queryModel.setProperty("/method", "Get");
				queryModel.setProperty("/command", "/$metadata");
				var queryParams = "";
				queryModel.setProperty("/queryParams", queryParams);
				//fetch metadata
				//(callingController, callback, callback2, oThis, qNameIn)
				thisView.setModel(queryModel, "qparamsMetaData");
				K2PUtils.getpostputpatch(callingController, callingController.slMetaDataCallBack, "", "", "qparamsMetaData");*/

			// set the queryParams model
			var queryModel = models.createQueryModel();
			queryModel.setProperty("/method", "Get");
			queryModel.setProperty("/command", "$metadata");
			var queryParams = "";
			queryModel.setProperty("/queryParams", queryParams);
			//fetch metadata
			//(callingController, callback, callback2, oThis, qNameIn)
			this.getView().setModel(queryModel, "qparamsMetaData");
			K2PUtils.getpostputpatch(this, this.slMetaDataCallBack, "", "", "qparamsMetaData");

			//K2PUtils.getByPath(this, "/UDO_K2P_PMCONFIG", "", this.configCallBack, "qparamsConfig");

		},
		slMetaDataCallBack: function(callingController) {
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel("qparamsMetaData");
			var errorCode = qParamsModel.getProperty("/errorCode");

			if (errorCode === 0) {
				K2PUtils.getByPath(callingController, "/UDO_K2P_PMCONFIG", "", callingController.configCallBack, "qparamsConfig");
			} else {
				thisView.setBusy(false);
				var sMessage = "slMetaDataCallBack : " + " Code:" + errorCode.toString();
				var i18n = "";
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}

		},
		configCallBack: function(callingController, results, callback2, oThis, qNameIn) {

			var thisView = callingController.getView();
			var oComponent = callingController.getOwnerComponent();
			var localModel = oComponent.getModel("local");
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var sYN = "N";
			var itemcode;

			var i18n;
			if (errorCode !== "0") {

				var oResult = new sap.ui.model.json.JSONModel();
				oResult.setData(results);
				var configItems = oResult.getProperty("/value");

				if (configItems.length > 0) {
					localModel.setProperty("/configItems", configItems);

					for (var i = 0; i < configItems.length; i++) {
						itemcode = configItems[i].Code;

						switch (itemcode) {

							case "UseProjMgmtID":
								localModel.setProperty("/UseProjMgmtID", configItems[i].U_OnOff);
								break;

							case "dfTaxCd":
								localModel.setProperty("/dfTaxCd", configItems[i].U_Value);
								break;

						}

					}

				}
				K2PUtils.getByPath(callingController, "/ChartOfAccounts/$count", "", callingController.accountsCallBack, "qparamsAccounts");

			} else //handle error
			{
				var sMessage = "configCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}

		},
		accountsCallBack: function(callingController, results, callback2, oThis, qNameIn) {
			var thisView = callingController.getView();
			var oComponent = callingController.getOwnerComponent();
			var localModel = oComponent.getModel("local");
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");

			var i18n;
			if (errorCode !== "0") {
				var accountsCount = results;
				localModel.setProperty("/accountsCount", accountsCount);
				K2PUtils.getUserModel(callingController, callingController.callBackUserModel);
			} else //handle error
			{
				var sMessage = "accountsCallBack " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},
		callBackUserModel: function(callingController, results, callback2, oThis, qNameIn) {
			//callingController, result, callback2, oThis, qNameIn
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var component = callingController.getOwnerComponent();
			var status = qParamsModel.getProperty("/status");
			var pnlTilesAdmin = thisView.byId("pnlApprovalAdmin");
			var pnlCustomer = thisView.byId("pnlCustomer");

			pnlTilesAdmin.setVisible(false);
			if (errorCode === 0) {
				var oResult = new sap.ui.model.json.JSONModel();
				oResult.setData(results);
				component.setModel(oResult, "userModel");
				var admin = oResult.getProperty("/value/0/U_K2P_ApprovalAdm");
				if (admin === "Y") {
					pnlTilesAdmin.setVisible(true);
				}
				var customer = oResult.getProperty("/value/0/U_K2P_CustomerAccess");
				if (customer === "Y") {
					pnlCustomer.setVisible(true);
				}
				else {
				    pnlCustomer.setVisible(false);
				}
				thisView.setBusy(false);
				thisView.setBusy(false);
			} else //handle error
			{
				var i18n;
				var sMessage = "callBackUserModel: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},

		checkSLLoginCallBack: function(callingContoller, queryModel) {

			var errorCode = queryModel.getProperty("/errorCode");
			var thisView = callingContoller.getView();
			var component = callingContoller.getOwnerComponent();
			var message;
			if (errorCode === 0) {
				//
			} else {

				if (errorCode === 301) {
					message = "";
				} else {
					message = "checkSLLogin: " + queryModel.getProperty("/error") + " Code:" + errorCode.toString();
					K2PUtils.errorMessageBox(component, "", message);
				}
			}
			thisView.setBusy(false);

		},

		/*
		
			var title = K2PUtils.geti18n(this, "loginPageTitle");
		    var thisPage = this.getView().byId("thisPage");
		    thisPage.title = title;
		
		
		slLogin: function () {
			var thisView = this.getView();
			var oComponent = this.getOwnerComponent();
			var localModel = oComponent.getModel("local");
			var queryModel = models.createQueryModel();

			thisView.setBusy(true);
			var loginInfo = {};
			loginInfo.UserName = localModel.getProperty("/B1UserName");
			loginInfo.Password = localModel.getProperty("/B1Password");
			loginInfo.CompanyDB = localModel.getProperty("/B1CompanyDB");

			queryModel.setProperty("/method", "POST");
			queryModel.setProperty("/command", "Login");
			var logindata = JSON.stringify(loginInfo);
			queryModel.setProperty("/data", logindata);

			K2PUtils.getpostputpatch(this, queryModel, this.slLoginCallBack);
		},

		slLoginCallBack: function (callingContoller, queryModel) {

			var errorCode = queryModel.getProperty("/errorCode");
			var thisView = callingContoller.getView();
			var component = callingContoller.getOwnerComponent();
			var message;
			if (errorCode === 0) {
				//

			} else {
				message = "slLoginCallBack: " + queryModel.getProperty("/error") + " Code:" + errorCode.toString();
				K2PUtils.errorMessageBox(component, "", message);

			}
			thisView.setBusy(false);

		},*/

		logIn1: function() {

			var localModel = this.getOwnerComponent().getModel("local");

			/*			var LoginCallBack = function(calledby, status) {

				if (calledby === "checkXS") {
					if (status === "false") {
						lLabel.setText("XS Login Failed");
						return;
					}

				} else if (calledby === "loginSL") {
				   if (status === "false") {
						lLabel.setText("SL Login Failed");
						return; 
				}

			};*/

			K2PLogin.checkLogins(localModel);

		},

		loginTenant: function() {

			var localModel = this.getOwnerComponent().getModel("local");

			var BPModel = this.getOwnerComponent().getModel("bp");
			K2PUtils.getBPDetails(localModel, BPModel);

			var serviceModel = this.getOwnerComponent().getModel("service");
			K2PUtils.getServiceDetails(localModel, serviceModel);

			var rentrollModel = this.getOwnerComponent().getModel("rentroll");
			K2PUtils.fetchRentRoll(rentrollModel, localModel);
		},

		logIn: function(controller) {

			//var localModel = controller.getOwnerComponent().getModel("local");

			K2PLogin.checkXS(this.xSCallBack, controller.getOwnerComponent());

		},

		sLCallback: function(loggedIn) {

			$.sap.log.error("sLCallback! ");
			//var localModel = this.getOwnerComponent().getModel("local");

		},

		xSCallBack: function(loggedIn, oComponent) {

			var i18nModel = oComponent.getModel("i18n");
			var localModel = oComponent.getModel("local");
			var lstatus;
			if (loggedIn === true) {
				lstatus = i18nModel.getProperty("xsConnected");
				$.sap.log.error("checkXS:" + lstatus);
				localModel.setProperty("/status", "");
				localModel.setProperty("/xsConnected", true);
			} else {
				lstatus = i18nModel.getProperty("xsDisConnected");
				$.sap.log.error(lstatus);
				localModel.setProperty("/status", lstatus);

			}

		},

		loginSLTest: function() {
			//var localModel = this.getOwnerComponent().getModel("local");
			//K2PLogin.loginSL(localModel, this.sLCallback);
			//

			var loginInfo = {};
			//var B1SLAddress = "/b1s/v1/";

			loginInfo.UserName = "manager";
			loginInfo.Password = "Duffy01!";
			loginInfo.CompanyDB = "DMJPROP";

			var path = "/destinations/hanab1:50000/b1s/v1/Login";
			var logindata = JSON.stringify(loginInfo);

			$.ajax({
				type: "POST",
				url: path,
				xhrFields: {
					withCredentials: true
				},
				data: logindata,
				error: function(a, b, c) {
					$.sap.log.error("loginSL: Error");
				}
			}).done(function(results) {

				if (results) {
					$.sap.log.error("loginSL: Success");
				} else {
					$.sap.log.error("loginSL: Error2");
				}

			}); //ajax login done

			//LoginSL.loginSL(localModel);

		},

		logoutSLTest: function() {
			var localModel = this.getOwnerComponent().getModel("local");
			K2PLogin.logoutSL(localModel, this.sLCallback);

		},

		checkSLSession: function() {

			var localModel = this.getOwnerComponent().getModel("local");
			var surl = document.URL;
			var aRRurl1 = surl.split("//");
			var aRRSegments = aRRurl1(1).split("/");
			var fullserver = aRRSegments(0);

			var aRRrootserver = fullserver.split(":");
			var rootserver = aRRrootserver(0);
			localModel.setProperty("/rootserver", rootserver);

			//var thisView = this.getView();
			var i, x, y;
			var ARRcookies = document.cookie.split(";");
			for (i = 0; i < ARRcookies.length; i += 1) {
				x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
				y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
				x = x.replace(/^\s+|\s+$/g, "");
				y = y;
			}

			/*			var localModel = thisView.getModel("local");
			var callbackcheckSL = function(success) {
				if (success === true) {
					jQuery.sap.log.error("SL1 Success");
				} else {
					jQuery.sap.log.error("SL1 Fail");
				}

			};
			K2PLogin.loginSL(localModel, callbackcheckSL);*/

		},

		loginSL1: function() {

			//var oController = this;
			var oComponent = this.getOwnerComponent();
			var localModel = oComponent.getModel("local");
			var loggedIn = localModel.getProperty("/loggedIn");
			if (loggedIn) {
				//log out
				K2PLogin.logoutSL(localModel);
			} else {
				//if (xsConnected) {
				//log into Service Layer
				var callback = function(success, message) {
					if (success === true) {
						jQuery.sap.log.error("SL1 Success");
						//K2PUtils.fetchRentRoll(rentRoleModel, localModel);

					} else {
						jQuery.sap.log.error("SL1 Fail");
						jQuery.sap.log.error(message);

					}

				};
				K2PLogin.loginSL(localModel, callback);

				//}

			}

		},
		/*		setLoginPanel: function (loggedIn) {
								var oController = this;
								var oComponent = oController.getOwnerComponent();
								var i18nModel = oComponent.getModel("i18n");
								var btnLogin = this.byId("btnLogin");
								var localModel = oComponent.getModel("local");
								var inpUser = oController.byId("inpUser");
								var pnlLogin = oController.byId("pnlLogin");
								var pnlTiles = oController.byId("pnlTiles");
								//pnlTiles
								var inpPassword = oController.byId("inpPassword");
								var cmbCompanyDB = oController.byId("cmbCompanyDB");

								var text;
								if (loggedIn) {
									text = i18nModel.getProperty("logout");
								} else {
									text = i18nModel.getProperty("login");
								}

								btnLogin.setText(text);
								inpUser.setEnabled(!loggedIn);
								inpPassword.setEnabled(!loggedIn);
								cmbCompanyDB.setEnabled(!loggedIn);
								localModel.setProperty("/loggedIn", loggedIn);
								pnlLogin.setExpanded(!loggedIn);
								pnlTiles.setVisible(loggedIn);

				},*/

		logoutSL: function() {
			//var thisView = this.getView();
			//var lLabel = thisView.byId("LabelLogin");
			var localModel = this.getOwnerComponent().getModel("local");
			//var destination = localModel.getProperty("/destination");
			//var destination = "/destinations/hanab1vm2:50000"; //$.net.http.readDestination("/xsjs", "B1SL");
			//var destination = "/destinations/96.89.78.153:50000";
			K2PLogin.logoutSL(localModel);

		},

		/*		doSomething: function(oEvent) {
			$.ajax({
				url: "logic.xsjs",
				type: "GET",
				beforeSend: function(xhr) {
					xhr.setRequestHeader("X-CSRF-Token", "Fetch");
				},
				success: function(data, textStatus, XMLHttpRequest) {
					var token = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
					//var data = "somePayLoad";
					$.ajax({
						url: "logic.xsjs",
						type: "POST",
						data: data,
						beforeSend: function(xhr) {
							xhr.setRequestHeader("X-CSRF-Token", token);
						},
						success: function() {
							alert("works");
						},
						error: function() {
							alert("works not");
						}
					});
				}
			});
		},*/

		onDisplayNotFound: function() {
			// display the "notFound" target without changing the hash
			this.getRouter().getTargets().display("notFound", {
				fromTarget: "home"
			});
		},

		onClick: function() {
			//alert("Hi There!");
		},
		onNavToStatement: function() {
			this.getRouter().navTo("payment");
		},

		onNavToBalances: function() {
			var component = this.getOwnerComponent();
			var userModel = component.getModel("userModel");
			var s = userModel.getProperty("/value/0/UserName");
			var oData = userModel.getData();
			var oValue = userModel.getProperty("/value/");
			this.getRouter().navTo("balances");
		},
		onNavToBalances2: function() {
			this.getRouter().navTo("balances2");
		},

		onNavToAccount: function() {
			this.getRouter().navTo("accountDetails");
		},

		onNavToworkOrderList: function() {
			this.getRouter().navTo("workOrderList");
		},
		onNavToworkOrder: function() {
			var oModel = models.creatWorkOrderViewModel();
			oModel.setProperty("/add", true);
			oModel.setProperty("/approved", false);
			oModel.setProperty("/navBack", "home");
			this.getOwnerComponent().setModel(oModel, "workOrderView");
			this.getRouter().navTo("workOrder");
		},

		onNavToRentRoll: function() {
			this.getRouter().navTo("rentroll");
		},
		onNavToRentRoll2: function() {
			this.getRouter().navTo("rentroll2");
		},
		onNavToProperty: function() {
			this.getRouter().navTo("property");
		},
		onNavToChargeTypes: function() {
			this.getRouter().navTo("chargetypes");
		},
		onNavToApprovalList: function() {
			this.getRouter().navTo("approvalList");
		},
		onNavToPurchaseOrderList: function() {
			this.getRouter().navTo("purchaseOrderList");
		},
		onNavToPurchaseOrder: function() {
			var oModel = models.creatPurchaseOrderViewModel();
			oModel.setProperty("/add", true);
			oModel.setProperty("/approved", false);
			oModel.setProperty("/navBack", "home");
			this.getOwnerComponent().setModel(oModel, "purchaseOrderView");
			this.getRouter().navTo("purchaseOrder");
		},
		onNavToTasks: function() {
			this.getRouter().navTo("tasks");
		},
		onNavToRoleList: function() {
			this.getRouter().navTo("roles");
		},
		onNavToLadderList: function() {
			this.getRouter().navTo("ladders");
		},
		onNavToApproverList: function() {
			this.getRouter().navTo("approvers");
		},
		onNavToCustomerDetails: function() {
			this.getRouter().navTo("customerDetails");
		},
		//
		onNavBack: function() {
			K2PUtils.slLogout(this);
			//this.getRouter().navTo("login");
			//logout
		},
		onChangePassword: function() {
			var callingController = this;
			if (!callingController.pDialog) {
				callingController.pDialog = callingController.loadFragment({
					type: "XML",
					name: "K2PPM_PM.K2PUtils.SimpleDialog"
				}); //dialogPW
			}
			callingController.pDialog.then(function(oDialog) {
				oDialog.open();
			});
		},
		onSavePassword: function() {
			//Try to change passrod

			var callingController = this;
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

			this.getpostputpatch(callingController, this.slLoginCallBack, null, this);

			this.byId("dialogPW").close();
		},
		onCancelPassword: function() {
			//MessageToast.show("Cancel");
			this.byId("dialogPW").close();
		}
	});

});