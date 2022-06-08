sap.ui.define([], function () {
	"use strict";
	return {
		statusText: function (sStatus) {
			// var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (sStatus) {
				case "bost_Close":
					// return resourceBundle.getText("CLOSE");
                 
                    return "Close"
				
				default:
					return ("DEFECTO");
			}
		}
	};
});