sap.ui.define(
	["K2PPM_PM/model/models", "sap/m/MessageBox", "sap/m/Dialog", "sap/m/Button", "sap/m/library",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
	],
	function(models, MessageBox, Dialog, Button, library, Fragment, Filter, FilterOperator) {
		"use strict";
		return {
			onValueHelpRequest: function(oEvent, oThis) {
				var sInputValue = oEvent.getSource().getValue(),
					oView = oThis.getView();

				if (!oThis._pValueHelpDialog) {
					oThis._pValueHelpDialog = Fragment.load({
						id: oView.getId(),
						name: "sap.m.sample.InputAssisted.ValueHelpDialog",
						controller: oThis
					}).then(function(oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				oThis._pValueHelpDialog.then(function(oDialog) {
					// Create a filter for the binding
					oDialog.getBinding("items").filter([new Filter("Name", FilterOperator.Contains, sInputValue)]);
					// Open ValueHelpDialog filtered by the input's value
					oDialog.open(sInputValue);
				});
			},

			onValueHelpSearch: function(oEvent,oThis) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new Filter("Name", FilterOperator.Contains, sValue);

				oEvent.getSource().getBinding("items").filter([oFilter]);
			},

			onValueHelpClose: function(oEvent,oThis) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				oEvent.getSource().getBinding("items").filter([]);

				if (!oSelectedItem) {
					return;
				}

				oThis.byId("productInput").setValue(oSelectedItem.getTitle());
			}

		};
	});