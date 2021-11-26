sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator"
], function (JQuery, BaseController, MessageToast, MessageBox, Filter, FilterOperator) {
    "use strict";

    var plant_gb = '';

    return BaseController.extend("sap.ui.demo.webapp.controller.PMBitacora.viewPMBitacora", {
        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("viewPMBitacora").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {  
            var oArgs;
            oArgs = oEvent.getParameter("arguments");

            plant_gb = 'PLANTA';
            this.PPOrders_view();            

            var columns = {
                columns: [
                    {
                        Column: "Orden",
                        Visible: 1
                    },
                    {
                        Column: "Material",
                        Visible: 1
                    },
                    {
                        Column: "Desc Material",
                        Visible: 1
                    },
                    {
                        Column: "Planta",
                        Visible: 1
                    },
                    {
                        Column: "Inicio Prog",
                        Visible: 1
                    },
                    {
                        Column: "Fin Prog",
                        Visible: 0
                    },
                    {
                        Column: "Tipo",
                        Visible: 0
                    },
                    {
                        Column: "Lote",
                        Visible: 1
                    },
                    {
                        Column: "Cant Prog",
                        Visible: 1
                    },
                    {
                        Column: "Estatus",
                        Visible: 1
                    }
                ]
            };

            this._setColumns(columns, "columnList", "PPOrders_list");
            
        },

        PPOrders_view: function () {
            var oData = {
                "END_DATE": this.byId("end_date").getValue(),
                "PLANT": plant_gb,
                "START_DATE": this.byId("start_date").getValue()
            };

            this._base_onloadTable("PPOrders_list", oData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/sel_ordenes", "Ordenes", "IconTabBar_Orders");
        },

        handleIconTabBarSelect: function (oEvent) {
            var aFilter = [],
                oTable = this.byId('PPOrders_list'),
                oBinding = oTable.getBinding('items'),
                sKey = oEvent.getParameter("key");

            if (sKey !== 'All') {
                if (sKey !== 'NORAS')
                    aFilter.push(new Filter("ESTATUS", FilterOperator.Contains, sKey));
                else
                    aFilter.push(new Filter("noras", FilterOperator.Contains, sKey));
            }

            oBinding.filter(aFilter);
        },

        onSelectionChange: function (oEvent) {
            this._selectionColumn(oEvent, "PPOrders_list");   
        },

        onCloseDialogHideColumns: function () {
            this.getView().byId("hideColumns_fragment").close();
        },

        onDetal_view: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            this.getRouter().navTo("orderDetail", {
                orden: oCtx.getProperty("NUM_ORDEN")
            });
        }
    });
});