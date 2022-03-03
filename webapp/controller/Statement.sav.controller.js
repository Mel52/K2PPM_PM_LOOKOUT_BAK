sap.ui.define([
	"K2PPM_PM/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("K2PPM_PM.controller.Statement", {

		onInit: function() {
			var oRouter = this.getRouter();
			oRouter.getRoute("statement").attachMatched(this._onRouteMatched, this);

			//var target = oRouter.getTarget("statement");
			//target.attachDisplay(this._onViewDisplay, this);

		},

		onAfterRendering: function(oEvent) {
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
			var oItem, oCtx;

			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();

			/*			this.getRouter().navTo("employee",{
				employeeId : oCtx.getProperty("EmployeeID")
			});*/

		},

		_onRouteMatched: function(oEvent) {
			var oArgs, oView;
			var localModel = this.getOwnerComponent().getModel("local");
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			var cardCode = localModel.getProperty("/cardCode");
			this.fetchInvoices(oView, cardCode);

			/*		oView.bindElement({
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
		},

		fetchInvoices: function(thisView, CardCode) {
			thisView.setBusy(true);
			var localModel = this.getOwnerComponent().getModel("local");
			var destination = localModel.getProperty("/destination");

			var surl = destination +
				"Invoices?$select=DocNum,CardCode,DocEntry,Comments,DocDueDate,DocTotal,TaxExtension&$orderby=DocEntry&$top=10&$filter=DocumentStatus eq 'O' and CardCode eq  '" +
				CardCode + "'";
			$.ajax({
				type: "GET",
				//url: "/destinations/hanab1vm2/Items",
				//url: "/destinations/hanab1vm2/Invoices?$select=DocNum,CardName,Address,DocDueDate,DocTotal&$orderby=DocEntry&$top=10&$skip=1$filter=DocumentStatus eq 'O'",
				url: surl,
				//url: "/destinations/hanab1vm2/Invoices",
				xhrFields: {
					withCredentials: true
				},
				error: function() {
					thisView.setBusy(false);
					$.sap.log.error("Statement.fetchInvoices: error");
				}
			}).done(function(results1) {
				if (results1) {
					//sap.m.MessageToast.show("Results: " + results.ItemCode);
					//console.log(results.value);
					var oTable = thisView.byId("idMainTable");
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(results1);
					oTable.setModel(oModel);

					/*					var oController = sap.ui.controller("MyAppMyApp.controller.View1");
					var today = new Date();
					var dd = oController.addZero(today.getDate());
					var MM = oController.addZero(today.getMonth() + 1);
					var yyyy = today.getFullYear();
					var sToday = yyyy + "-" + MM + "-" + dd;*/

					//var localModel = thisView.getModel("local");
					//localModel.setProperty("/PmtDate", sToday);

				} else {
					sap.m.MessageToast.show("No Invoices");
				}
				thisView.setBusy(false);
			});

		}
	});

});