sap.ui.define([
	"K2PPM_PM/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("K2PPM_PM.controller.App", {

		onInit: function() {
			var oRouter = this.getRouter();
			//oRouter.getRoute("statement").attachMatched(this._onRouteMatched, this);
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			//var target = oRouter.getTarget("statement");
			//target.attachDisplay(this._onViewDisplay, this);

		},

		onAfterRendering: function(oEvent) {
			
	
			

		},

		_onViewDisplay: function(oEvent) {
		    
		    

		},

		onListItemPressed: function(oEvent) {
			var oItem, oCtx;

			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();

			/*			this.getRouter().navTo("employee",{
				employeeId : oCtx.getProperty("EmployeeID")
			});*/

		},

		_onRouteMatched: function(oEvent) {
			/*var oView;
			oView = this.getView();
			this.fetchRentRoll(oView);

					oView.bindElement({
				path: "/Employees(" + oArgs.employeeId + ")",
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function(oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function(oEvent) {
						oView.setBusy(false);
					}
				}
			});*/
		}


	});

});