sap.ui.define([
	"K2PPM_PM/controller/BaseController",
	"../K2PUtils/K2PUtils",
	"K2PPM_PM/model/models",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v4/ODataModel",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment"
	], function(BaseController, K2PUtils, models, JSONModel, ODataModel, Sorter, Filter, FilterOperator, FilterType, MessageBox, MessageToast,
	History, Fragment) {
	"use strict";
	return BaseController.extend("K2PPM_PM.controller.PurchaseOrder", {
		onInit: function() {

			var oRouter = this.getRouter();
			oRouter.getRoute("purchaseOrder").attachMatched(this._onRouteMatched, this);

			//this.getView().setModel(models.createQueryModel(), "qParams");

			//var serviceLayerModel = this.getOwnerComponent().getModel("serviceLayer");
			//this.getView().setModel(serviceLayerModel);

			//this.getProperties();

			//var dfltModel = this.getOwnerComponent().getModel("serviceLayer");

			//this.getView().setModel(dfltModel);

			//this._bTechnicalErrors = false;

		},
		_onRouteMatched: function() {

			var thisView = this.getView();
			thisView.setBusy(true);
			var oVendor = thisView.byId("Vendor");

			//var btnSubmit = thisView.byId("btnSubmit");
			var oViewModel = this.getOwnerComponent().getModel("purchaseOrderView");

			var add = oViewModel.getProperty("/add");
			if (add === true) {
				//add new record here
				this.defaultNew();
			} else {
				oVendor.setEditable(false);
				//btnSubmit.setVisible(true);
				this.fetchMain();
			}

			thisView.setBusy(false);

		},
		onSuggestVendor: function(oEvent) {

			var sId = oEvent.getParameter("id");
			var thisControl = this.getView().byId(sId);
			var inputValue;

			inputValue = thisControl.getValue();
			var filter = "CardType eq \'cSupplier\' and contains(CardName,\'" + inputValue + "\')";

			this.refreshBPList(this, sId, "suggestionRows", filter, inputValue);

		},
		refreshBPList: function(callingController, itemId, bindingName, filter, inputValue) {
			var thisView = callingController.getView();
			thisView.setBusy(true);
			var oItem = thisView.byId(itemId);
			//"contains(CardCode,'BAJW')"
			var binding = oItem.getBinding(bindingName);
			var parameters = {
				$filter: filter
			};
			binding.changeParameters(parameters);
			binding.refresh();

			var suggestionRows = oItem.getSuggestionRows();

			thisView.setBusy(false);
			var parameters2 = {};
			parameters2.suggestValue = inputValue;
			oItem.fireSuggest(parameters2);
		},

		onDataReceivedProjCode1: function() {
			var o = null;

		},
		defaultNew: function() {
			var notesListModel = new JSONModel();
			var data = {
				"value": []
			};
			notesListModel.setData(data);
			//this.refreshProgramList(this, "XYZ!_");
			this.getOwnerComponent().setModel(notesListModel, "notesList");
			var thisView = this.getView();
			var oViewModel = this.getOwnerComponent().getModel("purchaseOrderView");
			var oUserModel = this.getOwnerComponent().getModel("userModel");
			var user = oUserModel.getProperty("/value/0/UserCode");
			var userName = oUserModel.getProperty("/value/0/UserName");
			var today = new Date();
			var sDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
			var newPOModel = this.createPurchaseOrderModel();
			newPOModel.setProperty("/U_K2P_User", user);
			newPOModel.setProperty("/U_K2P_CreateByName", userName);
			newPOModel.setProperty("/DocDate", sDate);
			newPOModel.setProperty("/DocDueDate", sDate);
			var woDocEntry = oViewModel.getProperty("/U_K2P_WODocEntry");
			var woDocNum = oViewModel.getProperty("/U_K2P_WODocNum");
			if (woDocEntry) {
				newPOModel.setProperty("/U_K2P_WODocEntry", woDocEntry);
				newPOModel.setProperty("/U_K2P_WODocNum", woDocNum);
			}
			newPOModel.setProperty("/U_K2P_Approved", "N");
			oViewModel.setProperty("/approved", false);
			oViewModel.setProperty("/draft", true);
			this.getOwnerComponent().setModel(newPOModel, "purchaseOrder");
			//this.onAddItem();
			//Set Controls
			var oVendor = thisView.byId("Vendor");
			var oPONum = thisView.byId("PONum");
			oVendor.setEditable(true);
			oPONum.setVisible(false);
			thisView.byId("Ladder").setEnabled(true);
			thisView.byId("ProjCode1").setEnabled(true);
			//btnSubmit.setVisible(true);
			thisView.byId("btnApprove").setVisible(true);
			thisView.byId("btnDecline").setVisible(false);
			thisView.byId("approvalComment").setVisible(true);
			thisView.byId("approvalCommentLabel").setVisible(true);
			thisView.byId("Ladder").setEnabled(true);
			thisView.byId("ProjCode1").setEnabled(true);
			//thisView.byId("PONum").setVisible(true);
			this.refreshApprovals(this, -1);
			thisView.setBusy(false);
		},
		fetchMain: function() {

			var oViewModel = this.getOwnerComponent().getModel("purchaseOrderView");
			var path = oViewModel.getProperty("/path");
			var data;

			// set the queryParams model
			var qParamsModel = models.createQueryModel();
			qParamsModel.setProperty("/method", "GET");
			qParamsModel.setProperty("/command", path);
			qParamsModel.setProperty("/data", data);
			var queryParams = "";
			qParamsModel.setProperty("/queryParams", queryParams);
			var qNameIn = "qPOFetch";
			this.getView().setModel(qParamsModel, qNameIn);
			K2PUtils.getpostputpatch(this, this.fetchMainCallback, null, this, qNameIn);

		},

		fetchMainCallback: function(callingController, result, callback2, oThis, qNameIn) {

			var oViewModel = callingController.getOwnerComponent().getModel("purchaseOrderView");
			var thisView = callingController.getView();
			var mainForm = thisView.byId("mainForm");
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var retry = qParamsModel.getProperty("/retry");
			var draft = oViewModel.getProperty("/draft");
			var component = callingController.getOwnerComponent();
			var i18n;
			if (errorCode === 0) {
				var oResultModel = new sap.ui.model.json.JSONModel();
				oResultModel.setData(result);
				var approved = oResultModel.getProperty("/U_K2P_Approved");
				var property = oResultModel.getProperty("/U_K2P_Property");

				component.setModel(oResultModel, "purchaseOrder");
				var docEntry;
				var draftDocEntry;

				if (draft) {
					docEntry = oResultModel.getProperty("/DocEntry");
					draftDocEntry = docEntry;
					if (!approved) {
						oResultModel.setProperty("/U_K2P_Approved", "N");
					}
				} else {
					//PO
					draftDocEntry = oResultModel.getProperty("/U_K2P_DraftDocEntry");
					if (!approved) {
						oResultModel.setProperty("/U_K2P_Approved", "Y");
					}
				}
				callingController.refreshApprovals(callingController, draftDocEntry);
				var level = oResultModel.getProperty("/U_K2P_APRV_NXT_LVL");
				/*var btnSubmit = thisView.byId("btnSubmit");
				if (level === "SUBMIT") {
					btnSubmit.setVisible(true);
				} else {
					btnSubmit.setVisible(true);
				}*/
				//callingController.refreshApprovals(callingController, docEntry);

				var oUserModel = component.getModel("userModel");
				var admin = oUserModel.getProperty("/value/0/U_K2P_ApprovalAdm");
				thisView.byId("Ladder").setEnabled(false);
				thisView.byId("ProjCode1").setEnabled(false);

				if (oViewModel.getProperty("/draft")) {
					oResultModel.setProperty("/U_K2P_DraftDocEntry", docEntry);
					var docTotal = oResultModel.getProperty("/DocTotal");
					oViewModel.setProperty("/lastTotal", docTotal);
					thisView.byId("btnApprove").setVisible(true);
					thisView.byId("btnDecline").setVisible(true);
					thisView.byId("approvalComment").setVisible(true);
					thisView.byId("approvalCommentLabel").setVisible(true);
					thisView.byId("PONum").setVisible(true);
					thisView.byId("Approved").setEnabled(false);
					callingController.onRefreshNotes(callingController, draftDocEntry);
					//mainForm.setEditable(true);
					//callingController.onSubmit(null, callingController, qNameIn);

				} else {
					thisView.byId("Ladder").setEnabled(false);
					thisView.byId("ProjCode1").setEnabled(false);
					thisView.byId("PONum").setVisible(true);
					thisView.byId("btnApprove").setVisible(false);
					thisView.byId("btnDecline").setVisible(false);
					thisView.byId("approvalComment").setVisible(false);
					thisView.byId("approvalCommentLabel").setVisible(false);

					/*					if (admin === "Y") {
						thisView.byId("Approved").setEnabled(true);
					}*/
					//mainForm.setEnabled(false);
					thisView.setBusy(false);
				}
				callingController.onSubmit(null, callingController, qNameIn);
				//callingController.onRefreshNotes(callingController, draftDocEntry);
				//callingController.refreshProgramList(callingController, property);
				//callingController.onSubmit(null, callingController, "getUserApprovalLimit");
				//callingController.addApprovalLogCallBack(callingController, qNameIn);

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
				var sMessage = "fetchMainCallback: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},
		refreshApprovals: function(callingController, docEntry) {
			//refresh the approvals table
			if (docEntry === 0 || docEntry === "0" || !docEntry) {
				docEntry = -1;
			}
			var thisView = callingController.getView();
			var sFilterLadder = "U_DraftEntry eq " + docEntry;
			var oParameters2 = {
				$filter: sFilterLadder
			};
			var mTable2 = thisView.byId("approvalsTable");
			var oBinding2 = mTable2.getBinding("items");
			oBinding2.changeParameters(oParameters2);
			oBinding2.refresh();

			//idApproverTable
			var sFilter = "DocEntry eq " + docEntry;
			var oParameters3 = {
				$filter: sFilter
			};
			var mTable3 = thisView.byId("idApproverTable");
			var oBinding3 = mTable3.getBinding("items");
			oBinding3.changeParameters(oParameters3);
			oBinding3.refresh();
			return;
		},
		onApprove: function(oEvent) {
			/*
            confirmation
            onSubmit
            getUserRole
            get approval ammount from UDO_K2P_APRV_LINES
            checkApprovalLimit
            if limit ok 
                --save the draft with the approved by info
                SaveDraftToDocument
            else add lower level approval if OK
            */
			var qNameIn;
			var viewModel = this.getOwnerComponent().getModel("purchaseOrderView");
			var thisView = this.getView();
			var purchaseOrderModel = thisView.getModel("purchaseOrder");
			var sId = oEvent.getParameter("id");
			var action;
			viewModel.setProperty("/action", action);
			var approved = viewModel.getProperty("/approved");
			var draft = viewModel.getProperty("/draft");
			var callingController = this;

			if (approved) {
				//this already approved
				MessageToast.show("Already approved");
				return;
			}

			if (!draft) {
				//already a PO
				MessageToast.show("Already approved");
				return;
			}

			//Approval limit OK?
			var nextAmt = purchaseOrderModel.getProperty("/U_K2P_APRV_NXT_AMT");
			if (!nextAmt) {
				nextAmt = 0;
			}
			var approvalLimit = viewModel.getProperty("/approvalLimit");
			var doctotal = purchaseOrderModel.getProperty("/DocTotal");
			if (!doctotal) {
				doctotal = 0;
			}
			if (nextAmt > approvalLimit) {
				MessageToast.show("Already approved at this level!");
				return;
			}

			//If the current level 

			switch (sId) {

				/*				case "nav---purchaseOrder--btnSubmit":
					action = "SUBMIT";
					qNameIn = "qOnSubmit";
					break;*/
				case "nav---purchaseOrder--btnApprove":
					action = "Approve";

					if (approvalLimit < doctotal) {
						qNameIn = "qNextLevel";
					} else if (approvalLimit === 0) {
						qNameIn = "qNextLevel";
					} else {
						qNameIn = "qOnApprove";
						action = "Final Approval";
					}

					break;
				case "nav---purchaseOrder--btnDecline":
					action = "Decline";
					qNameIn = "qOnDecline";
					break;
				default:
					MessageToast.show("Invalid Action!");
					return;
			}
			viewModel.setProperty("/action", action);
			var qParamsModel = models.createQueryModel();
			this.getOwnerComponent().setModel(qParamsModel, qNameIn);
			var approvalComment = viewModel.getProperty("/approvalComment");
			if (!approvalComment) {
				approvalComment = "Blank";
			}

			var sTitle = "Confirm";
			var msg = "Comment: " + approvalComment;
			MessageBox.show(
				msg, {
					icon: MessageBox.Icon.QUESTION,
					title: sTitle,
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					emphasizedAction: MessageBox.Action.NO,
					onClose: function(oAction) {
						switch (oAction) {
							case MessageBox.Action.YES:
								//
								callingController.onSubmit(null, callingController, qNameIn);
								break;
							case MessageBox.Action.NO:
								//
								return;
						}
					}
				});

		},

		checkApprovalLimit: function(callingController, qNameIn) {
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel(qNameIn);
			var oViewModel = callingController.getOwnerComponent().getModel("purchaseOrderView");
			var purchaseOrderModel = thisView.getModel("purchaseOrder");
			var approvalLimit = oViewModel.getProperty("/approvalLimit");
			var approvalComment = oViewModel.getProperty("/approvalComment");
			var role = purchaseOrderModel.getProperty("/approvalRole");
			if (!approvalLimit) {
				approvalLimit = 0;
			}
			if (approvalLimit === 0) {
				//this user has no approval authority
				//Unless it is the first time then push up
				MessageToast.show("Unauthorized");
				thisView.setBusy(false);
				return;
			}
			var DocTotal = purchaseOrderModel.getProperty("/DocTotal");
			var docEntry = purchaseOrderModel.getProperty("/DocEntry");
			var docNum = purchaseOrderModel.getProperty("/DocNum");
			var data = purchaseOrderModel.getJSON();
			var oUserModel = callingController.getOwnerComponent().getModel("userModel");
			var user = oUserModel.getProperty("/value/0/UserCode");
			var userName = oUserModel.getProperty("/value/0/UserName");
			var today = new Date();
			var sDate = today.getFullYear() + "" + (today.getMonth() + 1) + "" + today.getDate();
			if (!docEntry) {
				docEntry = 0;
				docNum = 0;
			}
			if (docEntry !== 0) {
				if (DocTotal <= approvalLimit) {
					//save draft to Document (or save PO Directly)
					purchaseOrderModel.setProperty("/U_K2P_DraftDocEntry", docEntry);
					purchaseOrderModel.setProperty("/U_K2P_DraftDocNum", docNum);
					purchaseOrderModel.setProperty("/U_K2P_ApprovedBy", user);
					purchaseOrderModel.setProperty("/U_K2P_ApprovedByName", userName);
					purchaseOrderModel.setProperty("/U_K2P_ApprovedDate", sDate);
					purchaseOrderModel.setProperty("/U_K2P_Approved", "Y");
					//Call onAddupdate
					callingController.addOrUpdate(callingController, qNameIn);

				} else {
					//DocTotal is greater than this users approval limit
					var K2P_APRV_NXT_AMT = purchaseOrderModel.getProperty("/U_K2P_APRV_NXT_AMT");
					if (!K2P_APRV_NXT_AMT) {
						K2P_APRV_NXT_AMT = 0;
					}
					if (K2P_APRV_NXT_AMT > approvalLimit) {
						//already approved at this amount so exit
						thisView.setBusy(false);
						MessageToast.show("Already approved at this level!");
						return;
					} else {

						//Put D for deny
						var action = "A";
						qParamsModel.setProperty("/action", action);
						callingController.addApprovalLog(callingController, qNameIn);

						/*						// 	if (approvalLimit > 0) {
						// 	}

						data = {
							"U_DraftEntry": docEntry,
							"U_Date": sDate,
							"U_Action": action,
							"U_DocType": 22,
							"U_UserCode": user,
							"U_UserName": userName,
							"U_Role": role,
							"U_Amt": approvalLimit,
							"U_Comments": approvalComment
						};
						qParamsModel.setProperty("/method", "POST");
						qParamsModel.setProperty("/command", "UDO_K2P_APRV_LOG");
						qParamsModel.setProperty("/data", JSON.stringify(data));
						qParamsModel.setProperty("/retry", false);
						qParamsModel.setProperty("/firstFetch", false);
						qParamsModel.setProperty("/withCredentials", false);
						qParamsModel.setProperty("/queryParams", "");
						qParamsModel.setProperty("/action", action);
						thisView.setModel(qParamsModel, qNameIn);
						K2PUtils.getpostputpatch(callingController, callingController.addApprovalCallBack, null, this, qNameIn);*/
					}
				}
			}
		},
		onDeleteLine: function(oEvent) {

			var purchaseOrderModel = this.getView().getModel("purchaseOrder");
			var objLines = purchaseOrderModel.getProperty("/DocumentLines");
			var sId = oEvent.getParameter("id");
			var sArray = sId.split("-");
			var sIndex = sArray[sArray.length - 1];
			objLines.splice(sIndex, 1);
			purchaseOrderModel.setProperty("/DocumentLines", objLines);
			this.getView().setBusy(false);

		},
		addApprovalLog: function(callingController, qNameIn) {
			var thisView = callingController.getView();
			var purchaseOrderViewModel = callingController.getOwnerComponent().getModel("purchaseOrderView");
			var purchaseOrderModel = callingController.getOwnerComponent().getModel("purchaseOrder");
			var draftEntry = purchaseOrderModel.getProperty("/U_K2P_DraftDocEntry");
			var oUserModel = callingController.getOwnerComponent().getModel("userModel");
			var user = oUserModel.getProperty("/value/0/UserCode");
			var userName = oUserModel.getProperty("/value/0/UserName");
			var sDate = K2PUtils.getTodaysDate();
			//var approvalLimit = purchaseOrderViewModel.getProperty("/approvalLimit");

			var approvalComment = purchaseOrderViewModel.getProperty("/approvalComment");
			var approvalRole = purchaseOrderViewModel.getProperty("/approvalRole");
			var approvalLimit = purchaseOrderViewModel.getProperty("/approvalLimit");

			var qParamsModel = thisView.getModel(qNameIn);
			if (!qParamsModel) {
				qParamsModel = models.createQueryModel();
			}
			var action = purchaseOrderViewModel.getProperty("/action");
			//var docTotal = purchaseOrderModel.getProperty("/DocTotal");
			//var level = purchaseOrderModel.getProperty("/U_K2P_APRV_NXT_LVL");

			var data = {
				"U_DraftEntry": draftEntry,
				"U_Date": sDate,
				"U_Action": action,
				"U_DocType": 22,
				"U_UserCode": user,
				"U_UserName": userName,
				"U_Role": approvalRole,
				"U_Amt": approvalLimit,
				"U_Comments": approvalComment
			};
			qParamsModel.setProperty("/method", "POST");
			qParamsModel.setProperty("/command", "UDO_K2P_APRV_LOG");
			qParamsModel.setProperty("/data", JSON.stringify(data));
			qParamsModel.setProperty("/retry", false);
			qParamsModel.setProperty("/firstFetch", false);
			qParamsModel.setProperty("/withCredentials", false);
			qParamsModel.setProperty("/queryParams", "");
			thisView.setModel(qParamsModel, qNameIn);
			K2PUtils.getpostputpatch(callingController, callingController.addApprovalLogCallBack, null, this, qNameIn);

		},
		addApprovalLogCallBack: function(callingController, result, callback2, oThis, qNameIn) {
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var purchaseOrderModel = thisView.getModel("purchaseOrder");
			var oRouter = callingController.getRouter();
			//var retry = qParamsModel.getProperty("/retry"); "UDO_K2P_APRV_LOG"
			if (errorCode === 0) {
				if (qNameIn === "qOnApprove" || qNameIn === "qOnDecline" || qNameIn === "qNextLevel") {
					//should be done - new level should already be set
					thisView.setBusy(false);
					oRouter.navTo("home");
					return;
				}
			} else {
				var sMessage = qNameIn + " " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				var i18n = "";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},
		setNextApprovalLevel: function(callingController, results, callback2, oThis, qNameIn) {
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var purchaseOrderModel = thisView.getModel("purchaseOrder");
			//var retry = qParamsModel.getProperty("/retry"); "UDO_K2P_APRV_LOG"
			var amt = 0;
			var role = "";
			if (errorCode === 0) {
				var oResult = new sap.ui.model.json.JSONModel();
				oResult.setData(results);

				var valueArray = oResult.getProperty("/value");
				if (valueArray.length > 0) {
					//this should work for either approve or decline
					role = oResult.getProperty("/value/0/U_Role");
					amt = oResult.getProperty("/value/0/U_Amt");
					purchaseOrderModel.setProperty("/U_K2P_APRV_NXT_AMT", amt);
					purchaseOrderModel.setProperty("/U_K2P_APRV_NXT_LVL", role);

				} else {
					//role has no amount
					switch (qNameIn) {
						case "qNextLevel":
							role = "No Higher Approval Level Found!";
							MessageToast.show(role);
							thisView.setBusy(false);
							break;

						case "qOnApprove":
							//This should probably never happend
							role = "No Higher Approval Level Found!";
							MessageToast.show(role);
							thisView.setBusy(false);
							break;

						case "qOnDecline":
							//no lower level available
							//set back to zero approval for creator
							role = "";
							break;

					}

					purchaseOrderModel.setProperty("/U_K2P_APRV_NXT_AMT", amt);
					purchaseOrderModel.setProperty("/U_K2P_APRV_NXT_LVL", role);
					/*				} */

				}
				callingController.addOrUpdate(callingController, qNameIn);
				return;
			} else {
				//(errorCode !== 0)  ?issue error?
				var sMessage = qNameIn + " " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				var i18n = "";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},
		addApprovalCallBack: function(callingController, result, callback2, oThis, qNameIn) {
			var purchaseOrderViewModel = callingController.getOwnerComponent().getModel("purchaseOrderView");
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var command = qParamsModel.getProperty("/command");
			//var retry = qParamsModel.getProperty("/retry"); "UDO_K2P_APRV_LOG"
			if (errorCode === 0) {
				thisView.setBusy(false);
				switch (command) {
					case "UDO_K2P_APRV_LOG":
						purchaseOrderViewModel.setProperty("/approvalComment", "");
						MessageToast.show("Approval Added!");
						thisView.setBusy(false);
						callingController.getRouter().navTo("approvalList");
						break;

					case "DraftsService_SaveDraftToDocument":
						///exit here if a direct PO
						if (qNameIn === "qDirect") {
							thisView.setBusy(false);
							var oRouter = callingController.getRouter();
							oRouter.navTo("home");
						} else {
							callingController.addApprovalLog(callingController, qNameIn);

						}
						break;
					default:
						var sMessage = "addApprovalCallBack: " + qNameIn + " " + error + " Code:" + errorCode.toString() + " status: " + status;
						thisView.setBusy(false);
						var i18n = "";
						K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
				}

			} else {
				var sMessage = qNameIn + " " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				var i18n = "";
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},
		onDeleteRequest: function() {
			var callingController = this;
			var purchaseOrderModel = callingController.getOwnerComponent().getModel("purchaseOrder");
			var documentStatus = purchaseOrderModel.getProperty("/DocumentStatus");
			var approved = purchaseOrderModel.getProperty("/U_K2P_Approved");
			var thisView = callingController.getView();
			if (documentStatus !== "bost_Open" || approved === "Y") {
				MessageToast.show("Already completed. Deletion not allowed!");
				return;
			}
			var docEntry = purchaseOrderModel.getProperty("/DocEntry");
			if (docEntry === 0) {
				//no need to delete - does not exist
				var oRouter = callingController.getRouter();
				oRouter.navTo("home");
				return;
			}
			var sTitle = "Confirm Delete?";
			var msg = "Permanently delete this request?";
			MessageBox.show(
				msg, {
					icon: MessageBox.Icon.QUESTION,
					title: sTitle,
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					emphasizedAction: MessageBox.Action.NO,
					onClose: function(oAction) {
						switch (oAction) {
							case MessageBox.Action.YES:
								//
								thisView.setBusy(true);
								var qNameIn = "qDeleteRequest";
								var command = "/Drafts(" + docEntry + ")";
								var qParamsModel = models.createQueryModel();
								qParamsModel.setProperty("/method", "DELETE");
								qParamsModel.setProperty("/command", command);
								qParamsModel.setProperty("/data", null);
								qParamsModel.setProperty("/retry", false);
								qParamsModel.setProperty("/withCredentials", false);
								var queryParams = "";
								qParamsModel.setProperty("/queryParams", queryParams);
								callingController.getView().setModel(qParamsModel, qNameIn);
								K2PUtils.getpostputpatch(callingController, callingController.onDeleteRequestCallBack, null, callingController, qNameIn);
								break;
							case MessageBox.Action.NO:
								//
								return;
						}
					}
				});
		},
		onDeleteRequestCallBack: function(callingController, results, callback2, oThis, qNameIn) {
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/errorCode");
			var i18n;
			if (errorCode === 0) {
				//no problem just return
				thisView.setBusy(false);
				MessageToast.show("Request deleted.");
				var oRouter = callingController.getRouter();
				oRouter.navTo("home");
				return;
			} else {
				//issue error
				var sMessage = "onDeleteRequestCallBack: " + error + " Code:" + errorCode.toString();
				thisView.setBusy(false);
				i18n = "";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				callingController.errorDialogBox(this, i18n, sMessage, true, null, status);
			}
		},
		onCancelCallBack: function(callingController, results, callback2, oThis, qNameIn) {
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/errorCode");
			var i18n;
			if (errorCode === 0) {
				//no problem just return
				thisView.setBusy(false);
				var oRouter = callingController.getRouter();
				oRouter.navTo("home");
				return;
			} else {
				//issue error
				var sMessage = "onCancelCallBack: " + error + " Code:" + errorCode.toString();
				thisView.setBusy(false);
				i18n = "";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				callingController.errorDialogBox(this, i18n, sMessage, true, null, status);
			}
		},

		onSubmit: function(oEvent, callingControler, qNameIn) {
			//getUserRole first
			var oThis;

			if (oEvent === null) {
				//Called from Code
				//firstFetch = true;
				oThis = callingControler;

			} else {
				//Called from save button
				oThis = this;
				var sId = oEvent.getParameter("id");
				switch (sId) {
					case "nav---purchaseOrder--btnSave":
						qNameIn = "qOnSave";
						//just save
						break;
					default:
						MessageToast.show("Invalid Submit!");
						return;

				}
			}
			var qParamsModel = oThis.getView().getModel(qNameIn);
			if (!qParamsModel) {
				qParamsModel = models.createQueryModel();
				oThis.getView().setModel(qParamsModel, qNameIn);
			}
			var thisView = oThis.getView();
			var purchaseOrderModel = oThis.getOwnerComponent().getModel("purchaseOrder");
			K2PUtils.resetTotal(purchaseOrderModel, "/DocumentLines", "/DocTotal", "/LineTotal");
			var userModel = oThis.getOwnerComponent().getModel("userModel");
			var userCode = userModel.getProperty("/value/0/UserCode");
			var sItems = "/DocumentLines";
			var property;
			var project;
			var ladder = purchaseOrderModel.getProperty("/U_K2P_Ladder");
			//			if (qNameIn === "qAddItem" || qNameIn === "qPOFetch") {
			property = purchaseOrderModel.getProperty("/U_K2P_Property");
			project = purchaseOrderModel.getProperty("/U_K2P_ProjCode");
			/*			} else {
				///This only needed for line cost codes
				property = purchaseOrderModel.getProperty(sItems + "/0/U_K2P_Property");
				project = purchaseOrderModel.getProperty(sItems + "/0/ProjectCode");
			}*/
			//populate header with codes from line1
			//populate the comments from the first line if blank
			var itemDescription;
			var comments = purchaseOrderModel.getProperty("/Comments");

			if (!comments) {
				itemDescription = purchaseOrderModel.getProperty(sItems + " /0/ItemDescription");
				purchaseOrderModel.setProperty("/Comments", itemDescription);
			}
			var queryParams, command;
			//var data = purchaseOrderModel.getJSON();
			var oViewModel = oThis.getOwnerComponent().getModel("purchaseOrderView");
			var nextAmt = purchaseOrderModel.getProperty("/U_K2P_APRV_NXT_AMT");
			var approvalLimit = oViewModel.getProperty("/approvalLimit");
			///
			var qParams;
			//var bDraft = oViewModel.getProperty("\draft");

			switch (qNameIn) {

				case "qPOFetch":
					//fetch the draft or PO
					thisView.setBusy(true);
					qParamsModel.setProperty("/method", "GET");
					qParamsModel.setProperty("/command", "/UDO_K2P_APRV_USERS");
					qParamsModel.setProperty("/data", null);
					qParamsModel.setProperty("/retry", false);
					qParamsModel.setProperty("/withCredentials", false);
					queryParams = "?$select=U_Role&$filter=U_Ladder eq \'" + ladder + "\'  and U_UserCode eq \'" + userCode + "\'";
					queryParams += " and U_Property eq \'" + property + "\'  and U_Project eq \'" + project + "\'";
					qParamsModel.setProperty("/queryParams", queryParams);
					K2PUtils.getpostputpatch(oThis, oThis.getUserRoleCallBack, null, oThis, qNameIn);
					return;

				case "qAddItem":
					//getTheApprovalLimit
					thisView.setBusy(true);
					qParamsModel.setProperty("/method", "GET");
					qParamsModel.setProperty("/command", "/UDO_K2P_APRV_USERS");
					qParamsModel.setProperty("/data", null);
					qParamsModel.setProperty("/retry", false);
					qParamsModel.setProperty("/withCredentials", false);
					queryParams = "?$select=U_Role&$filter=U_Ladder eq \'" + ladder + "\'  and U_UserCode eq \'" + userCode + "\'";
					queryParams += " and U_Property eq \'" + property + "\'  and U_Project eq \'" + project + "\'";
					qParamsModel.setProperty("/queryParams", queryParams);
					K2PUtils.getpostputpatch(oThis, oThis.getUserRoleCallBack, null, oThis, qNameIn);
					return;

				case "getUserApprovalLimit":
					//getTheApprovalLimit
					thisView.setBusy(true);
					qParamsModel.setProperty("/method", "GET");
					qParamsModel.setProperty("/command", "/UDO_K2P_APRV_USERS");
					qParamsModel.setProperty("/data", null);
					qParamsModel.setProperty("/retry", false);
					qParamsModel.setProperty("/withCredentials", false);
					queryParams = "?$select=U_Role&$filter=U_Ladder eq \'" + ladder + "\'  and U_UserCode eq \'" + userCode + "\'";
					queryParams += " and U_Property eq \'" + property + "\'  and U_Project eq \'" + project + "\'";
					qParamsModel.setProperty("/queryParams", queryParams);
					K2PUtils.getpostputpatch(oThis, oThis.getUserRoleCallBack, null, oThis, qNameIn);
					return;

				case "qOnApprove":
					oThis.addOrUpdate(oThis, qNameIn);

					/*					
					thisView.setBusy(true);
					qParamsModel.setProperty("/method", "GET");
					qParamsModel.setProperty("/command", "/UDO_K2P_APRV_USERS");
					qParamsModel.setProperty("/data", null);
					qParamsModel.setProperty("/retry", false);
					qParamsModel.setProperty("/withCredentials", false);
					queryParams = "?$select=U_Role&$filter=U_Ladder eq \'" + ladder + "\'  and U_UserCode eq \'" + userCode + "\'";
					queryParams += " and U_Property eq \'" + property + "\'  and U_Project eq \'" + project + "\'";
					qParamsModel.setProperty("/queryParams", queryParams);
					K2PUtils.getpostputpatch(oThis, oThis.getUserRoleCallBack, null, oThis, qNameIn);*/
					return;

				case "qOnSave":
					oThis.addOrUpdate(oThis, qNameIn);
					return;

				case "qNextLevel":
					var nextAmt2 = nextAmt;
					if (approvalLimit > nextAmt) {
						nextAmt2 = approvalLimit;
					}
					qParams = "?$select=U_Ladder,U_Role,U_Amt&$filter=U_Ladder eq \'" + ladder + "\' and U_Amt gt " + nextAmt2 +
						"&$orderby=U_Amt";
					K2PUtils.getByPath(callingControler, "UDO_K2P_APRV_LINES", qParams, callingControler.setNextApprovalLevel, qNameIn, null);
					return;

				case "qOnDecline":
					qParams = "?$select=U_Ladder,U_Role,U_Amt&$filter=U_Ladder eq \'" + ladder + "\' and U_Amt lt " + nextAmt +
						"&$orderby=U_Amt";
					K2PUtils.getByPath(callingControler, "UDO_K2P_APRV_LINES", qParams, callingControler.setNextApprovalLevel, qNameIn, null);
					return;

				case "qOnSubmit":

					thisView.setBusy(true);
					oThis.addApprovalLog(oThis, qNameIn);

					/*					qParamsModel.setProperty("/method", "GET");
					qParamsModel.setProperty("/command", "/UDO_K2P_APRV_USERS");
					qParamsModel.setProperty("/data", null);
					qParamsModel.setProperty("/retry", false);
					qParamsModel.setProperty("/withCredentials", false);
					queryParams = "?$select=U_Role&$filter=U_Ladder eq \'" + ladder + "\'  and U_UserCode eq \'" + userCode + "\'";
					queryParams += " and U_Property eq \'" + property + "\'  and U_Project eq \'" + project + "\'";
					qParamsModel.setProperty("/queryParams", queryParams);
					K2PUtils.getpostputpatch(oThis, oThis.getUserRoleCallBack, null, oThis, qNameIn);*/
					return;

					/*

					//save existing
					oThis.addOrUpdate(oThis);
					return;*/

					/*				case "qOnApprove": //checkApprovalLimit
					thisView.setBusy(false);
					MessageToast.show("No Approval Role Found!");
					thisView.byId("btnApprove").setVisible(true);
					return;
*/
			}

		},
		getUserRoleCallBack: function(callingController, results, callback2, oThis, qNameIn) {
			var thisView = callingController.getView();
			var oPurchaseOrderModel = callingController.getOwnerComponent().getModel("purchaseOrder");
			var oViewModel = callingController.getOwnerComponent().getModel("purchaseOrderView");
			var ladder = oPurchaseOrderModel.getProperty("/U_K2P_Ladder");
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var sIndex = qParamsModel.getProperty("/index");
			var firstFetch = qParamsModel.getProperty("/firstFetch");
			var approveIt = qParamsModel.getProperty("/approveIt");
			var i18n;
			if (errorCode === "0") {
				errorCode = 0;
			}
			if (errorCode === 0) {

				var oResult = new sap.ui.model.json.JSONModel();
				oResult.setData(results);
				var role;

				var valueArray = oResult.getProperty("/value");
				if (valueArray.length > 0) {
					role = oResult.getProperty("/value/0/U_Role");
				}

				oViewModel.setProperty("/approvalRole", role);
				oViewModel.setProperty("/approvalLimit", 0.00);

				if (role) {
					//get the approved amount for this roll
					var dpath = "UDO_K2P_APRV_LINES";
					var qparams = "?$filter=U_Ladder eq \'" + ladder + "\' and U_Role eq \'" + role + "\'";
					qParamsModel.setProperty("/method", "GET");
					qParamsModel.setProperty("/command", dpath);
					qParamsModel.setProperty("/data", null);
					qParamsModel.setProperty("/queryParams", qparams);
					qParamsModel.setProperty("/index", "");
					K2PUtils.getpostputpatch(callingController, callingController.paramsLineCallBack, callback2, callingController, qNameIn);

				} else {
					//unapproved draft - no role found for this user - approvalLimit = 0.00
					switch (qNameIn) {

						case "qPOFetch":
							thisView.setBusy(false);

							if (oViewModel.getProperty("/draft")) {
								thisView.byId("PONum").setVisible(false);
								thisView.byId("btnApprove").setVisible(true);
								thisView.byId("btnDecline").setVisible(true);
								thisView.byId("approvalComment").setVisible(true);
								thisView.byId("approvalCommentLabel").setVisible(true);
								var docentry = oPurchaseOrderModel.getProperty("/DocEntry");
								oPurchaseOrderModel.setProperty("/U_K2P_DraftDocEntry", docentry);
								//callingController.getOwnerComponent().setModel(oPurchaseOrderModel, "purchaseOrder");
							} else {
								thisView.byId("PONum").setVisible(true);
								thisView.byId("btnApprove").setVisible(false);
								thisView.byId("btnDecline").setVisible(false);
								thisView.byId("approvalComment").setVisible(true);
								thisView.byId("approvalCommentLabel").setVisible(false);
							}
							break;

						case "getUserApprovalLimit":
							oPurchaseOrderModel.setProperty("/U_K2P_APRV_NXT_LVL", "");
							oPurchaseOrderModel.setProperty("/U_K2P_APRV_NXT_AMT", 0);
							thisView.setBusy(false);
							break;

						case "qAddItem":
							callingController.onAddItemDetails(callingController);
							return;

						case "qOnSubmit":
							//save existing
							callingController.addOrUpdate(callingController);
							return;

						case "qOnApprove": //checkApprovalLimit
							//If this is the first approval and the approval user has no role
							//is this the creator?
							//check database for existing approvals - if none then add.
							callingController.addApprovalLog(callingController, qNameIn);
							return;

						case "qGetUseApprovalLimit":
							oPurchaseOrderModel.setProperty("/U_K2P_APRV_NXT_LVL", "");
							oPurchaseOrderModel.setProperty("/U_K2P_APRV_NXT_AMT", 0);
							break;

							/*							var mTable2 = thisView.byId("approvalsTable");
				            var oBinding2 = mTable2.getBinding("items");
				        if (oBinding2)  {  
				            this.addApprovalLog(callingController, qNameIn);
				        }
				            var oUserModel = callingController.getOwnerComponent().getModel("userModel");
			                var userName = oUserModel.getProperty("/value/0/UserName");
			                var creatorName = oPurchaseOrderModel.getProperty("/U_K2P_CreateByName");
			                if (userName === creatorName) {
		                    
			                }
				        else
							{
							thisView.setBusy(false);
							MessageToast.show("No Approval");
							thisView.byId("btnApprove").setVisible(true);
							return; 
							}*/

					}

					/*					if (!firstFetch) {
						callingController.addOrUpdate(callingController);
						thisView.setBusy(false);
						return;
					}
*/
				}
				thisView.setBusy(false);

			} else //handle error
			{
				var sMessage = "getUserRoleCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},
		paramsLineCallBack: function(callingController, results, callback2, oThis, qNameIn) {
			var thisView = callingController.getView();
			//var oPurchaseOrderModel = thisView.getModel("purchaseOrder");
			var oViewModel = callingController.getOwnerComponent().getModel("purchaseOrderView");
			var oPurchaseOrderModel = callingController.getOwnerComponent().getModel("purchaseOrder");
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var approvalLimit = 0;
			if (errorCode === 0) {
				var oResult = new sap.ui.model.json.JSONModel();
				oResult.setData(results);
				var valueArray = oResult.getProperty("/value");
				if (valueArray.length > 0) {
					approvalLimit = oResult.getProperty("/value/0/U_Amt");
					oViewModel.setProperty("/approvalLimit", approvalLimit);
					callingController.getOwnerComponent().setModel(oViewModel, "purchaseOrderView");
				} else {
					oViewModel.setProperty("/approvalLimit", 0);
				}
				callingController.getOwnerComponent().setModel(oViewModel, "purchaseOrderView");

				switch (qNameIn) {

					case "qPOFetch":
						if (oViewModel.getProperty("/draft")) {
							var docentry = oPurchaseOrderModel.getProperty("/DocEntry");
							oPurchaseOrderModel.setProperty("/U_K2P_DraftDocEntry", docentry);
							thisView.byId("btnApprove").setVisible(true);
							thisView.byId("btnDecline").setVisible(true);
							thisView.byId("approvalComment").setVisible(true);
							thisView.byId("approvalCommentLabel").setVisible(true);
							thisView.byId("PONum").setVisible(false);
						} else {
							thisView.byId("btnApprove").setVisible(true);
							thisView.byId("btnDecline").setVisible(false);
							thisView.byId("approvalComment").setVisible(false);
							thisView.byId("approvalCommentLabel").setVisible(false);
							thisView.byId("PONum").setVisible(true);
						}

						thisView.setBusy(false);
						return;

					case "getUserApprovalLimit":
						//oPurchaseOrderModel.setProperty("/U_K2P_APRV_NXT_LVL", ?); //already set.
						oPurchaseOrderModel.setProperty("/U_K2P_APRV_NXT_AMT", approvalLimit);
						thisView.setBusy(false);
						return;

					case "qAddItem":
						callingController.onAddItemDetails(callingController, qNameIn);
						return;

					case "qOnSubmit":
						callingController.addOrUpdate(callingController, qNameIn);
						return;

					case "qOnApprove": //checkApprovalLimit
						callingController.checkApprovalLimit(callingController, qNameIn);
						return;

					case "qGetUseApprovalLimit":
						//oPurchaseOrderModel.setProperty("/U_K2P_APRV_NXT_AMT", approvalLimit);
						thisView.setBusy(false);
						return;

				}
			} else //handle error
			{
				var sMessage = "paramsLineCallBack " + error + " Code:" + errorCode.toString() + " status: " + status;
				oViewModel.setProperty("/approvalLimit", 0);
				oViewModel.setProperty("/approvalRole", "");
				thisView.setBusy(false);
				//i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, "", sMessage, true, null, status);
				thisView.setBusy(false);
				return;
			}
		},
		addOrUpdate: function(callingController, qNameIn) {
			var purchaseOrderModel = callingController.getOwnerComponent().getModel("purchaseOrder");
			var oViewModel = callingController.getOwnerComponent().getModel("purchaseOrderView");
			//is this a draft?
			var bDraft = oViewModel.getProperty("/draft");
			var poDocEntry = 0;
			/*			if (totalAmount <= approvalLimit) {
				oViewModel.setProperty("/approved", true);
			} else {
				oViewModel.setProperty("/approved", false);
			}*/
			var docEntry = purchaseOrderModel.getProperty("/DocEntry");
			if (!docEntry) {
				docEntry = 0;
			}
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel(qNameIn);
			// set the queryParams model
			var method, command, data;

			if (docEntry === 0) {
				//document does not exist
				method = "POST";
				switch (qNameIn) {
					case "qOnApprove":
						//This is a direct PO so create as a draft first
						//callingController.preparePO(callingController);
						command = "Drafts";
						break;
					case "qNextLevel":
						//Direct approval of a draft to the next level
						command = "Drafts";
						break;
					case "qOnSave":
						//Direct approval of a draft to the next level
						command = "Drafts";
						break;
				}
			} //draft already exists
			else {
				switch (qNameIn) {
					case "qOnApprove":
						//This will be save the draft and then create a new PO from SaveDraftTodocument. 
						callingController.preparePO(callingController);
						method = "PATCH";
						command = "Drafts(" + docEntry + ")";
						break;
					case "qNextLevel":
						//This will just push to the next approval level. 
						method = "PATCH";
						command = "Drafts(" + docEntry + ")";
						break;
					case "qOnDecline":
						method = "PATCH";
						command = "Drafts(" + docEntry + ")";
						break;
					case "qOnSave":
						//This will just save either the PO or the Draft 
						method = "PATCH";
						if (bDraft) {
							command = "Drafts(" + docEntry + ")";
						} else //this is a PO
						{
							poDocEntry = docEntry;
							command = "PurchaseOrders(" + poDocEntry + ")";
						}
						break;
				}
			}
			data = purchaseOrderModel.getJSON();
			qParamsModel.setProperty("/method", method);
			qParamsModel.setProperty("/command", command);
			//this needs to be stringified in some cases but not all!!! JSON.stringify(data))
			qParamsModel.setProperty("/data", data);
			var queryParams = "";
			qParamsModel.setProperty("/queryParams", queryParams);
			thisView.setModel(qParamsModel, qNameIn);
			K2PUtils.getpostputpatch(callingController, callingController.addOrUpdateCallBack, null, this, qNameIn);
		},
		addOrUpdateCallBack: function(callingController, results, callback2, oThis, qNameIn) {
			var oViewModel = callingController.getOwnerComponent().getModel("purchaseOrderView");
			var oPurchaseOrderModel = callingController.getOwnerComponent().getModel("purchaseOrder");
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var method = qParamsModel.getProperty("/method");
			var command = qParamsModel.getProperty("/command");
			//var retry = qParamsModel.getProperty("/retry");
			var component = callingController.getOwnerComponent();
			//var approved = oViewModel.getProperty("/approved");
			var draft = oViewModel.getProperty("/draft");
			var docentry;
			var i18n;
			if (errorCode === 0) {
				if (method === "POST" && command === "Drafts") {
					if (results) {
						oPurchaseOrderModel.setData(results);
					}

					docentry = oPurchaseOrderModel.getProperty("/DocEntry");
					if (draft) {
						oPurchaseOrderModel.setProperty("/U_K2P_DraftDocEntry", docentry);
						//update U_K2P_DraftDocEntry on the the server - first time only 
						var qParamsModel2 = models.createQueryModel();
						var draftCommand = "Drafts(" + docentry + ")";
						var draftData = {
							"U_K2P_DraftDocEntry": docentry
						};
						qParamsModel2.setProperty("/method", "PATCH");
						qParamsModel2.setProperty("/command", draftCommand);
						qParamsModel2.setProperty("/data", JSON.stringify(draftData));
						qParamsModel2.setProperty("/retry", false);
						qParamsModel2.setProperty("/firstFetch", true);
						var queryParams = "";
						qParamsModel2.setProperty("/queryParams", queryParams);
						thisView.setModel(qParamsModel2, "qDraftUpdate");
						K2PUtils.getpostputpatch(callingController, callingController.draftUpdateCallBack, null, this, "qDraftUpdate");
					}
				}

				var docEntry = oPurchaseOrderModel.getProperty("/DocEntry");
				var sDocEntry = docEntry.toString();
				var newDocData = {
					"Document": {
						"DocEntry": sDocEntry
					}
				};
				switch (qNameIn) {

					/*case "qOnApprove":

						{ //If this is a direct approval without a draft 
							if (method === "POST" && command === "PurchaseOrders()") {
								callingController.addApprovalLog(callingController, qNameIn);
								thisView.setBusy(false);
								return;
							}
							/*else {
								//this is approved so save the draft to document
								var docEntry = oPurchaseOrderModel.getProperty("/DocEntry");
								var sDocEntry = docEntry.toString();
								var newDocData = {
									"Document": {
										"DocEntry": sDocEntry
									}
								};
								//newDocData.Document = data;
								qParamsModel.setProperty("/method", "POST");
								qParamsModel.setProperty("/command", "DraftsService_SaveDraftToDocument");
								qParamsModel.setProperty("/data", JSON.stringify(newDocData));
								var queryParams = "";
								qParamsModel.setProperty("/queryParams", queryParams);
								qNameIn = "qDirect";
								thisView.setModel(qParamsModel, qNameIn);
								K2PUtils.getpostputpatch(callingController, callingController.addApprovalCallBack, null, this, qNameIn);
								break;
							}

						}*/
					case "qOnApprove":
						if (method === "PATCH") {
							//the draft has been saved so now "SaveDraftToDocument" to create PO
							//create the PO
							//this is approved so save the draft to document
							callingController.preparePO(callingController);

							qParamsModel.setProperty("/method", "POST");
							qParamsModel.setProperty("/command", "DraftsService_SaveDraftToDocument");
							qParamsModel.setProperty("/data", JSON.stringify(newDocData));
							queryParams = "";
							qParamsModel.setProperty("/queryParams", queryParams);
							thisView.setModel(qParamsModel, qNameIn);
							K2PUtils.getpostputpatch(callingController, callingController.addOrUpdateCallBack, null, this, qNameIn);
							break;
						} else {
							if (method === "POST" && command === "Drafts") {
								//Draft has been successfully created - This is a direct PO
								callingController.preparePO(callingController);
								qParamsModel.setProperty("/method", "POST");
								qParamsModel.setProperty("/command", "DraftsService_SaveDraftToDocument");
								qParamsModel.setProperty("/data", JSON.stringify(newDocData));
								queryParams = "";
								qParamsModel.setProperty("/queryParams", queryParams);
								thisView.setModel(qParamsModel, qNameIn);
								K2PUtils.getpostputpatch(callingController, callingController.addOrUpdateCallBack, null, this, qNameIn);
								break;
							}
							if (method === "POST" && command === "DraftsService_SaveDraftToDocument") {
								//Po has been successfully created
								//AddAdpprovalLog?
								callingController.addApprovalLog(callingController, qNameIn);
								return;
							}
							if (method === "POST" && command === "PurchaseOrders") {
								//This is a direct PO with no approval process
								//Po has been successfully created
								//NO approval log because no process
								MessageToast.show("PO Created");
								thisView.setBusy(false);
								callingController.getRouter().navTo("home");
								return;
							}
						}
						/*						callingController.addApprovalLog(callingController, qNameIn);
						if (method === "POST") {
							oPurchaseOrderModel.setData(results);
							docentry = oPurchaseOrderModel.getProperty("/DocEntry");
							oPurchaseOrderModel.setProperty("/U_K2P_DraftDocEntry", docentry);
						}*/
						return;
					case "qNextLevel":
						callingController.addApprovalLog(callingController, qNameIn, docentry);
						return;
					case "qOnDecline":
						callingController.addApprovalLog(callingController, qNameIn, docentry);
						return;

					default:

						//no problem so try to refresh page data one last time
						var oVendor = thisView.byId("Vendor");
						var oPONum = thisView.byId("PONum");
						var msg = "Updated!";
						if (draft) {
							//draft
							if (method === "POST") {
								oPurchaseOrderModel.setData(results);
								docentry = oPurchaseOrderModel.getProperty("/DocEntry");
								oPurchaseOrderModel.setProperty("/U_K2P_DraftDocEntry", docentry);
								msg = "Added!";
							}
							oViewModel.setProperty("approved", false);

							oVendor.setEnabled(true);
							//callingController.getOwnerComponent().setModel(oPurchaseOrderModel, "purchaseOrder");
							callingController.getOwnerComponent().setModel(oViewModel, "purchaseOrderView");
							thisView.byId("btnApprove").setVisible(true);
							thisView.byId("btnDecline").setVisible(true);
							thisView.byId("approvalComment").setVisible(true);
							thisView.byId("approvalCommentLabel").setVisible(true);
							thisView.byId("PONum").setVisible(false);
							//var ladder = oPurchaseOrderModel.getProperty("U_Ladder");
							var K2P_APRV_NXT_AMT = oPurchaseOrderModel.getProperty("U_K2P_APRV_NXT_AMT");
							if (!K2P_APRV_NXT_AMT) {
								K2P_APRV_NXT_AMT = 0;
							}
							var draftDocEntry = oPurchaseOrderModel.getProperty("/U_K2P_DraftDocEntry");
							switch (qNameIn) {

								case "qOnSubmit":
									//already set to next level
									callingController.refreshApprovals(callingController, draftDocEntry);
									break;

								case "qOnSave":
									//done - just return
									break;

								case "qOnApprove":
									//add the log???

									break;

									/*var qParams = "?$select=U_Ladder,U_Role,U_Amt&$filter=U_Ladder eq \'" + ladder + "\' and U_Amt gt " + K2P_APRV_NXT_AMT +
									"&$orderby=U_Amt";
								K2PUtils.getByPath(callingController, "UDO_K2P_APRV_LINES", qParams, callingController.setNextApprovalLevel, qNameIn, null);*/

							} //end of case
							MessageToast.show(msg);
							thisView.setBusy(false);

						} else {
							//PO
							oViewModel.setProperty("approved", true);
							oVendor.setEnabled(false);
							oPONum.setVisible(true);
							/*						thisView.byId("btnApprove").setVisible(false);
						thisView.byId("btnDecline").setVisible(false);
						thisView.byId("approvalComment").setVisible(false);
						thisView.byId("approvalCommentLabel").setVisible(false);*/
						}
						if (oViewModel.getProperty("/add") === true) {
							component.setModel(oPurchaseOrderModel, "purchaseOrder");
							oViewModel.setProperty("add", false);

						} else //not addmode
						{
							//this actually does nothing
							oViewModel.setProperty("add", false);
						}

						/*
				//callingController.fetchMain(callingController, false); //refresh Invoices
				var oHistory, sPreviousHash;
				oHistory = History.getInstance();
				sPreviousHash = oHistory.getPreviousHash();
				//var params = {name: "maintenanceList", refresh: "true"};
				var oViewModel = callingController.getOwnerComponent().getModel("maintenanceView");
				oViewModel.setProperty("/refresh", true);
				callingController.getRouter().navTo("maintenanceList");
								if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					callingController.getRouter().navTo("", {}, true );
				//}*/
				}
				thisView.setBusy(false);
			} else {

				thisView.setBusy(false);
				var sMessage = "addOrUpdateCallBack : " + error + " Code:" + errorCode.toString() + " status: " + status;
				i18n = "serviceLayerStatus";
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
				//function(oComponent, i18nMsg, message, bFullMsg, callBack) {

				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");

			}
		},
		validatePO: function() {
			MessageBox.show(
				"This message should appear in the message box.", {
					icon: MessageBox.Icon.QUESTION,
					title: "Create PO?",
					actions: [MessageBox.Action.YES, MessageBox.Action.NO, MessageBox.Action.CANCEL],
					emphasizedAction: MessageBox.Action.YES,
					onClose: function(oAction) {

						return oAction;
					}

				});
		},
		draftUpdateCallBack: function(callingController, results, callback2, oThis, qNameIn) {
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/errorCode");
			var i18n;
			if (errorCode === 0) {
				//no problem just return
				thisView.setBusy(false);
				return;

			} else {

				//issue error
				var sMessage = "draftUpdateCallBack: " + error + " Code:" + errorCode.toString();
				thisView.setBusy(false);
				i18n = "";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				callingController.errorDialogBox(this, i18n, sMessage, true, null, status);
			}
		},
		preparePO: function(callingController) {
			var oUserModel = this.getOwnerComponent().getModel("userModel");
			var user = oUserModel.getProperty("/value/0/UserCode");
			var userName = oUserModel.getProperty("/value/0/UserName");
			var today = new Date();
			var sDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
			var purchaseOrderModel = callingController.getOwnerComponent().getModel("purchaseOrder");
			var docEntry = purchaseOrderModel.getProperty("DocEntry");
			purchaseOrderModel.setProperty("/U_K2P_APRV_NXT_LVL", "APPROVED");
			purchaseOrderModel.setProperty("/U_K2P_APRV_NXT_AMT", 0);
			purchaseOrderModel.setProperty("/U_K2P_ApprovedDate", sDate);
			purchaseOrderModel.setProperty("/U_K2P_ApprovedBy", user);
			purchaseOrderModel.setProperty("/U_K2P_ApprovedByName", userName);
			purchaseOrderModel.setProperty("/U_K2P_Approved", "Y");
			purchaseOrderModel.setProperty("U_K2P_DraftDocentry", docEntry);
			//K2P_DraftDocentry
		},
		getProperties: function() {

			try {

				var oViewModel = this.getOwnerComponent().getModel("maintenanceView");
				var thisView = this.getView();

				var data;
				//var surl = destination + "IncomingPayments";

				thisView.setBusy(true);
				// set the queryParams model
				var qParamsModel = models.createQueryModel();
				thisView.setModel(qParamsModel, "qProperty");
				qParamsModel.setProperty("/method", "GET");
				qParamsModel.setProperty("/command", "UDO_K2P_PROPERTY()?$inlinecount=allpages&$select=Code,Name");
				qParamsModel.setProperty("/data", data);
				qParamsModel.setProperty("/retry", false);
				qParamsModel.setProperty("/firstFetch", true);
				var queryParams = "";
				qParamsModel.setProperty("/queryParams", queryParams);
				K2PUtils.getpostputpatch(this, this.getPropertiesCallBack, null, this, "qProperty");

				/*					try {
						var s;
						var oNewRecord = JSON.parse(oModel.getJSON());
						var oBinding = oViewModel.oMaintTable.getBinding("
									items");
						var oContext = oBinding.create(oNewRecord);
						oContext.created().then(function() {
							s = "
									OK ";
						}, function(oError) {
							s = oError.toString();
						});
					} catch (err) {
						s = err.toString();
					}*/

				//this.defaultNew();

			} catch (e) {
				var e1 = e;
				e1 = e1;
			}
		},
		getPropertiesCallBack: function(callingController, results, callback2, oThis, qNameIn) {
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel("qProperty");
			if (qNameIn) {
				qParamsModel = thisView.getModel("qProperty");
			}
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/errorCode");
			var retry = qParamsModel.getProperty("/retry");
			var component = callingController.getOwnerComponent();
			var i18n;
			if (errorCode === 0) {
				//no problem so try to refresh page data one last time
				var oResult = new sap.ui.model.json.JSONModel();
				oResult.setData(results);
				thisView.setModel(oResult, "propertyList");
				thisView.setBusy(false);

			} else {

				/*					if (!retry) {
						//first failure so try to login
						qParamsModel.setProperty("/retry", true);
						this.slLogin(callingController, callingController.onSubmitPayment);
					} else {*/
				//second try so issue error - avoid infinite loop
				thisView.setBusy(false);
				var message = "getProperties: " + error + " Code:" + errorCode.toString() + " status: " + status;
				callingController.errorDialogBox(component, "userLoginConnection", message, true);
				/*}*/
				//issue error
				var sMessage = "getProperties: " + error + " Code:" + errorCode.toString();
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				callingController.errorDialogBox(this, i18n, sMessage, true, null, status);
			}

		},

		onRequest: function() {
			this.getRouter().navTo("requestList");

		},
		onApproved: function() {
			this.getRouter().navTo("approvedList");

		},
		onInventory: function() {
			this.getRouter().navTo("inventoryList");

		},

		onAddItem: function() {

			var qNameIn = "qAddItem";
			var callingController = this;
			var qParamsModel = models.createQueryModel();
			callingController.getOwnerComponent().setModel(qParamsModel, qNameIn);
			this.onSubmit(null, callingController, qNameIn);
		},

		onAddItemDetails: function(callingController, qNameIn) {

			try {
				var thisView = callingController.getView();
				var purchaseOrderModel = this.getOwnerComponent().getModel("purchaseOrder");
				var objLines = purchaseOrderModel.getProperty("/DocumentLines");
				//
				var newLine = models.createPurchaseOrderLine();
				var localModel = this.getOwnerComponent().getModel("local");
				var dfTaxCd = localModel.getProperty("/dfTaxCd");
				var property = purchaseOrderModel.getProperty("/U_K2P_Property");
				var propertyName = purchaseOrderModel.getProperty("/U_K2P_PropertyName");
				var project = purchaseOrderModel.getProperty("/U_K2P_ProjCode");
				newLine.TaxCode = dfTaxCd;
				newLine.U_K2P_ProjCode = project;
				newLine.ProjectCode = project;
				newLine.U_K2P_Property = property;
				newLine.U_K2P_PropertyName = propertyName;
				objLines.push(newLine);
				var sIndex = objLines.length - 1;
				var DocumentLinesTable = this.getView().byId("DocumentLines");
				var oBinding = DocumentLinesTable.getBinding("items"); //This gets the list Binding
				oBinding.refresh();
				callingController.refreshCostCodes(property, project, sIndex.toString());

				thisView.setBusy(false);

			} catch (e) {
				K2PUtils.errorDialogBox(callingController, "", e.message, true, null, status);
				thisView.setBusy(false);
			}
		},

		getUserApprovalLimit: function(callingController, qNameIn) {
			//getTheApprovalLimit
			var purchaseOrderModel = this.getOwnerComponent().getModel("purchaseOrder");
			var ladder = purchaseOrderModel.getProperty("/U_K2P_Ladder");
			var property = purchaseOrderModel.getProperty("/U_K2P_Property");

			var project = purchaseOrderModel.getProperty("/U_K2P_ProjCode");
			var userModel = callingController.getOwnerComponent().getModel("userModel");
			var userCode = userModel.getProperty("/value/0/UserCode");

			var thisView = callingController.getView();
			var qParamsModel = models.createQueryModel();
			thisView.setBusy(true);
			qParamsModel.setProperty("/method", "GET");
			qParamsModel.setProperty("/command", "/UDO_K2P_APRV_USERS");
			qParamsModel.setProperty("/data", null);
			qParamsModel.setProperty("/retry", false);
			qParamsModel.setProperty("/withCredentials", false);
			var queryParams = "?$select=U_Role&$filter=U_Ladder eq \'" + ladder + "\'  and U_UserCode eq \'" + userCode + "\'";
			queryParams += " and U_Property eq \'" + property + "\'  and U_Project eq \'" + project + "\'";
			qParamsModel.setProperty("/queryParams", queryParams);
			thisView.setModel(qParamsModel, qNameIn);
			K2PUtils.getpostputpatch(callingController, callingController.getUserRoleCallBack, null, callingController, qNameIn);
			return;

		},

		/*		onAddItem: function() {
			try {
				var purchaseOrderModel = this.getOwnerComponent().getModel("purchaseOrder");
				var objLines = purchaseOrderModel.getProperty("/DocumentLines");
				//var obj = JSON.parse(data)
				var newLine = models.createPurchaseOrderLine();
				objLines.push(newLine);
				var DocumentLinesTable = this.getView().byId("DocumentLines");
				var oBinding = DocumentLinesTable.getBinding("items"); //This gets the list Binding
				oBinding.refresh();
				/*
				var lineItems = purchaseOrderModel.getProperty("DocumentLines");
				var l = lineItems.length;
				var taskArray = {
					"value": taskItems
				};
				taskArray.push(oNewTask);
				oModel.setProperty("/K2P_WO_TASKSCollection", taskArray);
			
				var oTasksTable = this.byId("idTasksTable");
				var oBinding = oTasksTable.getBinding("items");
				var oContext = oBinding.create(oNewRecord);
				this.fetchMain();
				oContext.created().then(function() {
					s = "OK ";
				}, function(oError) {
					s = oError.toString();
				});
			} catch (e) {
				var e1 = e;
				e1 = e1;
			}
		},*/

		onSave: function() {
			/*			var oModel = this.getOwnerComponent().getModel("serviceLayer");
			if (oModel.add === true) {
				var thisView = this.getView("");
				var fnSuccess = function() {
					thisView.setBusy(false);
					//MessageToast.show(this._getText("
									changesSentMessage"));
					//this._setUIChanges(false);
				}.bind(this);
				var fnError = function(oError) {
					thisView.setBusy(false);
					//this._setUIChanges(false);
					var s = oError.message;
					s = s;
					//MessageBox.error(oError.message);
				}.bind(this);
				thisView.setBusy(true); // Lock UI until submitBatch is resolved.
				thisView.getModel().submitBatch("
									serviceLayer").then(fnSuccess, fnError);
				//this._bTechnicalErrors = false; // If there were technical errors, a new save resets them.  
			}*/

		},
		_setUIChanges: function(bHasUIChanges) {
			if (this._bTechnicalErrors) {
				// If there is currently a technical error, then force 'true '.
				bHasUIChanges = true;
			} else if (bHasUIChanges === undefined) {
				bHasUIChanges = this.getView().getModel().hasPendingChanges();
			}
			var oModel = this.getView().getModel("appView");
			oModel.setProperty("/hasUIChanges", bHasUIChanges);
		},

		onValueHelpRequest: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();

			var sourceID = oEvent.getParameter("id");
			var indexArray = sourceID.split("-");
			var lineIndex = indexArray[indexArray.length - 1];

			if (!this._pValueHelpDialog) {
				this._pValueHelpDialog = Fragment.load({
					id: "Dialog1", //oView.getId(),
					name: "K2PPM_PM.K2PUtils.ProjectDialog",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._pValueHelpDialog.then(function(oDialog) {
				// Create a filter for the binding
				oDialog.getBinding("items").filter([new Filter("ProjectName", FilterOperator.Contains, sInputValue)]);
				// Open ValueHelpDialog filtered by the input'	s value oDialog.open(sInputValue);
			});
		},

		onValueHelpRequestProperty: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();
			/*var oBinding = oEvent.getSource().getBinding("items");
				oBinding.path = "/UDO_K2P_PROPERTY";
*/
			if (!this._pValueHelpDialog2) {
				this._pValueHelpDialog2 = Fragment.load({
					id: "Dialog2", //oView.getId(),
					name: "K2PPM_PM.K2PUtils.PropertyDialog",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._pValueHelpDialog2.then(function(oDialog) {
				// Create a filter for the binding
				oDialog.getBinding("items").filter([new Filter("Name", FilterOperator.Contains, sInputValue)]);
				// Open ValueHelpDialog filtered by the input's value
				oDialog.open(sInputValue);
			});
		},

		onValueHelpRequestPayer: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			sInputValue = sInputValue.toUpperCase();
			var oView = this.getView();
			var sId = oEvent.getParameter("id");
			var oViewModel = this.getOwnerComponent().getModel("purchaseOrderView");
			oViewModel.setProperty("/tenantNameId", sId);
			/*var oBinding = oEvent.getSource().getBinding("items");
				oBinding.path = "/UDO_K2P_PROPERTY";
*/
			if (!this._pValueHelpDialogPayer) {
				this._pValueHelpDialogPayer = Fragment.load({
					id: "Dialog3", //oView.getId(),
					name: "K2PPM_PM.K2PUtils.CustomerDialog",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._pValueHelpDialogPayer.then(function(oDialog) {
				// Create a filter for the binding
				oDialog.getBinding("items").filter([new Filter("CardName", FilterOperator.StartsWith, sInputValue)]);
				// Open ValueHelpDialog filtered by the input's value
				oDialog.open(sInputValue);
			});
		},

		onSuggestionItemSelectedPayer: function(oEvent) {

			var oItem = oEvent.getParameter("selectedRow");
			var oCells = oItem.getCells();
			var oCell = oCells[1];
			var sText = oCell.getText();
			//{purchaseOrder>AccountCode}  __input7-nav---purchaseOrder--DocumentLines-0
			var sId = oEvent.getParameter("id");
			var sIdCode = sId.replace("K2P_TenantName", "K2P_Tenant");
			var oInput = this.getView().byId(sIdCode);
			oInput.setValue(sText);

		},

		onValueHelpRequestVendor: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			sInputValue = sInputValue.toUpperCase();
			var oView = this.getView();

			/*var oBinding = oEvent.getSource().getBinding("items");
				oBinding.path = "/UDO_K2P_PROPERTY";
*/
			if (!this._pValueHelpDialog5) {
				this._pValueHelpDialog5 = Fragment.load({
					id: "Dialog5", //oView.getId(),
					name: "K2PPM_PM.K2PUtils.VendorDialog",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._pValueHelpDialog5.then(function(oDialog) {
				// Create a filter for the binding
				oDialog.getBinding("items").filter([new Filter("CardName", FilterOperator.StartsWith, sInputValue)]);
				// Open ValueHelpDialog filtered by the input's value
				oDialog.open(sInputValue);
			});
		},

		onValueHelpSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var id = oEvent.getParameter("id");
			var sKeyName;

			switch (id) {

				case "Dialog1--selectProject":

					sKeyName = "Name";
					break;

				case "Dialog2--selectProperty":
					{
						sKeyName = "Code";
						break;

					}
				case "Dialog3--selectTenant":
					{
						sKeyName = "CardName";
						break;

					}

				case "Dialog5--selectVendor":
					{
						sKeyName = "CardName";
						break;

					}

			}

			var oFilter = new Filter(sKeyName, FilterOperator.StartsWith, sValue);

			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		onValueHelpClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var id = oEvent.getParameter("id");
			var oThis = this;
			var oPurchaseOrderModel = this.getOwnerComponent().getModel("purchaseOrder");
			if (!oSelectedItem) {
				return;
			}
			var path = oSelectedItem.getBindingContext().getPath();
			var sTitle;
			try {
				sTitle = oSelectedItem.getTitle();
			} catch (e)
			//skip error
			{}

			var s;

			switch (id) {

				case "Dialog1--selectProject":

					oPurchaseOrderModel.setProperty("/ProjCode", sTitle);
					oPurchaseOrderModel.setProperty("/U_K2P_ProjCode", sTitle);
					//this.byId("ProjCode").setValue(oSelectedItem.getTitle());
					break;

				case "Dialog2--selectProperty":
					{
						//getByPath: function(callingController, dpath, queryParamsIn, callback2, oThis)
						K2PUtils.getByPath(this, path, "", this.propertyCallBack, "qparamsProperty");
						break;

					}
				case "Dialog3--selectTenant":
					{
						//this.byId("Tenant").setValue(oSelectedItem.getTitle());
						//This section needs to be updatee to populate lease fields on the line
						//For now it just updates tenant name.

						var oViewModel = oThis.getOwnerComponent().getModel("purchaseOrderView");
						var sTenantNameId = oViewModel.getProperty("/tenantNameId");
						oThis.byId(sTenantNameId).setValue(oSelectedItem.getTitle());
						var sTenantCodeId = sTenantNameId.replace("K2P_TenantName", "K2P_Tenant");
						var sTenantCode = oSelectedItem.getDescription();
						oThis.byId(sTenantCodeId).setValue(sTenantCode);
						var sArray = sTenantNameId.split("-");
						var sIndex = sArray[sArray.length - 1];
						//look up most current lease for this tenant
						//if found then display lease and unit on line.
						var qParams = "?$filter=U_CardCode eq \'" + sTenantCode + "\'&$orderby=DocNum desc";
						//K2PUtils.getByPath(this, "UDO_K2P_LEASE", qParams, oThis.leaseCallBack, "qparamsTenant", sIndex);
						oThis.getView().setBusy(false);
						break;

					}
				case "Dialog5--selectVendor":
					{
						this.byId("Vendor").setValue(oSelectedItem.getTitle());
						s = oSelectedItem.getDescription();
						oPurchaseOrderModel.setProperty("/CardCode", s);

						//populate Vendor Name
						break;

					}

			}
		},

		propertyCallBack: function(callingController, results, callback2, oThis, qNameIn) {

			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var retry = qParamsModel.getProperty("/retry");
			var component = callingController.getOwnerComponent();
			var sIndex = qParamsModel.getProperty("/index");
			var sPath = "/DocumentLines/" + sIndex;

			var i18n;
			if (errorCode === 0) {
				var oPurchaseOrderModel = thisView.getModel("purchaseOrder");
				var oResult = new sap.ui.model.json.JSONModel();
				oResult.setData(results);
				thisView.setModel(oResult, "propertyModel");
				var sName = oResult.getProperty("/Name");
				oPurchaseOrderModel.setProperty(sPath + "/U_K2P_PropertyName", sName);
				oPurchaseOrderModel.setProperty(sPath + "/ProjectCode", oResult.getProperty("/U_ProjCode"));
				oPurchaseOrderModel.setProperty(sPath + "/U_K2P_ProjCode", oResult.getProperty("/ProjectCode"));
				var propertyCode = oResult.getProperty("/Code");
				var dfltProject = oResult.getProperty("/U_ProjCode");

				var localModel = callingController.getOwnerComponent().getModel("local");
				var UseProjMgmtID = localModel.getProperty("/UseProjMgmtID");

				if (UseProjMgmtID === "Y") {
					//handle Lookout logic here
					//Populate the Project(Program) combo
					var sFilter = "U_K2P_DIM3 eq \'" + propertyCode + "\'";
					//var path = " '/ProjectManagements', parameters : {$filter : 'U_K2P_DIM3 eq \'APQ3\'' }"

					//Change the binding for the Program/Project here
					var oItemTemplate = new sap.ui.core.ListItem({
						text: "{FinancialProject}",
						additionalText: "{ProjectName}"
					});

					var oBinding = {};
					oBinding.path = "/ProjectManagements";
					oBinding.parameters = {
						"$filter": sFilter
					};
					oBinding.template = oItemTemplate;
					oBinding.events = {
						"dataReceived": callingController.onDataReceivedProject1,
						"DataStateChange": callingController.onDataStateChangeProject1
					};

					var sId = "nav---purchaseOrder--Project1-nav---purchaseOrder--DocumentLines-" + sIndex;
					var oSelect = thisView.byId(sId);
					try {
						oSelect.bindItems(oBinding);
						//When to select it? List is populated 
						var items = oSelect.getItems();
						var firstItem = oSelect.getFirstItem();
						var itemToSelect = oSelect.getItemByKey(dfltProject);
					} catch (e) {

					}

					//This list has been populated - now set the selection
					//This does not work because list is not populated yet despite binditems
					//Maybe the network call has not yet returned. How to know?

					//oSelect.setSelectedItem(itemToSelect); //why will this not set the selection?
					//

					callingController.refreshCostCodes(propertyCode, dfltProject, sIndex);

				} else //Use codes from property
				{
					oPurchaseOrderModel.setProperty(sPath + "/CostingCode", oResult.getProperty("/U_Dim1"));
					oPurchaseOrderModel.setProperty(sPath + "/CostingCode2", oResult.getProperty("/U_Dim2"));
					oPurchaseOrderModel.setProperty(sPath + "/CostingCode3", oResult.getProperty("/U_Dim3"));
					oPurchaseOrderModel.setProperty(sPath + "/CostingCode4", oResult.getProperty("/U_Dim4"));
					oPurchaseOrderModel.setProperty(sPath + "/CostingCode5", oResult.getProperty("/U_Dim5"));
				}

			} else //handle error
			{
				if (errorCode !== "-2028") {
					var sMessage = "propertyCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
					thisView.setBusy(false);
					i18n = "serviceLayerStatus";
					//var oRouter = callingController.getRouter();
					//oRouter.navTo("login");
					K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
				}

			}
		},

		onProject1Change: function(oEvent) {
			var thisView = this.getView();
			var propertyCode, projectCode;
			var sId = oEvent.getParameter("id");
			var oSelect = thisView.byId(sId);

			var sArray = sId.split("-");
			var sIndex = sArray[sArray.length - 1];

			var oPurchaseOrderModel = thisView.getModel("purchaseOrder");
			var sPath = "/DocumentLines/" + sIndex;
			propertyCode = oPurchaseOrderModel.getProperty(sPath + "/U_K2P_Property");
			projectCode = oSelect.getSelectedItem().getText();

			//Populate the variables.
			//if lookout then
			var localModel = this.getOwnerComponent().getModel("local");
			var UseProjMgmtID = localModel.getProperty("/UseProjMgmtID");
			if (UseProjMgmtID === "Y") {
				this.refreshCostCodes(propertyCode, projectCode, sIndex);
			}
			//else no change - already populated from property. 

		},

		refreshCostCodes: function(propertyCode, sProjectCode, sIndex) {

			var qParams = "?$filter=U_K2P_DIM3 eq \'" + propertyCode + "\' and FinancialProject eq \'" + sProjectCode + "\'";
			K2PUtils.getByPath(this, "ProjectManagements", qParams, this.refreshCostCodesCallBack, "qparamsCostCodes", sIndex);

		},

		refreshCostCodesCallBack: function(callingController, results, callback2, oThis, qNameIn) {

			var thisView = callingController.getView();
			var oPurchaseOrderModel = thisView.getModel("purchaseOrder");
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var sIndex = qParamsModel.getProperty("/index");
			var sPath = "/DocumentLines/" + sIndex;

			var i18n;
			if (errorCode !== "0") {

				var oResult = new sap.ui.model.json.JSONModel();
				oResult.setData(results);
				var valueArray = oResult.getProperty("/value");
				if (valueArray.length > 0) {

					oPurchaseOrderModel.setProperty(sPath + "/CostingCode", oResult.getProperty("/value/0/U_K2P_DIM1"));
					oPurchaseOrderModel.setProperty(sPath + "/CostingCode2", oResult.getProperty("/value/0/U_K2P_DIM2"));
					oPurchaseOrderModel.setProperty(sPath + "/CostingCode3", oResult.getProperty("/value/0/U_K2P_DIM3"));
					oPurchaseOrderModel.setProperty(sPath + "/CostingCode4", oResult.getProperty("/value/0/U_K2P_DIM4"));
					oPurchaseOrderModel.setProperty(sPath + "/CostingCode5", oResult.getProperty("/value/0/U_K2P_DIM5"));

				}
				thisView.setBusy(false);

			} else //handle error
			{
				var sMessage = "refreshCostCodesCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}

		},

		onSuggestionItemSelected: function(oEvent) {
			var oItem = oEvent.getParameter("selectedItem");
			var oText = oItem ? oItem.getKey() : ""; //if oItem then oItem.getKey() else "" - : (is the else) 
			this.byId("selectedKeyIndicator").setText(oText);
		},
		onSuggestionItemSelectedProjCode1: function(oEvent) {
			this.getView().setBusy(true);
			var oItem = oEvent.getParameter("selectedRow");
			var oCells = oItem.getCells();
			var oCell = oCells[0];
			var projCode = oCell.getText();
			oCell = oCells[1];
			var projectName = oCell.getText();
			oCell = oCells[2];
			var property = oCell.getText();
			//var sProject = oCell.getText();

			var oPurchaseOrderModel = this.getView().getModel("purchaseOrder");
			oPurchaseOrderModel.setProperty("/U_K2P_Property", property);

			var path = "UDO_K2P_PROPERTY(\'" + property + "\')";
			var qParams = "?$select=Code,Name,U_Addr1,U_Addr2,U_City,U_State,U_Country,U_ZipCode";
			K2PUtils.getByPath(this, path, qParams, this.propertyCallBack1, "qParamsProperty1", null);

		},
		propertyCallBack1: function(callingController, results, callback2, oThis, qNameIn) {
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var retry = qParamsModel.getProperty("/retry");
			var component = callingController.getOwnerComponent();
			var sIndex = qParamsModel.getProperty("/index");

			var i18n;
			if (errorCode === 0) {
				var oPurchaseOrderModel = thisView.getModel("purchaseOrder");
				var oResult = new sap.ui.model.json.JSONModel();
				oResult.setData(results);
				thisView.setModel(oResult, "propertyModel");
				var sName = oResult.getProperty("/Name");
				oPurchaseOrderModel.setProperty("/U_K2P_PropertyName", sName);
				var addr1 = oResult.getProperty("/U_Addr1");
				var addr2 = oResult.getProperty("/U_Addr2");
				var city = oResult.getProperty("/U_City");
				var state = oResult.getProperty("/U_State");
				var country = oResult.getProperty("/U_Country");
				var zipcode = oResult.getProperty("/U_ZipCode");
				var address2;
				var linefeed = "\r\n";
				if (sName) {
					address2 = sName;
				}
				if (addr1) {
					address2 += linefeed + addr1;
				}
				if (addr2) {
					address2 += linefeed + addr2;
				}
				if (city) {
					address2 += linefeed + city;
				}
				if (state) {
					address2 += linefeed + state;
				}
				if (zipcode) {
					address2 += " " + zipcode;
				}
				if (country) {
					address2 += linefeed + country;
				}
				oPurchaseOrderModel.setProperty("/Address2", address2);
				//set approval limit
				if (qNameIn === "qParamsProperty1") {
					//callingController, qNameIn
					callingController.getUserApprovalLimit(callingController, "qGetUseApprovalLimit");
				}

				thisView.setBusy(false);

				return;

			} else //handle error
			{
				//if (errorCode !== "-2028") {
				var sMessage = "propertyCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
				//}

			}
		},
		onSuggestionItemSelectedProperty1: function(oEvent) {
			var oItem = oEvent.getParameter("selectedRow");
			var oCells = oItem.getCells();
			var oCell = oCells[0];
			//var sProperty = oCell.getText();
			oCell = oCells[1];
			var sPropertyName = oCell.getText();
			oCell = oCells[2];
			//var sProject = oCell.getText();

			var oPurchaseOrderModel = this.getView().getModel("purchaseOrder");
			oPurchaseOrderModel.setProperty("/U_K2P_PropertyName", sPropertyName);
			//this.refreshProgramList(this, sProperty);

			/*			var thisView = this.getView();
			var oSelect = thisView.byId("ProjCode1");
			var oBinding = oSelect.getBinding("items");
			var sFilter = "U_K2P_DIM3 eq \'" + sProperty + "\'";
			var oParameters = {
				$filter: sFilter
			};
			var oPurchaseOrderModel = this.getView().getModel("purchaseOrder");
			//oPurchaseOrderModel.setProperty("U_K2P_Property",sProperty);
			oBinding.changeParameters(oParameters);
			//localModel.setProperty("/project", sProject);

			//var path = "UDO_K2P_PROPERTY(\'" + sProperty + "\')";
			//K2PUtils.getByPath(this, path, "", this.propertyCallBack, "qparamsProperty");*/
		},

		refreshProgramList: function(callingController, sProperty) {

			var thisView = callingController.getView();
			var oSelect = thisView.byId("ProjCode1");
			var oBinding = oSelect.getBinding("items");
			var sFilter = "U_K2P_DIM3 eq \'" + sProperty + "\'";
			var oParameters = {
				$filter: sFilter
			};
			//var oPurchaseOrderModel = this.getView().getModel("purchaseOrder");
			//oPurchaseOrderModel.setProperty("U_K2P_Property",sProperty);
			oBinding.changeParameters(oParameters);

		},

		onSuggestionItemSelectedProperty: function(oEvent) {
			var sId = oEvent.getParameter("id");
			var sArray = sId.split("-");
			var sIndex = sArray[sArray.length - 1];
			var oItem = oEvent.getParameter("selectedRow");
			var oCells = oItem.getCells();
			var oCell = oCells[1];
			var sText = oCell.getText();
			var path = "UDO_K2P_PROPERTY(\'" + sText + "\')";
			K2PUtils.getByPath(this, path, "", this.propertyCallBack, "qparamsProperty", sIndex);
		},

		onSuggestionItemSelectedAccount: function(oEvent) {
			var oItem = oEvent.getParameter("selectedRow");
			var oCells = oItem.getCells();
			var oCell = oCells[2];
			var sText = oCell.getText();
			//{purchaseOrder>AccountCode}  __input7-nav---purchaseOrder--DocumentLines-0
			var sId = oEvent.getParameter("id");
			var sIdCode = sId.replace("K2P_AccountName", "K2P_AccountCode");
			var oInput = this.getView().byId(sIdCode);
			oInput.setValue(sText);

			/*			var sArray = sId.split("-");
			var sIndex = sArray[sArray.length - 1];
			var sPath = "/DocumentLines/" + sIndex + "/AccountCode";
			this.getView().getModel("purchaseOrder").setProperty(sPath, sText);*/
		},
		onSuggestionItemSelectedVendor: function(oEvent) {
			var oItem = oEvent.getParameter("selectedRow");
			var oCells = oItem.getCells();
			var oCell = oCells[1];
			var sText = oCell.getText();
			this.getView().getModel("purchaseOrder").setProperty("/CardCode", sText);
		},

		/*		onSuggestionItemSelectedTenant: function(oEvent) {
			var oItem = oEvent.getParameter("selectedRow");
			var sId = oEvent.getParameter("id");
			var sArray = sId.split("-");
			var sIndex = sArray[sArray.length - 1];

			var oCells = oItem.getCells();
			var oCell = oCells[1];
			var sCode = oCell.getText();
			oCell = oCells[0];
			//var sName = oCell.getText();
			//this.getView().getModel("purchaseOrder").setProperty("/U_K2P_TenantName", sName);
			var sPath = "/DocumentLines/" + sIndex + "/U_K2P_Tenant";
			this.getView().getModel("purchaseOrder").setProperty(sPath, sCode);
			var qParams = "?$filter=U_CardCode eq \'" + sCode + "\'&$orderby=DocNum desc";
			K2PUtils.getByPath(this, "UDO_K2P_LEASE", qParams, this.leaseCallBack, "qparamsTenant", sIndex);
			//lookup the lease, property, unit
			//lookup the property

		},*/
		onSuggestionItemProject: function(oEvent) {
			var oItem = oEvent.getParameter("selectedRow");
			var sId = oEvent.getParameter("id");
			var sArray = sId.split("-");
			var oPurchaseOrderModel = this.getView().getModel("purchaseOrder");
			var sIndex = sArray[sArray.length - 1];
			var sPath = "/DocumentLines/" + sIndex;

			var oCells = oItem.getCells();
			//var project = oCells[0].getText();
			var project = oCells[0].getText();
			var cost1 = oCells[1].getText();
			var cost2 = oCells[2].getText();
			var property = oCells[3].getText();
			var cost4 = oCells[4].getText();
			var cost5 = oCells[5].getText();
			//U_K2P_Property K2P_ProjCode
			oPurchaseOrderModel.setProperty(sPath + "/U_K2P_ProjCode", project);
			oPurchaseOrderModel.setProperty(sPath + "/U_K2P_Property", property);
			oPurchaseOrderModel.setProperty(sPath + "/CostingCode", cost1);
			oPurchaseOrderModel.setProperty(sPath + "/CostingCode2", cost2);
			oPurchaseOrderModel.setProperty(sPath + "/CostingCode3", property);
			oPurchaseOrderModel.setProperty(sPath + "/CostingCode4", cost4);
			oPurchaseOrderModel.setProperty(sPath + "/CostingCode5", cost5);

			var path = "UDO_K2P_PROPERTY(\'" + property + "\')";
			var qParams = "?$select=Code,Name,U_Addr1,U_Addr2,U_City,U_State,U_Country, U_ZipCode";
			K2PUtils.getByPath(this, path, qParams, this.propertyCallBackLine, "qParamsPropertyLine", sIndex);

		},
		propertyCallBackLine: function(callingController, results, callback2, oThis, qNameIn) {
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			//var retry = qParamsModel.getProperty("/retry");
			var component = callingController.getOwnerComponent();
			var sIndex = qParamsModel.getProperty("/index");
			var sPath = "/DocumentLines/" + sIndex;

			var i18n;
			if (errorCode === 0) {
				var oPurchaseOrderModel = callingController.getView().getModel("purchaseOrder");
				var oResult = new sap.ui.model.json.JSONModel();
				oResult.setData(results);
				var propertyName = oResult.getProperty("/Name");
				oPurchaseOrderModel.setProperty(sPath + "/U_K2P_PropertyName", propertyName);
				thisView.setBusy(false);
				return;
			} else //handle error
			{
				//if (errorCode !== "-2028") {
				var sMessage = "propertyCallBackLine: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
				//}
			}
		},
		leaseCallBack: function(callingController, results, callback2, oThis, qNameIn) {

			var thisView = callingController.getView();
			var oPurchaseOrderModel = thisView.getModel("purchaseOrder");
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var sIndex = qParamsModel.getProperty("/index");
			var sPath = "/DocumentLines/" + sIndex;
			//var retry = qParamsModel.getProperty("/retry");
			//var component = callingController.getOwnerComponent();
			//oPurchaseOrderModel.setProperty(sPath + "/U_K2P_Tenant", null);
			oPurchaseOrderModel.setProperty(sPath + "/U_K2P_Lease", null);
			oPurchaseOrderModel.setProperty(sPath + "/U_K2P_UnitID", null);
			/*oPurchaseOrderModel.setProperty(sPath + "/U_K2P_Property", null);
			oPurchaseOrderModel.setProperty(sPath + "/U_K2P_PropertyName", null);
			
			oPurchaseOrderModel.setProperty(sPath + "/U_K2P_ProjCode", null);
			oPurchaseOrderModel.setProperty(sPath + "/ProjectCode", null);
			oPurchaseOrderModel.setProperty(sPath + "/CostingCode", null);
			oPurchaseOrderModel.setProperty(sPath + "/CostingCode2", null);
			oPurchaseOrderModel.setProperty(sPath + "/CostingCode3", null);
			oPurchaseOrderModel.setProperty(sPath + "/CostingCode4", null);
			oPurchaseOrderModel.setProperty(sPath + "/CostingCode5", null);

					var sFilter = "U_K2P_DIM3 eq \'xyz&!\'";
			//Now lookup the program(s)
			var oItemTemplate = new sap.ui.core.ListItem({
				text: "{FinancialProject}",
				additionalText: "{ProjectName}"
			});
			var oBinding = {};
			oBinding.path = "/ProjectManagements";
			oBinding.parameters = {
				"$filter": sFilter
			};
			oBinding.template = oItemTemplate;
			var oSelect = thisView.byId("Program");
			oSelect.bindItems(oBinding);*/

			var i18n;
			if (errorCode === 0) {

				var oResult = new sap.ui.model.json.JSONModel();
				oResult.setData(results);
				var valueArray = oResult.getProperty("/value");
				if (valueArray.length > 0) {

					var sProperty = oResult.getProperty("/value/0/U_Property");
					oPurchaseOrderModel.setProperty(sPath + "/U_K2P_Property", sProperty);
					oPurchaseOrderModel.setProperty(sPath + "/U_K2P_Lease", oResult.getProperty("/value/0/DocNum"));
					//oPurchaseOrderModel.setProperty(sPath + "/U_K2P_PropertyName", null);
					oPurchaseOrderModel.setProperty(sPath + "/U_K2P_UnitID", oResult.getProperty("/value/0/U_UnitID"));

				}

				//Now get the codes from the property if possible
				/*
				var path = "UDO_K2P_PROPERTY(\'" + sProperty + "\')";
				K2PUtils.getByPath(oThis, path, "", oThis.propertyCallBack, "qparamsProperty", sIndex);
				
			    var path = "UDO_K2P_PROPERTY(\'" + propertyCode + "\')";
				try {
					K2PUtils.getByPath(oThis, path, "", oThis.propertyCallBack, "qparamsProperty",sIndex);
					
					
					
				} catch (e) {
					K2PUtils.errorDialogBox(callingController, "leaseCallBack", e.message, true, null, status);
				}*/

			} else //handle error
			{
				var sMessage = "leaseCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},

		onNavBack: function() {
			var oPurchaseOrderViewModel = this.getOwnerComponent().getModel("purchaseOrderView");
			var navBack = oPurchaseOrderViewModel.getProperty("/navBack");
			if (!navBack) {
				navBack = "home";
			}
			if (navBack === "workOrder") {
				//go back to the source workorder.
				var workOrderView = models.creatWorkOrderViewModel();
				var sKey = oPurchaseOrderViewModel.getProperty("/U_K2P_WODocEntry");
				var path = "/UDO_K2P_WORKORDER(" + sKey + ")";
				workOrderView.setProperty("/path", path);
				workOrderView.setProperty("/add", false);
				workOrderView.setProperty("/navBack", "workOrderList");
				//this.getOwnerComponent().setModel(workOrderView, "workOrderView");
			}
			this.getRouter().navTo(navBack);
		},

		onResetTotal: function() {
			var purchaseOrderModel = this.getOwnerComponent().getModel("purchaseOrder");
			K2PUtils.resetTotalQty(purchaseOrderModel, "/DocumentLines", "/DocTotal", "/LineTotal", "/U_K2P_QtyService", "/UnitPrice");

		},
		createPurchaseOrderModel: function() {
			var data = {
				"DocNum": "0",
				"DocEntry": 0,
				"DocObjectCode": "22",
				"DocumentStatus": "bost_Open",
				"DocDate": "",
				"DocDueDate": "",
				"CardCode": "",
				"CardName": "",
				"DocType": "dDocument_Service",
				"Comments": "",
				"NumAtCard": "",
				"U_K2P_DraftDocEntry": "0",
				"U_K2P_WODocEntry": "0",
				"U_K2P_WODocNum": "0",
				"U_K2P_U_Approved": "N",
				"U_K2P_ProjCode": "",
				"U_K2P_Property": "",
				"U_K2P_PropertyName": "",
				"U_K2P_APRV_NXT_LVL": "",
				"U_K2P_APRV_NXT_AMT": 0,
				"U_K2P_OrderedDate": "",
				"DocumentLines": []
			};
			var oModel = new JSONModel(data);
			oModel.setDefaultBindingMode("TwoWay");

			return oModel;
		},
		onRefreshNotes: function(callingController, docEntry) {
			var qNameIn = "qRefreshNotes";
			var qParamsModel = models.createQueryModel();
			qParamsModel.setProperty("/method", "GET");
			qParamsModel.setProperty("/command", "UDO_K2P_NOTES");
			//qParamsModel.setProperty("/data", null);
			qParamsModel.setProperty("/firstFetch", true);
			var params = "?$filter=U_DocEntry eq " + docEntry +
				"and U_DocType eq 'PURCHASEORDER'&$select=DocEntry,U_CreateDt,U_UserCode,U_UserName,U_Note";
			params += "&$orderby=DocEntry desc";
			var queryParams = params;
			qParamsModel.setProperty("/queryParams", queryParams);
			callingController.getOwnerComponent().setModel(qParamsModel, qNameIn);
			K2PUtils.getpostputpatch(this, this.onRefreshNotesCallback, null, this, qNameIn);
		},

		onRefreshNotesCallback: function(callingController, results, callback2, oThis, qNameIn) {
			var thisView = callingController.getView();
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			//var retry = qParamsModel.getProperty("/retry");
			var component = callingController.getOwnerComponent();
			var i18n;
			if (errorCode === 0) {
				var notesListModel = new sap.ui.model.json.JSONModel();
				notesListModel.setData(results);
				component.setModel(notesListModel, "notesList");
				thisView.setBusy(false);
			} else {

				thisView.setBusy(false);
				var sMessage = "onRefreshNotesCallback: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				//var oRouter = callingController.getRouter();
				//oRouter.navTo("login");
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},
		onAddNote: function() {
			var oWorkOrderViewModel = this.getOwnerComponent().getModel("purchaseOrderView");
			var newNote = oWorkOrderViewModel.getProperty("/newNote");
			var thisView = this.getView();
			if (!newNote) {
				newNote = "";
			}
			if (newNote !== "") {
				//add the note
				thisView.setBusy(true);
				var oUserModel = this.getOwnerComponent().getModel("userModel");
				var user = oUserModel.getProperty("/value/0/UserCode");
				var userName = oUserModel.getProperty("/value/0/UserName");
				var oWorkOrderModel = this.getOwnerComponent().getModel("purchaseOrder");
				var docentry = oWorkOrderModel.getProperty("/DocEntry");
				if (!docentry) {
					MessageToast.show("Add Document First!");
				}
				var docnum = oWorkOrderModel.getProperty("/DocNum");
				var today = new Date();
				var sDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
				// set the queryParams mode
				var data = {
					"U_DocEntry": docentry,
					"U_DocNum": docnum,
					"U_DocType": "PURCHASEORDER",
					"U_UserCode": user,
					"U_UserName": userName,
					"U_Note": newNote,
					"U_CreateDt": sDate
				};
				var qNameIn = "qAddNote";
				var qParamsModel = models.createQueryModel();
				qParamsModel.setProperty("/method", "POST");
				qParamsModel.setProperty("/command", "UDO_K2P_NOTES");
				qParamsModel.setProperty("/firstFetch", true);
				qParamsModel.setProperty("/data", JSON.stringify(data));
				qParamsModel.setProperty("/queryParams", "");
				thisView.setModel(qParamsModel, qNameIn);
				var callBack = this.onAddNoteCallBack;
				K2PUtils.getpostputpatch(this, callBack, null, this, qNameIn);
			}
		},
		onAddNoteCallBack: function(callingController, results, callback2, oThis, qNameIn) {
			var thisView = callingController.getView();
			var oWorkOrderModel = callingController.getOwnerComponent().getModel("purchaseOrder");
			var oWorkOrderViewModel = callingController.getOwnerComponent().getModel("purchaseOrderView");
			var qParamsModel = thisView.getModel(qNameIn);
			var errorCode = qParamsModel.getProperty("/errorCode");
			var error = qParamsModel.getProperty("/error");
			var docEntry = oWorkOrderModel.getProperty("/DocEntry");
			var i18n;
			if (errorCode !== "0") {
				//call refreshNotes
				oWorkOrderViewModel.setProperty("/newNote", "");
				callingController.onRefreshNotes(callingController, docEntry);
			} else //handle error
			{
				var sMessage = "onAddNoteCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
				thisView.setBusy(false);
				i18n = "serviceLayerStatus";
				K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
			}
		},

		onLineQtyChange: function(oEvent) {
			var sId = oEvent.getParameter("id");
			var thisView = this.getView();
			var oLineQty = thisView.byId(sId);
			var qty = oLineQty.getValue();
			var sId2 = sId.replace("lineQty", "linePrice");
			var oLinePrice = thisView.byId(sId2);
			var price = oLinePrice.getValue();
			var lineTotal = price * qty;
			lineTotal = Math.round(lineTotal * 100) / 100;
			var sId3 = sId.replace("lineQty", "lineTotal");
			var oLineTotal = thisView.byId(sId3);
			oLineTotal.setValue(lineTotal);
			this.onResetTotal();

		},
		onLinePriceChange: function(oEvent) {
			var sId = oEvent.getParameter("id");
			var thisView = this.getView();
			var oLinePrice = thisView.byId(sId);
			var price = oLinePrice.getValue();
			var sId2 = sId.replace("linePrice", "lineQty");
			var oLineQty = thisView.byId(sId2);
			var qty = oLineQty.getValue();
			var lineTotal = price * qty;
			lineTotal = Math.round(lineTotal * 100) / 100;
			var sId3 = sId.replace("linePrice", "lineTotal");
			var oLineTotal = thisView.byId(sId3);
			oLineTotal.setValue(lineTotal);
			this.onResetTotal();

		}
		/*				    {
					title: "Change Password",
					content: new List({
						items: {
							path: "/ProductCollection",
							template: new StandardListItem({
								title: "{Name}",
								counter: "{Quantity}"
							})
						}
					}),
					saveButton: new Button({
						type: ButtonType.Emphasized,
						text: "OK",
						press: function () {
							this.oPasswordDialog.close();
						}.bind(this)
					}),
					cancelButton: new Button({
						text: "Close",
						press: function () {
							this.oPasswordDialog.close();
						}.bind(this)
					})
				}
				
				);*/
		/*	
	if (!this._pValueHelpDialog) {
				this._pValueHelpDialog = Fragment.load({
					id: "Dialog1", //oView.getId(),
					name: "K2PPM_PM.K2PUtils.ProjectDialog",
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}




<Button
			text="Dialog"
			width="230px"
			press=".onDefaultDialogPress"
			class="sapUiSmallMarginBottom"
			ariaHasPopup="Dialog" />//onLinePriceChange*/

		/*			onApprovalCallBack: function(callingController, result, callback2, oThis, qNameIn) {

					var thisView = callingController.getView();
					var qParamsModel = thisView.getModel(qNameIn);
					var errorCode = qParamsModel.getProperty("/errorCode");
					var error = qParamsModel.getProperty("/error");
					var retry = qParamsModel.getProperty("/retry");
					var i18n;
					if (errorCode === 0) {
						//confirm
						//check this users approval limit
						var viewModel = this.getOwnerComponent().getModel("purchaseOrderView");
						var purchaseOrderModel = this.getOwnerComponent().getModel("purchaseOrder");
						var approvalLimit = viewModel.getProperty("approvalLimit");
						var totalAmount = K2PUtils.resetTotal(purchaseOrderModel, "/DocumentLines", "/DocTotal", "/LineTotal");
						var qParamsModel2 = models.createQueryModel();
						var qNameIn2;
						var data;
						var queryParams;
						var oUserModel = this.getOwnerComponent().getModel("userModel");
						var user = oUserModel.getProperty("/value/0/UserCode");
						var userName = oUserModel.getProperty("/value/0/UserName");
						var today = new Date();
						var sDate = today.getFullYear() + " - " + (today.getMonth() + 1) + " - " + today.getDate();
						var DocEntry = purchaseOrderModel.getProperty("/DocEntry");
						if (totalAmount <= approvalLimit) {
							//create the PO
							purchaseOrderModel.setProperty("/U_K2P_ApprovedBy", user);
							purchaseOrderModel.setProperty("/U_K2P_ApprovedByName", userName);
							purchaseOrderModel.setProperty("/U_K2P_ApprovedDate", sDate);
							data = purchaseOrderModel.getJSON();
							qNameIn2 = "qSaveToDocument";
							qParamsModel2.setProperty("/method", "POST");
							qParamsModel2.setProperty("/command", "/DraftsService_SaveDraftToDocument");
							qParamsModel2.setProperty("/data", data);
							qParamsModel2.setProperty("/retry", false);
							qParamsModel2.setProperty("/firstFetch", false);
							qParamsModel2.setProperty("/withCredentials", false);
							qParamsModel2.setProperty("/queryParams", queryParams);
							thisView.setModel(qParamsModel2, qNameIn2);
							K2PUtils.getpostputpatch(this, this.addApprovalCallBack, null, this, qNameIn2);
						} else {
							if (approvalLimit > 0) {
								//Just add approval log at this level. 
								data = {
									"U_DraftEntry": DocEntry,
									"U_Date": sDate,
									"U_Action": "A",
									"U_DocType": 22,
									"U_UserCode": user,
									"U_UserName": useruserName
								};
								qNameIn2 = "qCreateLog ";
								qParamsModel2.setProperty("/method", "POST");
								qParamsModel2.setProperty("/command", "/K2P_APRV_LOG");
								qParamsModel2.setProperty("/data", data);
								qParamsModel2.setProperty("/retry", false);
								qParamsModel2.setProperty("/firstFetch", false);
								qParamsModel2.setProperty("/withCredentials", false);
								qParamsModel2.setProperty("/queryParams", queryParams);
								thisView.setModel(qParamsModel2, qNameIn2);
								K2PUtils.getpostputpatch(this, this.addApprovalCallBack, null, this, qNameIn2);
							}
						}
					} else {
						var sMessage = "tenantCallBack: " + error + " Code:" + errorCode.toString() + " status: " + status;
						thisView.setBusy(false);
						i18n = "serviceLayerStatus";
						//var oRouter = callingController.getRouter();
						//oRouter.navTo("login");
						K2PUtils.errorDialogBox(callingController, i18n, sMessage, true, null, status);
					}
				},*/

	});

});