sap.ui.define([
		"K2PPM_PM/controller/BaseController",
	"../K2PUtils/K2PUtils",
	"K2PPM_PM/model/models",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v4/ODataModel",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment",
	"sap/ui/core/mvc/Controller"
	], function(BaseController, K2PUtils, models, JSONModel, ODataModel, Sorter, Filter, FilterOperator, FilterType, MessageBox, History,Fragment,Controller) {
	"use strict";

	return BaseController.extend("K2PPM_PM.controller.Maintenance", {

		eventDataReceived: function(o) {
			var o1 = o;
			o1 = o1;
		},

		onInit: function() {

			var oRouter = this.getRouter();
			oRouter.getRoute("maintenance").attachMatched(this._onRouteMatched, this);

/*			var oMessageManager = sap.ui.getCore().getMessageManager(),
				oMessageModel = oMessageManager.getMessageModel(),
				oMessageModelBinding = oMessageModel.bindList("/", undefined, [],
					new Filter("technical", FilterOperator.EQ, true)),
				oViewModel = new JSONModel({
					busy: false,
					hasUIChanges: false,
					usernameEmpty: true,
					order: 0
				});*/

			this.getView().setModel(models.createQueryModel(), "qParams");
			
			var serviceLayerModel = this.getOwnerComponent().getModel("serviceLayer");
			this.getView().setModel(serviceLayerModel);

			//this.getProperties();

			//var dfltModel = this.getOwnerComponent().getModel("serviceLayer");

			//this.getView().setModel(dfltModel);

			//this._bTechnicalErrors = false;

		},

		onBeforeRendering: function() {

		},

		onAfterRendering: function() {

			/*		    var serviceModel = this.getOwnerComponent().getModel("service");
			var thisView = this.getView();
			var oTable = thisView.byId("idMainTable");*/
			//oTable.setModel(serviceModel);

			/*		    var oArgs, oView;
		    oView = this.getView();
		    //oArgs = oEvent.getParameter("arguments");
		    //var cardCode = oArgs.cardCode;
		    var oModel = new sap.ui.model.json.JSONModel();
		    var oTable = oView.byId("idMainTable");
			oTable.setModel(oModel);
		    this.fetchInvoices(oView, "KYLEEC");*/

		},

		_onViewDisplay: function() {

		},

		onListItemPressed: function() {

		},

		_onRouteMatched: function() {

/*			var thisView = this.getView();
			var serviceLayerModel = this.getOwnerComponent().getModel("serviceLayer");
			thisView.setModel(serviceLayerModel, "serviceLayer");*/
			var oModel = this.getOwnerComponent().getModel("maintenanceView");
			if (oModel.add === true) {
				//add new record here
				this.getView().byId("btnSubmit").visible = true;
				this.getView().byId("btnRequest").visible = false;
				this.getView().byId("btnApproved").visible = false;
				this.getView().byId("btnInventory").visible = false;
				this.defaultNew();
			} else {
				this.getView().byId("btnSubmit").visible = true;
				this.getView().byId("btnRequest").visible = true;
				this.getView().byId("btnApproved").visible = true;
				this.getView().byId("btnInventory").visible = false;
				this.fetchMain();
			}
		},
		defaultNew: function() {
			//var thisView = this.getView();

			var oUserModel = this.getOwnerComponent().getModel("userModel");
			var user = oUserModel.getProperty("/value/0/UserCode");
			var userName = oUserModel.getProperty("/value/0/UserName");

			var newWOModel = models.createWorkOrderModel();
			newWOModel.setProperty("/U_CreateBy", user);
			newWOModel.setProperty("/U_CreateByName", userName);

			this.getOwnerComponent().setModel(newWOModel, "workOrder");

			//thisView.setModel(dfltModel);

			//var path = "/UDO_K2P_WORKORDER(1)";
			//var oPath = {};
			//oPath.path = path;

			//var VBox = thisView.byId("VBox");

			//VBox.bindElement(oPath);

		},
		fetchMain: function() {
			var dfltModel;
			var thisView = this.getView();

			var oViewModel = this.getOwnerComponent().getModel("maintenanceView");
			var path = oViewModel.path;

			var data;
			//var surl = destination + "IncomingPayments";

			thisView.setBusy(true);
			// set the queryParams model
			var qParamsModel = models.createQueryModel();
			thisView.setModel(qParamsModel, "qWOSubmit");
			qParamsModel.setProperty("/method", "GET");
			qParamsModel.setProperty("/command", path);
			qParamsModel.setProperty("/data", data);
			qParamsModel.setProperty("/firstFetch", true);
			var queryParams = "";
			qParamsModel.setProperty("/queryParams", queryParams);
			K2PUtils.getpostputpatch(this, this.fetchMainCallback, null, this, "qWOSubmit");
			/*
			var oPath = {};
			oPath.path = path;

			var VBox = thisView.byId("VBox");

			VBox.bindElement(oPath);*/

		},

		fetchMainCallback: function(callingController, result, callback2, oThis) {

			var oModel = callingController.getOwnerComponent().getModel("workOrder");
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel("qWOSubmit");
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var retry = qParamsModel.getProperty("/retry");
			var component = callingController.getOwnerComponent();
			var i18n;
			if (errorCode === 0) {
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(result);
				component.setModel(oModel, "workOrder");
				/*				
				var workOrderModel = component.getModel("workOrder");
				var taskArray = oModel.getProperty("/K2P_WO_TASKSCollection");
                var taskModel = {"value" : taskArray};
				
				 Does not seem to work
                    var oBinding = oTable.getBinding("items");
                   oBinding.setModel(oModel);
				
					var oTable = thisView.byId("idTasksTable");
	                oTable.setModel(taskModel);
*/
				thisView.setBusy(false);
			} else {

				/*					if (!retry) {
						//first failure so try to login
						qParamsModel.setProperty("/retry", true);
						this.slLogin(callingController, callingController.onSubmitPayment);
					} else {*/
				//second try so issue error - avoid infinite loop
				thisView.setBusy(false);
				//var message = "onSubmitCallback: " + error + " Code:" + errorCode.toString() + " status: " + status;
				//callingController.errorDialogBox(component, "WorkOrder", message, true);
				/*}*/
				//issue error
				//var sMessage = "onSubmitCallback: " + error + " Code:" + errorCode.toString();
				var sMessage = "onSubmitCallback: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},

		onSubmit: function(oEvent) {

			try {

				var oViewModel = this.getOwnerComponent().getModel("maintenanceView");
				var thisView = this.getView();
				var method, command;
				if (oViewModel.add === true) {
					method = "POST";
					command = "UDO_K2P_WORKORDER()";
				} else {
					method = "PATCH";
					command = oViewModel.path;
				}
				var oModel = this.getOwnerComponent().getModel("workOrder");

				var data = oModel.getJSON();
				//var surl = destination + "IncomingPayments";

				thisView.setBusy(true);
				// set the queryParams model
				var qParamsModel = models.createQueryModel();
				thisView.setModel(qParamsModel, "qWOSubmit");
				qParamsModel.setProperty("/method", method);
				qParamsModel.setProperty("/command", command);
				qParamsModel.setProperty("/data", data);
				qParamsModel.setProperty("/retry", false);
				qParamsModel.setProperty("/firstFetch", true);
				qParamsModel.setProperty("/withCredentials", false);
				//withCredentials
				var queryParams = "";
				qParamsModel.setProperty("/queryParams", queryParams);
				K2PUtils.getpostputpatch(this, this.onSubmitCallback, null, this, "qWOSubmit");

				/*					try {
						var s;
						var oNewRecord = JSON.parse(oModel.getJSON());
						var oBinding = oViewModel.oMaintTable.getBinding("
									items ");
						var oContext = oBinding.create(oNewRecord);

						oContext.created().then(function() {
							s = "
									OK ";
						}, function(oError) {
							s = oError.toString();
						});

					} catch (err) {
						s = err.toString();
					}*/

				//this.defaultNew();

			} catch (e) {
				var e1 = e;
				e1 = e1;
			}
		},
		onSubmitCallback: function(callingController, results, callback2, oThis) {
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel("qWOSubmit");
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var retry = qParamsModel.getProperty("/retry");
			var component = callingController.getOwnerComponent();
			var i18n;
			if (errorCode === 0) {
				//no problem so try to refresh page data one last time
				thisView.setBusy(false);
				//callingController.fetchMain(callingController, false); //refresh Invoices
				var oHistory, sPreviousHash;

				oHistory = History.getInstance();
				sPreviousHash = oHistory.getPreviousHash();
				
				//var params = {name: "maintenanceList", refresh: "true"};
				var oViewModel = callingController.getOwnerComponent().getModel("maintenanceView");
			    oViewModel.setProperty("/refresh",true);
				callingController.getRouter().navTo("maintenanceList");

/*				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					callingController.getRouter().navTo("", {}, true );
				//}
			

			} else {

				/*					if (!retry) {
						//first failure so try to login
						qParamsModel.setProperty("/retry", true);
						this.slLogin(callingController, callingController.onSubmitPayment);
					} else {*/
				//second try so issue error - avoid infinite loop
				thisView.setBusy(false);
				//var message = "onSubmitCallback: " + error + " Code:" + errorCode.toString() + " status: " + status;
				//callingController.errorDialogBox(component, "WorkOrder", message, true);
				/*}*/
				//issue error
				//var sMessage = "onSubmitCallback: " + error + " Code:" + errorCode.toString();
				var sMessage = "onSubmitCallback: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},
		getProperties: function() {

			try {

				var oViewModel = this.getOwnerComponent().getModel("maintenanceView");
				var thisView = this.getView();

				var data;
				//var surl = destination + "IncomingPayments";

				thisView.setBusy(true);
				// set the queryParams model
				var qParamsModel = models.createQueryModel();
				thisView.setModel(qParamsModel, "qProperty");
				qParamsModel.setProperty("/method", "GET");
				qParamsModel.setProperty("/command", "UDO_K2P_PROPERTY()?$inlinecount=allpages&$select=Code,Name");
				qParamsModel.setProperty("/data", data);
				qParamsModel.setProperty("/retry", false);
				qParamsModel.setProperty("/firstFetch", true);
				var queryParams = "";
				qParamsModel.setProperty("/queryParams", queryParams);
				K2PUtils.getpostputpatch(this, this.getPropertiesCallBack, null, this, "qProperty");

				/*					try {
						var s;
						var oNewRecord = JSON.parse(oModel.getJSON());
						var oBinding = oViewModel.oMaintTable.getBinding("
									items ");
						var oContext = oBinding.create(oNewRecord);

						oContext.created().then(function() {
							s = "
									OK ";
						}, function(oError) {
							s = oError.toString();
						});

					} catch (err) {
						s = err.toString();
					}*/

				//this.defaultNew();

			} catch (e) {
				var e1 = e;
				e1 = e1;
			}
		},
		getPropertiesCallBack: function(callingController, results) {
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel("qProperty");
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/errorCode");
			var retry = qParamsModel.getProperty("/retry");
			var component = callingController.getOwnerComponent();
			var i18n;
			if (errorCode === 0) {
				//no problem so try to refresh page data one last time
				var oResult = new sap.ui.model.json.JSONModel();
				oResult.setData(results);
				thisView.setModel(oResult, "propertyList");

				thisView.setBusy(false);

			} else {

				/*					if (!retry) {
						//first failure so try to login
						qParamsModel.setProperty("/retry", true);
						this.slLogin(callingController, callingController.onSubmitPayment);
					} else {*/
				//second try so issue error - avoid infinite loop
				thisView.setBusy(false);
				var message = "getProperties: " + error + " Code:" + errorCode.toString() + " status: " + status;
				callingController.errorDialogBox(component, "userLoginConnection", message, true);
				/*}*/
				//issue error
				var sMessage = "getProperties: " + error + " Code:" + errorCode.toString();
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				callingController.errorDialogBox(this, i18n, sMessage, true, null, status);
			}

		},

		onRequest: function() {
			this.getRouter().navTo("requestList");

		},
		onApproved: function() {
			this.getRouter().navTo("approvedList");

		},
		onInventory: function() {
			this.getRouter().navTo("inventoryList");

		},
		onAddTask: function() {

			try {
				var oModel = this.getOwnerComponent().getModel("workOrder");
				var s;
				var oTaskModel = models.createTaskModel();
				var oNewTask = JSON.parse(oTaskModel.getJSON());

				var taskItems = oModel.getProperty("/K2P_WO_TASKSCollection");
				var l = taskItems.length;

				var taskArray = {
					"value": taskItems
				};

				taskArray.push(oNewTask);
				oModel.setProperty("/K2P_WO_TASKSCollection", taskArray);

				/*
				var oTasksTable = this.byId("idTasksTable");

				var oBinding = oTasksTable.getBinding("items ");
				var oContext = oBinding.create(oNewRecord);

				this.fetchMain();

				oContext.created().then(function() {
					s = "OK ";
				}, function(oError) {
					s = oError.toString();
				});
*/
			} catch (e) {
				var e1 = e;
				e1 = e1;
			}
		},
		onSave: function() {
			/*			var oModel = this.getOwnerComponent().getModel("serviceLayer");
			if (oModel.add === true) {
				var thisView = this.getView("");
				var fnSuccess = function() {
					thisView.setBusy(false);
					//MessageToast.show(this._getText("
									changesSentMessage "));
					//this._setUIChanges(false);
				}.bind(this);

				var fnError = function(oError) {
					thisView.setBusy(false);
					//this._setUIChanges(false);
					var s = oError.message;
					s = s;
					//MessageBox.error(oError.message);
				}.bind(this);

				thisView.setBusy(true); // Lock UI until submitBatch is resolved.
				thisView.getModel().submitBatch("
									serviceLayer ").then(fnSuccess, fnError);
				//this._bTechnicalErrors = false; // If there were technical errors, a new save resets them.  
			}*/

		},
		_setUIChanges: function(bHasUIChanges) {
			if (this._bTechnicalErrors) {
				// If there is currently a technical error, then force 'true'.
				bHasUIChanges = true;
			} else if (bHasUIChanges === undefined) {
				bHasUIChanges = this.getView().getModel().hasPendingChanges();
			}
			var oModel = this.getView().getModel("appView ");
			oModel.setProperty(" / hasUIChanges ", bHasUIChanges);
		},

		onValueHelpRequest: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();

			if (!this._pValueHelpDialog) {
				this._pValueHelpDialog = Fragment.load({
					id: oView.getId(),
					name: "K2PPM_PM.K2PUtils.ProjectDialog",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._pValueHelpDialog.then(function(oDialog) {
				// Create a filter for the binding
				oDialog.getBinding("items").filter([new Filter("Name", FilterOperator.Contains, sInputValue)]);
				// Open ValueHelpDialog filtered by the input's value
				oDialog.open(sInputValue);
			});
		},

		onValueHelpSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Name", FilterOperator.Contains, sValue);

			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onValueHelpClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			oEvent.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			this.byId("ProjCode").setValue(oSelectedItem.getTitle());
		}

		/*	,	onErrorCall: function(oError) {
			if (oError.statusCode === "500" || oError.statusCode === 400 || oError.statusCode === "
									500 " || oError.statusCode === "
									400 ") {
				var errorRes = JSON.parse(oError.responseText);
				if (!errorRes.error.innererror) {
					sap.m.MessageBox.alert(errorRes.error.message.value);
				} else {
					if (!errorRes.error.innererror.message) {
						sap.m.MessageBox.alert(errorRes.error.innererror.toString());
					} else {
						sap.m.MessageBox.alert(errorRes.error.innererror.message);
					}
				}
				return;
			} else {
				sap.m.MessageBox.alert(oError.response.statusText);
				return;
			}

		}*/
	});



});