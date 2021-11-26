sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/json/JSONModel'

], function (JQuery, BaseController, MessageToast, MessageBox, JSONModel) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.PMOrder.PMOrderOperationAGRO", {
        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("PMOrderOperationAGRO").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oArgs,
                oView = this.getView(),
                oTable = oView.byId('PMNotificationList'),
                oModel_empty = new sap.ui.model.json.JSONModel();

            oArgs = oEvent.getParameter("arguments");
            

            oModel_empty.setData({})
            oTable.setModel(oModel_empty);

            oView.bindElement({
                path: "/",
            });

            var aData = {
                "ORDER": oArgs.order,
                "OPERATION": oArgs.activity
            };            

            this._base_onloadHeader(aData, "EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/get_operation", "Cabecera");
            this._base_onloadTable('PMNotificationList', aData, "EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/get_notifications", "Notificaciones", "");
        },

        /****************************** START NOTIFICATION ***************************************/

        onOpenDialogAddNotification: function (oEvent) {
            var oView = this.getView(),
                oDialog = oView.byId("PMNotificationDialog");
            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.view.PMNotificationAGRO", this);
                oView.addDependent(oDialog);
            }
            var oItem, oCtx,
                oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                oData = {
                    "PLANT": oCtx.getProperty("plant")
                };

            oView.byId('inputDescOperation').setValue(oCtx.getProperty("description"));
            oView.byId('start_date').setValue('');
            oView.byId('end_date').setValue('');

            this._base_onloadCOMBO("listPMCuadrillas", oData, "EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Notificar/Transaction/get_cuadrillas", "","Cuadrillas");
            this._base_onloadCOMBO("listPMUsers", oData, "EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Notificar/Transaction/get_users", "","Usuarios");

            oDialog.open();
        },

        onCloseDialogAddNotification: function () {
            this.getView().byId("PMNotificationDialog").close();
        },

        onCloseDialogAddNotificationConfirm: function (oEvent) {
            var descOperation = this.byId('inputDescOperation'),
                devReason_list = this.byId('listPMDesviacion'),
                start_date = this.byId('start_date'),
                end_date = this.byId('end_date'),
                oComboUser = this.byId('listPMUsers'),
                oComboCrew = this.byId('listPMCuadrillas');

            this.onCloseDialogAddNotification();

            var oItem, oCtx,
                oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                selectedItems = oComboUser.getSelectedKeys(),
                num_nomina = "";

            for (var i = 0; i < selectedItems.length; i++) {
                num_nomina += (num_nomina == '') ? '' : ',';
                num_nomina += selectedItems[i];
            }

            var oData = {
                "DESCRIPTION": descOperation.getValue(),
                "ORDER": oCtx.getProperty("order"),
                "OPERATION": oCtx.getProperty("activity"),
                "PLANT": oCtx.getProperty("plant"),
                "WORK_CENTER": oCtx.getProperty("work_center"),
                "START_DATE": start_date.getValue(),
                "END_DATE": end_date.getValue(),
                "USERS": num_nomina,
                "CREW": oComboCrew.getSelectedKey(),
                "DESC_OPERATION": oCtx.getProperty("description"),
                "ACTIVITY_TYPE": oCtx.getProperty("acttype"),
            };
            console.log(oData);
            this.createNotification(oData, 'EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Notificar/Transaction/notification');

        },

        createNotification: function (oData, path) {

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

                            var oData = {
                                "ORDER": aData[0].object,
                                "OPERATION": aData[0].object2
                            }
                            oThis._base_onloadHeader(oData, "EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/get_operation", "Cabecera");
                            oThis._base_onloadTable('PMNotificationList', oData, "EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/get_notifications", "Notificaciones", "");
                        }

                    }
                    else {
                        oThis.getOwnerComponent().openHelloDialog("No se recibio información");
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

        /****************************** END NOTIFICATION ****************************************/

    });
}
);