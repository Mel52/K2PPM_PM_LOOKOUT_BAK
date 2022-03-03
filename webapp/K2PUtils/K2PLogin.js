sap.ui.define(["K2PPM_PM/K2PUtils/K2PUtils", "K2PPM_PM/model/models"],
	function (K2PUtils, models) {
		"use strict";

		return {

			/*			loginSLCallback: function (loggedInSL) {
							var lstatus;
							if (loggedInSL === true) {
								lstatus = "loginSLCallback: Success";
								$.sap.log.error(lstatus);
								var ilocalModel;
								ilocalModel.setProperty("/status", "Please Login");
							} else {
								$.sap.log.error("loginSL: fail");
								ilocalModel.setProperty("/status", "Error: Service Layer Login Failed!");
							}
						},
			*/
			loginXSCallback: function (loggedInXS) {
				var lstatus;
				if (loggedInXS === true) {
					lstatus = "loginXS:Logged in";
					$.sap.log.error(lstatus);
					var ilocalModel;
					ilocalModel.setProperty("/status", lstatus);
					this.loginSL(ilocalModel, this.loginSLCallback);
				} else {
					lstatus = "loginXS: Login Failed";
					$.sap.log.error(lstatus);
					ilocalModel.setProperty("/status", lstatus);
					//FAIL!!!
				}

			},

			checkLogins: function (localmodel) {
				//Declare Function to Call Back
				var i = this;
				var ilocalModel = localmodel;
				/*				var loginSLCallback = function(loggedInSL) {
					var lstatus;
					if (loggedInSL === true) {
						lstatus = "loginSLCallback: Success";
						$.sap.log.error(lstatus);
						ilocalModel.setProperty("/status", "Please Login");
					} else {
						$.sap.log.error("loginSL: fail");
						ilocalModel.setProperty("/status", "Error: Service Layer Login Failed!");
					}
				};*/
				var checkXSCallback = function (loggedIn) {
					var lstatus;
					if (loggedIn === true) {
						lstatus = "XS Connected";
						$.sap.log.error("checkXS:" + lstatus);
						ilocalModel.setProperty("/status", lstatus);
						i.loginSL(ilocalModel, i.loginSLCallback);
					} else {
						/*						var loginXSCallback = function(loggedInXS) {
							if (loggedInXS === true) {
								lstatus = "loginXS:Logged in";
								$.sap.log.error(lstatus);
								ilocalModel.setProperty("/status", lstatus);
								i.loginSL(ilocalModel, loginSLCallback);
							} else {
								lstatus = "loginXS: Login Failed";
								$.sap.log.error(lstatus);
								ilocalModel.setProperty("/status", lstatus);
								//FAIL!!!
							}

						};*/
						i.loginXS(ilocalModel, i.loginXSCallback);
					}

				};
				//call another function with callback as parameter
				this.checkXS(checkXSCallback);
			},

			checkXS: function (xSCallBack, oComponent) {
				//var origin = this.getParameterByName("x-sap-origin-location");
				var i = this;
				var ret = false;
				$.ajax({
					url: "/sap/hana/xs/formLogin/checkSession.xsjs",
					type: "GET",
					/*				data: origin !== null ? {
					"x-sap-origin-location": decodeURIComponent(origin)
				} : {},*/
					success: function (resp) {

						if (resp) {
							/*if (resp["x-sap-origin-location-ok"] === false) {
							thisView.to("ui.phishing.page");
							ret = false;
							return;
						}*/
							if (resp.login === true) {
								$.sap.log.error("K2PLogin.checkXS: login true");
								//view.getController().handleSuccessfulLogin(resp);
								ret = true;
							} else {
								$.sap.log.error("K2PLogin.checkXS: login false");
								ret = false;
								var localModel = oComponent.getModel("local");
								i.loginXS(localModel, xSCallBack, oComponent);
								//thisView.to("sap.hana.xs.ui.login.page");
							}
						} else {
							$.sap.log.error("K2PLogin.checkXS: no response");
							ret = false;
						}
						xSCallBack(ret, oComponent);
					},

					error: function () {
						$.sap.log.error("K2PLogin.checkXS: error connecting to HANA");
						ret = false;

					}
				});

			},

			loginXS: function (localModel, xSCallBack, oComponent) {
				$.sap.log.error("logging into xs");
				var loginToXS = function (CSRFToken) {
					//var origin = getParameterByName("x-sap-origin-location");
					//localModel.setProperty("/CSRFToken",CSRFToken);
					var data = {
						"xs-username": localModel.getProperty("/DBUser"),
						"xs-password": localModel.getProperty("/DBPassword")
					};
					$.ajax({
						url: "/sap/hana/xs/formLogin/login.xscfunc",
						type: "POST",
						data: data,
						beforeSend: function (xhr) {
							xhr.setRequestHeader("X-CSRF-Token", CSRFToken);
						},
						success: function () {
							//var data1 = sdata;
							//var data2 = textStatus;
							var s = "Success";
							$.sap.log.error("login xs : " + s);
							xSCallBack(true, oComponent);

						},
						error: function (xhr) {
							//var msg = xhr.responseText;
							var s = "fail" + xhr.responseText;
							$.sap.log.error("login xs : " + s);
							xSCallBack(false, oComponent);
						}
					});
				};
				this.getCSRFToken(loginToXS, "/sap/hana/xs/formLogin/token.xsjs");
			},

			getCSRFToken: function (callback, surl) {
				//var s = "Begin";
				//$.sap.log.error("getCSRFToken: " + s);
				$.ajax({
					url: surl,
					type: "GET",
					beforeSend: function (xhr) {
						xhr.setRequestHeader("X-CSRF-Token", "Fetch");
					},
					error: function (xhr, status, error) {
						$.sap.log.error("getCSRFToken : fail");
						//oLabel1.setText(xhr.responseText);
						//$.sap.log.error("error in getCSRFToken: " + xhr.responseText);
						//var msg = xhr.responseText;
						//sap.m.MessageToast.show(msg);
					},
					success: function (data, textStatus, XMLHttpRequest) {
						//$.sap.log.error("success in getCSRFToken: " + XMLHttpRequest.getResponseHeader('X-CSRF-Token'));
						$.sap.log.error("getCSRFToken : success");
						var CSRFToken = XMLHttpRequest.getResponseHeader('X-CSRF-Token');
						callback(CSRFToken);
					}
				});
			},
			checkSLLogin: function (callingContoller, callback) {
				var thisView = callingContoller.getView();
				thisView.setBusy(true);
				// set the queryParams model
				var queryModel = models.createQueryModel();
				queryModel.setProperty("/method", "POST");
				queryModel.setProperty("/command", "CompanyService_GetCompanyInfo");
				var queryParams = "";
				queryModel.setProperty("/queryParams", queryParams);
				//fetch data
				K2PUtils.getpostputpatch(callingContoller, queryModel, callback);

			},
		slLogin: function (callingController, callback) {
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

			K2PUtils.getpostputpatch(callingController, this.slLoginCallBack, callback);
		},
	slLoginCallBack: function (callingContoller, results, retrycallback) {
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

		},

/*			slLogin: function (callingContoller, callback, retry) {
				var thisView = callingContoller.getView();
				thisView.setBusy(true);
				var oComponent = callingContoller.getOwnerComponent();
				var localModel = oComponent.getModel("local");

				var loginInfo = {};
				loginInfo.UserName = localModel.getProperty("/B1UserName");
				loginInfo.Password = localModel.getProperty("/B1Password");
				loginInfo.CompanyDB = localModel.getProperty("/B1CompanyDB");

				// set the queryParams model
				var queryModel = models.createQueryModel();
				queryModel.setProperty("/method", "POST");
				queryModel.setProperty("/command", "Login");
				//queryModel.setProperty("/withCredentials", false);
				if (retry) {
					queryModel.setProperty("/retry", true);
				}

				var queryParams = "";
				var data = JSON.stringify(loginInfo);
				queryModel.setProperty("/data", data);
				queryModel.setProperty("/queryParams", queryParams);
				queryModel.setProperty("/withCredentials", false);
				//withCredentials: true

				//fetch data
				K2PUtils.getpostputpatch(callingContoller, queryModel, callback);

			},*/

			loginSLold: function (localModel, callback) {

				/*					var localModel = thisView.getModel("local");
					var oLabelLogin = thisView.byId("LabelLogin");*/

				var loginInfo = {};

				loginInfo.UserName = localModel.getProperty("/B1UserName");
				loginInfo.Password = localModel.getProperty("/B1Password");
				loginInfo.CompanyDB = localModel.getProperty("/B1CompanyDB");

				var destination = localModel.getProperty("/destination");
				//var B1SLAddress = "/b1s/v1/";
				var path = destination + "Login";
				var sData = JSON.stringify(loginInfo);

				$.ajax({
					type: "POST",
					url: path,
					xhrFields: {
						withCredentials: true
					},
					data: sData,
					/*						sucess: function() {
							$.sap.log.error("loginSL: Success");
						},*/
					error: function (A, B, C) {
							$.sap.log.error("loginSL: Error");
							//$.sap.log.error(A);
							callback(false, C);
						}
						/*,
							complete: function() {
								$.sap.log.error("loginSL: Complete");
							}*/

				}).done(function (results) {

					if (results) {

						$.sap.log.error("loginSL: Success");
						callback(true);

					} else {
						$.sap.log.error("loginSL: failed!");
						callback(false);
					}

				});

			}, //ajax login done
/*			SLlogout: function (callingController) {
				var thisView = callingController.getView();
				thisView.setBusy(true);

				var qParamsModel = thisView.getModel("qParams");
				qParamsModel.setProperty("/method", "POST");
				qParamsModel.setProperty("/command", "Logout");
				qParamsModel.setProperty("/data", null);
				qParamsModel.setProperty("/loggingIn", false);

				K2PUtils.getpostputpatch(callingController, this.slLogoutCallBack);
			},

			slLogoutCallBack: function (callingController) {
				var thisView = callingController.getView();
				var qParamsModel = thisView.getModel("qParams");
				var oComponent = callingController.getOwnerComponent();
				var localModel = oComponent.getModel("local");

				var errorCode = qParamsModel.getProperty("/errorCode");
				var error = qParamsModel.getProperty("/error");
				var status = qParamsModel.getProperty("/status");
				var msg = error + " " + status;

				if (errorCode === 0) {

					localModel.setProperty("/loggedIn", "false");

					$.sap.log.error("SL logOut: Success");
				} else {
					$.sap.log.error("SL Logout error! " + msg);
					thisView.setBusy(false);
				}
				thisView.setBusy(false);
				callingController.getRouter().navTo("login"); //login
			},*/

			logoutSLold: function (callingController, queryModel) {
				var thisView = callingController.getView();
				var oController = callingController;
				thisView.setBusy(true);
				var loginInfo = {};
				var destination = queryModel.getProperty("/url");
				//var B1SLAddress = "/b1s/v1/";
				var path = destination + "Logout";

				$.ajax({
					type: "POST",
					url: path,
					xhrFields: {
						withCredentials: true
					},
					data: JSON.stringify(loginInfo),
					/*						sucess: function() {
							$.sap.log.error("SL Logged Out");
						},*/
					error: function () {
							$.sap.log.error("SL Logout error!");
							thisView.setBusy(false);
						}
						/*,
							complete: function() {
								$.sap.log.error("SL logOut: Complete");
							}*/

				}).done(function (results, status, xhr) {

					var vstatus = xhr.status;
					if (vstatus === 204) {
						$.sap.log.error("SL logOut: Success");

					} else {
						$.sap.log.error("SL Logout Failed!");
					}
					thisView.setBusy(false);
					oController.getRouter().navTo("login"); //login

				}); //ajax logout done
			}

			/*			loginSL: function(localModel, callback) {

				var sendSL = function(CSRFToken) {

					var loginInfo = {};

					loginInfo.UserName = localModel.getProperty("/B1UserName");
					loginInfo.Password = localModel.getProperty("/B1Password");
					loginInfo.CompanyDB = localModel.getProperty("/B1CompanyDB");
					var destination = localModel.getProperty("/destination");

					var B1SLAddress = "/b1s/v1/";
					var path = destination + B1SLAddress + "Login";
					$.sap.log.error("Logging in SL");
					//sap.ui.core.BusyIndicator.show(100);
					$.ajax({
						type: "POST",
						url: path,
						xhrFields: {
							withCredentials: true
						},
						data: JSON.stringify(loginInfo),
						beforeSend: function(xhr) {
							xhr.setRequestHeader("X-CSRF-Token", CSRFToken);
						},
						success: function() {
							//var data1 = sdata;
							//var data2 = textStatus;
							var s = "Success";
							$.sap.log.error("SL Login: " + s);
							callback(true);

						},
						error: function(xhr, status) {
							var s1 = ("SL Login Error: " + status);
							$.sap.log.error(s1);
							callback(false);
							/*if (xhr.response.Text) {
							lLabelIn.setText(s1 + xhr.responseText);
						} else {
							lLabelIn.setText(s1);
						}
						}
					});

				};
				this.getCSRFToken(sendSL,"/destinations/hanab1vm2:50000/");

			},

			logoutSL: function(lLabelIn, destination, loginInfo) {
				lLabelIn.setText("Logging out");
				var surl = destination + "/Logout";
				$.ajax({
					type: "POST",
					url: surl,
					data: JSON.stringify(loginInfo),
					error: function(jqxhr, status, error) {
						var s = ("SL Logout failed!");
						$.sap.log.error(s);
						lLabelIn.setText(s);
					},
					sucess: function(data, status, jqxhr) {
						sap.m.MessageToast.show("SL Logged Out");
						var s = ("SL Logged Out");
						$.sap.log.error(s);
						lLabelIn.setText(s);
					}
				}); //ajax login done

			}

							.done(function(results) {

					if (results) {

						oLabelLogin.setText("Logged In");

						var oController = sap.ui.controller("MyAppMyApp.controller.View1");
						oController.fetchBPs(thisView);

						obutton0.setText("Log Out");

					} else {
						oLabelLogin.setText("Login Failed");
						obutton0.setText("Log In");
					}

				})

			//; ajax Service Layer login done */

		};
	});