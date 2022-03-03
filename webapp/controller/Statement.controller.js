sap.ui.define([
	"K2PPM_PM/controller/BaseController",
	"K2PPM_PM/K2PUtils/K2PUtils",
	"K2PPM_PM/model/models"
], function (BaseController, K2PUtils, models) {
	"use strict";
	return BaseController.extend("K2PPM_PM.controller.Statement", {

		onInit: function () {
			var oRouter = this.getRouter();
			var thisView = this.getView("");
			oRouter.getRoute("statement").attachMatched(this._onRouteMatched, this);
			var target = oRouter.getTarget("statement");
			target.attachDisplay(this._onViewDisplay, this);
			
			var oComponent = this.getOwnerComponent();
			var i18nModel = oComponent.getModel("i18n");
			var title = i18nModel.getProperty("statement");

			var oViewModel = models.createViewModel();
			oViewModel.setProperty("/headerText", title);
			thisView.setModel(oViewModel, "view");
			this.getView().setModel(models.createQueryModel(), "qParams");
		},
		_onViewDisplay: function () {

		},
		_onRouteMatched: function () {
			var thisView;
			thisView = this.getView();
			thisView.setBusy(true);
			var oControl;
			var dfltPmtType;

			var localModel = this.getOwnerComponent().getModel("local");
			dfltPmtType = localModel.getProperty("/pmtTypeDefault");
			this.setPmtControls(dfltPmtType, thisView); //grpPayment
			oControl = thisView.byId("__group1");
			oControl.setSelectedIndex(dfltPmtType);
			localModel.getProperty("/crypto");
			//oControl = thisView.byId("btnCrypto");

			this.fetchMain(this, false);

		},
		onSelectionChange: function (oEvent) {
			var thisView = this.getView("");
			var oTable = thisView.byId("idMainTable");
			var statementModel = new sap.ui.model.json.JSONModel();
			statementModel = oTable.getModel();
			var localModel = this.getOwnerComponent().getModel("local");

			var oSelectedItem = oEvent.getParameter("listItem");
			//var path = oSelectedItem.getBindingContext().getPath();
			var bSelected = oEvent.getParameter("selected");
			var bselectAll = oEvent.getParameter("selectAll");

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

		resetAmountToPay: function (bselectAll, oSelectedItem, bSelected) {

			//Reset the amount to pay by adding up all the selected (checked) items.

			//
			var thisView = this.getView();
			var oTable = thisView.byId("idMainTable");
			var statementModel = new sap.ui.model.json.JSONModel();
			statementModel = oTable.getModel();

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
				jQuery.each(oTable.getSelectedContextPaths(), function (id, value) {
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
		fetchMain: function (callingController, retry) {
			var thisView = callingController.getView();
			thisView.setBusy(true);
			var localModel = callingController.getOwnerComponent().getModel("local");
			var CardCode = localModel.getProperty("/cardCode");
			localModel.setProperty("/Payment", "");
			// set the queryParams 
			var qParamsModel = models.createQueryModel();
			thisView.setModel(qParamsModel, "qParams");
			qParamsModel.setProperty("/method", "GET");
			qParamsModel.setProperty("/command", "Invoices");
			qParamsModel.setProperty("/retry", retry);
			qParamsModel.setProperty("/firstFetch", true);
			var queryParams =
				"?$select=DocNum,CardCode,DocEntry,Comments,DocDueDate,DocTotal,TaxExtension&$orderby=DocEntry&$inlinecount=allpages&$filter=DocumentStatus eq 'O' and CardCode eq  '" +
				CardCode + "'";
			qParamsModel.setProperty("/queryParams", queryParams);
			//fetch data
			K2PUtils.getpostputpatch(callingController, K2PUtils.fetchMainCallBack);
		},

		pmtTypeSelect: function (oEvent) {
			var oParameters;
			var thisView = this.getView();

			oParameters = oEvent.getParameters();

			this.setPmtControls(oParameters.selectedIndex, thisView);
		},
		setPmtControls: function (selectedIndex, thisView) {
			var arBoolean = new Array(20).fill(false);

			if (selectedIndex === 0) {
				arBoolean[15] = true;
				arBoolean[16] = true;

			} else if (selectedIndex === 1) {
				arBoolean[2] = true;
				arBoolean[3] = true;
				arBoolean[4] = true;
				arBoolean[5] = true;
				arBoolean[6] = true;
				arBoolean[7] = true;
				arBoolean[15] = true;
				arBoolean[16] = true;
			} else if (selectedIndex === 2) {
				arBoolean[0] = true;
				arBoolean[1] = true;
				arBoolean[15] = true;
				arBoolean[16] = true;
			} else if (selectedIndex === 3) {

				arBoolean[8] = true;
				arBoolean[9] = true;
				arBoolean[10] = true;
				arBoolean[11] = true;
				arBoolean[12] = true;
				arBoolean[13] = true;
				arBoolean[14] = true;
				arBoolean[15] = true;
				arBoolean[16] = true;
				arBoolean[17] = true;
				arBoolean[18] = true;
				arBoolean[19] = true;
			}

			this.setAllPmtControls(thisView, arBoolean);

		},
		setAllPmtControls: function (thisView, arBoolean)
		{
			var oControl;

			oControl = thisView.byId("lCheckNbr");
			oControl.setVisible(arBoolean[0]);
			thisView.byId("lCheckNbr").setVisible(arBoolean[0]);
			oControl = thisView.byId("CheckNbr");
			oControl.setVisible(arBoolean[1]);
			oControl = thisView.byId("lCC");
			oControl.setVisible(arBoolean[2]);
			oControl = thisView.byId("CC");
			oControl.setVisible(arBoolean[3]);
			oControl = thisView.byId("lExpDt");
			oControl.setVisible(arBoolean[4]);
			oControl = thisView.byId("ExpDt");
			oControl.setVisible(arBoolean[5]);
			oControl = thisView.byId("lSecCode");
			oControl.setVisible(arBoolean[6]);
			oControl = thisView.byId("SecCode");
			oControl.setVisible(arBoolean[7]);
			oControl = thisView.byId("lcryptoCurrency");
			oControl.setVisible(arBoolean[8]);
			oControl = thisView.byId("cmbCrypto");
			oControl.setVisible(arBoolean[9]);
			oControl = thisView.byId("lcryptoRate");
			oControl.setVisible(arBoolean[10]);
			oControl = thisView.byId("cryptoRate");
			oControl.setVisible(arBoolean[11]);
			oControl = thisView.byId("lcryptoAddress");
			oControl.setVisible(arBoolean[12]);
			oControl = thisView.byId("cryptoAddress");
			oControl.setVisible(arBoolean[13]);
			oControl = thisView.byId("cryptoQR");
			oControl.setVisible(arBoolean[14]);
			oControl = thisView.byId("lpaymentAmt");
			oControl.setVisible(arBoolean[15]);
			oControl = thisView.byId("paymentAmt");
			oControl.setVisible(arBoolean[16]);
			oControl = thisView.byId("btnCopyCrypt");
			oControl.setVisible(arBoolean[17]);
			oControl = thisView.byId("lcryptoAmount");
			oControl.setVisible(arBoolean[18]);
			oControl = thisView.byId("cryptoAmount");
			oControl.setVisible(arBoolean[19]);
		},
		onConfirmPayment: function () {
			K2PUtils.confirmAction(this, "confirmPayment", this.onSubmitPayment, this.fetchMain);

		},
		onSubmitPayment: function (callingController, callback) {
			//var LogEntries = jQuery.sap.log.getLogEntries();
			var thisView = callingController.getView();
			thisView.setBusy(true);
			var localModel = callingController.getOwnerComponent().getModel("local");
			//
			var oPayment = {};
			var CardCode = localModel.getProperty("/cardCode");
			oPayment.CardCode = CardCode;
			var DP1 = thisView.byId("DP1");
			var dt1 = DP1.getDateValue();
			oPayment.DocDate = dt1;
			oPayment.DueDate = dt1;
			oPayment.TaxDate = dt1;
			var oPaymentChecks = [], 
				oPaymentCheck = {};
			oPaymentCheck.CheckSum = localModel.getProperty("/Payment");
			oPaymentCheck.BankCode = localModel.getProperty("/Bank");
			oPaymentCheck.CheckNumber = localModel.getProperty("/CheckNbr");
			oPaymentCheck.DueDate = dt1;
			oPaymentChecks.push(oPaymentCheck);
			oPayment.PaymentChecks = oPaymentChecks;
			var oInvoices = [],
				oInvoice = {};
			var DocEntry, amount, aItemArray;
			var oTable = thisView.byId("idMainTable");
			var oModel = oTable.getModel();
			aItemArray = oModel.getProperty("/value/");
			var totAmount = 0;

			for (var i = 0; i < aItemArray.length; i++) {
				DocEntry = oModel.getProperty("/value/" + i.toString() + "/DocEntry");
				amount = oModel.getProperty("/value/" + i.toString() + "/U_JC1_Amount");
				if (amount) {
					amount = parseFloat(amount);
					if (amount > 0) {
						oInvoice = {};
						oInvoice.DocEntry = DocEntry;
						oInvoice.SumApplied = amount;
						oInvoices.push(oInvoice);
						totAmount = totAmount + amount;
					}
				}
			}
			oPayment.PaymentInvoices = oInvoices;
			var data = JSON.stringify(oPayment);


			//var surl = destination + "IncomingPayments";
			
			thisView.setBusy(true);
			// set the queryParams model
			var qParamsModel = models.createQueryModel();
			thisView.setModel(qParamsModel, "qParamsPay");
			qParamsModel.setProperty("/method", "POST");
			qParamsModel.setProperty("/command", "IncomingPayments()");
			qParamsModel.setProperty("/data", data);
			qParamsModel.setProperty("/retry", false);
			qParamsModel.setProperty("/firstFetch", true);
			var queryParams =  "";
			qParamsModel.setProperty("/queryParams", queryParams);
			K2PUtils.getpostputpatch(callingController, callingController.onSubmitPaymentCallback, null, null, "qParamsPay");

/*			$.ajax({
				type: "POST",
				url: surl,
				contentType: "application/json",
				dataType: "json",

				xhrFields: {
					withCredentials: true
				},
				data: data,
				error: function (xhr, status, error) {
					//oLabel1.setText(xhr.responseText);
					//sap.m.MessageToast.show(xhr.responseText);
					//jQuery.sap.log.error(xhr.responseText);
					$.sap.log.error(xhr.responseText);

					var jsonResponse = JSON.parse(xhr.responseText);
					var code = jsonResponse.error.code;
					var i18nKey;
					if (code === "-5003") {
						i18nKey = "errMsgPaymentDate";
					}
					K2PUtils.errorMessageBox(callingController, i18nKey, jsonResponse.error.message.value);

					thisView.setBusy(false);

					//var thisViewName = oController.getView().sViewname;
					//oController.postJC1_LOG(oController, "onSubmitPayment", status, error, "", xhr.responseText, surl, data);

					//ostJC1_LOG: function(oController, operation, status, error, webuser, response, Url, data ) {

				},
				success: function () {
					//oLabel1.setText("Success");
					sap.m.MessageToast.show("Payment Accepted");
					//					localModel.setProperty("/CreditCard","");
					//					localModel.setProperty("/Expiration","");
					//					localModel.setProperty("/SecurityCode","");
					//					localModel.setProperty("/Payment","");
					//
					thisView.setBusy(false);
					callback(callingController); //fetchInvoices

					//alert("UDQ Executed.");
					//displayResult(json.data[0]);
				}
			}).done(function () {

				//oLabel1.setText("Done Ajax");

			});*/

		},
		onSubmitPaymentCallback: function (callingController, callback) {
				var thisView = callingController.getView();
				var qParamsModel = thisView.getModel("qParamsPay");
				var errorCode = qParamsModel.getProperty("/errorCode");
				var error = qParamsModel.getProperty("/errorCode");
				var retry = qParamsModel.getProperty("/retry");
				var component = callingController.getOwnerComponent();
				var i18n;
				if (errorCode === 0) {
					//no problem so try to refresh page data one last time
					thisView.setBusy(false);
					callingController.fetchMain(callingController, false); //refresh Invoices
				} else {
					
/*					if (!retry) {
						//first failure so try to login
						qParamsModel.setProperty("/retry", true);
						this.slLogin(callingController, callingController.onSubmitPayment);
					} else {*/
						//second try so issue error - avoid infinite loop
						thisView.setBusy(false);
						var message = "fetchMain: " + error + " Code:" + errorCode.toString() + " status: " + status;
						this.errorDialogBox(component, "userLoginConnection", message, true);
					/*}*/
					//issue error
					var sMessage = "fetchMain: " + error + " Code:" + errorCode.toString();
					thisView.setBusy(false);
					i18n = "serviceLayerStatus";
					//var oRouter = callingController.getRouter();
					//oRouter.navTo("login");
					K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
				}
		}
	});

});