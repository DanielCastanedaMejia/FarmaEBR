sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator",
    "sap/ui/demo/webapp/model/formatter"
], function (JQuery, BaseController, MessageToast, MessageBox, Filter, FilterOperator, formatter) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.PP.Reports.MAFDesgaste", {

        formatter: formatter,

        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("mafDesgaste").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oData = {};
            this._base_onloadTable("PMMAFList_Report", oData, "FARMA/DatosTransaccionales/Mantenimiento/Reportes/Transaction/maf_desgaste", "MAF", "");

        }

    });
}
);

