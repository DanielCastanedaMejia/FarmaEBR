sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/json/JSONModel'

], function (JQuery, BaseController, MessageToast, MessageBox, JSONModel) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.Mantenimiento.Avisos.avisoDetalle", {
        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("avisoDetalle").attachMatched(this._onRouteMatched, this);            
        },

        _onRouteMatched: function (oEvent) {
            this._getUsuario("username");
            var
                oArgs = oEvent.getParameter("arguments"),
                oView = this.getView(),
                oThis = this;

            oView.bindElement({
                path: "/"
            });

            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({});

            this.getView().setModel(oModel);

            var binding = new sap.ui.model.Binding(oModel, "/", oModel.getContext("/"));
            binding.attachChange(function () {

                if (oModel.getProperty("/order") !== "")
                    oThis.byId("addOrder").setEnabled(false);
                else
                    oThis.byId("addOrder").setEnabled(true);

                if (oModel.getProperty("/status") === "MEAB")
                    oThis.byId("releaseOrder").setEnabled(true);
                else
                    oThis.byId("releaseOrder").setEnabled(false);
            });

            var oData = {
                "NOTIFICATION": oArgs.id
            };
            this._base_onloadHeader_changed(oData, "GIM/DatosTransaccionales/Mantenimiento/Avisos/Detalle/Transaction/notification_detail", "Cabecera Aviso", oModel);
            
        },        

        onRelease: function (oEvent) {
            var 
                oItem = oEvent.getSource(),
                resourceModel = this.getView().getModel("i18n"),
                oCtx = oItem.getBindingContext();

            var oData = {
                "AVISO": oCtx.getProperty("id")
            };
            this._handleMessagePutInProgress(resourceModel.getResourceBundle().getText("confirm.putInProgress"), "confirm", oData, this);
        },

        _handleMessagePutInProgress: function (sMessage, sMessageBoxType, oData, oThis) {
            MessageBox[sMessageBoxType](sMessage, {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        oThis.putInProgress(oData, "GIM/DatosTransaccionales/Mantenimiento/Avisos/EnTratamiento/Transaction/poner_en_tratamiento");
                    }
                }.bind(this)
            });
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

                    if (opElement.firstChild !== null) {
                        var aData = eval(opElement.firstChild.data);
                        if (aData[0].error !== undefined) {
                            oThis.getOwnerComponent().openHelloDialog(aData[0].error);
                        }
                        else {
                            //Create  the JSON model and set the data                                                                                                
                            MessageToast.show(aData[0].message);
                            var xData = {
                                "NOTIFICATION": aData[0].object
                            };
                            oThis.byId("releaseOrder").setEnabled(false);
                            oThis._base_onloadHeader(xData, "GIM/DatosTransaccionales/Mantenimiento/Avisos/Detalle/Transaction/notification_detail", "Cabecera Aviso");
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
            var                 
            oItem = oEvent.getSource(),
            oCtx = oItem.getBindingContext();
            
            this.getRouter().navTo("crearOrdenPM", {
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

        }

    });
}
);