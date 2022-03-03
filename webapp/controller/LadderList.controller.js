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
	return BaseController.extend("K2PPM_PM.controller.LadderList", {

		onInit: function() {

			this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode
			this.getView().setBusy(true);

			var oRouter = this.getRouter();
			oRouter.getRoute("ladders").attachMatched(this._onRouteMatched, this);
			this.getView().setModel(models.createQueryModel(), "qParams");

			/*			var dfltModel = this.getOwnerComponent().getModel();
			this.getView().setModel(dfltModel);*/

			var oModel = new JSONModel();
			oModel.setProperty("value", []);
			this.getView().setModel(oModel);

			this.getView().setBusy(false);

		},
		_onRouteMatched: function() {

			this.onRefresh(this, false);

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
		onAddItem: function() {

			try {

				var oMainTable = this.byId("idMainTable");
				var oModel = oMainTable.getModel();
				var newLadder = {
					"DocEntry": 0,
					"Code": "",
					"Name": ""
				};
				var ladderList = oModel.getProperty("/value");
				ladderList.push(newLadder);
				oModel.setProperty("/value", ladderList);

			} catch (err) {
				sap.m.MessageBox.alert(err.toString());
			}

			/*			


			
										    			
		//Get the code
			var sId = oEvent.getParameter("id");
			var sArray = sId.split("-");
			var sIndex = sArray[sArray.length - 1];
			var oMainTable = this.byId("idMainTable");
			var oModel = oMainTable.getModel();
			var sPath = "/value/" + sIndex + "/Code";
			var sCode = oModel.getProperty(sPath);*/

			/*


				var oTaskModel = models.createTaskModel();
				var oNewTask = JSON.parse(oTaskModel.getJSON());

				var taskItems = oModel.getProperty("/K2P_WO_TASKSCollection");
				var l = taskItems.length;

				var taskArray = {
					"value": taskItems
				};

				taskArray.push(oNewTask);
				oModel.setProperty("/K2P_WO_TASKSCollection", taskArray);

				
				var oMainTable = this.byId("idMainTable");

				var oBinding = oMainTable.getBinding("items"); //This gets the list Binding
				var oContext = oBinding.create({
					"Code": "",
					"Name": ""
				});

				//this.onRefresh();
				var s;
				oContext.created().then(function() {
					s = "OK ";
				}, function(oError) {
					s = oError.toString();
				});
					*/

		},
		onRefresh: function(oEvent, callingController, retry) {
		    if (!callingController) {
				callingController = this;
			}
			var thisView = callingController.getView();
			thisView.setBusy(true);
			// set the queryParams 
			var qParamsModel = models.createQueryModel();
			thisView.setModel(qParamsModel, "qParams");
			qParamsModel.setProperty("/method", "GET");
			qParamsModel.setProperty("/command", "UDO_K2P_APRV_LADDER");
			qParamsModel.setProperty("/retry", retry);
			qParamsModel.setProperty("/firstFetch", true);
			var queryParams = "?$select=Code,Name,DocEntry";
			qParamsModel.setProperty("/queryParams", queryParams);
			//fetch data
			K2PUtils.getpostputpatch(callingController, K2PUtils.fetchMainCallBack);
		},

		/*		onRefresh: function() {
			var thisView = this.getView();
			thisView.setBusy(true);

			var oMainTable = this.byId("idMainTable");
			var oTemplate = this.getView().byId("idMainColumnList").clone();
			var newBind = false;
			var oBinding = oMainTable.getBinding("items");
			if (oBinding) {
				if (oBinding.hasPendingChanges) {
					newBind = true;
				} else {
					oBinding.refresh();
					newBind = false;
				}
			}

			//rebind  so that data is always current with no pending changes in Binding
			if (newBind) {
				try {
					oMainTable.unbindItems();
				} catch (oError) {
					//just ignore an error   
				}
				var newBindingInfo = {};
				newBindingInfo.path = "/UDO_K2P_APRV_LADDER";
				newBindingInfo.parameters = {
					$$updateGroupId: 'ladderList'
				}; //, $orderby : 'Code;'
				newBindingInfo.events = {
					dataReceived: '.onDataReceived',
					change: '.onDataChange'
				};
				newBindingInfo.template = oTemplate;
				newBindingInfo.templateShareable = true;
				oMainTable.bindItems(newBindingInfo);
			}

			thisView.setBusy(false);

		},

		onRefresh: function() {
			var oBinding = this.byId("idMainTable").getBinding("items");

			if (oBinding.hasPendingChanges()) {
				MessageBox.error("Save Changes.");
				return;
			}
			var thisView = this.getView();
			thisView.setBusy(true);
			oBinding.refresh();
			//MessageToast.show(this._getText("refreshSuccessMessage"));
			thisView.setBusy(false);
		},
		*/
		onSubmit: function() {

			try {
				var oBinding = this.byId("idMainTable").getBinding("items");
				var bChanged = oBinding.hasPendingChanges("ladderList");

				if (bChanged) {
					this.getView().getModel().submitBatch("ladderList");
				}

				//The submit does not change hasPendingChanges to false!!!
				oBinding = this.byId("idMainTable").getBinding("items");
				//var bChangedAfter = oBinding.hasPendingChanges("ladderList");

			} catch (err) {
				sap.m.MessageBox.alert(err.message);
			}
		},
		onEditLine: function(oEvent) {
			var thisView = this.getView();
			thisView.setBusy(true);
			//Get the code
			var sId = oEvent.getParameter("id");
			var sIdCode = sId.replace("btnLines", "Code");
			var oInput = this.byId(sIdCode);
			var sKey = oInput.getValue();

			var localModel = this.getOwnerComponent().getModel("local");
			localModel.ladderLinePath = "";
			localModel.ladderLineKey = sKey;
			localModel.ladderLineAdd = false;
			this.getRouter().navTo("ladderLines");

			/*		    			var thisView = this.getView();
			thisView.setBusy(true);
			//Get the code
			var sId = oEvent.getParameter("id");
			var sIdCode = sId.replace("btnDeleteLine", "InputCode");
			var oInput = this.byId(sIdCode);
			var sCode = oInput.getValue();
		    
/*			var sId = oEvent.getParameter("id");
			var sArray = sId.split("-");
			var sIndex = sArray[sArray.length - 1];

			var oMainTable = this.byId("idMainTable"); //this is the table/listbase
			var oBinding = oMainTable.getBinding("items"); //the list binding
			var oContexts = oBinding.getContexts();
			var sPath = oContexts[sIndex].sPath;

			var localModel = this.getOwnerComponent().getModel("local");
			localModel.ladderLinePath = "";
			localModel.ladderLineKey = sKey;
			localModel.ladderLineAdd = false;
			this.getRouter().navTo("ladderLines");*/

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
				var oMainTable = this.byId("idMainTable");
			    var oModel = oMainTable.getModel();
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
				lineCommand = "UDO_K2P_APRV_LADDER('" + Code + "')";

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
			
			//delete the line
            /*
			// set the queryParams 
			var qParamsModel = models.createQueryModel();
			thisView.setModel(qParamsModel, "qParams");
			qParamsModel.setProperty("/method", "DELETE");
			qParamsModel.setProperty("/command", "UDO_K2P_APRV_LADDER(\'" + sCode + "\')");
			qParamsModel.setProperty("/retry", false);
			qParamsModel.setProperty("/firstFetch", true);
			var queryParams = "";
			qParamsModel.setProperty("/queryParams", queryParams);
			//fetch data
			K2PUtils.getpostputpatch(this, this.lineCallBack);
				
			var sId = oEvent.getParameter("id");
			var oContext = this.byId(sId).getBindingContext();
			var oMainTable = this.byId("idMainTable"); //this is the table/listbase
			var oBinding = oMainTable.getBinding("items"); //the list binding? 
			try {
				oContext.delete("$auto");
				oBinding.refresh();

			} catch (e) {
				sap.m.MessageBox.alert(e.message);
			}
			try {
				if (oBinding.hasPendingChanges()) {
					this.getView().getModel().submitBatch("ladderList");
				}
				oContext.delete("$auto");
				oBinding.refresh("ladderList");
			} catch (e) {
				sap.m.MessageBox.alert(e.message);
			}
            */

		},

		lineCallBack: function(callingController, results, callback2, oThis, qNameIn) {

			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel("qParams");
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");

			var i18n;
			if (errorCode === 0) {
				//fetch data
				callingController.onRefresh(callingController, false);
			} else //handle error
			{
				var sMessage = "deleteLineCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}

			thisView.setBusy(false);
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
			//var oModel = this.getView().getModel("ladderList");
			var oMainTable = this.byId("idMainTable");
			var oModel = oMainTable.getModel();
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
			var qNameIn = "qpLadders";
			var Code, lineCommand;
			var DocEntry;
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
					DocEntry = itemLine.DocEntry;
					Code = itemLine.Code;
					batchBody += "--batch_id-1629298140018-237";
					batchBody += crlf;
					batchBody += "Content-Type:application/http";
					batchBody += crlf;
					batchBody += "Content-Transfer-Encoding:binary";
					batchBody += crlf;
					batchBody += crlf;
					if (DocEntry > 0) {
						//update
						batchBody += ("PATCH ");
						lineCommand = "UDO_K2P_APRV_LADDER('" + Code + "')";
					} else {
						//insert
						batchBody += ("POST "); //
						lineCommand = "UDO_K2P_APRV_LADDER";
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
			//var body = batchBody.toString();

			qParamsModel.setProperty("/data", batchBody);
			thisView.setModel(qParamsModel, qNameIn);
			K2PUtils.getpostputpatch(this, K2PUtils.updateServerCallBack, callbackOrigin, this, qNameIn);

		},
	/*
		updateServerNoBatch: function() {
			//set the headers for the Batch

			var thisView = this.getView();
			thisView.setBusy(true);
			var oMainTable = this.byId("idMainTable");
			var oModel = oMainTable.getModel();
			var ladderList = oModel.getProperty("/value");
			var ladderLine;
			var i;
			thisView.setBusy(true);
			// set the queryParams 
			var qParamsModel = models.createQueryModel();
			qParamsModel.setProperty("/retry", false);
			qParamsModel.setProperty("/firstFetch", true);
			qParamsModel.setProperty("/contentType", "application/json;odata.metadata=minimal;charset=utf-8");
			var queryParams = "",
				qNameIn;
			var Code, DocEntry;
			qParamsModel.setProperty("/queryParams", queryParams);
			//callingController, callback, callback2, oThis, qNameIn

			//set the body
			for (i = 0; i < ladderList.length; i++) {
				ladderLine = ladderList[i];
				Code = ladderLine.Code;
				DocEntry = ladderLine.DocEntry;
				if (Code === "") {
					Code = null;
				}
				if (Code) { //skip if code is blank or null
					if (DocEntry > 0) {
						//update
						qParamsModel.setProperty("/method", "PATCH");
						qParamsModel.setProperty("/command", "UDO_K2P_APRV_LADDER('" + Code + "')");
					} else {
						//insert
						//add the line
						qParamsModel.setProperty("/method", "POST");
						qParamsModel.setProperty("/command", "UDO_K2P_APRV_LADDER");

					}
					qParamsModel.setProperty("/data", JSON.stringify(ladderLine));
					qNameIn = "qpLadder" + i.toString();
					thisView.setModel(qParamsModel, qNameIn);
					K2PUtils.getpostputpatch(this, this.updateServerCallBack, null, this, qNameIn);
				}
			} //end of for loop

			//this.onRefresh(this, false);
		},
	
			var oBinding = this.byId("idMainTable").getBinding("items");
			
			var fnSuccess = function() {
				//this._setBusy(false);
				MessageToast.show("Saved");
				oBinding = oThis.byId("idMainTable").getBinding("items");
				var bChangedAfter = oBinding.hasPendingChanges("ladderList");
				//var oMainTable = this.byId("idMainTable"); //this is the table/listbase
				//var oBinding = oMainTable.getBinding("items"); //the list binding?
				//oBinding.resetChanges("approverList");
				//oBinding.refresh("approverList");
				oThis.getRouter().navTo("home");

				//this._setUIChanges(false);
			}.bind(oThis);

			var fnError = function(oError) {
				//handle error
				MessageBox.alert(oError.message);
				oThis.getRouter().navTo("home");

			}.bind(oThis);
			try {
				if (oBinding.hasPendingChanges("ladderList")) {
					oThis.getView().getModel().submitBatch("ladderList").then(fnSuccess, fnError);

				} else {
					oThis.getRouter().navTo("home");
				}
			} catch (oError) {
				sap.m.MessageBox.alert(oError.message);
			}*/

		//MessageToast.show("Changes Updated");
		/*				MessageBox.warning("Save Changes?", {
					actions: [MessageBox.Action.YES,MessageBox.Action.NO,MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.YES,
					onClose: function(sAction) {
						if (sAction === MessageBox.Action.OK) {
							oBinding.resetChanges();

						}
						else {
						    oThis.getView().getModel().submitBatch("ladderList");
						}
					}
				});*/
		onSelectionChange: function(oEvent) {

			/*			var thisView = this.getView("");
			thisView.setBusy(true);
			var oSelectedItem = oEvent.getParameter("listItem");
			var path = oSelectedItem.getBindingContext().getPath();
			var localModel = this.getOwnerComponent().getModel("local");
			localModel.ladderLinePath = path;
			localModel.ladderLineAdd = false;
			this.getRouter().navTo("ladderLines");*/
		},

		onNavBack: function() {
			this.updateServer(null, this.onNavBackCallBack, this);
		},
		onNavBackCallBack: function(callingController) {
			callingController.getRouter().navTo("home");
		}
	});

});