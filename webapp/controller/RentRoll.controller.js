sap.ui.define([
	"K2PPM_PM/controller/BaseController",
	"../K2PUtils/K2PUtils",
	"K2PPM_PM/model/models",
	"sap/ui/model/odata/v4/ODataModel"
], function(BaseController, K2PUtils, models, ODataModel) {
	"use strict";

	return BaseController.extend("K2PPM_PM.controller.RentRoll", {

		onInit: function() {

			var oRouter = this.getRouter();
			oRouter.getRoute("rentroll").attachMatched(this._onRouteMatched, this);
			this.getView().setModel(models.createQueryModel(), "qParams");
		},
		_onRouteMatched: function() {

			this.fetchMain(this, false);

		},

		fetchMain: function() {

			var thisView = this.getView();
			/*
			var qParamsModel = models.createQueryModel();
			thisView.setModel(qParamsModel, "qParams");
			var surl = qParamsModel.getProperty("/url") + qParamsModel.getProperty("/sl") + "sml.svc/";
			var oModel = new ODataModel({
				serviceUrl: surl,
				synchronizationMode: "None",
				earlyRequests: false,
				groupId: "$direct",
				autoExpandSelect: true,
				operationMode: "Server",
				groupProperties: {
					"FavoriteProductGroup": {
						"submit": "Auto"
					},
					"myAutoGroup": {
						"submit": "Auto"
					},
					"myDirectGroup": {
						"submit": "Direct"
					}
				}
			});
			
			
			
			,
					"operationMode": "Server",
					"autoExpandSelect": true,
					"UpdateGroup": {
						"submit": "API"
					}
			
							,
					"SalesOrderUpdateGroup": {
						"submit": "API"
					}
			*/
			var oComponent = this.getOwnerComponent();
			var oModel = oComponent.getModel("semanticLayer");
			thisView.setModel(oModel);

			//var mainTable = thisView.byId("idMainTable");
			//var oBinding = mainTable.getBinding("items");
			//oBinding.refresh();

		},

		fetchMainOld: function(callingController, retry) {
			var thisView = this.getView();
			var qParamsModel = models.createQueryModel();
			var sl = qParamsModel.getProperty("/sl");
			sl = sl + "sml.svc/";
			qParamsModel.setProperty("/sl", sl);
			thisView.setBusy(true);

			// set the queryParams model
			thisView.setModel(qParamsModel, "qParams");
			qParamsModel.setProperty("/method", "GET");
			qParamsModel.setProperty("/command", "K2P_RENTROLL");
			qParamsModel.setProperty("/data", null);
			qParamsModel.setProperty("/retry", retry);
			qParamsModel.setProperty("/firstFetch", true);
			qParamsModel.setProperty("/queryParams", "?$inlinecount=allpages");

			K2PUtils.getpostputpatch(callingController, K2PUtils.fetchMainCallBack);
		}

		/*,

		// override the parent's onNavBack (inherited from BaseController)
		onNavBack : function (oEvent){
			// in some cases we could display a certain target when the back button is pressed
			if (this._oData && this._oData.fromTarget) {
				this.getRouter().getTargets().display(this._oData.fromTarget);
				delete this._oData.fromTarget;
				return;
			}

			// call the parent's onNavBack
			BaseController.prototype.onNavBack.apply(this, arguments);
		}
*/
	});

});