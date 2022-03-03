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
	return BaseController.extend("K2PPM_PM.controller.LadderLines", {

		onInit: function() {

			this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode
			this.getView().setBusy(true);

			var oRouter = this.getRouter();
			oRouter.getRoute("ladderLines").attachMatched(this._onRouteMatched, this);
			this.getView().setModel(models.createQueryModel(), "qParamsLines");
			
			

			
			this.getView().setBusy(false);

			/*            var data = {"value" :[]};
            var oModel = new JSONModel(data);
			oModel.setProperty("value", [{ "DocEntry": 0,"U_Ladder": "Regular", "U_Amt": 2500, "U_Role": "Property Manager" }]);
			//var oMainTable = this.byId("idMainTable");
            //oMainTable.setModel(oModel);
			
			this.getView().setModel(oModel,"ladderLines");*/

			/*			var slModel = this.getOwnerComponent().getModel("");
			this.getView().setModel(slModel, "serviceLayer");*/


		},
		_onRouteMatched: function() {

			this.onRefresh(null, this); 

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
		onAddItem: function() {
		    
		 
			try {
			    
			    var thisView = this.getView();
			    
			    var ladderLinesModel = thisView.getModel("ladderLines");
			    var localModel = this.getOwnerComponent().getModel("local");
			    var skey = localModel.ladderLineKey;


				//var oMainTable = this.byId("idMainTable");
				var newLadderLine = {
					"DocEntry": 0,
					"U_Ladder": skey,
					"U_Role": "",
					"U_Amt": 0.00
				};
		
				var ladderLines = ladderLinesModel.getProperty("/value");
				ladderLines.push(newLadderLine);
				ladderLinesModel.setProperty("/value", ladderLines);
				
				
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

				//this.fetchMain();
				var s;
				oContext.created().then(function() {
					s = "OK ";
				}, function(oError) {
					s = oError.toString();
				});
					*/

		    
		    
		    
/*
			try {

				var oMainTable = this.byId("ladderLines");
				var localModel = this.getOwnerComponent().getModel("local");
				var key;
				key = localModel.ladderLineKey;
				var oBinding = oMainTable.getBinding("items"); //This gets the list Binding
				var oContext = oBinding.create({
				    "DocEntry": 0,
					"U_Ladder": key,
					"U_Role": "",
					"U_Amt": ""
				});

				//this.fetchMain();
				var s;
				oContext.created().then(function() {
					s = "OK ";
				}, function(oError) {
					s = oError.toString();
				});
			} catch (e) {
				var e1 = e;
				e1 = e1;
			}*/
		},
		onDeleteLine: function(oEvent) {
			var thisView = this.getView();
			thisView.setBusy(true);
			var crlf = "\r\n";
			//Get the code
			var sId = oEvent.getParameter("id");
/*			var sIdCode = sId.replace("btnDeleteLine", "Code");
			var oInput = this.byId(sIdCode);
			var Code = oInput.getValue();*/
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
				lineCommand = "UDO_K2P_APRV_LINES(" + DocEntry + ")";
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
		    
		    
		    
/*			var sId = oEvent.getParameter("id");
			//var sArray = sId.split("-");
			//var sIndex = sArray[sArray.length - 1];

			var oContext = this.byId(sId).getBindingContext();

			var oMainTable = this.byId("ladderLines"); //this is the table/listbase
			var oBinding = oMainTable.getBinding("items"); //the list binding? 
			//var oContexts = oBinding.getContexts();
			//var sPath = oContexts[sIndex].sPath;
			//need a 
			//var oModel = oMainTable.getModel();
			try {

				oContext.delete("$auto");

				//this.getView().getModel().submitBatch("UpdateBatchGroup1");

			} catch (e) {
				var e1 = e;
				e1 = e1;
			}
			oBinding.refresh();*/

		
		lineCallBack: function(callingController, results, callback2, oThis, qNameIn) {

			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");

			var i18n;
			if (errorCode !== "0") {
				//fetch data
				callingController.onRefresh(callingController, false);
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
/*		onDelete: function() {
			var oMainTable = this.byId("ladderLines");
			var oSelectedItem = oMainTable.getSelectedItem();
			if (oSelectedItem) {
				oSelectedItem.getBindingContext().delete("$auto");
				/*.then(function () {
					MessageToast.show(this._getText("deletionSuccessMessage"));
				}.bind(this), function (oError) {
					MessageBox.error(oError.message);
				});
			}
			}
			this.onRefresh();
		},

		onSubmit: function() {

			try {

				this.getView().getModel().submitBatch("UpdateBatchGroup1");

			} catch (e) {
				var e1 = e;
				e1 = e1;
			}
		},
		onSelectionChange: function(oEvent) {

			/*
			var thisView = this.getView("");
			thisView.setBusy(true);
			var oSelectedItem = oEvent.getParameter("listItem");
			var path = oSelectedItem.getBindingContext().getPath();

			var oBinding = {};
			oBinding.path = path;
			oBinding.parameters = {
				"$$updateGroupId": "UpdateBatchGroup1"
			};
			oBinding.events = {
				dataReceived: this.onDataReceived
			};

			var VBox = thisView.byId("vBoxLines");
			VBox.bindElement(oBinding);

			thisView.setBusy(false);*/

		
		onRefresh: function(oEvent, callingController, retry) {
		    
		    if (!callingController) {
				callingController = this;
			}
			var thisView = callingController.getView();
			thisView.setBusy(true);
			var localModel = this.getOwnerComponent().getModel("local");
			var skey = localModel.ladderLineKey;
			// set the queryParams 
			var qParamsModel = models.createQueryModel();
			thisView.setModel(qParamsModel, "qParams");
			qParamsModel.setProperty("/method", "GET");
			qParamsModel.setProperty("/command", "UDO_K2P_APRV_LINES");
			qParamsModel.setProperty("/retry", retry);
			qParamsModel.setProperty("/firstFetch", true);
			var queryParams =  "?$select=DocEntry,U_Ladder,U_Role,U_Amt&$orderby=U_Amt&$filter=U_Ladder eq '" + skey + "'";
			qParamsModel.setProperty("/queryParams", queryParams);
			//fetch data
			K2PUtils.getpostputpatch(callingController, callingController.onRefreshCallBack);
			
		},
		    
		    	/*
			var thisView = this.getView();
			thisView.setBusy(true);
			var localModel = this.getOwnerComponent().getModel("local");
			var skey = localModel.ladderLineKey;

			// set the queryParams model
			var qParamsModel = models.createQueryModel();
			qParamsModel.setProperty("/method", "GET");
			qParamsModel.setProperty("/command", "UDO_K2P_APRV_LINES");
			//qParamsModel.setProperty("/data", null);
			qParamsModel.setProperty("/firstFetch", true);
			var params = "?$select=DocEntry,U_Ladder,U_Role,U_Amt&$orderby=U_Amt&$filter=U_Ladder eq '" + skey + "'";
			var queryParams = params;
			qParamsModel.setProperty("/queryParams", queryParams);
			this.getView().setModel(qParamsModel, "qParamsLines");
			K2PUtils.getpostputpatch(this, this.onRefreshCallBack, null, this, "qParamsLines");

					var thisView = callingController.getView();
			thisView.setBusy(true);
			var localModel = this.getOwnerComponent().getModel("local");
			var skey = localModel.ladderLineKey;
			// set the queryParams 
			var qParamsModel = models.createQueryModel();
			thisView.setModel(qParamsModel, "qParamsLines");
			qParamsModel.setProperty("/method", "GET");
			qParamsModel.setProperty("/command", "UDO_K2P_APRV_LINES");
			qParamsModel.setProperty("/retry", false);
			qParamsModel.setProperty("/firstFetch", true);
			var params = "?$select=U_Ladder,U_Role,U_Amt&$orderby=U_Amt&$filter=U_Ladder eq '" + skey + "'";
			var queryParams = params;
			//?$select=Code,Name,DocEntry
			qParamsModel.setProperty("/queryParams", queryParams);
			//fetch data
			K2PUtils.getpostputpatch(callingController, callingController.fetchMainCallBack, null, null, "qParamsLines");*/



		onRefreshCallBack: function(callingController, result, callback2, oThis) {

			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel("qParamsLines");
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var retry = qParamsModel.getProperty("/retry");
			var component = callingController.getOwnerComponent();
			var i18n;
			if (errorCode === 0) {
				var oResultModel = new sap.ui.model.json.JSONModel(result);
				oResultModel.setData(result);
				thisView.setModel(oResultModel, "ladderLines");
				/*			
				
				var oTable = thisView.byId("idMainTable");
					oTable.setModel(oResultModel);
					
					
					            var data = {"value" :[]};
            var oModel = new JSONModel(data);
							
				var workOrderModel = component.getModel("workOrder");
				var taskArray = oModel.getProperty("/K2P_WO_TASKSCollection");
                var taskModel = {"value" : taskArray};
				
				 Does not seem to work
                    var oBinding = oTable.getBinding("items");
                   oBinding.setModel(oModel);
				
					var oTable = thisView.byId("idTasksTable");
	                oTable.setModel(taskModel);
	                
*/
				thisView.setBusy(false);
			} else {

				/*					if (!retry) {
						//first failure so try to login
						qParamsModel.setProperty("/retry", true);
						this.slLogin(callingController, callingController.onSubmitPayment);
					} else {*/
				//second try so issue error - avoid infinite loop
				thisView.setBusy(false);
				//var message = "onSubmitCallback: " + error + " Code:" + errorCode.toString() + " status: " + status;
				//callingController.errorDialogBox(component, "WorkOrder", message, true);
				/*}*/
				//issue error
				//var sMessage = "onSubmitCallback: " + error + " Code:" + errorCode.toString();
				var sMessage = "onRefreshCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
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
			var oModel = thisView.getModel("ladderLines");
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
			var qNameIn = "qpLines";
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
						lineCommand = "UDO_K2P_APRV_LINES(" + DocEntry + ")";
					} else {
						//insert
						batchBody += ("POST "); //
						lineCommand = "UDO_K2P_APRV_LINES";
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
			K2PUtils.getpostputpatch(this,  K2PUtils.updateServerCallBack, callbackOrigin, this, qNameIn);

		},


		onNavBack: function() {
			this.updateServer(null, this.onNavBackCallBack, this);
		},
		onNavBackCallBack: function(callingController) {
			callingController.getRouter().navTo("ladders");
		}

	});

});