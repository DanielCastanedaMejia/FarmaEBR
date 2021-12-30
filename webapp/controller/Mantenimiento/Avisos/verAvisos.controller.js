sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Item",
    "sap/ui/model/json/JSONModel"
], function (JQuery, BaseController, MessageToast, MessageBox, Filter, FilterOperator, Item, JSONModel) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.Mantenimiento.Avisos.verAvisos", {
        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("verAvisos").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments"),
                oView = this.getView(),
                oTable = oView.byId('PMNotificationList'),
                oStats = oView.byId('IconTabBar_Notifications'),
                oModel_empty = new sap.ui.model.json.JSONModel(),
                oThis = this;
            this.getView().setModel(this.getOwnerComponent().getModel("spots"), "spots");
            if (this.getView().byId("planta").getItems().length == 0) {
                this.fillTypeComboBox("planta");
            }
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
            var length = this.getView().getModel("spots").getProperty("/SPOT/").length;
            for (var i = 0; i < length; i++) {
                var itemCombo = new Item();
                var nombrePlanta = this.getView().getModel("spots").getProperty("/SPOT/" + i + "/NOMBRE");
                var keyPlanta = this.getView().getModel("spots").getProperty("/SPOT/" + i + "/ID");
                itemCombo.setText(nombrePlanta);
                itemCombo.setKey(keyPlanta);
                this.getView().byId(idComboBox).addItem(itemCombo);
            }
        }

    });
});