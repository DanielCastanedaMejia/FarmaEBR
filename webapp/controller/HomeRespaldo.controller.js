sap.ui.define([
	"sap/ui/demo/webapp/controller/BaseController"

], function (BaseController) {
	"use strict";
    return BaseController.extend("sap.ui.demo.webapp.controller.Home", {
        onOpenDialog: function () {
            this.getOwnerComponent().openHelloDialog();
        }
	});
});