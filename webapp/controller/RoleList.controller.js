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
	"sap/m/MessageToast"
], function(BaseController, K2PUtils, models, JSONModel, ODataModel, Sorter, Filter, FilterOperator, FilterType, MessageBox, MessageToast) {
	"use strict";
	return BaseController.extend("K2PPM_PM.controller.RoleList", {

		onInit: function() {

			this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode
			this.getView().setBusy(true);

			var oRouter = this.getRouter();
			oRouter.getRoute("roles").attachMatched(this._onRouteMatched, this);
			this.getView().setModel(models.createQueryModel(), "qParams");
			this.getOwnerComponent().setModel(models.createQueryModel(), "roleList");
			/*
			var dfltModel = this.getOwnerComponent().getModel("serviceLayerBatch");
			this.getView().setModel(dfltModel);*/

			this.getView().setBusy(false);

			//K2PUtils.setTitle(this, "purchaseOrders");

		},
		onDataReceived: function(data, error) {
			if (error) {
				sap.m.MessageBox.alert(error.toString());
			} else {
				var d = data;
				d = d;
			}
		},
		onDataChange: function(data, error) {
			if (error) {
				sap.m.MessageBox.alert(error.toString());
			} else {
				var d = data;
				d = d;
			}
		},
		onDataStateChange: function(data, error) {
			if (error) {
				sap.m.MessageBox.alert(error.toString());
			} else {
				var d = data;
				d = d;
			}
		},
		_onRouteMatched: function() {

			this.onRefresh(null, this);

		},
		onAddItem: function() {

			try {
				var newLine = {
					"DocEntry": 0,
					"Code": "",
					"Name": ""
				};
				var oModel = this.getOwnerComponent().getModel("roleList");
				var roleList = oModel.getProperty("/value");
				roleList.push(newLine);
				oModel.setProperty("/value", roleList);

			} catch (err) {
				sap.m.MessageBox.alert(err.toString());
			}
		},
		onDeleteLine: function(oEvent) {
			var thisView = this.getView();
			thisView.setBusy(true);
			var crlf = "\r\n";
			//Get the code
			var sId = oEvent.getParameter("id");
			var sIdCode = sId.replace("btnDeleteLine", "Code");
			var oInput = this.byId(sIdCode);
			var Code = oInput.getValue();
			var sIdDocEntry = sId.replace("btnDeleteLine", "DocEntry");
			var oInput2 = this.byId(sIdDocEntry);
			var DocEntry = oInput2.getValue();

			if (DocEntry === "0") {
				//just delete from model
				var oModel = this.getView().getModel("roleList");
				var sArray = sIdDocEntry.split("-");
				var sIndex = sArray[sArray.length - 1];
				var roleList = oModel.getProperty("/value");
				roleList.splice(sIndex, 1);
				oModel.setProperty("/value", roleList);
				thisView.setBusy(false);
				return;
			} else {
				//delete from database
				var batchBody = "";
				var lineCommand;
				//batch body
				batchBody += "--batch_id-1629298140018-237";
				batchBody += crlf;
				batchBody += "Content-Type:application/http";
				batchBody += crlf;
				batchBody += "Content-Transfer-Encoding:binary";
				batchBody += crlf;
				batchBody += crlf;
				//DELETE
				batchBody += ("DELETE ");
				lineCommand = "UDO_K2P_APRV_ROLES('" + Code + "')";

				batchBody += lineCommand;
				batchBody += " HTTP/1.1";
				batchBody += crlf;
				batchBody += "Content-Type:application/json;charset=UTF-8;IEEE754Compatible=true";
				batchBody += crlf;
				batchBody += crlf;
				batchBody += crlf;
				//no body for delete
				//batchBody += JSON.stringify(itemLine);
				//batchBody += crlf;

				this.updateServer(oEvent, null, this, batchBody);

			}
		},
		/*

			// set the queryParams 
			var qParamsModel = models.createQueryModel();
			thisView.setModel(qParamsModel, "qParams");
			qParamsModel.setProperty("/method", "DELETE");
			qParamsModel.setProperty("/command", "UDO_K2P_APRV_ROLES('" + Code + "')");
			qParamsModel.setProperty("/retry", false);
			qParamsModel.setProperty("/firstFetch", true);
			var queryParams = "";
			qParamsModel.setProperty("/queryParams", queryParams);
			//post
			K2PUtils.getpostputpatch(this, this.lineCallBack);
			
			*/

		lineCallBack: function(callingController) {

			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel("qParams");
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");

			var i18n;
			if (errorCode === 0) {
				//fetch data
				callingController.onRefresh(null, callingController, false);
			} else //handle error
			{
				var sMessage = "lineCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}

			thisView.setBusy(false);
		},
		onDelete: function() {
			var oMainTable = this.byId("idMainTable");
			var oSelectedItem = oMainTable.getSelectedItem();
			if (oSelectedItem) {
				oSelectedItem.getBindingContext().delete("$auto");
				/*.then(function () {
					MessageToast.show(this._getText("deletionSuccessMessage"));
				}.bind(this), function (oError) {
					MessageBox.error(oError.message);
				});
			}*/
			}
			//this.onRefresh();
		},
		onRefresh: function(oEvent, callingController) {
			if (!callingController) {
				callingController = this;
			}
			var path = "UDO_K2P_APRV_ROLES";
			var qparams = "?$select=DocEntry,Code,Name";
			K2PUtils.getByPath(callingController, path, qparams, callingController.roleListCallBack, "qparamsRoles");
		},
		roleListCallBack: function(callingController, results) {
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel("qparamsRoles");
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			if (errorCode === 0) {
				var oResult = new sap.ui.model.json.JSONModel(results);
				callingController.getOwnerComponent().setModel(oResult, "roleList");
				thisView.setBusy(false);
			} else //handle error
			{
				var sMessage = "roleListCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				//i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, "", sMessage, true, null, status);
				thisView.setBusy(false);
			}

		},
		updateServer: function(oEvent, callbackOrigin, CallingController, inBatchBody) {
			//set the headers for the Batch
			var crlf = "\r\n";
			var thisView = this.getView();
			thisView.setBusy(true);
			if (oEvent) {
				//if called from button do not exit page
				callbackOrigin = null;
			}
			var oModel = this.getView().getModel("roleList");
			var itemList;
			var itemLine;
			var i;
			// set the queryParams 
			var qParamsModel = models.createQueryModel();
			qParamsModel.setProperty("/method", "POST");
			qParamsModel.setProperty("/command", "$batch");
			qParamsModel.setProperty("/retry", false);
			qParamsModel.setProperty("/firstFetch", true);
			qParamsModel.setProperty("/contentType", "multipart/mixed;charset=UTF-8;boundary=batch_id-1629298140018-237");
			var queryParams = "";
			var qNameIn = "qpRoles";
			var Code, Docentry, lineCommand;
			qParamsModel.setProperty("/queryParams", queryParams);
			var batchBody = "";
			if (inBatchBody) {
				batchBody = inBatchBody;
			} else {
				itemList = oModel.getProperty("/value");
				if (itemList.length === 0) {
					//no lines to process so exit
					if (callbackOrigin) {
						callbackOrigin(CallingController);
					}
					return;
				}

				for (i = 0; i < itemList.length; i++) {
					//for (i = 0; i === 0; i++) {    
					itemLine = itemList[i];
					Docentry = itemLine.DocEntry;
					Code = itemLine.Code;
					batchBody += "--batch_id-1629298140018-237";
					batchBody += crlf;
					batchBody += "Content-Type:application/http";
					batchBody += crlf;
					batchBody += "Content-Transfer-Encoding:binary";
					batchBody += crlf;
					batchBody += crlf;
					if (Docentry) {
						//update
						batchBody += ("PATCH ");
						lineCommand = "UDO_K2P_APRV_ROLES('" + Code + "')";
					} else {
						//insert
						batchBody += ("POST "); //
						lineCommand = "UDO_K2P_APRV_ROLES";
					}
					batchBody += lineCommand;
					batchBody += " HTTP/1.1";
					batchBody += crlf;
					batchBody += "Content-Type:application/json;charset=UTF-8;IEEE754Compatible=true";
					batchBody += crlf;
					batchBody += crlf;
					batchBody += crlf;
					batchBody += JSON.stringify(itemLine);
					batchBody += crlf;

				} //end of for loop
			}
			batchBody += "--batch_id-1629298140018-237--";
			batchBody += crlf;
			qParamsModel.setProperty("/data", batchBody);
			thisView.setModel(qParamsModel, qNameIn);
			K2PUtils.getpostputpatch(this, K2PUtils.updateServerCallBack, callbackOrigin, this, qNameIn);
		},

		/*		updateServerCallBack: function(callingController, results, callbackOrigin) {

			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel("qpRoles");
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			//callingController.getRouter().navTo("home");
			var errorPos = results.search("\"error\" : {");
			if (errorPos !== -1) {
				errorCode = -1;
				error = "Error in Batch";
				errorPos = results.search("\"-2035\"");
				if (errorPos !== -1) {
					error = "Duplicate Not Allowed!";
				}
			}
			if (errorCode === 0) {
				//fetch data
				if (callbackOrigin) {
					callbackOrigin(callingController);
				} else {
					callingController.onRefresh(null, callingController, false);
				}
			} else //handle error
			{
				var sMessage = "updateServerCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				//i18n = "";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, "", sMessage, true, null, status);
			}

		},*/
		onNavBack: function() {
			this.updateServer(null, this.onNavBackCallBack, this);
		},
		onNavBackCallBack: function(callingController) {
			callingController.getRouter().navTo("home");
		}
	});

});