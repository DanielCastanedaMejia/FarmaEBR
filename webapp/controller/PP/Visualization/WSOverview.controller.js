sap.ui.define([
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";
    return BaseController.extend("sap.ui.demo.webapp.controller.PP.Visualization.WSOverview", {
        onInit: function () {
        },

        onContinue: function (oEvent) {
            this.getRouter().navTo("home");
        }
    });
});