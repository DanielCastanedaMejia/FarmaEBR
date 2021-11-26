sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/json/JSONModel'

], function (JQuery, BaseController, MessageToast, MessageBox, JSONModel) {
    "use strict";

    var plant_gb = '';

    return BaseController.extend("sap.ui.demo.webapp.controller.PMOrder.PMOrderDetailAGRO", {
        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("PMOrderDetailAGRO").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oArgs, oView;
            oArgs = oEvent.getParameter("arguments");
            oView = this.getView();

            var oTable = oView.byId("PMOperationList");
            var oModel_empty = new sap.ui.model.json.JSONModel();
            oModel_empty.setData({})
            oTable.setModel(oModel_empty);

            oView.bindElement({
                path: "/",
            });

            var aData = {
                "ORDER": oArgs.id,
            };

            plant_gb = oArgs.plant;
            console.log(plant_gb);

            this._base_onloadHeader(aData, "EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/visualizar_orden", "Cabecera");
            this._base_onloadTable('PMOperationList', aData, 'EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Cabecera/Transaction/get_operations', "Operaciones", "");
        },

        onOpenDialogAddOperation: function (oEvent) {
            var oView = this.getView();
            var oDialog = oView.byId("AddOperationDialog");
            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.view.PMOperationModAGRO", this);
                oView.addDependent(oDialog);
            }
            var oData = {
                "PLANT": plant_gb
            },
                oItem, oCtx,
                oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                aData = {
                    "ORDER": oCtx.getProperty("order")
                };

            oView.byId('inputWorkOperation').setValue('');

            this._base_onloadCOMBO("workCenter_list", oData, "EquipandoXXI/DatosMaestros/Produccion/CentroTrabajo/Transaction/get_workCenter", oCtx.getProperty("work_center"), "Centro Trabajo");
            this._base_onloadCOMBO("operation_list", aData, "EquipandoXXI/DatosMaestros/Mantenimiento/HojaRuta/Transaction/get_operation_keys_filter", "", "Operations");

            oDialog.open();
        },

        onCloseDialogAddOperation: function () {
            this.getView().byId("AddOperationDialog").close();
        },

        onCloseDialogAddOperationConfirm: function (oEvent) {
            var descOperation = this.byId('operation_list'),
                work = this.byId('inputWorkOperation'),
                workCenter_list = this.byId('workCenter_list');


            if (descOperation.getSelectedKey() == '')
                this.getOwnerComponent().openHelloDialog("Indique la operacion");
            else if (work.getValue() == '')
                this.getOwnerComponent().openHelloDialog("Indique el trabajo estimado");
            else if (workCenter_list.getSelectedKey() == '')
                this.getOwnerComponent().openHelloDialog("Indique el puesto de trabajo");
            else {
                this.onCloseDialogAddOperation();

                var oItem, oCtx;
                oItem = oEvent.getSource();
                oCtx = oItem.getBindingContext();
                var oData = {
                    "DESCRIPTION": descOperation.getSelectedItem().getText(),
                    "ORDER": oCtx.getProperty("order"),
                    "WORK_CENTER": workCenter_list.getSelectedKey(),
                    "WORK": work.getValue(),
                    "STANDARD_KEY": descOperation.getSelectedKey()
                };
                this.createPMOperation('PMOrderOperation', oData, 'EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Crear/Transaction/add_operationAGRO');
            }            

        },
        createPMOperation: function (idObject, oData, path) {

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
                                "ORDER": aData[0].object
                            }
                            oThis._base_onloadTable('PMOperationList', aData, 'EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Cabecera/Transaction/get_operations', "Operaciones", "");
                        }

                    }
                    else {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud a fallado: ¿Hay conexión de red?");
                    }

                    sap.ui.core.BusyIndicator.hide();

                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        MessageToast.show("La solicitud a fallado: " + textStatus);
                    }
                    sap.ui.core.BusyIndicator.hide();
                });

        },
        onOpenDialogRelease: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            var oData = {
                "ORDER": oCtx.getProperty("order")
            };
            this.releaseOrder(oData, 'EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Liberar/Transaction/liberar_orden');
        },

        onPMOrderOperation: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();

            this.getRouter().navTo("PMOrderOperationAGRO", {
                order: oCtx.getProperty("order"),
                activity: oCtx.getProperty("operation")
            });
        },

        onOpenDialog: function () {
            this.getOwnerComponent().openHelloDialog();
        },

        releaseOrder: function (oData, path) {

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
                                "ORDER": aData[0].object,
                            };

                            oThis._base_onloadHeader(aData, "EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/visualizar_orden", "Cabecera");
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

    });
}
);