sap.ui.define([
	"K2PPM_PM/controller/BaseController",
	"../K2PUtils/K2PUtils",
	"K2PPM_PM/model/models",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/m/MessageBox"
], function(BaseController, K2PUtils, models, JSONModel, ODataModel, Sorter, Filter, FilterOperator, FilterType, MessageBox) {
	"use strict";
	return BaseController.extend("K2PPM_PM.controller.WorkOrderList", {

		onInit: function() {

			this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode
			this.getView().setBusy(true);

			var oRouter = this.getRouter();
			oRouter.getRoute("workOrderList").attachMatched(this._onRouteMatched, this);
			this.getView().setModel(models.createQueryModel(), "qParams");

			var dfltModel = this.getOwnerComponent().getModel("serviceLayer");
			this.getView().setModel(dfltModel);

			var oViewModel = models.creatWorkOrderViewModel();
			this.getOwnerComponent().setModel(oViewModel, "workOrderView");

			/*			var oMessageManager = sap.ui.getCore().getMessageManager(),
				oMessageModel = oMessageManager.getMessageModel(),
				oMessageModelBinding = oMessageModel.bindList("/", undefined, [],
					new Filter("technical", FilterOperator.EQ, true)),
				oViewModel = new JSONModel({
					busy: false,
					hasUIChanges: false,
					usernameEmpty: true,
					order: 0
				});
			this.getView().setModel(oViewModel, "appView");
			this.getView().setModel(oMessageModel, "message");

			oMessageModelBinding.attachChange(this.onMessageBindingChange, this);
			this._bTechnicalErrors = false;*/

		},

		defaultNew: function() {

			var oModel = models.createWorkOrderModel();
			this.getOwnerComponent().setModel(oModel, "newWO");

		},

		_onRouteMatched: function() {
			this.getView().setBusy(true);
/*			var sFilter;
			
			//get the user
			var oUserModel = this.getOwnerComponent().getModel("userModel");
			var user = oUserModel.getProperty("/value/0/UserCode");
			//filter the table by user and status

			sFilter = "(U_Status eq \'P\' or U_Status eq \'A\' or U_Status eq \'M\') ";
			sFilter += "and (U_Manager eq \'" + user + "\' or U_Technician eq \'" + user + "\')";
			var parameters = {
				"$filter": sFilter
			};
			var mTable = this.getView().byId("idMainTable");
			var oBinding = mTable.getBinding("items");
			oBinding.changeParameters(parameters);*/
			this.myApprovals();
			
			this.getView().setBusy(false);
		},
		myApprovals: function() {
		    this.getView().setBusy(true);
			var oUserModel = this.getOwnerComponent().getModel("userModel");
			var userCode = oUserModel.getProperty("/value/0/UserCode");
			
		    var	sFilter = "(U_Status eq \'P\') ";
			sFilter += "and (U_Manager eq \'" + userCode + "\')"; 
			var parameters = {
				"$filter": sFilter
			};
			var mTable = this.getView().byId("idMainTable");
			var oBinding = mTable.getBinding("items");
			oBinding.changeParameters(parameters);
			this.getView().setBusy(false);
		},
		myWorkOrders: function() {
		    this.getView().setBusy(true);
			var oUserModel = this.getOwnerComponent().getModel("userModel");
			var userCode = oUserModel.getProperty("/value/0/UserCode");
		    var	sFilter = "U_CreateBy eq \'" + userCode + "\'"; 
			var parameters = {
				"$filter": sFilter
			};
			var mTable = this.getView().byId("idMainTable");
			var oBinding = mTable.getBinding("items");
			oBinding.changeParameters(parameters);
			this.getView().setBusy(false);
		},
		allWorkOrders: function() {
		    this.getView().setBusy(true);
		    var	sFilter = "U_Status eq U_Status";
			var parameters = {
				"$filter": sFilter
			};
			var mTable = this.getView().byId("idMainTable");
			var oBinding = mTable.getBinding("items");
			oBinding.changeParameters(parameters);
			this.getView().setBusy(false);
		},
		onEditLine: function(oEvent) {
			//Get the code
			var sId = oEvent.getParameter("id");
			var sIdCode = sId.replace("btnLines", "DocEntry");
			var oText = this.byId(sIdCode);
			var sKey = oText.getText();
			var path = "/UDO_K2P_WORKORDER(" + sKey + ")";
			this.getOwnerComponent().setModel(models.creatWorkOrderViewModel(), "workOrderView");
			var oModel = this.getOwnerComponent().getModel("workOrderView");
			oModel.setProperty("/path", path);
			oModel.setProperty("/add", false);
			oModel.setProperty("/navBack", "workOrderList");
			this.getRouter().navTo("workOrder");

		},
		onSelectionChange: function(oEvent) {
			var thisView = this.getView("");
			thisView.setBusy(true);
			var oSelectedItem = oEvent.getParameter("listItem");
			var path = oSelectedItem.getBindingContext().getPath();
			var oComponent = this.getOwnerComponent();
			var oModel = oComponent.getModel("workOrderView");
			oModel.path = path;
			oModel.add = false;
			this.getRouter().navTo("workOrder");
			oSelectedItem.setSelected(false);
			//thisView.setBusy(false);
		},
		onAdd: function() {
			var oModel = models.creatWorkOrderViewModel();
			oModel.setProperty("/add", true);
			oModel.setProperty("/approved", false);
			oModel.setProperty("/navBack", "workOrderList");
			this.getOwnerComponent().setModel(oModel, "workOrderView");
			this.getRouter().navTo("workOrder");
		},

		onSubmit: function() {

			try {

				var dataModel = this.getView().getModel("serviceCall");
				var oNewRecord = dataModel.getProperty("/value/0");
				//var oServiceCallModel = this.getOwnerComponent().getModel("serviceLayer");
				var mParams = {};
				mParams.success = function() {
					sap.m.MessageToast.show("Create Successful!");
				};
				mParams.error = this.onErrorCall;

				var oMaintTable = this.byId("idMainTable");
				var oBinding = oMaintTable.getBinding("items"); //This is a DataListBinding created from a table which is a data list. 
				var oContext = oBinding.create(oNewRecord);

				//oServiceCallModel.create("/serviceLayer", oNewRecord, mParams);
				//var oContext = oServiceCallModel.createBindingContext("",)

				/*				oModel.oNewRecord = oNewRecord;
				oModel.callBack();*/

				//oViewModel.oBinding.attachEvent("dataReceived", this.eventDataReceived);
				//oContext = oViewModel.oBinding.create(oNewRecord);

				/*			oContext.created().then(function() {
				s = "OK";
			}, function(oError) {
				s = oError.toString();
			});*/

			} catch (e) {
				var e1 = e;
				e1 = e1;
			}
		},

		onAddCallback: function() {

			//var thisView = this.getView();
			//var oMaintTable = thisView.byId("idMainTable");
			//var oBinding = oMaintTable.getBinding("items");
			var oModel = this.getOwnerComponent().getModel("newWO");

			try {
				var oNewRecord = JSON.parse(oModel.getJSON());
				var s;
				var oMaintTable = this.getView().byId("idMainTable");
				var oBinding = oMaintTable.getBinding("items");
				var oContext = oBinding.create(oNewRecord);

				oContext.created().then(function() {
					s = "OK";
				}, function(oError) {
					s = oError.toString();
				});

			} catch (err) {
				s = err.toString();

			}

			//this.defaultNew();

			//this.getRouter().navTo("workOrder");

		},
		fetchMain: function() {

			var thisView = this.getView();
			thisView.setBusy(true);

			var oJSONData = {
				busy: false,
				order: 0
			};
			var oModel = new JSONModel(oJSONData);
			this.getView().setModel(oModel, "appView");

			K2PUtils.setTitle(this, "workOrders");

			//thisView.byId("idMainTable").getBinding("items").sort(new Sorter("ServiceCallID", true));
			thisView.setBusy(false);

			//var oMaintTable = this.getView().byId("idMainTable");
			//var oBinding = oMaintTable.getBinding("items");

			//dfltModel.refresh();
			//var tableData = dfltModel.get

			//oMaintTable.setModel(dfltModel);

			//this.defaultNew();

		},
		onRefresh: function() {
			var oBinding = this.byId("idMainTable").getBinding("items");

			if (oBinding.hasPendingChanges()) {
				MessageBox.error(this._getText("refreshNotPossibleMessage"));
				return;
			}
			oBinding.refresh();
			//MessageToast.show(this._getText("refreshSuccessMessage"));
			var thisView = this.getView();
			thisView.setBusy(false);
		},

		onSort: function() {
			var oView = this.getView(),
				aStates = [undefined, "asc", "desc"],
				//aStateTextIds = ["sortNone", "sortAscending", "sortDescending"],
				//sMessage,
				iOrder = oView.getModel("appView").getProperty("/order");

			// Cycle between the states
			iOrder = (iOrder + 1) % aStates.length;
			var sOrder = aStates[iOrder];

			//oView.getModel("appView").setProperty("/order", iOrder);  sOrder && 
			oView.byId("idMainTable").getBinding("items").sort(new Sorter("ServiceCallID", true));

			//sMessage = this._getText("sortMessage", [this._getText(aStateTextIds[iOrder])]);
			//MessageToast.show(sMessage);
		},

		onSearch: function() {

			var oView = this.getView(),
				sValue = oView.byId("searchField").getValue(),
				oFilter = new Filter("U_Property", FilterOperator.Contains, sValue);

			oView.byId("idMainTable").getBinding("items").filter(oFilter, FilterType.Application);

			/*
			var thisView = this.getView();
			var mainTable = thisView.byId("idMainTable");
			var oBinding = mainTable.getBinding("items");

			var sValue = thisView.byId("searchField").getValue();
			var oFilter = new Filter("Code", FilterOperator.Contains, sValue);

			oBinding.filter(oFilter, FilterType.Application);
			
			*/
			//oBinding.refresh();
			//var oModel = thisView.getModel();
			//thisView.setModel(oModel);

		},

		/*		fetchMain: function (callingController, retry) {
			var thisView = this.getView();
			thisView.setBusy(true);
			// set the queryParams model
			var qParamsModel = models.createQueryModel();
			thisView.setModel(qParamsModel, "qParams");
			qParamsModel.setProperty("/method", "GET");
			qParamsModel.setProperty("/command", "sml.svc/K2P_RENTROLL");
			qParamsModel.setProperty("/data", null);
			qParamsModel.setProperty("/retry", retry);
			qParamsModel.setProperty("/firstFetch", true);
			var queryParams = "?$inlinecount=allpages";
			qParamsModel.setProperty("/queryParams", queryParams);

			K2PUtils.getpostputpatch(callingController, K2PUtils.fetchMainCallBack);
		},*/
		onTestNow: function() {
			this.fetchMain(this, false);

		},
		createDefaultModel: function() {

			var data = {
				page: 1,
				totalPages: 10

			};

			var oModel = new JSONModel(data);
			oModel.setDefaultBindingMode("TwoWay");

			return oModel;
		},
		_setUIChanges: function(bHasUIChanges) {
			if (this._bTechnicalErrors) {
				// If there is currently a technical error, then force 'true'.
				bHasUIChanges = true;
			} else if (bHasUIChanges === undefined) {
				bHasUIChanges = this.getView().getModel().hasPendingChanges();
			}
			var oModel = this.getView().getModel("appView");
			oModel.setProperty("/hasUIChanges", bHasUIChanges);
		},

		onNavBack: function() {
			this.getRouter().navTo("home");
		}

	});

});