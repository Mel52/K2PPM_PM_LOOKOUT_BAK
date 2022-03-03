sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		createViewModel: function() {
			var data = {
				headerText: ""
			};

			var oModel = new JSONModel(data);
			oModel.setDefaultBindingMode("TwoWay");

			return oModel;
		},

		createMaintenanceViewModel: function() {
			var data = {
				path: "",
				refresh: false
			};
			var oModel = new JSONModel(data);
			oModel.setDefaultBindingMode("TwoWay");

			return oModel;

		},
		createTaskModel: function() {
			var data = {
				K2P_WO_TASKSCollection: [{
					"LineId": 7,
					"U_Descr": "Line 7",
					"U_Details": "",
					"U_ScheduleDt": null,
					"U_StartDt": null,
					"U_EndDt": null,
					"U_Duration": 0.0
			}]
			};
			var oModel = new JSONModel(data);
			oModel.setDefaultBindingMode("TwoWay");

			return oModel;

		},
		createPurchaseOrderModel2: function() {
			var data = {
				"DocNum": "",
				"CardCode": "",
				"CardName": "",
				"DocType": "dDocument_Service",
				"Comments": "Put Comments Here!",
				"DocumentLines": [
					{
						"ItemDescription": "",
						"Price": 0.00,
						"LineTotal": 0.00,
						"AccountCode": "",
						"TaxCode": "GST",
						"U_K2P_Account": "TestAccount"
                 }
                 ]
			};
			var oModel = new JSONModel(data);
			oModel.setDefaultBindingMode("TwoWay");

			return oModel;

		},
	    creatWorkOrderViewModel: function() {
			var data = {
				add: false,
				navBack: "home",
				lineIndex: -1,
				refresh: true,
				newNote: ""
				
			};
			var oModel = new JSONModel(data);
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},
		createPurchaseOrderModel: function() {
			var data = {
				"DocNum": "",
				"DocObjectCode": "22",
				"DocumentStatus": "bost_Open",
				"DocDate": "",
				"DocDueDate": "",
				"CardCode": "",
				"CardName": "",
				"DocType": "dDocument_Service",
				"Comments": "",
				"NumAtCard": "",
				"DocumentLines": [
                 ]
			};
			var oModel = new JSONModel(data);
			oModel.setDefaultBindingMode("TwoWay");

			return oModel;

		},

		createPurchaseOrderLine2: function() {
			var data = {
				"U_K2P_ChrgType": "",
				"ItemDescription": "",
				"U_K2P_QtyService": 0.0,
				"LineTotal": 0.0,			
				"U_K2P_Account": "",
				"AccountCode": "",
				"U_K2P_Tenant": "",
				"U_K2P_Property": "",
				"U_K2P_ProjCode": "",
				"U_K2P_DocNum": "",
				"U_K2P_UnitID": "",
				"U_K2P_ChrgTo": "N",
				"U_K2P_ChrgAmt": 0.0,
				"TaxCode": "",
				"DocumentLines": []
				};
			return data;
		},
		
	  createPurchaseOrderLine: function() {
			var data = {
				"ItemDescription": "",
				"Price": 0.0,
				"LineTotal": 0.0,
				"AccountCode": "",
				"U_K2P_ChrgTo": "N",
				"U_K2P_QtyService": 1,
				"TaxCode": "",
				"U_K2P_Account": "",
				"ProjectCode": "",
				"U_K2P_Property": ""
				};
			return data;
		},
		createApproverList: function() {
		    var data = {
		     value: []   
		    };
		    
		    var oModel = new JSONModel(data);
			oModel.setDefaultBindingMode("TwoWay");

			return oModel;
		    
		},
		createRoleList: function() {
		    var data = {
		     value: []   
		    };
		    
		    var oModel = new JSONModel(data);
			oModel.setDefaultBindingMode("TwoWay");

			return oModel;
		    
		},
		createLocalModel: function() {

			var data = {

				//destination: "/destinations/hanab1vm2:50000",
				//destinationxs:"/destinations/hanab1vm2:4300",
				///destination: "/destinations/96.89.78.153:50000/b1s/v1/",
				destination: "",
				uID: "",
				uPassword: "1234",
				DBUser: "SYSTEM",
				DBPassword: "Duffy123",
				B1UserName: "",
				B1Password: "", //Duffy01!
				oldPassword: "",
				newPassword: "",
				newPassword2: "",
				B1CompanyDB: "SAP_LOOKOUT", //DMJPROP
				status: "Disconnected ",
				CSRFToken: "",
				rootserver: "",
				cardCode: "",
				cardName: "",
				login: "",
				PmtDate: "2020-09-02",
				CheckNbr: "",
				CreditCard: "",
				Expiration: "",
				SecurityCode: "",
				Bank: "",
				Payment: "",
				balance: "",
				maintRequests: "",
				loggedIn: false,
				xsConnected: false,
				crypto: true,
				pmtTypeDefault: 0,
				cryptoAddress: "",
				cryptoCode: "",
				cryptoRate: "",
				cryptoAmount: "",
				cookieHeader: "",
				approvalUser: "",
				approvalUserName: "",
				ladderLinePath: "",
				ladderAdd: "",
				property: "",
				property2: "",
				program: "",
				ladder: "",
				test: "",
				configItems: []
			};

			var oModel = new JSONModel(data);
			oModel.setDefaultBindingMode("TwoWay");

			return oModel;

		},
		createQueryParameters: function() {
			var data = {
				//url: "/destinations/key2p",
				url: "https://lookoutportal.vision33cloud.com/xsengine",
				//url: "https://hanab1vm2:4300",
				//url: "https://portal.key2precision.com:4300",
				sl: "/K2PPM_PM/xsjs/K2POdata.xsjs/",
				method: "",
				command: "",
				queryParams: "",
				body: {},
				nextLink: "",
				pageSize: 0,
				page: 0,
				totalPages: 0,
				pageCountText: "",
				count: 0,
				error: "",
				errorCode: 0,
				data: "",
				retry: false,
				dataType: "json",
				contentType: "application/json",
				withCredentials: true,
				status: "",
				loggingIn: false,
				firstFetch: false
			};
			return data;
		},

		createQueryModel: function() {
			var data = this.createQueryParameters();
			var oModel = new JSONModel(data);
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},
		creatPurchaseOrderViewModel: function() {
			var data = {
				add: false,
				action: "",
				refresh: false,
				approved: false,
				approvalLimit: 0,
				approvalComment: "",
				lastTotal: 0,
				navBack: "home",
				lineIndex: -1,
				propertyName: ""
			};
			var oModel = new JSONModel(data);
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},

		createBPModel: function() {

			var data = {
				CardCode: "",
				CardName: "",
				Address: "",
				Block: "",
				City: "",
				BillToState: "",
				ZipCode: "",
				Country: "",
				Password: "",
				PmtDate: "",
				CheckNbr: "",
				CreditCard: "",
				Expiration: "",
				SecurityCode: "",
				Bank: "",
				Payment: ""

			};

			var oModel = new JSONModel(data);
			oModel.setDefaultBindingMode("TwoWay");

			return oModel;
		},

		createInvoiceModel: function() {
			var data = {
				Date: "",
				Description: "",
				DueDate: "",
				Amount: "",
				AmountToPay: ""

			};

			var oModel = new JSONModel(data);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createServiceModel: function() {
			var data = {
				Date: "",
				Subject: "",
				Description: "",
				Email: "",
				Phone: ""

			};

			var oModel = new JSONModel(data);
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},
		createRentRollModel: function() {

			var data = {

				AnnualRent: "",
				Balance: "0",
				Code: "",
				DocNum: 0,
				Name: "",
				RentPerArea: 0,
				TenantVacant_1: "",
				U_Area: 0,
				U_BldgPrcl_1: "",
				U_EndDt: "",
				U_FromDt: "",
				U_MgmtFee: 0,
				U_RentPer: 0,
				U_UnitID_1: "",
				id_: 0
				/*			    
				Code: "",
				U_BldgPrcl_1: "",
				U_UnitID_1: "",
				TenantVacant_1: "",
				DocNum: "",
	            U_FromDt: "",
				U_EndDt: "",
				U_RentPer: "",
				Rent: "",
				AnnualRent: "",
				U_Area: "",
				U_MgmtFee: "",
				Balance: ""
				*/
			};

			var oModel = new JSONModel(data);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;

		},

		addZero: function(i) {
			if (i < 10) {
				i = "0" + i;
			}
			return i;
		}

	};
});