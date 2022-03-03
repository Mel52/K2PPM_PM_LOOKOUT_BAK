sap.ui.define([
	"K2PPM_PM/controller/BaseController",
	"K2PPM_PM/model/models",
	"sap/ui/model/odata/v4/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/m/MessageToast"
], function(BaseController, models, ODataModel, JSONModel, Sorter, Filter, FilterOperator, FilterType, MessageToast) {
	"use strict";

	return BaseController.extend("K2PPM_PM.controller.ChargeTypes", {

		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("chargetypes").attachMatched(this._onRouteMatched, this);

			var thisView = this.getView();

			var oComponent = this.getOwnerComponent();
			var i18nModel = oComponent.getModel("i18n");
			var title = i18nModel.getProperty("chargeTypes");

			var oViewModel = models.createViewModel();
			oViewModel.setProperty("/headerText", title);
			thisView.setModel(oViewModel, "view");

			var oJSONData = {
				busy: false,
				hasUIChanges: false,
				codeEmpty: true,
				order: 0
			};
			var oModel = new JSONModel(oJSONData);
			this.getView().setModel(oModel, "appView");
			this.getView().setModel(models.createQueryModel(), "qParams");
			//thisView.byId("chargeTypesTable").getBinding("items").sort("asc" && new Sorter("Code", false));

			//var target = oRouter.getTarget("statement");
			//target.attachDisplay(this._onViewDisplay, this);

		},
		onCreate: function() {
			var oTable = this.byId("chargeTypesTable"),
				oBinding = oTable.getBinding("items"), //get the binding for the model "items" 
				oContext = oBinding.create({
					"Code": "",
					"Name": "",
					"U_Amt": "0",
					"U_BillFreq": "M"
				}, false);

			//this._setUIChanges();
			this.getView().getModel("appView").setProperty("/codeEmpty", true);
			/*
            //This section is supposed to set the focus on the new line.
			oTable.getItems().some(function(oItem) {
				if (oItem.getBindingContext() === oContext) {
					oItem.focus();
					oItem.setSelected(true);
					return true;
				}
			});*/
		},
		onRefresh: function() {
			var oBinding = this.byId("chargeTypesTable").getBinding("items");

			if (oBinding.hasPendingChanges()) {
				//MessageBox.error(this._getText("refreshNotPossibleMessage"));
				return;
			}
			oBinding.refresh();
			//MessageToast.show(this._getText("refreshSuccessMessage"));
		},
		onSave: function() {
			var fnSuccess = function() {
				this._setBusy(false);
				MessageToast.show(this._getText("changesSentMessage"));
				this._setUIChanges(false);
			}.bind(this);

			var fnError = function(oError) {
				this._setBusy(false);
				this._setUIChanges(false);
				MessageToast.show(oError.message);
			}.bind(this);

			this._setBusy(true); // Lock UI until submitBatch is resolved.
			this.getView().getModel().submitBatch("peopleGroup").then(fnSuccess, fnError);
			this._bTechnicalErrors = false; // If there were technical errors, a new save resets them.
		},
		onResetChanges: function() {
			this.byId("peopleList").getBinding("items").resetChanges();
			this._bTechnicalErrors = false;
			this._setUIChanges();
		},

		onSearch: function() {
			var oView = this.getView(),
				sValue = oView.byId("searchField").getValue(),
				oFilter = new Filter("Code", FilterOperator.Contains, sValue);

			oView.byId("chargeTypesTable").getBinding("items").filter(oFilter, FilterType.Application);
		},

		/*
		 * Sort the table according to the Code.
		 * Cycles between the three sorting states "none", "ascending" and "descending"
		 */
		onSort: function() {
			var oView = this.getView(),
				aStates = [undefined, "asc", "desc"],
				aStateTextIds = ["sortNone", "sortAscending", "sortDescending"],
				sMessage,
				iOrder = oView.getModel("appView").getProperty("/order");

			// Cycle between the states
			iOrder = (iOrder + 1) % aStates.length;
			var sOrder = aStates[iOrder];

			oView.getModel("appView").setProperty("/order", iOrder);
			oView.byId("chargeTypesTable").getBinding("items").sort(sOrder && new Sorter("Code", sOrder === "desc"));

			sMessage = this._getText("sortMessage", [this._getText(aStateTextIds[iOrder])]);
			MessageToast.show(sMessage);
		},
		_setBusy: function(bIsBusy) {
			var oModel = this.getView().getModel("appView");
			oModel.setProperty("/busy", bIsBusy);
		},

		_getText: function(sTextId, aArgs) {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sTextId, aArgs);
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

		onTestNow: function() {
			/*		    	var oModel = this.getOwnerComponent().getModel("b1");
			 */

			var oModel = new ODataModel({
				serviceUrl: "https://hanab1:4300/K2PPM_SERVER/xsjs/QuerySL.xsjs/UDO_K2P_CHRGTYPE/",
				synchronizationMode: "None",
				autoExpandSelect: false,
				operationMode: "Server",
				groupId: "$direct"

			});

			var oView = this.getView();
			oView.setModel(oModel);
			oView.bindElement("/UDO_K2P_CHRGTYPE('REPAIR')");

			/*
			
		
		
			var httpHeaders;
			httpHeaders = oModel.getHttpHeaders();
			httpHeaders.B1SESSION = "b148ab6a-cc4b-11ea-8000-000c294df046";
			httpHeaders.ROUTEID = ".node1";
			oModel.changeHttpHeaders(httpHeaders);*/

			//oView.bindElement("/UDO_K2P_CHRGTYPE('REPAIR')");

		},

		onBeforeRendering: function(oEvent) {

		},

		onAfterRendering: function(oEvent) {

		},

		_onViewDisplay: function(oEvent) {

		},

		onListItemPressed: function(oEvent) {

		},

		_onRouteMatched: function(oEvent) {

		}

	});

});