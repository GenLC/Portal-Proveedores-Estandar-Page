sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("ppe.ppe.controller.controller.App", {
        onInit() {
          
          //this.getOwnerComponent().getRouter().getTargets().display("TargetLogin");
        }
      });
    }
  );
  