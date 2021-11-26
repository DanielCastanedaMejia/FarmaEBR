sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator"
], function (JQuery, BaseController, MessageToast, MessageBox, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.PP.Reports.PPViewNotification", {
        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("operationNotification").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var 
                oArgs = oEvent.getParameter("arguments"),
                oView = this.getView(),
                oData = {
                    "NUM_ORDEN": oArgs.orden,
                    "OPERACION": oArgs.operacion
                };

            this._base_onloadTable("PPNotificationList", oData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Reportes/Movimientos/Transaction/sel_noti", "Notificaciones", "");

        },

        onPMNotificationDetail: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            this.getRouter().navTo("PMNotificationDetail", {
                id: oCtx.getProperty("id")
            });

        },

        onReservationDetail: function (oEvent) {
            var oView = this.getView(),
                oDialog = oView.byId("PPReservationItems"),
                oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();



            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.view.ReservationItems", this);
                oView.addDependent(oDialog);
            }

            var oData = {
                "RESERVATION": oCtx.getProperty("reservation")
            }

            this._base_onloadTable("idReservationItems", oData, "EquipandoXXI/DatosTransaccionales/Mantenimiento/Avisos/Reserva/Transaction/get_reserv_items", "Componentes", "");
            oDialog.open();
        },

        onCloseDialogReservationItems: function () {
            this.getView().byId("PPReservationItems").close();
        },

        handleIconTabBarSelect: function (oEvent) {
            var aFilter = [],
                oTable = this.byId('PPReservationList'),
                oBinding = oTable.getBinding('items'),
                sKey = oEvent.getParameter("key");

            if (sKey != 'All') {
                if (sKey != 'NORAS')
                    aFilter.push(new Filter("status", FilterOperator.Contains, sKey));
                else
                    aFilter.push(new Filter("noras", FilterOperator.Contains, sKey));
            }

            oBinding.filter(aFilter);
        },

    });
}
);

