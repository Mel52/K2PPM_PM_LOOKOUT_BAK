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
	"sap/m/MessageToast",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment",
	"sap/ui/core/mvc/Controller"
	], function(BaseController, K2PUtils, models, JSONModel, ODataModel, Sorter, Filter, FilterOperator, FilterType, MessageBox, MessageToast,
	History,
	Fragment, Controller) {
	"use strict";

	return BaseController.extend("K2PPM_PM.controller.Maintenance", {

		onDataReceived: function(oEvent) {
			var params = oEvent.getParameters();

			if (params.error) {
				sap.m.MessageBox.alert(params.error.toString());
			} else {
				var d = oEvent;
				d = d;
			}
		},

		onDataReceivedProject1: function(oEvent) {
			var params = oEvent.getParameters();
			var source = oEvent.getSource();
			if (params.error) {
				sap.m.MessageBox.alert(params.error.toString());
			} else {
				var d = oEvent;
				d = d;
			}
		},

		onDataStateChangeProject1: function(data, error) {
			if (error) {
				sap.m.MessageBox.alert(error.toString());
			} else {
				var d = data;
				d = d;
			}
		},

		/*
		onChange: function(data, error) {
			if (error) {
				sap.m.MessageBox.alert(error.toString());
			} else {
				var d = data;
				d = d;
			}
		},
		onDataRequested: function(data, error) {
			if (error) {
				sap.m.MessageBox.alert(error.toString());
			} else {
				var d = data;
				d = d;
			}
		},
		onDataStateChange: function(data, error) {
			if (error) {
				sap.m.MessageBox.alert(error.toString());
			} else {
				var d = data;
				d = d;
			}
		},
*/
		onInit: function() {

			var oRouter = this.getRouter();
			oRouter.getRoute("purchaseOrder").attachMatched(this._onRouteMatched, this);

			this.getView().setModel(models.createQueryModel(), "qParams");

			//var serviceLayerModel = this.getOwnerComponent().getModel("serviceLayer");
			//this.getView().setModel(serviceLayerModel);

			//this.getProperties();

			//var dfltModel = this.getOwnerComponent().getModel("serviceLayer");

			//this.getView().setModel(dfltModel);

			//this._bTechnicalErrors = false;

		},

		onBeforeRendering: function() {

		},

		onAfterRendering: function() {

		},

		_onViewDisplay: function() {

		},

		onListItemPressed: function() {

		},

		_onRouteMatched: function() {

			/*			var thisView = this.getView();
			var serviceLayerModel = this.getOwnerComponent().getModel("serviceLayer");
			thisView.setModel(serviceLayerModel, "serviceLayer");*/
			var thisView = this.getView();
			/*			var serviceLayerBatchModel = this.getOwnerComponent().getModel("serviceLayerBatch");
			thisView.setModel(serviceLayerBatchModel);*/
			thisView.setBusy(true);
			var oVendor = thisView.byId("Vendor");
			var oPurchaseOrderID = thisView.byId("purchaseOrderID");

			var oViewModel = this.getOwnerComponent().getModel("purchaseOrderView");
			var add = oViewModel.getProperty("/add");
			if (add === true) {
				//add new record here
				oVendor.editable = true;
				oPurchaseOrderID.visible = false;
				this.defaultNew();
			} else {
				oVendor.editable = false;
				oPurchaseOrderID.visible = true;
				this.fetchMain();
			}

			thisView.setBusy(false);
		},
		defaultNew: function() {
			var thisView = this.getView();

			var oUserModel = this.getOwnerComponent().getModel("userModel");
			var user = oUserModel.getProperty("/value/0/UserCode");
			var userName = oUserModel.getProperty("/value/0/UserName");
			var today = new Date();
			var sDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

			var newPOModel = models.createPurchaseOrderModel();
			newPOModel.setProperty("/U_K2P_User", user);
			newPOModel.setProperty("/U_CreateByName", userName);
			newPOModel.setProperty("/DocDate", sDate);
			newPOModel.setProperty("/DocDueDate", sDate);

			this.getOwnerComponent().setModel(newPOModel, "purchaseOrder");

			this.onAddItem();
			thisView.setBusy(false);

			/*
			var oList = thisView.getModel().bindList("/PurchaseOrders");
			var data = newPOModel.getData();
			var oNewContext = oList.create(data);
			//Create new binding here
			var oBinding = {};
			oBinding.path = oNewContext.getPath();
			oBinding.parameters = {
				"$$updateGroupId": "UpdateGroup1"
			};
			
		
			
			
			var VBox = thisView.byId("VBox");
			VBox.bindElement(oBinding);
			//thisView.setBusy(false);
						var oBinding = VBox.getBinding();
           
            var oContext = oBinding.create(newPOModel);
            
            var s = oContext.path;
            
            s = s;
            
            
			var oMainTable = this.getView().byId("idMainTable");
			var oBinding = oMainTable.getBinding("items");
			var newPOModel = models.createPurchaseOrderModel();
			newPOModel.setProperty("/U_CreateBy", user);
			newPOModel.setProperty("/U_CreateByName", userName);
			var oContext = oBinding.create(newPOModel);
			var oViewModel = this.getOwnerComponent().getModel("purchaseOrderView");
			oViewModel.path = oContext.getPath();*/

			//this.getOwnerComponent().setModel(newPOModel, "purchaseOrder");

		},
		fetchMain: function() {

			var oViewModel = this.getOwnerComponent().getModel("purchaseOrderView");
			var path = oViewModel.getProperty("/path");
			var data;

			var oData4 = false;

			if (oData4) {
				/*
				var oBinding = {};
				oBinding.path = path;
				oBinding.parameters = {
					"$$updateGroupId": "UpdateBatchGroup1"
				};
				oBinding.events = {
					dataReceived: this.onDataReceived
				};
				var VBox = this.byId("VBox");
				//var VBox = this.getView.byId("VBox");
				VBox.bindElement(oBinding);
				this.getView().setBusy(false);*/

			} else //!oData4
			{

				// set the queryParams model
				var qParamsModel = models.createQueryModel();
				qParamsModel.setProperty("/method", "GET");
				qParamsModel.setProperty("/command", path);
				qParamsModel.setProperty("/data", data);
				qParamsModel.setProperty("/firstFetch", true);
				var queryParams = "";
				qParamsModel.setProperty("/queryParams", queryParams);
				this.getView().setModel(qParamsModel, "qPOSubmit");
				K2PUtils.getpostputpatch(this, this.fetchMainCallback, null, this, "qPOSubmit");

			}

		},

		fetchMainCallback: function(callingController, result, callback2, oThis) {

			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel("qPOSubmit");
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var retry = qParamsModel.getProperty("/retry");
			var component = callingController.getOwnerComponent();
			var i18n;
			if (errorCode === 0) {
				var oResultModel = new sap.ui.model.json.JSONModel();
				oResultModel.setData(result);
				component.setModel(oResultModel, "purchaseOrder");
				var oViewModel = callingController.getOwnerComponent().getModel("purchaseOrderView");
				var docTotal = oResultModel.getProperty("/DocTotal");
				oViewModel.setProperty("/lastTotal", docTotal);
				/*				
				var workOrderModel = component.getModel("workOrder");
				var taskArray = oModel.getProperty("/K2P_WO_TASKSCollection");
                var taskModel = {"value" : taskArray};
				
				 Does not seem to work
                    var oBinding = oTable.getBinding("items");
                   oBinding.setModel(oModel);
				
					var oTable = thisView.byId("idTasksTable");
	                oTable.setModel(taskModel);
	               MessageToast.show(K2PUtils.geti18n(callingController, "purchaseOrderCreated"));
	                
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
		onApprove: function() {
		    //confirm
		    //check this users approval limit
		    //if good then promote Draft to PO
		    //if not then issue message
		}
		//getUserRole
		onSubmit: function() {
			var purchaseOrderModel = this.getOwnerComponent().getModel("purchaseOrder");
			var totalAmount = K2PUtils.resetTotal(purchaseOrderModel, "/DocumentLines", "/DocTotal", "/LineTotal");
			var userModel = this.getOwnerComponent().getModel("userModel");
			var userCode = userModel.getProperty("/value/0/UserCode");

			var sItems = "/DocumentLines";
			var property = purchaseOrderModel.getProperty(sItems + "/0/U_K2P_Property");
			var project = purchaseOrderModel.getProperty(sItems + "/0/ProjectCode");
			var ladder = purchaseOrderModel.getProperty("/U_K2P_Ladder");

			//populate header with codes from line1
			var aItemArray;
			aItemArray = purchaseOrderModel.getProperty(sItems);
			var itemDescription;
			var comments = purchaseOrderModel.getProperty("/Comments");
			//purchaseOrderModel.setProperty("U_K2P_Ladder", ladder);
			//purchaseOrderModel.setProperty("U_K2P_Property", propertyCode);
			var propertyName = purchaseOrderModel.getProperty(sItems + "/0/U_K2P_PropertyName");
			purchaseOrderModel.setProperty("U_K2P_PropertyName", propertyName);
			purchaseOrderModel.setProperty("U_K2P_ProjCode", project);

			//if tenantname blank then blank out U_K2P_Tenant - do also in loop below
			var sTenant = purchaseOrderModel.getProperty(sItems + "/0/U_K2P_Tenant");
			var sTenantName = purchaseOrderModel.getProperty(sItems + "/0/U_K2P_TenantName");
			if (!sTenantName) {
				sTenant = "";
			} else {
				sTenant = purchaseOrderModel.getProperty(sItems + "/0/U_K2P_Tenant");
			}

			//populate the comments from the first line if blank
			if (!comments) {
				itemDescription = purchaseOrderModel.getProperty(sItems + "/0/ItemDescription");
				purchaseOrderModel.setProperty("/Comments", itemDescription);
			}
			purchaseOrderModel.setProperty("/U_K2P_Tenant", sTenant);
			purchaseOrderModel.setProperty("/U_K2P_TenantName", sTenantName);
			//set the ladder on each line
			var i;
			for (i = 0; i < aItemArray.length; i++) {
				//purchaseOrderModel.setProperty("U_K2P_ProjCode", ladder);
				purchaseOrderModel.setProperty("/DocumentLines/" + i.toString() + "/U_K2P_Ladder", ladder);
				//purchaseOrderModel.setProperty("/DocumentLines/" + i.toString() + "/U_K2P_ProjCode", project);
			}

			var qParamsModel = models.createQueryModel();
			this.getView().setModel(qParamsModel, "qUserRole");
			qParamsModel.setProperty("/method", "GET");
			qParamsModel.setProperty("/command", "/UDO_K2P_APRV_USERS");
			qParamsModel.setProperty("/data", null);
			qParamsModel.setProperty("/retry", false);
			qParamsModel.setProperty("/firstFetch", true);
			qParamsModel.setProperty("/withCredentials", false);
			//withCredentials
			var queryParams = "?$select=U_Role&$filter=U_Ladder eq \'" + ladder + "\'  and U_UserCode eq \'" + userCode + "\'";
			queryParams += " and U_Property eq \'" + property + "\'  and U_Project eq \'" + project + "\'";
			qParamsModel.setProperty("/queryParams", queryParams);
			K2PUtils.getpostputpatch(this, this.getUserRoleCallBack, null, this, "qUserRole");

		},
		getUserRoleCallBack: function(callingController, results, callback2, oThis) {

			var thisView = callingController.getView();
			var oPurchaseOrderModel = callingController.getOwnerComponent().getModel("purchaseOrder");
			var oViewModel = callingController.getOwnerComponent().getModel("purchaseOrderView");
			var ladder = oPurchaseOrderModel.getProperty("/U_K2P_Ladder");
			var qParamsModel = thisView.getModel("qUserRole");
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var sIndex = qParamsModel.getProperty("/index");
			var i18n;
			if (errorCode !== "0") {

				var oResult = new sap.ui.model.json.JSONModel();
				var role;
				oResult.setData(results);
				var valueArray = oResult.getProperty("/value");
				if (valueArray.length > 0) {
					role = oResult.getProperty("/value/0/U_Role");
				}

				oViewModel.setProperty("/role", role);
				oViewModel.setProperty("/approvalLimit", 0.00);

				if (role) {
					//get the approved amount for this roll
					var path = "UDO_K2P_APRV_LINES";
					var qparams = "?$filter=U_Ladder eq \'" + ladder + "\' and U_Role eq \'" + role + "\'";
					K2PUtils.getByPath(oThis, path, qparams, callingController.paramsLineCallBack, "qparamsLine", sIndex);
				} else {
					//create as unapproved draft - no role found for this user - approvalLimit = 0.00
					callingController.addOrUpdate(callingController);
				}

			} else //handle error
			{
				var sMessage = "tenantCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},
		paramsLineCallBack: function(callingController, results, callbackOrigin) {
			var thisView = callingController.getView();
			//var oPurchaseOrderModel = thisView.getModel("purchaseOrder");
			var oViewModel = callingController.getOwnerComponent().getModel("purchaseOrderView");
			var qParamsModel = thisView.getModel("qparamsLine");
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var approvalLimit = 0;
			if (errorCode === 0) {
				var oResult = new sap.ui.model.json.JSONModel();
				oResult.setData(results);
				var valueArray = oResult.getProperty("/value");
				if (valueArray.length > 0) {
					approvalLimit = oResult.getProperty("/value/0/U_Amt");
					//oViewModel.approvalLimit = approvalLimit;
					oViewModel.setProperty("/approvalLimit", approvalLimit);
					callingController.getOwnerComponent().setModel(oViewModel, "purchaseOrderView");
					callingController.addOrUpdate(callingController);
				}
			} else //handle error
			{
				var sMessage = "paramsLineCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				oViewModel.setProperty("/approvalLimit", approvalLimit);
				thisView.setBusy(false);
				//i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, "", sMessage, true, null, status);
				thisView.setBusy(false);
			}
		},
		addOrUpdate: function(callingController) {
			var purchaseOrderModel = callingController.getOwnerComponent().getModel("purchaseOrder");
			var oViewModel = callingController.getOwnerComponent().getModel("purchaseOrderView");
			var totalAmount = K2PUtils.resetTotal(purchaseOrderModel, "/DocumentLines", "/DocTotal", "/LineTotal");
			var approvalLimit = oViewModel.getProperty("/approvalLimit");
			var bDraft;
			//is this a draft?
			if (oViewModel.approved) {
				//need to set before oViewModel.approved is changed!
				bDraft = false;
			} else {
				bDraft = true;
			}

			if (totalAmount <= approvalLimit) {
				oViewModel.setProperty("/approved", true);
			} else {
				oViewModel.setProperty("/approved", false);
			}
			var docEntry = purchaseOrderModel.getProperty("/DocEntry");

			//Check the users role for this ladder
			/*			var userCode =  purchaseOrderModel.getProperty("/U_K2P_User");
			var sFilter2 = "?$filter=U_Property eq \'" + propertyCode + "\' and U_Project eq \'" + project + "\' and U_Ladder eq \'" + ladder +
							"\' and U_UserCode eq \'" + userCode + "\'";
			var qParamsModel = models.createQueryModel();
			qParamsModel.setProperty("/method", "GET");
			qParamsModel.setProperty("/command", "UDO_K2P_APRV_USERS");
			//qParamsModel.setProperty("/data", null);
			qParamsModel.setProperty("/firstFetch", true);
			var params = sFilter;
			//params = "?$select=DocEntry,U_Ladder,U_Role,U_Amt&$orderby=U_Amt&$filter=U_Ladder eq '" + skey + "'";
			var queryParams = params;
			qParamsModel.setProperty("/queryParams", queryParams);
			this.getView().setModel(qParamsModel, "qParamsLines");
			K2PUtils.getpostputpatch(this, this.fetchMainCallback, null, this, "qParamsLines");
*/

			/*newPOModel.setProperty("/U_CreateBy", user);
			
			U_K2P_UnitID
			
			
			//Look up the approval limit for this user for this ladder, project, 
			//If PO under this users approval limit for this ladder then create po else draft.
/*			var action = this.validatePO();
			switch (action) {
				case MessageBox.Action.YES:
					//
					bDraft = false;
					break;
				case MessageBox.Action.NO:
					//
					bDraft = true;
					break;
				case MessageBox.Action.CANCEL:
					//
					return;
					//break;
			}*/

			try {
				/*
				var oData4 = false;
				if (oData4) {
					var newPOModel = this.getOwnerComponent().getModel("purchaseOrder");
					var oMainTable = this.byId("idMainTable");
					var oBinding = oMainTable.getBinding("items"); //This gets the list Binding
					var oNewContext = oBinding.create(newPOModel);
					var oModel = this.getView().getModel();
					oModel.submitBatch("UpdateBatchGroup1");
				}
				
				else
				{*/

				var thisView = callingController.getView();
				var method, command, strDocEntry;
				if (oViewModel.add === true) {
					method = "POST";
					//Check to see if this user has enough approval authorization
					//Change data as needed
					//command = "Drafts()";
					if (!oViewModel.approved) {
						//create approval draft
						command = "Drafts()";
					} else {
						command = "PurchaseOrders()";
					}
				} else {
					method = "PATCH";
					strDocEntry = "(" + docEntry + ")";
					if (bDraft) {
						//create approval draft
						command = "Drafts" + strDocEntry;
					} else {
						command = "PurchaseOrders" + strDocEntry;
					}
				}

				var data = purchaseOrderModel.getJSON();
				//var surl = destination + "IncomingPayments";

				thisView.setBusy(true);
				// set the queryParams model
				var qParamsModel = models.createQueryModel();
				thisView.setModel(qParamsModel, "qPOSubmit");
				qParamsModel.setProperty("/method", method);
				qParamsModel.setProperty("/command", command);
				qParamsModel.setProperty("/data", data);
				qParamsModel.setProperty("/retry", false);
				qParamsModel.setProperty("/firstFetch", true);
				qParamsModel.setProperty("/withCredentials", false);
				//withCredentials
				var queryParams = "";
				qParamsModel.setProperty("/queryParams", queryParams);
				K2PUtils.getpostputpatch(this, callingController.onSubmitCallback, null, this, "qPOSubmit");

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

				//}

			} catch (e) {
				K2PUtils.errorDialogBox(callingController, "", e.message, true, null, status);
				thisView.setBusy(false);
			}
		},
		onSubmitCallback: function(callingController, results, callback2, oThis) {
			var oViewModel = callingController.getOwnerComponent().getModel("purchaseOrderView");
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel("qPOSubmit");
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var retry = qParamsModel.getProperty("/retry");
			var component = callingController.getOwnerComponent();
			var i18n;
			if (errorCode === 0) {
				//no problem so try to refresh page data one last time
				if (oViewModel.add === true) {
					var oResult = new sap.ui.model.json.JSONModel();
					oResult.setData(results);
					component.setModel(oResult, "purchaseOrder");
					oViewModel.add = false;
					var oVendor = thisView.byId("Vendor");
					var oPurchaseOrderID = thisView.byId("purchaseOrderID");
					oVendor.editable = false;
					oPurchaseOrderID.visible = true;
					thisView.setBusy(false);
				}

				/*
				//callingController.fetchMain(callingController, false); //refresh Invoices
				var oHistory, sPreviousHash;
				oHistory = History.getInstance();
				sPreviousHash = oHistory.getPreviousHash();
				//var params = {name: "maintenanceList", refresh: "true"};
				var oViewModel = callingController.getOwnerComponent().getModel("maintenanceView");
				oViewModel.setProperty("/refresh", true);
				callingController.getRouter().navTo("maintenanceList");
								if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					callingController.getRouter().navTo("", {}, true );
				//}*/
			} else {

				/*					if (!retry) {
						//first failure so try to login
						qParamsModel.setProperty("/retry", true);
						this.slLogin(callingController, callingController.onSubmitPayment);
					} else {*/
				//second try so issue error - avoid infinite loop
				//thisView.setBusy(false);
				////
				//var message = "onSubmitCallback: " + error + " Code:" + errorCode.toString() + " status: " + status;
				//callingController.errorDialogBox(component, "WorkOrder", message, true);*/

				//issue error
				//var sMessage = "onSubmitCallback: " + error + " Code:" + errorCode.toString();
				thisView.setBusy(false);
				var sMessage = "onSubmitCallback: " + error + " Code:" + errorCode.toString() + " status: " + status;
				i18n = "serviceLayerStatus";
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
				//function(oComponent, i18nMsg, message, bFullMsg, callBack) {

				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");

			}
		},
		validatePO: function() {
			MessageBox.show(
				"This message should appear in the message box.", {
					icon: MessageBox.Icon.QUESTION,
					title: "Create PO?",
					actions: [MessageBox.Action.YES, MessageBox.Action.NO, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.YES,
					onClose: function(oAction) {

						return oAction;
					}

				});

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

		onAddItem: function() {

			try {
				var purchaseOrderModel = this.getOwnerComponent().getModel("purchaseOrder");
				var objLines = purchaseOrderModel.getProperty("/DocumentLines");
				var newLine = models.createPurchaseOrderLine();
				var localModel = this.getOwnerComponent().getModel("local");
				var dfTaxCd = localModel.getProperty("/dfTaxCd");
				newLine.TaxCode = dfTaxCd;
				objLines.push(newLine);
				var DocumentLinesTable = this.getView().byId("DocumentLines");
				var oBinding = DocumentLinesTable.getBinding("items"); //This gets the list Binding
				oBinding.refresh();

			} catch (e) {
				var e1 = e;
				e1 = e1;
			}
		},

		/*		onAddItem: function() {
			try {
				var purchaseOrderModel = this.getOwnerComponent().getModel("purchaseOrder");
				var objLines = purchaseOrderModel.getProperty("/DocumentLines");
				//var obj = JSON.parse(data)
				var newLine = models.createPurchaseOrderLine();
				objLines.push(newLine);
				var DocumentLinesTable = this.getView().byId("DocumentLines");
				var oBinding = DocumentLinesTable.getBinding("items"); //This gets the list Binding
				oBinding.refresh();
				/*
				var lineItems = purchaseOrderModel.getProperty("DocumentLines");
				var l = lineItems.length;
				var taskArray = {
					"value": taskItems
				};
				taskArray.push(oNewTask);
				oModel.setProperty("/K2P_WO_TASKSCollection", taskArray);
			
				var oTasksTable = this.byId("idTasksTable");
				var oBinding = oTasksTable.getBinding("items ");
				var oContext = oBinding.create(oNewRecord);
				this.fetchMain();
				oContext.created().then(function() {
					s = "OK ";
				}, function(oError) {
					s = oError.toString();
				});
			} catch (e) {
				var e1 = e;
				e1 = e1;
			}
		},*/

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

			var sourceID = oEvent.getParameter("id");
			var indexArray = sourceID.split("-");
			var lineIndex = indexArray[indexArray.length - 1];

			if (!this._pValueHelpDialog) {
				this._pValueHelpDialog = Fragment.load({
					id: "Dialog1", //oView.getId(),
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

		onValueHelpRequestProperty: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();
			/*var oBinding = oEvent.getSource().getBinding("items");
				oBinding.path = "/UDO_K2P_PROPERTY";
*/
			if (!this._pValueHelpDialog2) {
				this._pValueHelpDialog2 = Fragment.load({
					id: "Dialog2", //oView.getId(),
					name: "K2PPM_PM.K2PUtils.PropertyDialog",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._pValueHelpDialog2.then(function(oDialog) {
				// Create a filter for the binding
				oDialog.getBinding("items").filter([new Filter("Name", FilterOperator.Contains, sInputValue)]);
				// Open ValueHelpDialog filtered by the input's value
				oDialog.open(sInputValue);
			});
		},

		onValueHelpRequestTenant: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();
			/*var oBinding = oEvent.getSource().getBinding("items");
				oBinding.path = "/UDO_K2P_PROPERTY";
*/
			if (!this._pValueHelpDialog3) {
				this._pValueHelpDialog3 = Fragment.load({
					id: "Dialog3", //oView.getId(),
					name: "K2PPM_PM.K2PUtils.TenantDialog",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._pValueHelpDialog3.then(function(oDialog) {
				// Create a filter for the binding
				oDialog.getBinding("items").filter([new Filter("CardName", FilterOperator.Contains, sInputValue)]);
				// Open ValueHelpDialog filtered by the input's value
				oDialog.open(sInputValue);
			});
		},

		onValueHelpRequestVendor: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();
			/*var oBinding = oEvent.getSource().getBinding("items");
				oBinding.path = "/UDO_K2P_PROPERTY";
*/
			if (!this._pValueHelpDialog5) {
				this._pValueHelpDialog5 = Fragment.load({
					id: "Dialog5", //oView.getId(),
					name: "K2PPM_PM.K2PUtils.VendorDialog",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._pValueHelpDialog5.then(function(oDialog) {
				// Create a filter for the binding
				oDialog.getBinding("items").filter([new Filter("CardName", FilterOperator.Contains, sInputValue)]);
				// Open ValueHelpDialog filtered by the input's value
				oDialog.open(sInputValue);
			});
		},

		onValueHelpSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var id = oEvent.getParameter("id");
			var sKeyName;

			switch (id) {

				case "Dialog1--selectProject":

					sKeyName = "Name";
					break;

				case "Dialog2--selectProperty":
					{
						sKeyName = "Code";
						break;

					}
				case "Dialog3--selectTenant":
					{
						sKeyName = "CardCode";
						break;

					}

				case "Dialog5--selectVendor":
					{
						sKeyName = "CardCode";
						break;

					}

			}

			var oFilter = new Filter(sKeyName, FilterOperator.Contains, sValue);

			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onValueHelpClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var id = oEvent.getParameter("id");
			var oPurchaseOrderModel = this.getOwnerComponent().getModel("purchaseOrder");
			var o = oEvent.getSource().getBinding("items").filter([]); //???

			if (!oSelectedItem) {
				return;
			}
			var path = oSelectedItem.getBindingContext().getPath();
			var sTitle;
			try {
				sTitle = oSelectedItem.getTitle();
			} catch (e)
			//skip error
			{}

			var s;
			var poModel;

			switch (id) {

				case "Dialog1--selectProject":

					oPurchaseOrderModel.setProperty("/ProjCode", sTitle);
					oPurchaseOrderModel.setProperty("/U_K2P_ProjCode", sTitle);
					//this.byId("ProjCode").setValue(oSelectedItem.getTitle());
					break;

				case "Dialog2--selectProperty":
					{
						//getByPath: function(callingController, dpath, queryParamsIn, callback2, oThis)
						K2PUtils.getByPath(this, path, "", this.propertyCallBack, "qparamsProperty");
						break;

					}
				case "Dialog3--selectTenant":
					{
						//this.byId("Tenant").setValue(oSelectedItem.getTitle());
						var tenantCode = oSelectedItem.getDescription();
						//poModel = this.getView().getModel("purchaseOrder");
						oPurchaseOrderModel.setProperty("/U_K2P_Tenant", tenantCode);
						oPurchaseOrderModel.setProperty("/U_K2P_TenantName", oSelectedItem.getTitle());

						var qParams = "?$filter=U_CardCode eq \'" + tenantCode + "\'&$orderby=DocNum desc";
						K2PUtils.getByPath(this, "UDO_K2P_LEASE", qParams, this.tenantCallBack, "qparamsTenant");

						break;

					}
				case "Dialog5--selectVendor":
					{
						this.byId("Vendor").setValue(oSelectedItem.getDescription());
						s = oSelectedItem.getTitle();
						poModel = this.getView().getModel("purchaseOrder");
						poModel.setProperty("/CardCode", s);

						//populate Vendor Name
						break;

					}

			}
		},

		propertyCallBack: function(callingController, results, callback2, oThis, qNameIn) {

			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var retry = qParamsModel.getProperty("/retry");
			var component = callingController.getOwnerComponent();
			var sIndex = qParamsModel.getProperty("/index");
			var sPath = "/DocumentLines/" + sIndex;

			var i18n;
			if (errorCode === 0) {
				var oPurchaseOrderModel = thisView.getModel("purchaseOrder");
				var oResult = new sap.ui.model.json.JSONModel();
				oResult.setData(results);
				thisView.setModel(oResult, "propertyModel");
				var sName = oResult.getProperty("/Name");
				oPurchaseOrderModel.setProperty(sPath + "/U_K2P_PropertyName", sName);
				oPurchaseOrderModel.setProperty(sPath + "/ProjectCode", oResult.getProperty("/U_ProjCode"));
				oPurchaseOrderModel.setProperty(sPath + "/U_K2P_ProjCode", oResult.getProperty("/ProjectCode"));
				var propertyCode = oResult.getProperty("/Code");
				var dfltProject = oResult.getProperty("/U_ProjCode");

				var localModel = callingController.getOwnerComponent().getModel("local");
				var UseProjMgmtID = localModel.getProperty("/UseProjMgmtID");

				if (UseProjMgmtID === "Y") {
					//handle Lookout logic here
					//Populate the Project(Program) combo
					var sFilter = "U_K2P_DIM3 eq \'" + propertyCode + "\'";
					//var path = " '/ProjectManagements', parameters : {$filter : 'U_K2P_DIM3 eq \'APQ3\'' }"

					//Change the binding for the Program/Project here
					var oItemTemplate = new sap.ui.core.ListItem({
						text: "{FinancialProject}",
						additionalText: "{ProjectName}"
					});

					var oBinding = {};
					oBinding.path = "/ProjectManagements";
					oBinding.parameters = {
						"$filter": sFilter
					};
					oBinding.template = oItemTemplate;
					oBinding.events = {
						"dataReceived": callingController.onDataReceivedProject1,
						"DataStateChange": callingController.onDataStateChangeProject1
					};

					var sId = "nav---purchaseOrder--Project1-nav---purchaseOrder--DocumentLines-" + sIndex;
					var oSelect = thisView.byId(sId);
					oSelect.bindItems(oBinding);
					//This list has been populated - now set the selection
					//This does not work because list is not populated yet despite binditems
					//Maybe the network call has not yet returned. How to know?
					//When to select it? List is populated 
					var items = oSelect.getItems();
					var firstItem = oSelect.getFirstItem();
					var itemToSelect = oSelect.getItemByKey(dfltProject);
					oSelect.setSelectedItem(itemToSelect); //why will this not set the selection?
					//

					callingController.refreshCostCodes(propertyCode, dfltProject, sIndex);

				} else //Use codes from property
				{
					oPurchaseOrderModel.setProperty(sPath + "/CostingCode", oResult.getProperty("/U_Dim1"));
					oPurchaseOrderModel.setProperty(sPath + "/CostingCode2", oResult.getProperty("/U_Dim2"));
					oPurchaseOrderModel.setProperty(sPath + "/CostingCode3", oResult.getProperty("/U_Dim3"));
					oPurchaseOrderModel.setProperty(sPath + "/CostingCode4", oResult.getProperty("/U_Dim4"));
					oPurchaseOrderModel.setProperty(sPath + "/CostingCode5", oResult.getProperty("/U_Dim5"));
				}

			} else //handle error
			{
				if (errorCode !== "-2028") {
					var sMessage = "propertyCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
					thisView.setBusy(false);
					i18n = "serviceLayerStatus";
					//var oRouter = callingController.getRouter();
					//oRouter.navTo("login");
					K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
				}

			}
		},

		onProject1Change: function(oEvent) {
			var thisView = this.getView();
			var source = oEvent.getSource();
			var parameters = oEvent.getParameters();
			var propertyCode, projectCode;
			var sId = oEvent.getParameter("id");
			var oSelect = thisView.byId(sId);

			var a = oSelect.getSelectedItem().getText();
			var b = oSelect.getSelectedItemId();
			var c = oSelect.getSelectedKey();

			var sArray = sId.split("-");
			var sIndex = sArray[sArray.length - 1];

			var oPurchaseOrderModel = thisView.getModel("purchaseOrder");
			var sPath = "/DocumentLines/" + sIndex;
			propertyCode = oPurchaseOrderModel.getProperty(sPath + "/U_K2P_Property");
			projectCode = oSelect.getSelectedItem().getText();

			//Populate the variables.
			//if lookout then
			var localModel = this.getOwnerComponent().getModel("local");
			var UseProjMgmtID = localModel.getProperty("/UseProjMgmtID");
			if (UseProjMgmtID === "Y") {
				this.refreshCostCodes(propertyCode, projectCode, sIndex);
			}
			//else no change - already populated from property. 

		},

		refreshCostCodes: function(propertyCode, sProjectCode, sIndex) {

			var qParams = "?$filter=U_K2P_DIM3 eq \'" + propertyCode + "\' and FinancialProject eq \'" + sProjectCode + "\'";
			K2PUtils.getByPath(this, "ProjectManagements", qParams, this.refreshCostCodesCallBack, "qparamsCostCodes", sIndex);

		},

		refreshCostCodesCallBack: function(callingController, results, callback2, oThis, qNameIn) {

			var thisView = callingController.getView();
			var oPurchaseOrderModel = thisView.getModel("purchaseOrder");
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var sIndex = qParamsModel.getProperty("/index");
			var sPath = "/DocumentLines/" + sIndex;

			var i18n;
			if (errorCode !== "0") {

				var oResult = new sap.ui.model.json.JSONModel();
				oResult.setData(results);
				var valueArray = oResult.getProperty("/value");
				if (valueArray.length > 0) {

					oPurchaseOrderModel.setProperty(sPath + "/CostingCode", oResult.getProperty("/value/0/U_K2P_DIM1"));
					oPurchaseOrderModel.setProperty(sPath + "/CostingCode2", oResult.getProperty("/value/0/U_K2P_DIM2"));
					oPurchaseOrderModel.setProperty(sPath + "/CostingCode3", oResult.getProperty("/value/0/U_K2P_DIM3"));
					oPurchaseOrderModel.setProperty(sPath + "/CostingCode4", oResult.getProperty("/value/0/U_K2P_DIM4"));
					oPurchaseOrderModel.setProperty(sPath + "/CostingCode5", oResult.getProperty("/value/0/U_K2P_DIM5"));

				}

			} else //handle error
			{
				var sMessage = "refreshCostCodesCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}

		},

		onSuggestionItemSelected: function(oEvent) {
			var oItem = oEvent.getParameter("selectedItem");
			var oText = oItem ? oItem.getKey() : ""; //if oItem then oItem.getKey() else "" - : (is the else) 
			this.byId("selectedKeyIndicator").setText(oText);
		},

		onSuggestionItemSelectedProperty: function(oEvent) {
			var sId = oEvent.getParameter("id");
			var sArray = sId.split("-");
			var sIndex = sArray[sArray.length - 1];
			var oItem = oEvent.getParameter("selectedRow");
			var oCells = oItem.getCells();
			var oCell = oCells[1];
			var sText = oCell.getText();
			var path = "UDO_K2P_PROPERTY(\'" + sText + "\')";
			K2PUtils.getByPath(this, path, "", this.propertyCallBack, "qparamsProperty", sIndex);
		},

		onSuggestionItemSelectedAccount: function(oEvent) {
			var oItem = oEvent.getParameter("selectedRow");
			var oCells = oItem.getCells();
			var oCell = oCells[2];
			var sText = oCell.getText();
			//{purchaseOrder>AccountCode}  __input7-nav---purchaseOrder--DocumentLines-0
			var sId = oEvent.getParameter("id");
			var sArray = sId.split("-");
			var sIndex = sArray[sArray.length - 1];
			var sPath = "/DocumentLines/" + sIndex + "/AccountCode";
			this.getView().getModel("purchaseOrder").setProperty(sPath, sText);
		},
		onSuggestionItemSelectedVendor: function(oEvent) {
			var oItem = oEvent.getParameter("selectedRow");
			var oCells = oItem.getCells();
			var oCell = oCells[1];
			var sText = oCell.getText();
			this.getView().getModel("purchaseOrder").setProperty("/CardCode", sText);
		},

		onSuggestionItemSelectedTenant: function(oEvent) {
			var oItem = oEvent.getParameter("selectedRow");
			var sId = oEvent.getParameter("id");
			var sArray = sId.split("-");
			var sIndex = sArray[sArray.length - 1];

			var oCells = oItem.getCells();
			var oCell = oCells[1];
			var sCode = oCell.getText();
			oCell = oCells[0];
			//var sName = oCell.getText();
			//this.getView().getModel("purchaseOrder").setProperty("/U_K2P_TenantName", sName);
			var sPath = "/DocumentLines/" + sIndex + "/U_K2P_Tenant";
			this.getView().getModel("purchaseOrder").setProperty(sPath, sCode);
			var qParams = "?$filter=U_CardCode eq \'" + sCode + "\'&$orderby=DocNum desc";
			K2PUtils.getByPath(this, "UDO_K2P_LEASE", qParams, this.tenantCallBack, "qparamsTenant", sIndex);
			//lookup the lease, property, unit
			//lookup the property

		},
		tenantCallBack: function(callingController, results, callback2, oThis, qNameIn) {

			var thisView = callingController.getView();
			var oPurchaseOrderModel = thisView.getModel("purchaseOrder");
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var sIndex = qParamsModel.getProperty("/index");
			var sPath = "/DocumentLines/" + sIndex;
			//var retry = qParamsModel.getProperty("/retry");
			//var component = callingController.getOwnerComponent();
			//oPurchaseOrderModel.setProperty(sPath + "/U_K2P_Tenant", null);
			oPurchaseOrderModel.setProperty(sPath + "/U_K2P_Lease", null);
			oPurchaseOrderModel.setProperty(sPath + "/U_K2P_Property", null);
			oPurchaseOrderModel.setProperty(sPath + "/U_K2P_PropertyName", null);
			oPurchaseOrderModel.setProperty(sPath + "/U_K2P_UnitID", null);
			oPurchaseOrderModel.setProperty(sPath + "/U_K2P_ProjCode", null);
			oPurchaseOrderModel.setProperty(sPath + "/ProjectCode", null);
			oPurchaseOrderModel.setProperty(sPath + "/CostingCode", null);
			oPurchaseOrderModel.setProperty(sPath + "/CostingCode2", null);
			oPurchaseOrderModel.setProperty(sPath + "/CostingCode3", null);
			oPurchaseOrderModel.setProperty(sPath + "/CostingCode4", null);
			oPurchaseOrderModel.setProperty(sPath + "/CostingCode5", null);

			/*			var sFilter = "U_K2P_DIM3 eq \'xyz&!\'";
			//Now lookup the program(s)
			var oItemTemplate = new sap.ui.core.ListItem({
				text: "{FinancialProject}",
				additionalText: "{ProjectName}"
			});
			var oBinding = {};
			oBinding.path = "/ProjectManagements";
			oBinding.parameters = {
				"$filter": sFilter
			};
			oBinding.template = oItemTemplate;
			var oSelect = thisView.byId("Program");
			oSelect.bindItems(oBinding);*/

			var i18n;
			if (errorCode !== "0") {

				var oResult = new sap.ui.model.json.JSONModel();
				oResult.setData(results);
				var valueArray = oResult.getProperty("/value");
				if (valueArray.length > 0) {

					var sProperty = oResult.getProperty("/value/0/U_Property");
					oPurchaseOrderModel.setProperty(sPath + "/U_K2P_Property", sProperty);
					oPurchaseOrderModel.setProperty(sPath + "/U_K2P_Lease", oResult.getProperty("/value/0/DocNum"));
					//oPurchaseOrderModel.setProperty(sPath + "/U_K2P_PropertyName", null);
					oPurchaseOrderModel.setProperty(sPath + "/U_K2P_UnitID", oResult.getProperty("/value/0/U_UnitID"));

				}

				//Now get the codes from the property if possible
				var path = "UDO_K2P_PROPERTY(\'" + sProperty + "\')";
				K2PUtils.getByPath(oThis, path, "", oThis.propertyCallBack, "qparamsProperty", sIndex);
				/*				
			var path = "UDO_K2P_PROPERTY(\'" + propertyCode + "\')";
				try {
					K2PUtils.getByPath(oThis, path, "", oThis.propertyCallBack, "qparamsProperty",sIndex);
					
					
					
				} catch (e) {
					K2PUtils.errorDialogBox(callingController, "tenantCallBack", e.message, true, null, status);
				}*/

			} else //handle error
			{
				var sMessage = "tenantCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},

		onNavBack: function() {
			var oModel = this.getOwnerComponent().getModel("purchaseOrderView");
			var navBack = oModel.getProperty("/navBack");
			this.getRouter().navTo(navBack);
		},

		onResetTotal: function() {
			var purchaseOrderModel = this.getOwnerComponent().getModel("purchaseOrder");
			K2PUtils.resetTotal(purchaseOrderModel, "/DocumentLines", "/DocTotal", "/LineTotal");

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

