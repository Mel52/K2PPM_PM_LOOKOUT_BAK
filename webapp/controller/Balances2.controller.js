sap.ui.define([
	"K2PPM_PM/controller/BaseController",
	"K2PPM_PM/K2PUtils/K2PUtils",
	"K2PPM_PM/model/models",
	"K2PPM_PM/K2PUtils/K2PLogin",
	"sap/ui/model/odata/v4/ODataModel"
], function(BaseController, K2PUtils, models, K2PLogin, ODataModel) {
	"use strict";
	return BaseController.extend("K2PPM_PM.controller.Balances2", {

		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("balances2").attachMatched(this._onRouteMatched, this);

			/*
			
			
		

			var thisView = this.getView();
			thisView.setModel(dfltModel);*/

			/*			var target = oRouter.getTarget("balances");
			target.attachDisplay(this._onViewDisplay, this);*/
			//thisView.bindElement("/Products('4711')");

		},
		_onViewDisplay: function() {

		},
		_onRouteMatched: function() {
			/*				var thisView = this.getView();
				var dfltModel = thisView.getModel();
				dfltModel = dfltModel;*/

		},
		/*		onTest: function (oEvent) {
			//ODATA MODEL TEST
			var component = this.getOwnerComponent();
			var oModel = component.getModel("BP1");

			var queryModel = models.createQueryModel();
			queryModel.setProperty("/method", "GET");
			queryModel.setProperty("/command", "BusinessPartners");
			queryModel.setProperty("/dataType", "odata");
			//dataType: "json"
			var queryParams = "";
			//var modelBP = new odata.v4.ODataModel(mParameters);

			var url = queryModel.getProperty("/url");
			var serviceUrl = url + "BusinessPartners/";
			var mParameters = {
				annotationURI: "OData/annotations.xml",
				synchronizationMode: "None",
				serviceUrl: url
			};
			var modelBP = new ODataModel(mParameters);
			var thisView = this.getView();
			thisView.setModel(modelBP);

			//=	"?$select=CardCode,CardName,CurrentAccountBalance&$orderby=CardName&$filter=CardType eq 'cCustomer' and CurrentAccountBalance ne 0"
			queryModel.setProperty("/queryParams", queryParams);
			//fetch data
			//K2PUtils.getpostputpatch(this, queryModel, this.onTestCallBack);
		},

*/
		onTestCallBack: function(callingController, queryModel, result) {

			var url = queryModel.getProperty("/url");
			var serviceUrl = url + "BusinessPartners/";
			var thisView = callingController.getView();
			var mParameters = {
				annotationURI: "OData/annotations.xml",
				synchronizationMode: "None",
				serviceUrl: serviceUrl
			};
			var modelBP = new ODataModel(mParameters);

			//var smartTable = thisView.byId("idMainTable");
			//var table = smartTable.getTable();
			//modelBP.setData(result);

			var r = result;

		},

		onSelectionChange: function(oEvent) {
			var thisView = this.getView("");
			thisView.setBusy(true);
			var oTable = thisView.byId("idMainTable");
			var oSelectedItem = oEvent.getParameter("listItem");
			var path = oSelectedItem.getBindingContext().getPath();
			var balancesModel = oTable.getModel();
			var CardCode = balancesModel.getProperty(path + "/CardCode");
			var localModel = this.getOwnerComponent().getModel("local");
			localModel.setProperty("/cardCode", CardCode);
			this.getRouter().navTo("statement");
			//thisView.setBusy(false);
		},

		fetchMain: function() {
			var thisView = this.getView();
			thisView.setBusy(true);
			// set the queryParams model
			var queryModel = models.createQueryModel();
			queryModel.setProperty("/method", "GET");
			queryModel.setProperty("/command", "BusinessPartners");

			// "sml.svc/K2P_VENDOR_UNION_ALL"
			var queryParams = "";
			/* =
				"?$select=CardCode,CardName,CurrentAccountBalance&$orderby=CardName&$filter=CardType eq 'cCustomer' and CurrentAccountBalance ne 0"*/
			queryModel.setProperty("/queryParams", queryParams);
			//fetch data
			K2PUtils.getpostputpatch(this, queryModel, this.fetchMainCallBack);

			//and CardCode eq  '" +				CardCode + "'";

		},
		fetchMainCallBack: function(callingController, queryModel, result) {

			var errorCode = queryModel.getProperty("/errorCode");
			var thisView = callingController.getView();
			var component = callingController.getOwnerComponent();
			var BPModel = component.getModel("BP");

			if (errorCode === 0) {
				//dfltModel.setData(result);
				//var smartTable = thisView.byId("idMainTable");
				//var table = smartTable.getTable();

				//var oModel = thisView.getModel();

				thisView.setModel(BPModel);
				//thisView.rebindTable();

			} else {
				//Try to re-login. If successful try fetch again once. 
				K2PLogin.slLogin(this, this.slLoginCallBack, true);

				var message = "fetchMain: " + queryModel.getProperty("/error") + " Code:" + errorCode.toString();
				K2PUtils.errorMessageBox(component, "", message);
			}
			thisView.setBusy(false);

		}

	});

});