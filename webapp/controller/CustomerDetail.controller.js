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
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment"
], function(BaseController, K2PUtils, models, JSONModel, ODataModel, Sorter, Filter, FilterOperator, FilterType, MessageBox, MessageToast,
	Fragment) {
	"use strict";
	return BaseController.extend("K2PPM_PM.controller.CustomerDetail", {

		onInit: function() {

			this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode
			this.getView().setBusy(true);

			var oRouter = this.getRouter();
			oRouter.getRoute("customerDetails").attachMatched(this._onRouteMatched, this);

			var oModel = new JSONModel();
			oModel.setProperty("/CardName", "");
			oModel.setProperty("/CardCode", "");
			oModel.setProperty("/Lease", 0);
			oModel.setProperty("/BegBal", 0);
			oModel.setProperty("/EndBal", 5);
			oModel.setProperty("/Balance", 0);
			oModel.setProperty("/PropertyName", "");
			this.getView().setModel(oModel, "viewModel");

			oModel = new JSONModel();
			this.getView().setModel(oModel, "leaseModel");

			this.getView().setBusy(false);
		},
		_onRouteMatched: function() {

		},
		onOpen: function() {


			var viewModel = this.getView().getModel("viewModel");
			var cardCode = viewModel.getProperty("/CardCode");
			if (!cardCode) {
				return;
			}

			var oBinding = this.getView().byId("idMainTable").getBinding("items");
			var sFilter = "CardType eq \'C\' and CardCode eq \'" + cardCode + "\'";
			sFilter = sFilter + " and NetOpen ne 0";
			var oParameters = {
				$filter: sFilter
			};
			oBinding.changeParameters(oParameters);

			oBinding.refresh();

			var balance = viewModel.getProperty("/Balance");
			viewModel.setProperty("/EndBal", balance);
			viewModel.setProperty("/BegBal", 0);

			//getBegBal

		},
		onAll: function() {
/*			var dateRange1 = this.getView().byId("dateRange1");
			dateRange1.setStart(null);
			dateRange1.setTo(null);*/
			var viewModel = this.getView().getModel("viewModel");
			var cardCode = viewModel.getProperty("/CardCode");
			if (!cardCode) {
				return;
			}
			var oBinding = this.getView().byId("idMainTable").getBinding("items");
			var sFilter = "CardType eq \'C\' and CardCode eq \'" + cardCode + "\'";
			var oParameters = {
				$filter: sFilter
			};
			oBinding.changeParameters(oParameters);

			oBinding.refresh();

			var balance = viewModel.getProperty("/Balance");
			viewModel.setProperty("/BegBal", 0);
			viewModel.setProperty("/EndBal", balance);

		},
		dateRangeChange: function(oEvent) {
			var sFrom = oEvent.getParameter("from");
			var from = sFrom;
			var sTo = oEvent.getParameter("to");
			var dtFrom = new Date(sFrom);
			var dtTo = new Date(sTo);
			sFrom = K2PUtils.formatDate(dtFrom);
			sTo = K2PUtils.formatDate(dtTo);
			var viewModel = this.getView().getModel("viewModel");
			var cardCode = viewModel.getProperty("/CardCode");

			var oBinding = this.getView().byId("idMainTable").getBinding("items");
			var sFilter = "CardType eq \'C\' and CardCode eq \'" + cardCode + "\'";
			if (from) {
				sFilter = sFilter + "and (TaxDate ge \'" + sFrom + "\' and TaxDate le \'" + sTo + "\' ) ";
			}

			var oParameters = {
				$filter: sFilter
			};
			oBinding.changeParameters(oParameters);

			oBinding.refresh();
			//GET Beginning Balance
			var path2 = "/sml.svc/K2P_CUSTOMER_DETAILS_QUERY";
			var qParams2 = "?$filter=CardType eq \'C\' and CardCode eq \'" + cardCode + "\' and TaxDate lt \'" + sFrom +
				"\'&$apply=aggregate(Net with sum as TotalNet)";
			K2PUtils.getByPath(this, path2, qParams2, this.begBalCallBack, "qparamsBegBal", 0);
			//
			var path3 = "/sml.svc/K2P_CUSTOMER_DETAILS_QUERY";
			var qParams3 = "?$filter=CardType eq \'C\' and CardCode eq \'" + cardCode + "\' and TaxDate lt \'" + sTo +
				"\'&$apply=aggregate(Net with sum as TotalNet)";
			K2PUtils.getByPath(this, path3, qParams3, this.endBalCallBack, "qparamsEngBal", 0);

		},

		begBalCallBack: function(callingController, results, callback2, oThis, qNameIn) {

			var thisView = callingController.getView();
			var viewModel = thisView.getModel("viewModel");
			var model = new JSONModel();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			//var lease;
			//lease = 0;
			viewModel.setProperty("/BegBal", 0);
			//viewModel.setProperty("/EndBal", 0);

			var i18n;
			if (errorCode === 0) {
				model.setData(results);
				var balance = model.getProperty("/value/0/TotalNet");
				if (balance) {
					viewModel.setProperty("/BegBal", balance);
				}

			} else //handle error
			{

				var sMessage = "leaseCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				viewModel.setProperty("/Balance", 0);
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},
		endBalCallBack: function(callingController, results, callback2, oThis, qNameIn) {

			var thisView = callingController.getView();
			var viewModel = thisView.getModel("viewModel");
			var model = new JSONModel();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			//var lease;
			//lease = 0;
			viewModel.setProperty("/EndBal", 0);
			//viewModel.setProperty("/EndBal", 0);

			var i18n;
			if (errorCode === 0) {
				model.setData(results);
				var balance = model.getProperty("/value/0/TotalNet");
				if (balance) {
					viewModel.setProperty("/EndBal", balance);
				}

			} else //handle error
			{

				var sMessage = "leaseCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				viewModel.setProperty("/Balance", 0);
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},

		getBP: function(path, cardCode) {

			var vBox1 = this.getView().byId("VBox1");
			var mainModel = this.getOwnerComponent().getModel();

			var oContext = new sap.ui.model.Context(mainModel, path);

			vBox1.setBindingContext(oContext);

			//set binding parameters for table
			/*			var maintTable = this.getView("idMainTable");
			var oBinding = maintTable.getBinding("items");*/
			var oBinding = this.getView().byId("idMainTable").getBinding("items");
			var sFilter = "CardType eq \'C\' and CardCode eq \'" + cardCode + "\'";
			sFilter = sFilter + " and NetOpen ne 0";
			var oParameters = {
				$filter: sFilter
			};
			oBinding.changeParameters(oParameters);

			oBinding.refresh();

			var qParams = "?$filter=U_CardCode eq \'" + cardCode +
				"\'&$orderby=DocNum desc&$select=DocNum,U_Property,U_UnitID,U_Status,U_PossesDt,U_MvOutDt,U_FromDt,U_EndDt";
			K2PUtils.getByPath(this, "UDO_K2P_LEASE", qParams, this.leaseCallBack, "qparamsLease", 0);

			var path2 = "BusinessPartners(\'" + cardCode + "\')";
			var qParams2 = "?$select=CurrentAccountBalance";
			K2PUtils.getByPath(this, path2, qParams2, this.bPCallBack, "qparamsBP", 0);

		},
		leaseCallBack: function(callingController, results, callback2, oThis, qNameIn) {

			var thisView = callingController.getView();
			//var viewModel = thisView.getModel("viewModel");
			var leaseModel = thisView.getModel("leaseModel");
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			//var lease;
			//lease = 0;
			//viewModel.setProperty("/Lease", lease);

			var i18n;
			leaseModel.setData(results);
			if (errorCode === 0) {
				var property = leaseModel.getProperty("/value/0/U_Property");
				var path2 = "UDO_K2P_PROPERTY(\'" + property + "\')";
				var qParams2 = "?$select=Name";
				K2PUtils.getByPath(callingController, path2, qParams2, callingController.propertyCallBack, "qparamsProp", 0);

				/*				leaseModel.setData(results);
				var valueArray = leaseModel.getProperty("/value");
				if (valueArray.length > 0) {
					lease = leaseModel.getProperty("/value/0/DocNum");
				}
				viewModel.setProperty("/Lease", lease);
*/
			} else //handle error
			{

				var sMessage = "leaseCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},
		bPCallBack: function(callingController, results, callback2, oThis, qNameIn) {

			var thisView = callingController.getView();
			var viewModel = thisView.getModel("viewModel");
			var bPModel = new JSONModel();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			//var lease;
			//lease = 0;
			viewModel.setProperty("/Balance", 0);
			viewModel.setProperty("/EndBal", 0);

			var i18n;
			if (errorCode === 0) {
				bPModel.setData(results);
				var balance = bPModel.getProperty("/CurrentAccountBalance");
				viewModel.setProperty("/Balance", balance);
				viewModel.setProperty("/EndBal", balance);
			} else //handle error
			{

				var sMessage = "leaseCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				viewModel.setProperty("/Balance", 0);
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},
		propertyCallBack: function(callingController, results, callback2, oThis, qNameIn) {

			var thisView = callingController.getView();
			var viewModel = thisView.getModel("viewModel");
			var model = new JSONModel();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			//var lease;
			//lease = 0;
			viewModel.setProperty("/PropertyName", "");

			var i18n;
			if (errorCode === 0) {
				model.setData(results);
				var name = model.getProperty("/Name");
				viewModel.setProperty("/PropertyName", name);
			} else //handle error
			{

				var sMessage = "leaseCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				viewModel.setProperty("/Balance", 0);
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},

		onValueHelpRequestCustomer: function(oEvent) {

			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();

			var sourceID = oEvent.getParameter("id");

			if (!this._pValueHelpDialogCustomer) {
				this._pValueHelpDialogCustomer = Fragment.load({
					id: "Dialog1", //oView.getId(),
					name: "K2PPM_PM.K2PUtils.CustomerDialog",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._pValueHelpDialogCustomer.then(function(oDialog) {
				// Create a filter for the binding
				oDialog.getBinding("items").filter([new Filter("CardName", FilterOperator.StartsWith, sInputValue)]);
				// Open ValueHelpDialog filtered by the input'	s value oDialog.open(sInputValue);
				oDialog.open(sInputValue);
			});
		},
		onValueHelpClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var id = oEvent.getParameter("id");
			var oThis = this;
			var viewModel = this.getView().getModel("viewModel");
			if (!oSelectedItem) {
				return;
			}
			var path = oSelectedItem.getBindingContext().getPath();
			var sTitle, sValue;
			try {
				sTitle = oSelectedItem.getTitle();
				sValue = oSelectedItem.getDescription();
			} catch (e)
			//skip error
			{}

			switch (id) {

				case "Dialog1--selectCustomer":

					viewModel.setProperty("/CardName", sTitle);
					viewModel.setProperty("/CardCode", sValue);
					this.getBP(path, sValue);

					break;

			}
		},

		onValueHelpSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var id = oEvent.getParameter("id");
			var sKeyName = "";

			switch (id) {

				case "Dialog1--selectCustomer":

					sKeyName = "CardName";
					break;

			}

			var oFilter = new Filter(sKeyName, FilterOperator.StartsWith, sValue);

			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onNavBack: function() {
			this.getRouter().navTo("home");
		}
	});

});