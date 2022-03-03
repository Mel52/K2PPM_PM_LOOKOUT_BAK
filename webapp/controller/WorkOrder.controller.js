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
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
	], function(BaseController, K2PUtils, models, JSONModel, ODataModel, Sorter, Filter, FilterOperator, FilterType, MessageBox, History,
	Fragment, Controller, MessageToast) {
	"use strict";

	return BaseController.extend("K2PPM_PM.controller.WorkOrder", {

		eventDataReceived: function(o) {
			var o1 = o;
			o1 = o1;
		},

		onInit: function() {

			var oRouter = this.getRouter();
			oRouter.getRoute("workOrder").attachMatched(this._onRouteMatched, this);

			var notesListModel = new JSONModel();
			var data = {
				"value": []
			};
			notesListModel.setData(data);
			this.getOwnerComponent().setModel(notesListModel, "notesList");

			var oUserModel = this.getOwnerComponent().getModel("userModel");
			var manager = oUserModel.getProperty("/value/0/U_K2P_WOManager");
			var workOrderViewModel = this.getOwnerComponent().getModel("workOrderView");
			if (manager === "Y") {
				workOrderViewModel.setProperty("manager", true);
				this.getView().byId("Status").setEnabled(true);
				this.getView().byId("btnComplete").setVisible(false);
			} else {
				workOrderViewModel.setProperty("manager", false);
				this.getView().byId("Status").setEnabled(false);
				this.getView().byId("btnComplete").setVisible(true);
			}

		},

		_onRouteMatched: function() {

			/*			var thisView = this.getView();
			var serviceLayerModel = this.getOwnerComponent().getModel("serviceLayer");
			thisView.setModel(serviceLayerModel, "serviceLayer");*/
			var oModel = this.getOwnerComponent().getModel("workOrderView");
			if (oModel.getProperty("/add")) {
				//add new record here
				this.getView().byId("btnSubmit").setVisible(true);
				this.getView().byId("btnRequest").setVisible(false);
				this.getView().byId("btnApproved").setVisible(false);
				this.getView().byId("btnPO").setVisible(false);
				this.getView().byId("btnAddNote").setVisible(false);
				this.getView().byId("btnInventory").setVisible(false);
				this.defaultNew();
			} else {
				this.getView().byId("btnSubmit").setVisible(true);
				this.getView().byId("btnRequest").setVisible(false);
				this.getView().byId("btnApproved").setVisible(false);
				this.getView().byId("btnInventory").setVisible(false);
				this.getView().byId("btnPO").setVisible(true);
				this.getView().byId("btnAddNote").setVisible(true);
				this.fetchMain();
			}
		},
		defaultNew: function() {
			//var thisView = this.getView();

			var oUserModel = this.getOwnerComponent().getModel("userModel");
			var user = oUserModel.getProperty("/value/0/UserCode");
			var userName = oUserModel.getProperty("/value/0/UserName");

			var newWOModel = this.createWorkOrderModel();
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
			var thisView = this.getView();

			var oViewModel = this.getOwnerComponent().getModel("workOrderView");
			var path = oViewModel.getProperty("/path");
			var data;
			//var surl = destination + "IncomingPayments";

			thisView.setBusy(true);
			// set the queryParams mode
			var qNameIn = "qWOFetch";
			var qParamsModel = models.createQueryModel();
			qParamsModel.setProperty("/method", "GET");
			qParamsModel.setProperty("/command", path);
			qParamsModel.setProperty("/data", data);
			qParamsModel.setProperty("/firstFetch", true);
			qParamsModel.setProperty("/queryParams", "");
			thisView.setModel(qParamsModel, qNameIn);
			K2PUtils.getpostputpatch(this, this.fetchMainCallback, null, this, qNameIn);

		},

		fetchMainCallback: function(callingController, result, callback2, oThis, qNameIn) {

			var workOrderModel = new sap.ui.model.json.JSONModel();
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			//var retry = qParamsModel.getProperty("/retry");
			var component = callingController.getOwnerComponent();
			var i18n;
			if (errorCode === 0) {
				workOrderModel.setData(result);
				component.setModel(workOrderModel, "workOrder");
				var docEntry = workOrderModel.getProperty("/DocEntry");
				var sFilter = "U_K2P_WODocEntry eq '" + docEntry + "'";
				var oParameters = {
					$filter: sFilter
				};
				var mRequestsTable = thisView.byId("requestsTable");
				var oBinding3 = mRequestsTable.getBinding("items");
				oBinding3.changeParameters(oParameters);
				//
/*				var mTablePO = thisView.byId("poTable");
				var oBinding4 = mTablePO.getBinding("items");
				oBinding4.changeParameters(oParameters);*/

				callingController.onRefreshNotes(callingController, docEntry);

				thisView.setBusy(false);
			} else {

				/*					if (!retry) {
						//first failure so try to login
						qParamsModel.setProperty("/retry", true);
						this.slLogin(callingController, callingController.onSubmitPayment);
					} else {*/
				//second try so issue error - avoid infinite loop
				thisView.setBusy(false);
				var sMessage = "fetchMainCallback: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},
		onRefreshNotes: function(callingController, docEntry) {
			var qNameIn = "qRefreshNotes";
			var qParamsModel = models.createQueryModel();
			qParamsModel.setProperty("/method", "GET");
			qParamsModel.setProperty("/command", "UDO_K2P_NOTES");
			//qParamsModel.setProperty("/data", null);
			qParamsModel.setProperty("/firstFetch", true);
			var params = "?$filter=U_DocEntry eq " + docEntry +
				"and U_DocType eq 'WORKORDER'&$select=DocEntry,U_CreateDt,U_UserCode,U_UserName,U_Note";
			params += "&$orderby=DocEntry desc";
			var queryParams = params;
			qParamsModel.setProperty("/queryParams", queryParams);
			callingController.getView().setModel(qParamsModel, qNameIn);
			K2PUtils.getpostputpatch(this, this.onRefreshNotesCallback, null, this, qNameIn);
		},

		onRefreshNotesCallback: function(callingController, results, callback2, oThis, qNameIn) {
			var notesListModel = new sap.ui.model.json.JSONModel();
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			//var retry = qParamsModel.getProperty("/retry");
			var component = callingController.getOwnerComponent();
			var i18n;
			if (errorCode === 0) {
				notesListModel.setData(results);
				component.setModel(notesListModel, "notesList");
				thisView.setBusy(false);
			} else {

				thisView.setBusy(false);
				var sMessage = "onRefreshNotesCallback: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},

		onSubmit: function(oEvent) {

			try {
				var thisView = this.getView();
				var oViewModel = this.getOwnerComponent().getModel("workOrderView");
				var workOrderModel = this.getOwnerComponent().getModel("workOrder");
				var data = workOrderModel.getJSON();
				var docEntry = workOrderModel.getProperty("/DocEntry");
				var status = workOrderModel.getProperty("/U_Status");
				var sId = oEvent.getParameter("id");

				if (!docEntry) {
					docEntry = 0;
				}

				var method, command;
				if (docEntry === 0) {
					method = "POST";
					command = "UDO_K2P_WORKORDER";
				} else {
					method = "PATCH";
					command = "UDO_K2P_WORKORDER(" + docEntry + ")";
					var pos = sId.search("btnComplete");
					if (pos !== -1) {
						if (status === "A") {
							workOrderModel.setProperty("/U_Status", "M");
						}
					}
				}

				//var surl = destination + "IncomingPayments";

				thisView.setBusy(true);
				// set the queryParams model
				var qParamsModel = models.createQueryModel();
				var qNameIn = "qWOSubmit";
				pos = sId.search("btnPO");
				if (pos !== -1) {
				  qNameIn = "qPOSubmit"; 
				}
				thisView.setModel(qParamsModel, qNameIn);
				qParamsModel.setProperty("/method", method);
				qParamsModel.setProperty("/command", command);
				qParamsModel.setProperty("/data", data);
				qParamsModel.setProperty("/retry", false);
				qParamsModel.setProperty("/firstFetch", true);
				qParamsModel.setProperty("/withCredentials", false);
				//withCredentials
				var queryParams = "";
				qParamsModel.setProperty("/queryParams", queryParams);
				K2PUtils.getpostputpatch(this, this.onSubmitCallback, null, this, qNameIn);

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
		onSubmitCallback: function(callingController, results, callback2, oThis, qNameIn) {
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var retry = qParamsModel.getProperty("/retry");
			var component = callingController.getOwnerComponent();
			var method = qParamsModel.getProperty("/method");
			var workOrderModel = new sap.ui.model.json.JSONModel();
			workOrderModel.setData(results);
			var i18n = "";
			if (errorCode === 0) {
				//no problem so try to refresh page data one last time
				thisView.setBusy(false);
				//callingController.fetchMain(callingController, false); //refresh Invoices

				if (method === "POST") {
					callingController.getOwnerComponent().setModel(workOrderModel, "workOrder");
					thisView.byId("btnPO").setVisible(true);
					thisView.byId("btnAddNote").setVisible(true);
				}
		
				//var params = {name: "workOrderList", refresh: "true"};
				MessageToast.show("Updated");
				thisView.setBusy(false);
				
				//switch to PO Form if from PO button. 
				if (qNameIn === "qPOSubmit") {
				    callingController.onPO();
				}
			} else {
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

				var oViewModel = this.getOwnerComponent().getModel("workOrderView");
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
		onAddNote: function() {
			var oWorkOrderViewModel = this.getOwnerComponent().getModel("workOrderView");
			var newNote = oWorkOrderViewModel.getProperty("/newNote");
			var thisView = this.getView();

			if (newNote !== "") {
				//add the note
				thisView.setBusy(true);
				var oUserModel = this.getOwnerComponent().getModel("userModel");
				var user = oUserModel.getProperty("/value/0/UserCode");
				var userName = oUserModel.getProperty("/value/0/UserName");
				var oWorkOrderModel = this.getOwnerComponent().getModel("workOrder");
				var docentry = oWorkOrderModel.getProperty("/DocEntry");
				var docnum = oWorkOrderModel.getProperty("/DocNum");
				var today = new Date();
				var sDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
				// set the queryParams mode
				var data = {
					"U_DocEntry": docentry,
					"U_DocNum": docnum,
					"U_DocType": "WORKORDER",
					"U_UserCode": user,
					"U_UserName": userName,
					"U_Note": newNote,
					"U_CreateDt": sDate
				};
				var qNameIn = "qAddNote";
				var qParamsModel = models.createQueryModel();
				qParamsModel.setProperty("/method", "POST");
				qParamsModel.setProperty("/command", "UDO_K2P_NOTES");
				qParamsModel.setProperty("/data", JSON.stringify(data));
				qParamsModel.setProperty("/firstFetch", true);
				qParamsModel.setProperty("/queryParams", "");
				thisView.setModel(qParamsModel, qNameIn);
				var callBack = this.onAddNoteCallBack;
				K2PUtils.getpostputpatch(this, callBack, null, this, qNameIn);
			}
		},
		onAddNoteCallBack: function(callingController, results, callback2, oThis, qNameIn) {
			var thisView = callingController.getView();
			var oWorkOrderModel = callingController.getOwnerComponent().getModel("workOrder");
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var docEntry = oWorkOrderModel.getProperty("/DocEntry");
			var i18n;
			if (errorCode !== "0") {
				//call refreshNotes
				var oWorkOrderViewModel = callingController.getOwnerComponent().getModel("workOrderView");
				oWorkOrderViewModel.setProperty("/newNote", "");
				callingController.onRefreshNotes(callingController, docEntry);
			} else //handle error
			{
				var sMessage = "onAddNoteCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},
		onAddTask: function() {

			var oWorkOrderModel = this.getOwnerComponent().getModel("workOrder");
			var technician = oWorkOrderModel.getProperty("/U_Technician");
			var techName = oWorkOrderModel.getProperty("/U_TechName");
			//U_TechName
			var objLines = oWorkOrderModel.getProperty("/K2P_WO_TASKSCollection");

			var newLine = {
				"U_Descr": "",
				"U_Details": "",
				"U_Technician": technician,
				"U_TechName": techName,
				"U_ScheduleDt": null,
				"U_StartDt": null,
				"U_EndDt": null,
				"U_Duration": 0.0
			};
			objLines.push(newLine);
			oWorkOrderModel.setProperty("/K2P_WO_TASKSCollection", objLines);
			/*			var sIndex = objLines.length - 1;
			var comboId = "nav---workOrder--techCombo1-nav---workOrder--idTasksTable-0-" + sIndex;
			var combo = this.getView().byId(comboId);
			combo.setSelectedKey(technician);*/
		},
		onDeleteLine: function(oEvent) {

			var oWorkOrderModel = this.getOwnerComponent().getModel("workOrder");
			var objLines = oWorkOrderModel.getProperty("/K2P_WO_TASKSCollection");
			var sId = oEvent.getParameter("id");
			var sArray = sId.split("-");
			var sIndex = sArray[sArray.length - 1];
			objLines.splice(sIndex, 1);
			oWorkOrderModel.setProperty("/K2P_WO_TASKSCollection", objLines);
			this.getView().setBusy(false);

		},
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
			var id = oEvent.getParameter("id");
			var sKeyName;

			switch (id) {

				case "DialogTenant--selectTenant":

					sKeyName = "CardName";
					break;
			}
			var oFilter = new Filter(sKeyName, FilterOperator.StartsWith, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onValueHelpClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var id = oEvent.getParameter("id");
			var sArray = id.split("-");
			var sIndex = sArray[sArray.length - 1];

			var oWorkOrderModel = this.getOwnerComponent().getModel("workOrder");
			var oThis = this;
			if (!oSelectedItem) {
				return;
			}
			var sTitle;
			try {
				sTitle = oSelectedItem.getTitle();
			} catch (e)
			//skip error
			{}

			switch (id) {

				case "DialogTenant--selectTenant":

					oWorkOrderModel.setProperty("/U_CardName", sTitle);
					var tenantCode = oSelectedItem.getDescription();
					oWorkOrderModel.setProperty("/U_CardCode", tenantCode);
					var qParams = "?$filter=U_CardCode eq \'" + tenantCode + "\'&$orderby=DocNum desc";
					K2PUtils.getByPath(this, "UDO_K2P_LEASE", qParams, oThis.leaseCallBack, "qparamsTenant", sIndex);
					break;

			}
		},
		leaseCallBack: function(callingController, results, callback2, oThis, qNameIn) {

			var thisView = callingController.getView();
			var oWorkOrderModel = thisView.getModel("workOrder");
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			oWorkOrderModel.setProperty("/U_Lease", null);
			oWorkOrderModel.setProperty("/U_Unit", null);

			var i18n;
			if (errorCode === 0) {

				var oResult = new sap.ui.model.json.JSONModel();
				oResult.setData(results);
				var valueArray = oResult.getProperty("/value");
				if (valueArray.length > 0) {

					//var sProperty = oResult.getProperty("/value/0/U_Property");
					//oWorkOrderModel.setProperty(sPath + "/U_K2P_Property", sProperty);
					oWorkOrderModel.setProperty("/U_Lease", oResult.getProperty("/value/0/DocNum"));
					//oPurchaseOrderModel.setProperty(sPath + "/U_K2P_PropertyName", null);
					oWorkOrderModel.setProperty("/U_Unit", oResult.getProperty("/value/0/U_UnitID"));

				}

			} else //handle error
			{
				var sMessage = "oWorkOrderModel: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},

		onValueHelpRequestTenant: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();
			/*var oBinding = oEvent.getSource().getBinding("items");
				oBinding.path = "/UDO_K2P_PROPERTY";
*/
			if (!this._pValueHelpDialogTenant) {
				this._pValueHelpDialogTenant = Fragment.load({
					id: "DialogTenant", //oView.getId(),
					name: "K2PPM_PM.K2PUtils.TenantDialog",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._pValueHelpDialogTenant.then(function(oDialog) {
				// Create a filter for the binding
				oDialog.getBinding("items").filter([new Filter("CardName", FilterOperator.StartsWith, sInputValue)]);
				// Open ValueHelpDialog filtered by the input's value
				oDialog.open(sInputValue);
			});
		},

		createWorkOrderModel: function() {
			var today = new Date();
			var sDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

			var data = {
				"DocNum": 0,
				"U_Type": "R",
				"U_Descr": "",
				"U_Details": "",
				"U_Status": "P",
				"U_Priority": "M",
				"U_CreateDt": sDate,
				"U_StartDt": "",
				"U_EndDt": "",
				"U_CardCode": "",
				"U_CardName": "",
				"U_Property": "",
				"U_Lease": "",
				"U_Unit": "",
				"U_EstHrs": "",
				"U_ActHrs": "",
				"U_Manager": "",
				"U_Technician": "",
				"U_ProjCode": "",
				"U_CreateBy": "",
				//"U_CreateByName" : "",
				"K2P_WO_TASKSCollection": []
			};
			var oModel = new JSONModel(data);
			oModel.setDefaultBindingMode("TwoWay");

			return oModel;
		},
		onSuggestionItemSelectedTenant: function(oEvent) {
		    //
		    this.getView().setBusy(true);
			var oItem = oEvent.getParameter("selectedRow");
			var oCells = oItem.getCells();
			var oCell = oCells[0];
			//var name = oCell.getText();
			oCell = oCells[1];
			var lease = oCell.getText();
			oCell = oCells[2];
			var unit = oCell.getText();
			oCell = oCells[3];
			var code = oCell.getText();

			var oWorkOrderModel = this.getView().getModel("workOrder");
			oWorkOrderModel.setProperty("/U_Unit", unit);
			oWorkOrderModel.setProperty("/U_CardCode", code);
			oWorkOrderModel.setProperty("/U_Lease", lease);
			this.getView().setBusy(false);
		},
		onSuggestionItemSelectedProjCode: function(oEvent) {
			this.getView().setBusy(true);
			var oItem = oEvent.getParameter("selectedRow");
			var oCells = oItem.getCells();
			var oCell = oCells[0];
			var projCode = oCell.getText();

			var path = "ProjectManagements";
			//lookup the property for this project
			var qParams = "?$filter=FinancialProject eq \'" + projCode + "\'&$select=DocNum,U_K2P_DIM3";
			K2PUtils.getByPath(this, path, qParams, this.projectCodeCallBack, "qProjCode", -1);
			//var sProject = oCell.getText();

			/*			var oPurchaseOrderModel = this.getView().getModel("purchaseOrder");
			oPurchaseOrderModel.setProperty("/U_K2P_Property", property);

			var path = "UDO_K2P_PROPERTY(\'" + property + "\')";
			var qParams = "?$select=Code,Name,U_Addr1,U_Addr2,U_City,U_State,U_Country";
			K2PUtils.getByPath(this, path, qParams, this.propertyCallBack1, "qParamsProperty1", null);

		},onSuggestionItemSelectedProjCode1: function(oEvent) {
			this.getView().setBusy(true);
			var oItem = oEvent.getParameter("selectedItem");
			var sProjectCode = oItem.getText();
			var path = "ProjectManagements";
			//lookup the property for this project
			var qParams = "?$filter=FinancialProject eq \'" + sProjectCode + "\'&$select=DocNum,U_K2P_DIM3";
			K2PUtils.getByPath(this, path, qParams, this.projectCodeCallBack, "qProjCode", -1);
			//populate property code and manager
		*/
		},
		projectCodeCallBack: function(callingController, results, callback2, oThis, qNameIn) {

			var thisView = callingController.getView();
			var oWorkOrderModel = callingController.getOwnerComponent().getModel("workOrder");
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			/*			var sIndex = qParamsModel.getProperty("/index");
			var sPath = "/DocumentLines/" + sIndex;*/

			var i18n;
			if (errorCode !== "0") {

				var oResult = new sap.ui.model.json.JSONModel();
				oResult.setData(results);
				var propertyCode = "";
				var valueArray = oResult.getProperty("/value");
				if (valueArray.length > 0) {
					propertyCode = oResult.getProperty("/value/0/U_K2P_DIM3");
					if (!propertyCode) {
						propertyCode = "";
					}
					oWorkOrderModel.setProperty("/U_Property", propertyCode);
					if (propertyCode !== "") {
						//rebind the tenant look up list.
						var oTenant = thisView.byId("Tenant");
						var oBinding = oTenant.getBinding("suggestionRows");
						var sFilter = "U_Property eq \'" + propertyCode + "\'";
						var oParameters = {
							$filter: sFilter
						};
						oBinding.changeParameters(oParameters);

						//look up the manager for this property
						var path = "UDO_K2P_PROPERTY('" + propertyCode + "')";
						var qParams = "?$select=U_Manager, Code, Name";
						K2PUtils.getByPath(callingController, path, qParams, callingController.getManagerCodeCallBack, "qManager", -1);
					}
				}
				thisView.setBusy(false);

			} else //handle error
			{
				var sMessage = "projectCodeCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}

		},
		getManagerCodeCallBack: function(callingController, results, callback2, oThis, qNameIn) {

			var thisView = callingController.getView();
			var oWorkOrderModel = callingController.getOwnerComponent().getModel("workOrder");
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			/*			var sIndex = qParamsModel.getProperty("/index");
			var sPath = "/DocumentLines/" + sIndex;*/

			var i18n;
			if (errorCode !== "0") {

				var oResult = new sap.ui.model.json.JSONModel();
				oResult.setData(results);
				var managerCode = "";
				managerCode = oResult.getProperty("/U_Manager");
				var propertyName = oResult.getProperty("/Name");
				var propertyCode = oResult.getProperty("/Code");
				
				oWorkOrderModel.setProperty("/U_PropertyName",propertyName);
				oWorkOrderModel.setProperty("/U_Property",propertyCode);

				if (!managerCode) {
					managerCode = "";
				}
				var managerCombo = thisView.byId("managerCombo");
				managerCombo.setSelectedKey(managerCode);

				//oWorkOrderModel.setProperty("/U_Manager", managerCode);
				thisView.setBusy(false);

			} else //handle error
			{
				var sMessage = "getManagerCodeCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}

		},
		onPO: function() {
		    //Gets Called after saving the work order
		    this.getOwnerComponent().setModel(models.creatPurchaseOrderViewModel(), "purchaseOrderView");
			var oWorkOrderModel = this.getOwnerComponent().getModel("workOrder");
			var purchaseOrderViewModel = this.getOwnerComponent().getModel("purchaseOrderView");
			var docentry = oWorkOrderModel.getProperty("/DocEntry");
			var docnum = oWorkOrderModel.getProperty("/DocNum");
			purchaseOrderViewModel.setProperty("/U_K2P_WODocEntry", docentry);
			purchaseOrderViewModel.setProperty("/U_K2P_WODocNum", docnum);
			purchaseOrderViewModel.setProperty("/add", true);
			purchaseOrderViewModel.setProperty("/approved", false); //"workOrder"
			purchaseOrderViewModel.setProperty("/navBack", "workOrder");
			this.getRouter().navTo("purchaseOrder");

		},
		onNavBack: function() {
			var oModel = this.getOwnerComponent().getModel("workOrderView");
			var navBack = oModel.getProperty("/navBack");
			if (!navBack) {
				navBack = "home";
			}
			this.getRouter().navTo(navBack);
		},
		onManagerComboChange: function(oEvent) {
			var Item = oEvent.getParameter("selectedItem");
			var key = Item.getKey();
			//var text = Item.getText();
			var oWorkOrderModel = this.getOwnerComponent().getModel("workOrder");
			oWorkOrderModel.setProperty("/U_Manager", key);
		},

		onTechComboChange: function(oEvent) {
			var Item = oEvent.getParameter("selectedItem");
			var key = Item.getKey();
			//var text = Item.getText();
			var oWorkOrderModel = this.getOwnerComponent().getModel("workOrder");
			oWorkOrderModel.setProperty("/U_Technician", key);
		},

		onTechComboChange1: function(oEvent) {
			var Item = oEvent.getParameter("selectedItem");
			var key = Item.getKey();
			//var text = Item.getText();
			var sId = oEvent.getParameter("id");
			var sIdCode = sId.replace("techCombo1", "techCode1");
			var oInput = this.getView().byId(sIdCode);
			oInput.setValue(key);

		},
		onLineDurationChange: function() {
		    
		    var workOrderModel = this.getOwnerComponent().getModel("workOrder");
			K2PUtils.resetTotal(workOrderModel, "/K2P_WO_TASKSCollection", "/U_ActHrs", "/U_Duration");

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