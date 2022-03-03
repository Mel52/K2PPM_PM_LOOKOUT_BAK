sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"K2PPM_PM/K2PUtils/K2PUtils",
	"K2PPM_PM/model/models",
	"sap/ui/model/odata/v4/ODataModel"
], function(Controller, History, K2PUtils, models, ODataModel) {
	"use strict";

	return Controller.extend("K2PPM_PM.controller.BaseController", {

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onNavBack: function(oEvent) {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("", {}, true /*no history*/ );
			}
		},
		onNavLogout: function(oEvent) {
			
			K2PUtils.slLogout(this);
		},
		onNavHome: function(oEvent) {
			this.getRouter().navTo("home");
		},

		onDataReceived: function(data, error) {
			var params = data.getParameters();
			if (params.error) {
				sap.m.MessageBox.alert(params.error.toString());
			} else {
				var d = data;
				d = d;
			}
		}

		/*,
		fetchFirst: function () {
			var thisView = this.getView();
			var qParamsModel = thisView.getModel("qParams");
			if (qParamsModel.getProperty("/page") > 1) {
				qParamsModel.setProperty("/page", 2);
				K2PUtils.fetchPreviousPage(this.oView.oController, K2PUtils.fetchMainCallBack);
			}
		},
		fetchNext: function () {
			var thisView = this.getView();
			var oController = thisView.getController();
			K2PUtils.fetchNext(oController, K2PUtils.fetchMainCallBack);
		},
		fetchPrevious: function () {
			K2PUtils.fetchPreviousPage(this.oView.oController, K2PUtils.fetchMainCallBack);
		},
		fetchLast: function () {
			var thisView = this.getView();
			var qParamsModel = thisView.getModel("qParams");
			var totalPages = qParamsModel.getProperty("/totalPages");
			var page = qParamsModel.getProperty("/page");
			if (page !== totalPages) {
				var pagePlusOne = totalPages + 1;
				qParamsModel.setProperty("/page", pagePlusOne);
				K2PUtils.fetchPreviousPage(this.oView.oController, K2PUtils.fetchMainCallBack);
			}
		}*/
	});
});