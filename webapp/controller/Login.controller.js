sap.ui.define([
	"K2PPM_PM/controller/BaseController",
	"K2PPM_PM/K2PUtils/K2PUtils",
	"K2PPM_PM/K2PUtils/jsCookie",
	"K2PPM_PM/model/models",
	"K2PPM_PM/controller/Balances.controller",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(BaseController, K2PUtils, jsCookie, models, Balances, Fragment, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("K2PPM_PM.controller.Login", {

		onInit: function() {
			var component = this.getOwnerComponent();
			var oRouter = component.getRouter();
			var oRoute = oRouter.getRoute("login");
			var thisView = this.getView();
			var qParamsModel = models.createQueryModel();
			oRoute.attachMatched(this._onRouteMatched, this);
			thisView.setModel(qParamsModel, "qParams");
				var localModel = component.getModel("local");
			var href = window.location.href;
			localModel.setProperty("/href", href);
			component.setModel(localModel, "local");
			

		},
		_onRouteMatched: function() {

			var title = K2PUtils.geti18n(this, "loginPageTitle");
			var thisPage = this.getView().byId("thisPage");
			thisPage.title = title;

		},

		slGetAdminInfo: function() {

			var thisView = this.getView();
			thisView.setBusy(true);
			// set the queryParams model
			var queryModel = models.createQueryModel();
			queryModel.setProperty("/method", "POST");
			queryModel.setProperty("/command", "CompanyService_GetAdminInfo");
			var queryParams = "";
			queryModel.setProperty("/queryParams", queryParams);
			//fetch data
			K2PUtils.getpostputpatch(this, queryModel, this.slGetAdminInfoCallBack);
		},

		slGetAdminInfoCallBack: function(callingContoller, queryModel) {

			var errorCode = queryModel.getProperty("/errorCode");
			var thisView = callingContoller.getView();
			var component = callingContoller.getOwnerComponent();
			//var message;
			if (errorCode === 0) {
				//Goto Home Page
				var localModel = component.getModel("local");
				localModel.setProperty("/loggedIn", "true");
				component.getRouter().navTo("home");

			} else {
				//Just stay on this login page

			}
			thisView.setBusy(false);

		},
		slLoginButton: function() {
			K2PUtils.slLogin(this, this.slLoginButtonCallBack);

		},
		slLoginButtonCallBack: function(callingController) {
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel("qParams");
			var errorCode = qParamsModel.getProperty("/errorCode");
			if (errorCode === 0) {
				//Get the metadata again 
				//GET https://hanab1vm2:4300/K2PPM_PM/xsjs/K2POdata.xsjs/$metadata
				callingController.getRouter().navTo("home");

				// set the queryParams model
				/*				
	            thisView.setBusy(true);
	            var queryModel = models.createQueryModel();
				queryModel.setProperty("/method", "Get");
				queryModel.setProperty("/command", "/$metadata");
				var queryParams = "";
				queryModel.setProperty("/queryParams", queryParams);
				//fetch metadata
				//(callingController, callback, callback2, oThis, qNameIn)
				thisView.setModel(queryModel, "qparamsMetaData");
				K2PUtils.getpostputpatch(callingController, callingController.slMetaDataCallBack, "", "", "qparamsMetaData");*/

			} else {
				var sMessage = "slLoginButtonCallBack : " + error + " Code:" + errorCode.toString();
				var i18n = "";
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
			//
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

			this.getpostputpatch(callingController, this.slLoginCallBack, callbackOrigin, this);

			this.byId("dialogPW").close();
		},
		onCancelPassword: function() {
			//MessageToast.show("Cancel");
			this.byId("dialogPW").close();
		}
		/*

			
			var thisView = callingController.getView();
			if (!callingController.oPasswordDialog) {

				callingController.oPasswordDialog = Fragment.load({
					id: "passwordDialog", //oView.getId(),
					name: "K2PPM_PM.K2PUtils.ChangePasswordDialog",
					controller: callingController
				}).then(function(oPasswordDialog) {
					thisView.addDependent(oPasswordDialog);
					return oPasswordDialog;
				});

			}
			var oDialog = callingController.byId("passwordDialog");
			oDialog.open();

		
		/*

			
					    var sTitle = "Change Password";
			var msg = "Password";
			MessageBox.show(
				msg, {
					icon: MessageBox.Icon.QUESTION,
					title: sTitle,
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					emphasizedAction: MessageBox.Action.NO,
					onClose: function(oAction) {
						switch (oAction) {
							case MessageBox.Action.YES:
								//
								break;
							case MessageBox.Action.NO:
								//
								return;
						}
					}
				});
			
			*/

		/*,
		slMetaDataCallBack: function(callingController) {
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel("qparamsMetaData");
			var errorCode = qParamsModel.getProperty("/errorCode");
			thisView.setBusy(false);
			if (errorCode === 0) {
				callingController.getRouter().navTo("home");
			} else {
				var sMessage = "slMetaDataCallBack : "  + " Code:" + errorCode.toString();
				var i18n = "";
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}

		}*/

		/*		slLogin: function (callingControllerIn, callback) {
						//If called from the login form then callback and retry will be null
						//callback will not be null if this is a retry login from a failed fetch
						var callingController;
						if (callingControllerIn) {
							callingController = callingControllerIn;
						} else {
							callingController = this;
						}
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

						K2PUtils.getpostputpatch(callingController, this.slLoginCallBack, callback);
					},*/

		/*		slLoginCallBack: function (callingContoller, logincallback, retrycallback) {
					var thisView = callingContoller.getView();
					thisView.setBusy(false);
					var component = callingContoller.getOwnerComponent();
					var localModel = component.getModel("local");

					var qParamsModel = thisView.getModel("qParams");
					var errorCode = qParamsModel.getProperty("/errorCode");
					var error = qParamsModel.getProperty("/error");
					var status = qParamsModel.getProperty("/status");
					var message;

					if (errorCode === 0) {

						if (retrycallback) {
							//This is a retry so callback
							retrycallback(callingContoller, true);
						} else {
							//Goto Home Page
							localModel.setProperty("/loggedIn", "true");
							component.getRouter().navTo("home");
						}

					} else {
						//userLoginError
						if (status === 401) {
							if (errorCode === 100000055) {
								//user locked
								message = ""; // errorStr + " Code:" + errorCode.toString();
								K2PUtils.errorMessageBox(component, "userLockedError", message, true);
							} else if (errorCode === 100000027) {
								//bad credentials
								message = ""; // errorStr + " Code:" + errorCode.toString();
								K2PUtils.errorMessageBox(component, "userLoginError", message, true);

							} else {
								//generic 401	
								message = error + " Code:" + errorCode.toString();
								K2PUtils.errorMessageBox(component, "serviceLayer401", message, true);
							}
						} else if (status === 405) {
							message = error + " Code:" + errorCode.toString();
							K2PUtils.errorMessageBox(component, "serviceLayerURL", message, true);
						} else if (status === 500) {
							message = error + " Code:" + errorCode.toString();
							K2PUtils.errorMessageBox(component, "userLoginConnection", message, true);
						} else {
							message = "Login Failed: " + error + " Code:" + errorCode.toString();
							K2PUtils.errorMessageBox(component, "serviceLayerError", message);
						}

					}

				}*/

		/*,

		// override the parent's onNavBack (inherited from BaseController)
		onNavBack : function (oEvent){
			// in some cases we could display a certain target when the back button is pressed
			if (this._oData && this._oData.fromTarget) {
				this.getRouter().getTargets().display(this._oData.fromTarget);
				delete this._oData.fromTarget;
				return;
			}

			// call the parent's onNavBack
			BaseController.prototype.onNavBack.apply(this, arguments);
		}
*/
	});

});