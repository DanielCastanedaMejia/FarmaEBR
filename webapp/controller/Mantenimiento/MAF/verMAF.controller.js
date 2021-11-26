sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator",
    "../../../model/formatter"
], function (JQuery, BaseController, MessageToast, MessageBox, Filter, FilterOperator, formatter) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.Mantenimiento.MAF.verMAF", {

        formatter: formatter,

        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("verMAF").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            this._getUsuario("username");
            var oData = {};
            this._base_onloadTable("PMMAFList_Report", oData, "GIM/DatosTransaccionales/Mantenimiento/Reportes/Transaction/maf_desgaste", "MAF", "");

        }

    });
}
);

