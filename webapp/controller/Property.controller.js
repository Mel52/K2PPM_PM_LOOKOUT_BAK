sap.ui.define([
	"K2PPM_PM/controller/BaseController",
		"K2PPM_PM/model/models"
], function(BaseController, models) {
	"use strict";

	return BaseController.extend("K2PPM_PM.controller.Property", {

		onInit: function() {

			var oRouter = this.getRouter();
			oRouter.getRoute("property").attachMatched(this._onRouteMatched, this);
			this.getView().setModel(models.createQueryModel(), "qParams");
		}
		/*,

		// override the parent's onNavBack (inherited from BaseController)
		onNavBack : function (oEvent){
			// in some cases we could display a certain target when the back button is pressed
			if (this._oData && this._oData.fromTarget) {
				this.getRouter().getTargets().display(this._oData.fromTarget);
				delete this._oData.fromTarget;
				return;
			}

			// call the parent's onNavBack
			BaseController.prototype.onNavBack.apply(this, arguments);
		}
*/
	});

});