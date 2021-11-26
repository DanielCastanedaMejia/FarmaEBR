sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator"
], function (JQuery, BaseController, MessageToast, MessageBox, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.PP.Reports.PPViewConsumption", {
        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("operationConsumption").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var
                oArgs = oEvent.getParameter("arguments"),
                oView = this.getView(),
                oData = {
                     "NUM_ORDEN": oArgs.orden,
                     "OPERACION": oArgs.operacion,
                     "MOV_TYPE":261
                };
            console.log(oData);
            this._base_onloadTable("PPConsumptionList", oData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Reportes/Movimientos/Transaction/sel_mov", "Consumos", "");

        }

    });
}
);

