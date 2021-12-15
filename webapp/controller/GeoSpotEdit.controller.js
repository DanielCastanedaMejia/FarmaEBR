sap.ui.define([
	"sap/ui/demo/webapp/controller/BaseController"
], function (BaseController) {
	"use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.GeoSpotEdit", {
        onInit: function () {            
            var oRouter = this.getRouter();
			oRouter.getRoute("GeoSpotEdit").attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
            console.log("Editar spots");
            this.getView().setModel(this.getOwnerComponent().getModel("spots"));
            //console.log(this.getView().getModel();
        }
    });
});