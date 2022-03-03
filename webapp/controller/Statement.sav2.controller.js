sap.ui.define([
	"K2PPM_PM/controller/BaseController",
	"K2PPM_PM/K2PUtils/K2PUtils",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(BaseController, K2PUtils, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("K2PPM_PM.controller.Statement", {

		onInit: function() {
			//var oRouter = this.getRouter();
			//oRouter.getRoute("statement").attachMatched(this._onRouteMatched, this);

			//var target = oRouter.getTarget("statement");
			//target.attachDisplay(this._onViewDisplay, this);

		},

		/*		_onViewDisplay: function() {

			//$.sap.log.error("Statement - ViewDisplay");

			var localModel = this.getOwnerComponent().getModel("local");
			var statementModel = this.getOwnerComponent().getModel("statement");
			
			var DP1 = this.byId("DP1");
			DP1.setDateValue(new Date());

			var thisView = this.getView();
			var oTable = thisView.byId("idMainTable");

			this.setStatementModel(thisView, false);
			var radioBtnGrp = thisView.byId("__group1");
			var btnACH = thisView.byId("__button4");
			radioBtnGrp.setSelectedButton(btnACH);
			this.setPmtControls(true, thisView);

			var payment = localModel.getProperty("/Payment");
			if (payment === 0) {
				oTable.selectAll();
				this.resetAmountToPay(true);
				K2PUtils.resetPmtTotal(localModel, statementModel);
			} else {
				K2PUtils.resetPmtTotal(localModel, statementModel);
			}
		},*/

		setStatementModel: function(thisView, bSelectAll) {
/*
			var oController = thisView.getController();
			var oTable = thisView.byId("idMainTable");
			var statementModel = oTable.getModel;

			//var statementModel = oController.getOwnerComponent().getModel("statement");
			var localModel = oController.getOwnerComponent().getModel("local");
			var oTable = thisView.byId("idMainTable");
			oTable.setModel(statementModel);
			oTable.alternateRowColors = true;
			if (bSelectAll) {
				oTable.selectAll();
				K2PUtils.resetPmtTotal(localModel, statementModel);
			}
		*/
		},

		/*
		onListItemPressed: function(oEvent) {
			var oItem, oCtx;

			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();

					this.getRouter().navTo("employee",{
				employeeId : oCtx.getProperty("EmployeeID")
			});

		},
		*/

		_onRouteMatched: function(oEvent) {
			/*
			var oArgs, oView;
			var localModel = this.getOwnerComponent().getModel("local");
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			var cardCode = localModel.getProperty("/cardCode");
			this.fetchInvoices(oView, cardCode);
		*/
		},

		onInvoiceSelectionChange: function(oEvent) {
			//var thisView = this.getView("");
			//var oTable = thisView.byId("idMainTable");

			var statementModel = this.getOwnerComponent().getModel("statement");
			var localModel = this.getOwnerComponent().getModel("local");

			/*			var oComponent = this.getOwnerComponent;
			var statementModel = oComponent.getModel("statement");
			var localModel = oComponent.getModel("local");*/

			//var aPaths = oTable.getSelectedContextPaths();

			//var oModel = oTable.getModel();
			//var amount = 0;
			var oSelectedItem = oEvent.getParameter("listItem");
			//var path = oSelectedItem.getBindingContext().getPath();
			var bSelected = oEvent.getParameter("selected");
			var bselectAll = oEvent.getParameter("selectAll");
			//var length;
			//var i;
			//var aItemArray;
			//aItemArray = oModel.getProperty("/value/");

			this.resetAmountToPay(bselectAll, oSelectedItem, bSelected);

			/*			var items = "";
			jQuery.each(oTable.getSelectedContextPaths(), function(id, value) {
				if (items === "") {
					items = value;
				} else {
					items = items + ";" + value;
				}
			});
			var aAllItems = items.split(";");

			if (bselectAll) {
				length = aItemArray.length;
				amount = 0;
				for (i = 0; i < length; i++) {
					amount = oModel.getProperty("/value/" + i.toString() + "/DocTotal");
					oModel.setProperty("/value/" + i.toString() + "/U_JC1_Amount", amount, false);
				}

			} else {

				if (bSelected) {
					amount = oModel.getProperty(path + "/DocTotal");
					oModel.setProperty(path + "/U_JC1_Amount", amount, false);
				} else {
					var testPath = "";
					amount = 0;
					var oIndex;
					for (i = 0; i < aItemArray.length; i++) {
						testPath = "/value/" + i.toString();
						oIndex = aAllItems.indexOf(testPath);
						if (oIndex > -1) {
							//do nothing
						} else {
							//not selected so set to zero
							oModel.setProperty("/value/" + i.toString() + "/U_JC1_Amount", amount, false);
						}
					}
				}
			}*/

			K2PUtils.resetPmtTotal(localModel, statementModel);

		},

		resetAmountToPay: function(bselectAll, oSelectedItem, bSelected) {

			//Reset the amount to pay by adding up all the selected (checked) items.

			//
			var thisView = this.getView();
			var oTable = thisView.byId("idMainTable");
			var statementModel = oTable.getModel;

			var amount = 0;
			var length;
			var i;
			var aItemArray;
			aItemArray = statementModel.getProperty("/value/");

			if (bselectAll) {
				length = aItemArray.length;
				amount = 0;
				for (i = 0; i < length; i++) {
					amount = statementModel.getProperty("/value/" + i.toString() + "/DocTotal");
					statementModel.setProperty("/value/" + i.toString() + "/U_JC1_Amount", amount, false);
				}

			} else {
				var path = oSelectedItem.getBindingContext().getPath();

				var items = "";
				jQuery.each(oTable.getSelectedContextPaths(), function(id, value) {
					if (items === "") {
						items = value;
					} else {
						items = items + ";" + value;
					}
				});
				var aAllItems = items.split(";");

				if (bSelected) {
					amount = statementModel.getProperty(path + "/DocTotal");
					statementModel.setProperty(path + "/U_JC1_Amount", amount, false);
				} else {
					var testPath = "";
					amount = 0;
					var oIndex;
					for (i = 0; i < aItemArray.length; i++) {
						testPath = "/value/" + i.toString();
						oIndex = aAllItems.indexOf(testPath);
						if (oIndex > -1) {
							//do nothing
						} else {
							//not selected so set to zero
							statementModel.setProperty("/value/" + i.toString() + "/U_JC1_Amount", amount, false);
						}
					}
				}
			}

		},

		pmtTypeSelect: function(oEvent) {
			var oParameters;
			var thisView = this.getView();

			oParameters = oEvent.getParameters();

			this.setPmtControls(oParameters.selectedIndex, thisView);
			/*
			if (oParameters.selectedIndex === 0) {
				this.setPmtControls(true, thisView);
			} else if (oParameters.selectedIndex === 1) {
				this.setPmtControls(false, thisView);
			}
			*/
		},

		setPmtControls: function(selectedIndex, thisView) {
			var oControl;

			if (selectedIndex === 0) {
				oControl = thisView.byId("cryptoQR");
				oControl.setVisible(false);
				oControl = thisView.byId("lCheckNbr");
				oControl.setVisible(false);
				oControl = thisView.byId("CheckNbr");
				oControl.setVisible(false);
				oControl = thisView.byId("lCC");
				oControl.setVisible(false);
				oControl = thisView.byId("CC");
				oControl.setVisible(false);
				oControl = thisView.byId("lExpDt");
				oControl.setVisible(false);
				oControl = thisView.byId("ExpDt");
				oControl.setVisible(false);
				oControl = thisView.byId("lSecCode");
				oControl.setVisible(false);
				oControl = thisView.byId("SecCode");
				oControl.setVisible(false);
			} else if (selectedIndex === 1) {
				oControl = thisView.byId("cryptoQR");
				oControl.setVisible(false);
				oControl = thisView.byId("lCheckNbr");
				oControl.setVisible(false);
				oControl = thisView.byId("CheckNbr");
				oControl.setVisible(false);
				oControl = thisView.byId("lCC");
				oControl.setVisible(true);
				oControl = thisView.byId("CC");
				oControl.setVisible(true);
				oControl = thisView.byId("lExpDt");
				oControl.setVisible(true);
				oControl = thisView.byId("ExpDt");
				oControl.setVisible(true);
				oControl = thisView.byId("lSecCode");
				oControl.setVisible(true);
				oControl = thisView.byId("SecCode");
				oControl.setVisible(true);
			} else if (selectedIndex === 2) {
				oControl = thisView.byId("cryptoQR");
				oControl.setVisible(false);
				oControl = thisView.byId("lCheckNbr");
				oControl.setVisible(true);
				oControl = thisView.byId("CheckNbr");
				oControl.setVisible(true);
				oControl = thisView.byId("lCC");
				oControl.setVisible(false);
				oControl = thisView.byId("CC");
				oControl.setVisible(false);
				oControl = thisView.byId("lExpDt");
				oControl.setVisible(false);
				oControl = thisView.byId("ExpDt");
				oControl.setVisible(false);
				oControl = thisView.byId("lSecCode");
				oControl.setVisible(false);
				oControl = thisView.byId("SecCode");
				oControl.setVisible(false);
			} else if (selectedIndex === 3) {
			    oControl = thisView.byId("cryptoQR");
				oControl.setVisible(true);
				oControl = thisView.byId("lCheckNbr");
				oControl.setVisible(false);
				oControl = thisView.byId("CheckNbr");
				oControl.setVisible(false);
				oControl = thisView.byId("lCC");
				oControl.setVisible(false);
				oControl = thisView.byId("CC");
				oControl.setVisible(false);
				oControl = thisView.byId("lExpDt");
				oControl.setVisible(false);
				oControl = thisView.byId("ExpDt");
				oControl.setVisible(false);
				oControl = thisView.byId("lSecCode");
				oControl.setVisible(false);
				oControl = thisView.byId("SecCode");
				oControl.setVisible(false);
			}
		
		}
		,

		onConfirmPayment: function() {
			K2PUtils.confirmAction(this.getOwnerComponent(), "confirmPayment ", this.onSubmitPayment, this.getView());

			/*			var i18nModel = this.getOwnerComponent().getModel("
						i18n ");
			var pmtMsg = i18nModel.getProperty("
						confirmPayment ");
			MessageBox.confirm(pmtMsg, {
				actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				onClose: function(sAction) {
					//MessageToast.show(sAction);
					if (sAction !== MessageBox.Action.CANCEL) {
						ocontroller.onSubmitPayment();
					}
				}
			});*/

		},

		onSubmitPayment: function(oComponent, thisView) {
			//var LogEntries = jQuery.sap.log.getLogEntries();
			var oController = thisView.getController;
			var localModel = oComponent.getModel("local ");
			var statementModel = oComponent.getModel("statement ");
			var setStatementModel = oController.setStatementModel;
			//var oController = this;
			var oPayment = new Object();
			var CardCode = localModel.getProperty("/cardCode ");
			oPayment.CardCode = CardCode;
			var DP1 = thisView.byId("DP1 ");
			var dt1 = DP1.getDateValue();
			oPayment.DocDate = dt1;
			oPayment.DueDate = dt1;
			oPayment.TaxDate = dt1;
			//oPayment.DocTotal = localModel.getProperty(" /
			Payment ");
			var oPaymentChecks = new Array(),
				oPaymentCheck = new Object();
			oPaymentCheck.CheckSum = localModel.getProperty(" /
				Payment ");
			oPaymentCheck.BankCode = localModel.getProperty(" / Bank ");
			oPaymentCheck.CheckNumber = localModel.getProperty(" /
				CheckNbr ");
			oPaymentCheck.DueDate = dt1;
			oPaymentChecks.push(oPaymentCheck);
			oPayment.PaymentChecks = oPaymentChecks;
			var oInvoices = new Array(),
				oInvoice = new Object();
			var DocEntry, amount, aItemArray;
			var oTable = thisView.byId("
			idMainTable ");
			var oModel = oTable.getModel();
			aItemArray = oModel.getProperty(" / value /
				");
			var totAmount = 0;

			for (var i = 0; i < aItemArray.length; i++) {
				DocEntry = oModel.getProperty(" / value /
				" + i.toString() + " / DocEntry ");
				amount = oModel.getProperty(" / value / " + i.toString() + " / U_JC1_Amount ");
				if (amount) {
					amount = parseFloat(amount);
					if (amount > 0) {
						oInvoice = new Object();
						oInvoice.DocEntry = DocEntry;
						oInvoice.SumApplied = amount;
						oInvoices.push(oInvoice);
						totAmount = totAmount + amount;
					}
				}
			}

			oPayment.PaymentInvoices = oInvoices;

			var data = JSON.stringify(oPayment);
			//var oLabel1 = thisView.byId("
			Label1 ");
			//oLabel1.setText(data);
			var surl = "
			https: //SU-9308-52.emea.businessone.cloud.sap/b1s/v1/IncomingPayments";

			$.ajax({
				type: "POST",
				url: surl,
				contentType: "application/json",
				dataType: "json",

				xhrFields: {
					withCredentials: true
				},
				data: data,
				error: function(xhr, status, error) {
					//oLabel1.setText(xhr.responseText);
					//sap.m.MessageToast.show(xhr.responseText);
					//jQuery.sap.log.error(xhr.responseText);
					$.sap.log.error(xhr.responseText);

					var jsonResponse = JSON.parse(xhr.responseText);
					var code = jsonResponse.error.code;
					var i18nKey;
					if (code == "-5003") {
						i18nKey = "errMsgPaymentDate";
					}
					K2PUtils.errorMessageBox(oComponent, i18nKey, jsonResponse.error.message.value);

					//var thisViewName = oController.getView().sViewname;
					//oController.postJC1_LOG(oController, "onSubmitPayment", status, error, "", xhr.responseText, surl, data);

					//ostJC1_LOG: function(oController, operation, status, error, webuser, response, Url, data ) {

				},
				success: function(json) {
					//oLabel1.setText("Success");
					sap.m.MessageToast.show("Payment Accepted");
					/*					localModel.setProperty("/CreditCard","");
										localModel.setProperty("/Expiration","");
										localModel.setProperty("/SecurityCode","");
										localModel.setProperty("/Payment","");
					*/
					this.fetchInvoices(localModel, statementModel, setStatementModel, thisView);

					//alert("UDQ Executed.");
					//displayResult(json.data[0]);
				}
			}).done(function(results) {

				//oLabel1.setText("Done Ajax");

			});

			//oLabel1.setText("After Ajax");
			/*	
								localModel.setProperty("/CreditCard","");
								localModel.setProperty("/Expiration","");
								localModel.setProperty("/SecurityCode","");
								localModel.setProperty("/Payment","");

								var oController = sap.ui.controller("MyAppMyApp.controller.View1");
								var CardArg = "XXX";
								oController.fetchInvoices(CardArg, thisView);
								
								sap.m.MessageToast.show("Payment Accepted");
			*/

			//oLabel1.setText(data);
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
				error: function(a, b, c) {
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