sap.ui.define([
	"K2PPM_PM/controller/BaseController",
	"../K2PUtils/K2PUtils",
	"K2PPM_PM/model/models",
	"sap/ui/model/json/JSONModel"
], function(BaseController, K2PUtils, models, JSONModel) {
	"use strict";
	return BaseController.extend("K2PPM_PM.controller.Balances", {

		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("balances").attachMatched(this._onRouteMatched, this);
			this.getView().setModel(models.createQueryModel(), "qParams");
			K2PUtils.setTitle(this, "balances");

		},
		_onViewDisplay: function() {

		},
		_onRouteMatched: function() {

			this.fetchMain(this, false);

		},
		onSelectionChange: function(oEvent) {
			var thisView = this.getView("");
			thisView.setBusy(true);
			var oSelectedItem = oEvent.getParameter("listItem");
			var path = oSelectedItem.getBindingContext().getPath();
			var oTable = thisView.byId("idMainTable");
			var balancesModel = oTable.getModel();
			var CardCode = balancesModel.getProperty(path + "/CardCode");
			var CardName = balancesModel.getProperty(path + "/CardName");
			var localModel = this.getOwnerComponent().getModel("local");
			localModel.setProperty("/cardCode", CardCode);
			localModel.setProperty("/cardName", CardName);
			this.getRouter().navTo("statement");
			//thisView.setBusy(false);
		},
		fetchMain: function(callingController, retry) {
			var thisView = this.getView();
			thisView.setBusy(true);
			// set the queryParams model
			var qParamsModel = models.createQueryModel();
			thisView.setModel(qParamsModel, "qParams");
			qParamsModel.setProperty("/method", "GET");
			qParamsModel.setProperty("/command", "BusinessPartners()");
			qParamsModel.setProperty("/data", null);
			qParamsModel.setProperty("/retry", retry);
			qParamsModel.setProperty("/firstFetch", true);
			var queryParams =
				"?$select=CardCode,CardName,CurrentAccountBalance&$inlinecount=allpages&$orderby=CardName&$filter=CardType eq 'cCustomer' and CurrentAccountBalance ne 0";
			qParamsModel.setProperty("/queryParams", queryParams);

			K2PUtils.getpostputpatch(callingController, K2PUtils.fetchMainCallBack);
		},
		createDefaultModel: function() {

			var data = {
				page: 1,
				totalPages: 10

			};

			var oModel = new JSONModel(data);
			oModel.setDefaultBindingMode("TwoWay");

			return oModel;
		}
	});

});