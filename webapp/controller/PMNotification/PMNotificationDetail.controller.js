sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/json/JSONModel'

], function (JQuery, BaseController, MessageToast, MessageBox, JSONModel) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.PMNotification.PMNotificationDetail", {
        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("PMNotificationDetail").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oArgs, oView;
            oArgs = oEvent.getParameter("arguments");
            oView = this.getView();   

            oView.bindElement({
                path: "/",
            });

            var oData = {
                "NOTIFICATION": oArgs.id,
            };

            this._base_onloadHeader(oData, "EquipandoXXI/DatosTransaccionales/Mantenimiento/Avisos/Detalle/Transaction/notification_detail", "Cabecera Aviso");

        },

        onRelease: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();

            var oData = {
                "AVISO": oCtx.getProperty("id")
            };

            this.putInProgress(oData, "EquipandoXXI/DatosTransaccionales/Mantenimiento/Avisos/EnTratamiento/Transaction/poner_en_tratamiento");
        },

        putInProgress: function (oData, path) {
            var uri = "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Runner?Transaction=" + path + "&OutputParameter=JsonOutput&Content-Type=text/xml"
            uri = uri.replace(/\s+/g, '');

            var oThis = this;

            sap.ui.core.BusyIndicator.show(0);

            $.ajax({
                type: "GET",
                dataType: "xml",
                cache: false,
                url: uri,
                data: oData
            })
                .done(function (xmlDOM) {
                    var opElement = xmlDOM.getElementsByTagName("Row")[0].firstChild;

                    if (opElement.firstChild != null) {
                        var aData = eval(opElement.firstChild.data);
                        if (aData[0].error !== undefined) {
                            oThis.getOwnerComponent().openHelloDialog(aData[0].error);
                        }
                        else {
                            //Create  the JSON model and set the data                                                                                                
                            MessageToast.show(aData[0].message);
                            var aData = {
                                "NOTIFICATION": aData[0].object,
                            };

                            oThis._base_onloadHeader(aData, "EquipandoXXI/DatosTransaccionales/Mantenimiento/Avisos/Detalle/Transaction/notification_detail", "Cabecera Aviso");
                        }

                    }
                    else {
                        MessageToast.show("No se recibio información");
                    }

                    sap.ui.core.BusyIndicator.hide();

                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud a fallado: Hay conexión de red?");
                    }
                    sap.ui.core.BusyIndicator.hide();
                });
        },

        onShowCreatePMOrder: function (oEvent) {            
            var oItem, oCtx;                
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            var desc = oCtx.getProperty("short_text");
            
            this.getRouter().navTo("createPMOrder", {
                id: oCtx.getProperty("id"),
                short_text: encodeURIComponent(desc),
                priority: oCtx.getProperty("priority"),
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

    });
}
);