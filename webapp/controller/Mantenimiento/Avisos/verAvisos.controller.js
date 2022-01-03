sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Item",
    "sap/ui/model/json/JSONModel",
    "sap/ui/demo/webapp/model/formatter"
], function (JQuery, BaseController, MessageToast, MessageBox, Filter, FilterOperator, Item, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.Mantenimiento.Avisos.verAvisos", {
        formatter: formatter,
        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("verAvisos").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            this.getView().setModel(this.getOwnerComponent().getModel("spots"), "spots");
            var tam = this.getView().byId("planta").getItems().length;            
            if (tam > 0) {
                var comboItems = this.getView().byId("planta").getItems();
                this.getView().byId("planta").removeAllItems();
                for (var i = 0; i < tam; i++) {
                    comboItems[i].destroy();
                }
            }
            this.fillTypeComboBox("planta");
            var initkey = this.getView().byId("planta").getItems()[0].getProperty("key");
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
            /*var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            this.getRouter().navTo("avisoDetalle", {
                id: oCtx.getProperty("id")
            });*/
            var oSource = oEvent.getSource();
            var bCtx = oSource.getBindingContext();
            var sPath = bCtx.getPath();
            this.getRouter().navTo("PMNotificationDetail", {
                id: bCtx.getProperty(sPath + "/id")
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
            var nModel = new JSONModel(this.getOwnerComponent().getModel("noticesModel"));
            var aData = nModel.oData.oData;
            var indexSpotClicked = this.getView().byId("planta").getSelectedKey();
            var selNoticeModel = {
                "ITEMS": []
            };
            for (var i = 0; i < aData.ITEMS.length; i++) {
                if (aData.ITEMS[i].spotId == indexSpotClicked) {
                    selNoticeModel.ITEMS.push(aData.ITEMS[i]);
                }
            }
            var auxModel = new JSONModel(selNoticeModel)
            this.getView().byId("PMNotificationList").setModel(auxModel);
            this.getView().byId("IconTabBar_Notifications").setSelectedKey("All");
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
            var keyPlanta, nombrePlanta;
            var length = this.getView().getModel("spots").getProperty("/SPOT/").length;
            for (var i = 0; i < length; i++) {
                var itemCombo = new Item();
                nombrePlanta = this.getView().getModel("spots").getProperty("/SPOT/" + i + "/NOMBRE");
                keyPlanta = this.getView().getModel("spots").getProperty("/SPOT/" + i + "/ID");
                itemCombo.setText(nombrePlanta);
                itemCombo.setKey(keyPlanta);
                this.getView().byId(idComboBox).addItem(itemCombo);
            }            
        }
    });
});