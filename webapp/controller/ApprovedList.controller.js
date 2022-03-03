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
	return BaseController.extend("K2PPM_PM.controller.ApprovedList", {

		onInit: function() {

			this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode
			this.getView().setBusy(true);

			var oRouter = this.getRouter();
			oRouter.getRoute("approvedList").attachMatched(this._onRouteMatched, this);
			this.getView().setModel(models.createQueryModel(), "qParams");

			var dfltModel = this.getOwnerComponent().getModel("serviceLayer");
			this.getView().setModel(dfltModel);

			this.getOwnerComponent().setModel(models.creatPurchaseOrderViewModel(), "purchaseOrderView");
			
			this.getView().setBusy(false);
			
			K2PUtils.setTitle(this, "purchaseOrders");

		},
		onAdd: function() {
			var oModel = this.getOwnerComponent().getModel("purchaseOrderView");
			oModel.add = true;
			
			/*			var oMainTable = this.getView().byId("idMainTable");
			var oBinding = oMainTable.getBinding("items");
			var newPOModel = models.createPurchaseOrderModel();
			newPOModel.setProperty("/U_CreateBy", user);
			newPOModel.setProperty("/U_CreateByName", userName);
			var oContext = oBinding.create(newPOModel);
			var oViewModel = this.getOwnerComponent().getModel("purchaseOrderView");
			oViewModel.path = oContext.getPath();*/


			 this.getRouter().navTo("purchaseOrder");
		},
		
		_onRouteMatched: function() {
		    	var oViewModel = this.getOwnerComponent().getModel("purchaseOrderView");
		    	var refresh = oViewModel.getProperty("/refresh");
			    if  (refresh) {
			        oViewModel.setProperty("/refresh",false);
			        //this.onRefresh();
			    }
			    else
			    {
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
			oModel.path = path;
			oModel.add = false;
			this.getRouter().navTo("purchaseOrder");
			oSelectedItem.setSelected(false);
			//thisView.setBusy(false);
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
		}
	});

});