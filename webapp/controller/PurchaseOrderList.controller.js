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
	return BaseController.extend("K2PPM_PM.controller.PurchaseOrderList", {

		onInit: function() {

			this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode
			this.getView().setBusy(true);

			var oRouter = this.getRouter();
			oRouter.getRoute("purchaseOrderList").attachMatched(this._onRouteMatched, this);
			this.getView().setModel(models.createQueryModel(), "qParams");

			var dfltModel = this.getOwnerComponent().getModel("serviceLayer");
			this.getView().setModel(dfltModel);

			var viewModel = models.creatPurchaseOrderViewModel();
			viewModel.setProperty("/open", true);
			viewModel.setProperty("/excludeOrdered", false);
			this.getOwnerComponent().setModel(viewModel, "purchaseOrderView");

			this.getView().setBusy(false);

			K2PUtils.setTitle(this, "purchaseOrders");

		},
		onAdd: function() {
			var oModel = this.getOwnerComponent().getModel("purchaseOrderView");
			oModel.setProperty("/add", true);
			oModel.setProperty("/approved", false);
			this.getRouter().navTo("purchaseOrder");

			/*			var oMainTable = this.getView().byId("idMainTable");
			var oBinding = oMainTable.getBinding("items");
			var newPOModel = models.createPurchaseOrderModel();
			newPOModel.setProperty("/U_CreateBy", user);
			newPOModel.setProperty("/U_CreateByName", userName);
			var oContext = oBinding.create(newPOModel);
			var oViewModel = this.getOwnerComponent().getModel("purchaseOrderView");
			oViewModel.path = oContext.getPath();*/

		},

		_onRouteMatched: function() {
			var oViewModel = this.getOwnerComponent().getModel("purchaseOrderView");
			var refresh = oViewModel.getProperty("/refresh");
			if (refresh) {
				oViewModel.setProperty("/refresh", false);
				//this.onRefresh();
			} else {
				this.fetchMain();
			}

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

			//thisView.byId("idMainTable").getBinding("items").sort(new Sorter("ServiceCallID", true));
			thisView.setBusy(false);

			//var oMaintTable = this.getView().byId("idMainTable");
			//var oBinding = oMaintTable.getBinding("items");

			//dfltModel.refresh();
			//var tableData = dfltModel.get

			//oMaintTable.setModel(dfltModel);

			//this.defaultNew();

		},
		onSelectionChange: function(oEvent) {
			var thisView = this.getView("");
			thisView.setBusy(true);
			var oSelectedItem = oEvent.getParameter("listItem");
			var path = oSelectedItem.getBindingContext().getPath();
			var oComponent = this.getOwnerComponent();
			var oModel = oComponent.getModel("purchaseOrderView");
			oModel.setProperty("/path", path);
			oModel.setProperty("/add", false);
			oModel.setProperty("/approved", true);
			oModel.setProperty("/draft", false);
			this.getRouter().navTo("purchaseOrder");
			oSelectedItem.setSelected(false);
			//thisView.setBusy(false);
		},
		onEditLine: function(oEvent) {
			//Get the code
			var sId = oEvent.getParameter("id");
			var sIdCode = sId.replace("btnLines", "DocEntry");
			var oText = this.byId(sIdCode);
			var sKey = oText.getText();
			sKey = sKey.replaceAll(",", "");
			var path = "/PurchaseOrders(" + sKey + ")";
			this.getOwnerComponent().setModel(models.creatPurchaseOrderViewModel(), "purchaseOrderView");
			var oModel = this.getOwnerComponent().getModel("purchaseOrderView");
			oModel.setProperty("/path", path);
			oModel.setProperty("/add", false);
			oModel.setProperty("/approved", true);
			oModel.setProperty("/draft", false);
			oModel.setProperty("/navBack", "purchaseOrderList");
			this.getRouter().navTo("purchaseOrder");

		},
		onRefresh: function() {
			var viewModel = this.getOwnerComponent().getModel("purchaseOrderView");
			var sProperty = viewModel.getProperty("/property");
			var sPropertyName = viewModel.getProperty("/propertyName");
			if (!sPropertyName) {
				sProperty = "";
				viewModel.setProperty("/propertyName", sPropertyName);
				viewModel.setProperty("/property", sProperty);
			}
			this.filterPOList(this, sProperty);

		},
		onSuggestionItemSelectedProperty: function(oEvent) {

			var oItem = oEvent.getParameter("selectedRow");
			var oCells = oItem.getCells();
			var oCell = oCells[0];
			var sPropertyName = oCell.getText();
			oCell = oCells[1];
			var sProperty = oCell.getText();
			var viewModel = this.getOwnerComponent().getModel("purchaseOrderView");
			viewModel.setProperty("/propertyName", sPropertyName);
			viewModel.setProperty("/property", sProperty);

			this.filterPOList(this, sProperty);

		},
		filterPOList: function(callingController, property) {
			var thisView = callingController.getView();
			thisView.setBusy(true);

			var oBinding = thisView.byId("idMainTable").getBinding("items");
			var viewModel = this.getOwnerComponent().getModel("purchaseOrderView");
			var open = viewModel.getProperty("/open");
			var excludeOrdered = viewModel.getProperty("/excludeOrdered");
			var sFilter = "";
			if (excludeOrdered) {
				sFilter = "U_K2P_OrderedDate eq null";
			}
			if (open) {
				if (sFilter) {
					sFilter = sFilter + " and ";
				}
				sFilter = sFilter + " DocumentStatus eq \'bost_Open\'";
			} else {
				if (sFilter) {
					sFilter = sFilter + " and ";
				}
				sFilter = sFilter + " DocumentStatus ne \'bost_Open\'";
			}
			if (property) {
			    if (sFilter) {
					sFilter = sFilter + " and ";
				}
				sFilter = sFilter + " U_K2P_Property eq \'" + property + "\'";
			}

			var oParameters = {
				$filter: sFilter
			};
			oBinding.changeParameters(oParameters);

			oBinding.refresh();

			thisView.setBusy(false);

		},

		onNavBack: function() {
			this.getRouter().navTo("home");
		}
	});

});