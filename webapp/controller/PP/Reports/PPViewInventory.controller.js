sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator",
    "sap/ui/demo/webapp/util/jsbarcode"
], function (JQuery, BaseController, MessageToast, MessageBox, Filter, FilterOperator, jsbarcode) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.PP.Reports.PPViewInventory", {
        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("viewInventory").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var
                oArgs = oEvent.getParameter("arguments"),
                oView = this.getView(),
                oData = {
                    "NUM_ORDEN": oArgs.orden,
                    "OPERACION": '',
                    "MOV_TYPE": 101
                };
            console.log(oData);
            this._base_onloadTable("PPInventoryList", oData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Reportes/Movimientos/Transaction/sel_mov", "Consumos", "");

        },

        print_noti: function () {
            var
                items = this.getView().byId("PPInventoryList").getSelectedItems(),
                oData,
                oView = this.getView(),
                oModel_etiqueta = new sap.ui.model.json.JSONModel();                

            if (items.length > 0) {
                items.forEach(function (item) {
                    oData = {
                        "SERIAL": item.getCells()[8].getText(),
                        "CODIGO": item.getCells()[0].getText(),
                        "CANTIDAD": item.getCells()[2].getText()
                    };
                    
                });
            }
            oModel_etiqueta.setData(oData);
            oView.setModel(oModel_etiqueta);



            JsBarcode(".barcode", "8981882470", {
                height: 50,
                width: 5,
                displayValue:false
            });

            JsBarcode(".quantity", oData.CANTIDAD, {
                height: 50,
                width: 3,
                displayValue: false
            });

            JsBarcode(".PO", "112213222", {
                height: 50,
                width: 5,
                displayValue: false
            });

            JsBarcode(".supplier", "5374", {
                height: 50,
                width: 3,
                displayValue: false
            });

            JsBarcode(".serial", oData.SERIAL, {
                height: 50,
                width: 3,
                displayValue: false
            });
                                          
            setTimeout(function () {
                window.print();
            }, 100);    
        }

    });
}
);

