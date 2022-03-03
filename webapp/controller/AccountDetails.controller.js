sap.ui.define([
	"K2PPM_PM/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("K2PPM_PM.controller.AccountDetails", {
	    

		onInit: function() {
			//var oRouter = this.getRouter();
			//oRouter.getRoute("accountDetails").attachMatched(this._onRouteMatched, this);

			//var target = oRouter.getTarget("statement");
			//target.attachDisplay(this._onViewDisplay, this);
			thisView.setModel(models.createQueryModel(), "qParams");
			
			

		},
		

		    
		    
		    

		onBeforeRendering: function(oEvent) {
		    
		    var BPModel = this.getOwnerComponent().getModel("bp");
		    var thisView = this.getView();
		    thisView.setModel(BPModel, "bp");
		    
		    
		    
			/*		    var oArgs, oView;
		    oView = this.getView();
		    //oArgs = oEvent.getParameter("arguments");
		    //var cardCode = oArgs.cardCode;
		    var oModel = new sap.ui.model.json.JSONModel();
		    var oTable = oView.byId("idMainTable");
			oTable.setModel(oModel);
		    this.fetchInvoices(oView, "KYLEEC");*/

		},

		_onViewDisplay: function(oEvent) {

		},

		onListItemPressed: function(oEvent) {
			/*	var oItem, oCtx;

			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();

					this.getRouter().navTo("employee",{
				employeeId : oCtx.getProperty("EmployeeID")
			});*/

		}

/*		_onRouteMatched: function(oEvent) {
			var oArgs, oView;
			var localModel = this.getOwnerComponent().getModel("local");
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			var cardCode = localModel.getProperty("/cardCode");
			this.fetchInvoices(oView,  cardCode);

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
			});
		},*/
		


	});

});