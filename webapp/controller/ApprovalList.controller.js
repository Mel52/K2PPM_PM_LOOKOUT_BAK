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
	return BaseController.extend("K2PPM_PM.controller.ApprovalList", {

		onInit: function() {

			var thisView = this.getView();
			thisView.addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode
			thisView.setBusy(true);

			var component = this.getOwnerComponent();
			var semanticLayer = component.getModel("semanticLayer");
			
		    var viewModel = new JSONModel();
			var data = {"propertyName" : ""};
			viewModel.setData(data);
			this.getView().setModel(viewModel,"viewModel");

			//thisView.setModel(semanticLayer);

			var oRouter = this.getRouter();
			oRouter.getRoute("approvalList").attachMatched(this._onRouteMatched, this);
			this.getView().setModel(models.createQueryModel(), "qParams");

			var oJSONData = {
				busy: false,
				order: 0
			};
			var oModel = new JSONModel(oJSONData);
			this.getView().setModel(oModel, "appView");

		},
		_onRouteMatched: function() {
			this.myApprovals();

		},
		myApprovals: function() {
			var oUserModel = this.getOwnerComponent().getModel("userModel");
			var userCode = oUserModel.getProperty("/value/0/UserCode");
			var command = "K2P_APPROVALS_LIST_Query";
			var queryParams = "?$orderby=DocEntry desc&$inlinecount=allpages&$filter=DocStatus eq 'O' and U_UserCode eq \'" + userCode + "\'";
			this.fetchMain(command, queryParams);
		},
		allMyApprovals: function() {
			var oUserModel = this.getOwnerComponent().getModel("userModel");
			var userCode = oUserModel.getProperty("/value/0/UserCode");
			var command = "K2P_APPROVALS_NEXT_QUERY";
			var queryParams = "?$orderby=DocEntry desc&$inlinecount=allpages";
			queryParams += "&$filter=DocStatus eq 'O'  and AllApproval eq 'true' and U_UserCode eq \'" + userCode + "\'";
			this.fetchMain(command, queryParams);
		},
		myRequests: function() {
			var oUserModel = this.getOwnerComponent().getModel("userModel");
			var userCode = oUserModel.getProperty("/value/0/UserCode");
			var command = "K2P_APPROVALS_ALL_QUERY";
			var queryParams = "?$orderby=DocEntry desc&$inlinecount=allpages&$filter=DocStatus eq 'O' and U_K2P_User eq \'" + userCode + "\'";
			this.fetchMain(command, queryParams);
		},
		allRequests: function() {
			//var oUserModel = this.getOwnerComponent().getModel("userModel");
			//var userCode = oUserModel.getProperty("/value/0/UserCode");
			var command = "K2P_APPROVALS_ALL_QUERY";
			var queryParams = "?$orderby=DocEntry desc&$inlinecount=allpages&$filter=DocStatus eq 'O'"; // and U_K2P_User eq \'" + userCode + "\'";
			this.fetchMain(command, queryParams);
		},

		fetchMain: function(command, queryParams) {

			var thisView = this.getView();
			var callingController = this;
			thisView.setBusy(true);
			var qNameIn = "qApprovalsList";
			var qParamsModel = models.createQueryModel(qNameIn);

			//filter the table by user and status

			var sl = qParamsModel.getProperty("/sl");
			sl = sl + "sml.svc/";
			qParamsModel.setProperty("/sl", sl);
			qParamsModel.setProperty("/method", "GET");
			qParamsModel.setProperty("/command", command);
			qParamsModel.setProperty("/retry", false);
			qParamsModel.setProperty("/firstFetch", true);
			//?$filter=DocStatus eq 'O' and U_UserCode eq 'lorissademoskoff'
			//queryParams = "?$filter=DocStatus eq 'O' and U_UserCode eq \'" + userCode + "\'";
			qParamsModel.setProperty("/queryParams", queryParams);
			thisView.setModel(qParamsModel, qNameIn);
			//fetch data
			K2PUtils.getpostputpatch(callingController, K2PUtils.fetchMainCallBack, null, callingController, qNameIn);

			/*			sFilter = "U_UserCode eq \'" + user + "\'";
			var parameters = {
				"$filter": sFilter
			};
			var mTable = this.getView().byId("idMainTable");
			var oBinding = mTable.getBinding("items");
			oBinding.changeParameters(parameters);*/

			this.getView().setBusy(false);

			//K2PUtils.setTitle(this, "Approval Requests");

			//var dfltModel = this.getOwnerComponent().getModel("drafts");
			//thisView.setModel(dfltModel);
			//thisView.byId("idMainTable").getBinding("items").sort(new Sorter("ServiceCallID", true));
			//thisView.setBusy(false);

			//var oMaintTable = this.getView().byId("idMainTable");
			//var oBinding = oMaintTable.getBinding("items");

			//dfltModel.refresh();
			//var tableData = dfltModel.get

			//oMaintTable.setModel(dfltModel);

		},
		onEditLine: function(oEvent) {
			//Get the code
			var sId = oEvent.getParameter("id");
			var sIdCode = sId.replace("btnLines", "DocEntry");
			var oText = this.byId(sIdCode);
			var sKey = oText.getText();
			var path = "/Drafts(" + sKey + ")";
			this.getOwnerComponent().setModel(models.creatPurchaseOrderViewModel(), "purchaseOrderView");
			var oModel = this.getOwnerComponent().getModel("purchaseOrderView");
			oModel.setProperty("/path", path);
			oModel.setProperty("/add", false);
			oModel.setProperty("/approved", false);
			oModel.setProperty("/draft", true);
			oModel.setProperty("/navBack", "approvalList");
			this.getRouter().navTo("purchaseOrder");

		},
		onSearch: function(oEvent) {
			var sId = oEvent.getParameter("id");
			var searchField = this.getView().byId(sId);
			var property = searchField.getValue;
			var oBinding = this.byId("idMainTable").getBinding("items");
			var sFilter = "U_K2P_Property eq \'" + property + "\'";
			var oParameters = {
				$filter: sFilter
			};
			//var oPurchaseOrderModel = this.getView().getModel("purchaseOrder");
			//oPurchaseOrderModel.setProperty("U_K2P_Property",sProperty);
			oBinding.changeParameters(oParameters);

		},
		onRefresh: function() {
			var oBinding = this.byId("idMainTable").getBinding("items");

			if (oBinding.hasPendingChanges()) {
				MessageBox.error("refreshNotPossibleMessage");
				return;
			}

			oBinding.refresh();
			//MessageToast.show(this._getText("refreshSuccessMessage"));
		},
		onNavBack: function() {
			this.getRouter().navTo("home");
		}

	});

});