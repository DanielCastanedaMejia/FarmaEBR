sap.ui.define([
	"sap/ui/demo/webapp/controller/BaseController"

], function (BaseController) {
	"use strict";
	return BaseController.extend("sap.ui.demo.webapp.controller.NotFound", {
		onInit: function () {
            var oRouter, oTarget;
            var oThis = this;            
            var id;
            oRouter = this.getRouter();
            oTarget = oRouter.getTarget("notFound");
            oTarget.attachDisplay(function (oEvent) {
                this._oData = oEvent.getParameter("data"); //store the data
                var complete_url = window.location.href;
                // @ts-ignore
                id = complete_url.split("/", 7).at(-1);
                var idNumber  = Number(id)
                //Si es un ID numerico lo que encontró
                if(idNumber) {                    
                    oThis.getView().byId("notFoundMsg").setText("El ID no se encontró o no está disponible");
                }
            }, this);
        },
        // override the parent's onNavBack (inherited from BaseController)
        onNavBack: function (oEvent) {
            // in some cases we could display a certain target when the back button is pressed
            if (this._oData && this._oData.fromTarget) {
                this.getRouter().getTargets().display(this._oData.fromTarget);
                delete this._oData.fromTarget;
                return;
            }
            // call the parent's onNavBack
            BaseController.prototype.onNavBack.apply(this, arguments);
        }
	});
});