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
	"sap/m/MessageToast",
	"sap/ui/core/Fragment"
], function(BaseController, K2PUtils, models, JSONModel, ODataModel, Sorter, Filter, FilterOperator, FilterType, MessageBox, MessageToast,
	Fragment) {
	"use strict";
	return BaseController.extend("K2PPM_PM.controller.ApproverList", {

		onInit: function() {

			this.getView().addStyleClass("sapUiSizeCompact"); // make everything inside this View appear in Compact mode
			this.getView().setBusy(true);
			


			var oRouter = this.getRouter();
			oRouter.getRoute("approvers").attachMatched(this._onRouteMatched, this);
			/*			this.getView().setModel(models.createQueryModel(), "qParamsapproverList");

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
			this.getView().setBusy(true);
			/*			var approverListModel = models.createApproverList();
			this.getOwnerComponent().setModel(approverListModel, "approverList");
			var oMainTable = this.byId("idMainTable");*/
			//this.getView().setModel(approverListModel, "approverList");

			//blank out local model
			var localModel = this.getOwnerComponent().getModel("local");
			localModel.setProperty("/property", "");
			localModel.setProperty("/propertyName", "");
			localModel.setProperty("/project", "");
			localModel.setProperty("/ladder", "");
			//this.getView().setBusy(false);

			/*
			var oMainTable = this.byId("idMainTable");
			var oColumnListItem = this.getView().byId("ColumnListItemUsers").clone();
			//rebind tables
					var oBinding = oMainTable.getBinding("items"); //This gets the list Binding
			oBinding = {};
			var sFilter = "DocNum eq -1";
			oBinding.path = "/UDO_K2P_APRV_USERS";
			oBinding.template = oColumnListItem;
			oBinding.templateShareable = true;
			oBinding.parameters = {
			    $filter: sFilter,
				"$$updateGroupId": "approverList"
			};
			oMainTable.bindItems(oBinding);

			//ladderLinesItems
			//{$filter : 'U_Ladder eq \'Xyz$\'', $orderby : 'U_Amt'}}">
			var oTable = this.byId("ladderLines");
			var oColumnListItem = this.getView().byId("ladderLinesItems").clone();
			var oBinding = oTable.getBinding("ladderLines"); //This gets the list Binding
			oBinding = {};
			var sFilter = "U_Ladder eq 'Xyz$'";
			oBinding.path = "/UDO_K2P_APRV_LINES";
			oBinding.template = oColumnListItem;
			oBinding.templateShareable = true;
			oBinding.parameters = {
				$filter: sFilter
			};
			oTable.bindItems(oBinding);
			*/
			this.onRefresh(null);

		},
		onPopulate: function() {
			//Loop through ladder items and get role
			//add to approver grid
			var thisView = this.getView();
			var mTable2 = thisView.byId("ladderLines");
			var items = mTable2.getItems();
			var item, oCell, role;

			for (var i = 0, strLen = items.length; i < strLen; i++) {
				item = items[i];
				var oCells = item.getCells();
				oCell = oCells[1];
				role = oCell.getValue();
				this.onAddItem(role);
			}

		},
		onAddItem: function(role) {

			try {
				var localModel = this.getOwnerComponent().getModel("local");
				//get the defaults
				var propertyCode = localModel.getProperty("/property");
				var project = localModel.getProperty("/project");
				var ladder = localModel.getProperty("/ladder");
				if (!role) {
					role = "";
				}
				var newLine = {
					"U_Role": role,
					"U_Ladder": ladder,
					"U_UserCode": "",
					"U_UserName": "",
					"U_Property": propertyCode,
					"U_Project": project,
					"U_Enabled": "Y",
					"U_Expires": "29991231"
				};
				var oModel = this.getView().getModel("approverList");
				var approverList = oModel.getProperty("/value");
				approverList.push(newLine);
				oModel.setProperty("/value", approverList);

			} catch (err) {
				sap.m.MessageBox.alert(err.toString());
			}
			/*			try {

				var oMainTable = this.byId("idMainTable");
				var localModel = this.getOwnerComponent().getModel("local");
				if (!role) {
					role = "";
				}

				//handle Lookout logic here


/*				var oBinding = oMainTable.getBinding("items"); //This gets the list Binding
				var oContext = oBinding.create({
					"U_Role": role,
					"U_Ladder": ladder,
					"U_UserCode": "",
					"U_UserName": "",
					"U_Property": propertyCode,
					"U_Project": project,
					"U_Enabled": "Y",
					"U_Expires": "29991231"
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
			//Get the code
			var sId = oEvent.getParameter("id");
			var sIdCode = sId.replace("btnDeleteLine", "DocEntry");
			var oInput = this.byId(sIdCode);
			var sDocEntry = oInput.getValue();

			//delete the line

			// set the queryParams 
			var qParamsModel = models.createQueryModel();
			thisView.setModel(qParamsModel, "qParams");
			qParamsModel.setProperty("/method", "DELETE");
			qParamsModel.setProperty("/command", "UDO_K2P_APRV_USERS(" + sDocEntry + ")");
			qParamsModel.setProperty("/retry", false);
			qParamsModel.setProperty("/firstFetch", true);
			var queryParams = "";
			qParamsModel.setProperty("/queryParams", queryParams);
			//fetch data
			K2PUtils.getpostputpatch(this, this.lineCallBack);

			/*	
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

			if (!qNameIn) {
				qNameIn = "qParams";
			}
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");

			var i18n;
			if (errorCode === 0) {
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

		/*		onDeleteLine: function(oEvent) {
			var sId = oEvent.getParameter("id");
			var oContext = this.byId(sId).getBindingContext();
			var oMainTable = this.byId("idMainTable"); //this is the table/listbase
			var oBinding = oMainTable.getBinding("items"); //the list binding? 

			try {

				oContext.delete("$auto");
				this.onNavBack();

				//this.getView().getModel().submitBatch("approverList");

			} catch (e) {
				var e1 = e;
				e1 = e1;
			}
			//oBinding.refresh("approverList");

		},*/
		onSubmit: function() {

			var fnSuccess = function() {
				//this._setBusy(false);
				MessageToast.show("Saved");
				this.onNavBack();
				//var oMainTable = this.byId("idMainTable"); //this is the table/listbase
				//var oBinding = oMainTable.getBinding("items"); //the list binding?
				//oBinding.resetChanges("approverList");
				//oBinding.refresh("approverList");

				//this._setUIChanges(false);
			}.bind(this);

			var fnError = function(oError) {
				//this._setBusy(false);
				//this._setUIChanges(false);
				MessageBox.alert(oError);
			}.bind(this);

			try {

				this.getView().getModel().submitBatch("approverList").then(fnSuccess, fnError);

			} catch (oError) {
				MessageBox.alert(oError);
			}

		},
		onRefresh: function(oEvent) {

			var thisView = this.getView();
			/*			var mTable = thisView.byId("idMainTable");
			var oBinding = mTable.getBinding("items");

			var chgd = (oBinding.hasPendingChanges());
			if (chgd) {
				MessageBox.error("Current Changes Not Saved!");
				return;
			}
*/
			thisView.setBusy(true);
			var localModel = this.getOwnerComponent().getModel("local");
			//handle Lookout logic here
			//Populate the Project(Program) combo
			var propertyCode = localModel.getProperty("/property");
			var project = localModel.getProperty("/project");
			var ladder = localModel.getProperty("/ladder");
			if (!oEvent) {
				ladder = "XYZQq";
			}

			//refresh the lines for this ladder
			var sFilterLadder = "U_Ladder eq \'" + ladder + "\'";
			var oParameters2 = {
				$filter: sFilterLadder
			};
			var mTable2 = thisView.byId("ladderLines");
			var oBinding2 = mTable2.getBinding("items");
			oBinding2.changeParameters(oParameters2);

			var sFilter = "?$filter=U_Property eq \'" + propertyCode + "\' and U_Project eq \'" + project + "\' and U_Ladder eq \'" + ladder +
				"\'";
			//var skey = localModel.ladderLineKey;

			// set the queryParams model
			var qParamsModel = models.createQueryModel();
			qParamsModel.setProperty("/method", "GET");
			qParamsModel.setProperty("/command", "UDO_K2P_APRV_USERS");
			//qParamsModel.setProperty("/data", null);
			qParamsModel.setProperty("/firstFetch", true);
			var params = sFilter;
			//params = "?$select=DocEntry,U_Ladder,U_Role,U_Amt&$orderby=U_Amt&$filter=U_Ladder eq '" + skey + "'";
			var queryParams = params;
			qParamsModel.setProperty("/queryParams", queryParams);
			this.getView().setModel(qParamsModel, "qParamsLines");
			K2PUtils.getpostputpatch(this, this.onRefreshCallback, null, this, "qParamsLines");

			/*			//	$$updateGroupId: "approverList", ???
			var oBinding = this.byId("ladderLines").getBinding("items");
			sFilter = "";
			var oParameters = {
				$filter: sFilter
			};
*/

			/*
			
			
		    
		    	
			var oBinding = this.byId("ladderLines").getBinding("items");
			oBinding.resetChanges("approverList"); //This will reset both server and local bound data

			if (oBinding.hasPendingChanges()) {
				MessageBox.error("Refresh Not Possible");
				return;
			}
			var thisView = this.getView();
			thisView.setBusy(true);
			oBinding.refresh();
			//MessageToast.show(this._getText("refreshSuccessMessage"));
			thisView.setBusy(false);

		    
		    */

			/*
			var oFilter = new Filter({
				path: "U_Property",
				operator: FilterOperator.EQ,
				value1: propertyCode
			});

			//var sFilter = "U_Property eq \'" + propertyCode + "\' and U_Project eq \'" + project + "\' and U_Ladder eq \'" + ladder + "\'";

			//var oTemplate = thisView.byId("ColumnListItemUsers").clone();
			var oBinding = mTable.getBinding("items");
			oBinding.filter(oFilter, FilterType.Application);

		
				
							var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Name", FilterOperator.Contains, sValue);

			oEvent.getSource().getBinding("items").filter([oFilter]);
				
			oBinding.path = "/UDO_K2P_APRV_USERS";
			oBinding.parameters = {
				"$filter": sFilter,
				"$$updateGroupId": "UpdateBatchGroup1"
			};
			oBinding.events = {
				"dataReceived": this.onDataReceivedProject1,
				"DataStateChange": this.onDataStateChangeProject1
			};
			oBinding.template = oTemplate;
			oBinding.templateShareable = true;

			mTable.bindAggregation("items", true);
			

		
			parameters: {$filter : 'CardType eq \'cCustomer\''}, templateShareable:false}
			events: {dataReceived : '.onDataReceived', change: '.onDataChange', DataStateChange: '.onDataStateChange'}
			oBinding.events = {
						"dataReceived": callingController.onDataReceivedProject1,
						"DataStateChange": callingController.onDataStateChangeProject1
					};*/

			/*			if (oBinding.hasPendingChanges()) {
				var i18nModel = this.getOwnerComponent.getModel("i18n");
				MessageBox.error(i18nModel.getProperty("refreshNotPossible"));
				return;
			}*/

		},

		onRefreshCallback: function(callingController, results, callback2, oThis) {

			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel("qParamsLines");
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var retry = qParamsModel.getProperty("/retry");
			var component = callingController.getOwnerComponent();
			var i18n;
			if (errorCode === 0) {
				var oResultModel = new sap.ui.model.json.JSONModel(results);
				//oResultModel.setData(result);
				thisView.setModel(oResultModel, "approverList");

				//Does This user have a role?
				//
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
				var sMessage = "onRefreshCallback: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},
		onNameChange: function(oEvent) {
			var oInput = oEvent.getSource();
			var sValueState = "None";
			var bValidationError = false;
			var oBinding = oInput.getBinding("value");

			try {
				oBinding.getType().validateValue(oInput.getValue());
			} catch (oException) {
				sValueState = "Error";
				bValidationError = true;
			}

			//oInput.setValueState(sValueState);

			return bValidationError;
		},

		onValueHelpRequest: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();
			///<core:Fragment id="headerFrag" fragmentName="K2PPM_PM.K2PUtils.customHeader" type="XML"/>
			if (!this._pValueHelpDialog) {
				this._pValueHelpDialog = Fragment.load({
					id: oView.getId(),
					name: "K2PPM_PM.K2PUtils.UserDialog",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._pValueHelpDialog.then(function(oDialog) {
				// Create a filter for the binding
				oDialog.getBinding("items").filter([new Filter("Name", FilterOperator.Contains, sInputValue)]);
				// Open ValueHelpDialog filtered by the input's value
				oDialog.open(sInputValue);
			});
		},

		onValueHelpDialogSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Name", FilterOperator.Contains, sValue);

			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onValueHelpDialogClose: function(oEvent) {
			var sDescription,
				oSelectedItem = oEvent.getParameter("selectedItem");
			oEvent.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			sDescription = oSelectedItem.getDescription();

			this.byId("productInput").setSelectedKey(sDescription);
			this.byId("selectedKeyIndicator").setText(sDescription);

		},

		onSuggestionItemSelected: function(oEvent) {
			var oItem = oEvent.getParameter("selectedItem");
			var oKey = oItem ? oItem.getKey() : "";
			var oValue = oItem ? oItem.getText() : "";
			var localModel = this.getOwnerComponent().getModel("local");
			localModel.setProperty("/approvalUserName", oValue);
			localModel.setProperty("/approvalUser", oKey);
		},

		onSuggestionItemSelectedProperty: function(oEvent) {
			var oItem = oEvent.getParameter("selectedRow");
			var oCells = oItem.getCells();
			var oCell = oCells[0];
			var sPropertyName = oCell.getText();
			oCell = oCells[1];
			var sProperty = oCell.getText();
			oCell = oCells[2];
			var sProject = oCell.getText();
			var localModel = this.getOwnerComponent().getModel("local");
			localModel.setProperty("/propertyName", sPropertyName);
			localModel.setProperty("/property", sProperty);
			var thisView = this.getView();
			var oSelect = thisView.byId("Project1");
			var oBinding = oSelect.getBinding("items");
			var sFilter = "U_K2P_DIM3 eq \'" + sProperty + "\'";
			var oParameters = {
				$filter: sFilter
			};
			oBinding.changeParameters(oParameters);
			localModel.setProperty("/project", sProject);

			//var path = "UDO_K2P_PROPERTY(\'" + sProperty + "\')";
			//K2PUtils.getByPath(this, path, "", this.propertyCallBack, "qparamsProperty");
		},
		onSuggestionItemSelectedUser: function(oEvent) {
			var thisView = this.getView();
			var oItem = oEvent.getParameter("selectedRow");
			var sId = oEvent.getParameter("id");
			var sId2 = sId.replace("UserName", "UserCode");
			var oInput = thisView.byId(sId);
			var oInputCode = thisView.byId(sId2);

			/*			var sArray = sId.split("-");
			var sIndex = sArray[sArray.length - 1];

			var oContext = oInput.getBindingContext();
			var sPath = oContext.sPath;

			var oMainTable = this.byId("idMainTable");
			var oBinding = oMainTable.getBinding("items");
			var oModel = oMainTable.getModel();
			var oModel = this.getOwnerComponent().getModel("serviceLayer");
			var sFullPath = sPath + "/UserCode";
			*/

			var oCells = oItem.getCells();
			var oCell = oCells[0];
			var sName = oCell.getText();
			oCell = oCells[1];
			var sCode = oCell.getText();

			oInputCode.setValue(sCode);

			//update the values on this row for user name and id

		},
		updateServer: function(oEvent, callbackOrigin, CallingController) {
			//set the headers for the Batch
			//var crlf = "\r\n";
			if (oEvent) {
				//if called from button do not exit page
				callbackOrigin = null;
			}
			var crlf = String.fromCharCode(13) + String.fromCharCode(10);
			var oModel = this.getView().getModel("approverList");
			var itemList = oModel.getProperty("/value");
			if (itemList.length === 0) {
				//no lines to process so exit
				if (callbackOrigin) {
					callbackOrigin(CallingController);
				}
				return;
			}
			var thisView = this.getView();
			thisView.setBusy(true);
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
			var qNameIn = "qpLadder";
			var DocEntry, lineCommand;
			qParamsModel.setProperty("/queryParams", queryParams);
			var batchBody = "";

			for (i = 0; i < itemList.length; i++) {
				//for (i = 0; i === 0; i++) {    
				itemLine = itemList[i];
				DocEntry = itemLine.DocEntry;
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
					lineCommand = "UDO_K2P_APRV_USERS(" + DocEntry + ")";
				} else {
					//insert
					batchBody += ("POST "); //
					lineCommand = "UDO_K2P_APRV_USERS";
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
			batchBody += "--batch_id-1629298140018-237--";
			batchBody += crlf;
			//var body = batchBody.toString();
			/*            var body = "--batch_id-1629038696589-237\r\nContent-Type:application/http\r\nContent-Transfer-Encoding:binary\r\n\r\n\r\n\r\n" 
            + "PATCH UDO_K2P_APRV_LADDER('Regular') HTTP/1.1\r\nContent-Type:application/json;charset=UTF-8;IEEE754Compatible=true\r\n\r\n\r\n" 
            + "{\"Code\":\"Regular\",\"Name\":\"Regular2\",\"DocEntry\":\"36\"}\r\n\r\n\r\n--batch_id-1629038696589-237--\r\n";*/
			qParamsModel.setProperty("/data", batchBody);
			thisView.setModel(qParamsModel, qNameIn);
			K2PUtils.getpostputpatch(this, this.updateServerCallBack, callbackOrigin, this, qNameIn);

			//this.fetchMain(this, false);
		},

		updateServerCallBack: function(callingController, results, callbackOrigin) {

			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel("qpLadder");
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");

			//callingController.getRouter().navTo("home");
			if (errorCode === 0) {
				//fetch data
				if (callbackOrigin) {
					callbackOrigin(callingController);
				} else {
					callingController.onRefresh(callingController, false);
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

		},

		onNavBack: function() {
			this.updateServer(null, this.onNavBackCallBack, this);
		},
		onNavBackCallBack: function(callingController) {
			callingController.getRouter().navTo("home");
		}
	});

});