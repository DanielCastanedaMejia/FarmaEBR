sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Item"
], function (JQuery, BaseController, MessageToast, MessageBox, Filter, FilterOperator, Item) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.Mantenimiento.Avisos.verAvisos", {
        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("verAvisos").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            //his._getUsuario("username");

            var oArgs = oEvent.getParameter("arguments"),
                oView = this.getView(),
                oTable = oView.byId('PMNotificationList'),
                oStats = oView.byId('IconTabBar_Notifications'),
                oModel_empty = new sap.ui.model.json.JSONModel(),
                oThis = this;

            //clear table
            /*oModel_empty.setData({});
            oTable.setModel(oModel_empty);
            oStats.setModel(oModel_empty);

            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({ plant: oArgs.Plant });
            oView.setModel(oModel);

            this.byId("planta").setSelectedKey(1710);

            oView.bindElement({
                path: "/"
            });

            var oData2 = {
                "TIPO_FILTRO": "CE",
                "FILTRO": "1710",
                "TIPO_UBI": ""
            };

            this._base_onloadCOMBO("listPMProceso", oData2, "GIM/DatosMaestros/Mantenimiento/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH", "1710-PRD", "Proceso");    

            var oData3 = {
                "TIPO_FILTRO": "FAB",
                "FILTRO": "1710-PRD",
                "TIPO_UBI": ""
            };

            this._base_onloadCOMBO("listPMSubProceso", oData3, "GIM/DatosMaestros/Mantenimiento/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH", "", "SubProceso");
            */
            var filterbar = this.getView().byId("filterBar");
            console.log(filterbar);
            this.fillTypeComboBox("planta");
        },

        onChangePMProceso: function (oEvent) {
            var oData = {
                "TIPO_FILTRO": "SUBPRO",
                "FILTRO": oEvent.getParameter("selectedItem").getKey()
            };
            //this._base_onloadCOMBO("listPMSubProceso", oData, "EquipandoXXI/DatosTransaccionales/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH", "", "SubProceso");
        },

        onChangePMSubProceso: function (oEvent) {
            var oData = {
                "TIPO_FILTRO": "PRO",
                "FILTRO": oEvent.getParameter("selectedItem").getKey()
            };
            console.log(oData);
            //this._base_onloadCOMBO("listPMFunction", oData, "GIM/DatosMaestros/Mantenimiento/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH", "", "Funciones");     
        },

        onPMNotificationDetail: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            this.getRouter().navTo("avisoDetalle", {
                id: oCtx.getProperty("id")
            });

        },

        onShowOrder: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            this.getRouter().navTo("PMOrderDetail", {
                id: oCtx.getProperty("order")
            });

        },

        onFilterSearch: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();

            var oComboProcess = this.byId("listPMProceso");
            var oComboSubProcess = this.byId("listPMSubProceso");
            var oComboFunction = this.byId("listPMFunction");
            var oCheckStop = this.byId("PMStop");
            var oInputStarDate = this.byId("start_date");
            var oInputEndDate = this.byId("end_date");

            var oStop = '0';
            if (oCheckStop.getSelected() == true)
                oStop = 'X';
            else
                oStop = '';

            var plant = "1710";

            plant = plant.split('-')[1];

            var oData = {
                "BREAKDOWN": oStop,
                "END_DATE": oInputEndDate.getValue(),
                "FUNCTION": oComboFunction.getSelectedKey(),
                "PLANT": plant,
                "PROCESS": oComboProcess.getSelectedKey(),
                "START_DATE": oInputStarDate.getValue(),
                "SUBPROCESS": oComboSubProcess.getSelectedKey()
            };

            //this._base_onloadTable("PMNotificationList", oData, "GIM/DatosTransaccionales/Mantenimiento/Avisos/Buscar/Transaction/get_avisos", "Avisos","IconTabBar_Notifications");
        },

        onClear: function () {
            console.log("CLEAR");
        },

        handleIconTabBarSelect: function (oEvent) {
            var aFilter = [],
                oTable = this.byId('PMNotificationList'),
                oBinding = oTable.getBinding('items'),
                sKey = oEvent.getParameter("key");

            if (sKey !== 'All') {
                if (sKey !== 'NORAS')
                    aFilter.push(new Filter("status", FilterOperator.Contains, sKey));
                else
                    aFilter.push(new Filter("noras", FilterOperator.Contains, sKey));
            }

            oBinding.filter(aFilter);
        },
        fillTypeComboBox: function (idComboBox) {
            var oThis = this;

            var itemCombo = new Item();
            itemCombo.setText("Test");
            itemCombo.setKey("0");
            console.log(oThis.getView().byId(idComboBox));
            oThis.getView().byId(idComboBox).addItem(itemCombo);
            /*var itemTest = new sap.ui.core.Item();
            itemTest.setText("Success");
            itemTest.setKey("0");
            // @ts-ignore
            oThis.byId(idComboBox).addItem(itemTest);

            itemTest = new sap.ui.core.Item();
            itemTest.setText("Default");
            itemTest.setKey("1");
            // @ts-ignore
            oThis.byId(idComboBox).addItem(itemTest);

            itemTest = new sap.ui.core.Item();
            itemTest.setText("Warning");
            itemTest.setKey("2");
            // @ts-ignore
            oThis.byId(idComboBox).addItem(itemTest);

            itemTest = new sap.ui.core.Item();
            itemTest.setText("None");
            itemTest.setKey("3");
            // @ts-ignore
            oThis.byId(idComboBox).addItem(itemTest);

            itemTest = new sap.ui.core.Item();
            itemTest.setText("Inactive");
            itemTest.setKey("4");
            // @ts-ignore
            oThis.byId(idComboBox).addItem(itemTest);

            itemTest = new sap.ui.core.Item();
            itemTest.setText("Error");
            itemTest.setKey("5");
            // @ts-ignore
            oThis.byId(idComboBox).addItem(itemTest);*/
        }

    });
});