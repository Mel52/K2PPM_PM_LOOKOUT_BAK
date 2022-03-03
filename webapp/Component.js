sap.ui.define([
	"sap/ui/core/UIComponent", 	"K2PPM_PM/K2PUtils/K2PUtils", "sap/ui/Device"
], function (UIComponent, K2PUtils, Device) {
	"use strict";
	//

	return UIComponent.extend("K2PPM_PM.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			// create the views based on the url/hash
			this.getRouter().initialize();
			
			$.sap.log.error("Router Initialized");

			K2PUtils.appInit(this);
			
		},
		
		getContentDensityClass : function () {
			if (!this._sContentDensityClass) {
				if (!Device.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
					$.sap.log.error("Compact");
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
						$.sap.log.error("Cozy");
				}
			}
			return this._sContentDensityClass;
		}

	});

});
