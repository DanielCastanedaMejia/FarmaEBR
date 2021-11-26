sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/json/JSONModel'

], function (JQuery, BaseController, MessageToast, MessageBox, JSONModel) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.PMOrder.PMOrderOperation", {
        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("PMOrderOperation").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oArgs, oView;
            oArgs = oEvent.getParameter("arguments");
            oView = this.getView();
            var plant = oArgs.plant;

            oView.bindElement({
                path: "/",
            });

            var aData = {
                "ORDER": oArgs.order,
                "OPERATION": oArgs.activity
            };

            oView.getModel().setProperty('/order', oArgs.order);

            console.log(plant);

            if (plant == '3120' || plant == '3320' || plant == '3110' || plant == '3310' || plant == '3210') {
                this.byId('buttonConsumption').setVisible(false);                
            }
            else
                this.byId('buttonConsumption').setVisible(true);                

            this.byId("PMComponentList").getColumns()[1].setVisible(false);
            this.byId("PMComponentList").getColumns()[0].setVisible(false);
            this._base_onloadTable("PMComponentList", aData, "SelloRojo/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/get_components", "Componentes", "");
            this._base_onloadHeader(aData, "SelloRojo/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/get_operation", "Cabecera");
        },

        /****************************** START COMPONENT ***************************************/

        onOpenDialogAddComponent: function () {
            var oView = this.getView(),
                oDialog = oView.byId("AddComponentDialog"),
                oData = {
                    "ORDER": oView.getModel().getProperty('/order')
                };
            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.view.PMAddComponent", this);
                oView.addDependent(oDialog);
            }
            
            this._base_onloadCOMBO("material_addOperation", oData, "SelloRojo/DatosTransaccionales/Mantenimiento/Orden/Crear/Transaction/get_materials_byType", "","Materiales");

            oView.byId('inputQuantity').setValue('');
            oView.byId('material_addOperation').getSelectedKey('');
            oDialog.open();
        },

        onCloseDialogAddComponentCancel: function () {
            this.getView().byId("AddComponentDialog").close();
        },

        onCloseDialogAddComponentConfirm: function (oEvent) {
            var material = this.byId('material_addOperation'),
                quantity = this.byId('inputQuantity'),
                resourceModel = this.getView().getModel("i18n");

            this.onCloseDialogAddComponentCancel();

            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();

            if (material.getSelectedKey() == '')
                this.getOwnerComponent().openHelloDialog(resourceModel.getResourceBundle().getText("PMOperation.material"));
            else
                if (quantity.getValue() == '' || quantity.getValue() == '0')
                    this.getOwnerComponent().openHelloDialog(resourceModel.getResourceBundle().getText("PMOperation.quantity"));

            var oData = {
                "MATERIAL": material.getSelectedKey(),
                "QUANTITY": quantity.getValue(),
                "STAGE": "0500",
                "PLANT": oCtx.getProperty("plant"),
                "OPERATION": oCtx.getProperty("activity"),
                "ORDER": oCtx.getProperty("order"),
            };
            
            this.addComponent(oData, 'SelloRojo/DatosTransaccionales/Mantenimiento/Orden/Crear/Transaction/add_component');
        },

        addComponent: function (oData, path) {

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
                                "OPERATION": aData[0].object2
                            }
                            oThis._base_onloadTable("PMComponentList", aData, "SelloRojo/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/get_components", "Componentes", "");
                        }

                    }
                    else {
                        oThis.getOwnerComponent().openHelloDialog("No se recibio informaci�n");
                    }

                    sap.ui.core.BusyIndicator.hide();

                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud a fallado: Hay conexi�n de red?");
                    }
                    sap.ui.core.BusyIndicator.hide();
                });

        },

        /****************************** END COMPONENT ****************************************/

        /****************************** START NOTIFICATION ***************************************/

        onOpenDialogAddNotification: function (oEvent) {
            var oItem, oCtx,
                oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                oView = this.getView(),
                oDialog = oView.byId("PMNotificationDialog");

            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.view.PMNotification", this);
                oView.addDependent(oDialog);
            }
            var oData = {},
                oInputDesc = oView.byId('inputDescOperation'),
                oAData = {
                    "PLANTA": oCtx.getProperty("plant"),
                    "PLANT": oCtx.getProperty("plant"),
                };

            oInputDesc.setValue(oCtx.getProperty("description"));
            oView.byId('start_date').setValue('');
            oView.byId('end_date').setValue('');
            oView.byId('NOTI').setSelected(false);

            this._base_onloadCOMBO("listPMDesviacion", oData, "SelloRojo/DatosMaestros/Mantenimiento/Desviaciones/Transaction/get_desv", "Desviaciones");
            this._base_onloadCOMBO("workCenter_list", oAData, "SelloRojo/DatosMaestros/Produccion/CentroTrabajo/Transaction/get_workCenter", oCtx.getProperty("work_center"), "Centro Trabajo");

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
                oComboWorkCenter = this.byId('workCenter_list'),
                num_nomina = "",
                checkNoti = this.byId("NOTI"),
                NOTI = '';

            if (checkNoti.getSelected() == true)
                NOTI = 'X';
            else
                NOTI = '';

            if (descOperation.getValue() == '') {
                this.getOwnerComponent().openHelloDialog("Ingresa una descripcion");
            }
            else if (start_date.getValue() == '') {
                this.getOwnerComponent().openHelloDialog("Ingresa una fecha de inicio");
            }
            else if (end_date.getValue() == '') {
                this.getOwnerComponent().openHelloDialog("Ingresa una fecha de termino");
            }
            else if (oComboWorkCenter.getSelectedKey() == '') {
                this.getOwnerComponent().openHelloDialog("Selecciona un puesto de trabajo");
            }
            else {
                this.onCloseDialogAddNotification();

                var oItem, oCtx;
                oItem = oEvent.getSource();
                oCtx = oItem.getBindingContext();
                var oData = {
                    "DESCRIPCION": descOperation.getValue(),
                    "ORDER": oCtx.getProperty("order"),
                    "OPERATION": oCtx.getProperty("activity"),
                    "PLANT": oCtx.getProperty("plant"),
                    "WORK_CENTER": oComboWorkCenter.getSelectedKey(),
                    "DEV_REASON": devReason_list.getSelectedKey(),
                    "START_DATE": start_date.getValue(),
                    "END_DATE": end_date.getValue(),
                    "ACTIVITY_TYPE": oCtx.getProperty("acttype"),
                    "NOTI": NOTI
                };
                console.log(oData);
                this.createNotification(oData, 'SelloRojo/DatosTransaccionales/Mantenimiento/Orden/Notificar/Transaction/notification');
            }

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
                    console.log(opElement);
                    if (opElement.firstChild != null) {
                        var aData = JSON.parse(opElement.firstChild.data);
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
                            oThis._base_onloadHeader(oData, "SelloRojo/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/get_operation", "Cabecera");
                        }

                    }
                    else {
                        oThis.getOwnerComponent().openHelloDialog("No se recibio informaci�n");
                    }

                    sap.ui.core.BusyIndicator.hide();

                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud a fallado: Hay conexi�n de red?");
                    }
                    sap.ui.core.BusyIndicator.hide();
                });

        },

        /****************************** END NOTIFICATION ****************************************/

        /****************************** START CONSUMPTION ****************************************/

        onOpenDialogAddConsumption: function (oEvent) {

            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();

            var items = this.getView().byId("PMComponentList").getItems();
            var xml_completo = '<Rowsets>\n';
            xml_completo += '<Rowset>\n';
            items.forEach(function (item) {
                if (item.getCells()[9].getBindingContext().getProperty("quantity_consumption") != "" && item.getCells()[9].getBindingContext().getProperty("quantity_consumption") != 0 && item.getCells()[9].getBindingContext().getProperty("quantity_consumption") != undefined) {
                    xml_completo += '<Row>\n';
                    xml_completo += '<RESERV_NO>' + item.getCells()[0].getProperty("text") + '</RESERV_NO>\n';
                    xml_completo += '<RES_ITEM>' + item.getCells()[1].getProperty("text") + '</RES_ITEM>\n';
                    xml_completo += '<MATERIAL>' + item.getCells()[3].getProperty("text") + '</MATERIAL>\n';
                    xml_completo += '<STGE_LOC>' + item.getCells()[7].getProperty("text") + '</STGE_LOC>\n';
                    xml_completo += '<PLANT>' + item.getCells()[8].getProperty("text") + '</PLANT>\n';
                    xml_completo += '<QUANTITY>' + item.getCells()[9].getBindingContext().getProperty("quantity_consumption") + '</QUANTITY>\n';
                    xml_completo += '<ORDER>' + oCtx.getProperty("order") + '</ORDER>\n';
                    xml_completo += '<OPERATION>' + oCtx.getProperty("activity") + '</OPERATION>\n';
                    xml_completo += "</Row>\n";
                }
            });
            xml_completo += "</Rowset>\n";
            xml_completo += "</Rowsets>\n";

            var oData = {
                "GOODS_ISSUES": xml_completo
            }

            this.createConsumption(oData, 'SelloRojo/DatosTransaccionales/Mantenimiento/Orden/Consumos/Transaction/consumption');
        },

        createConsumption: function (oData, path) {

            var uri = "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Runner?Transaction=" + path + "&OutputParameter=JsonOutput&Content-Type=text/xml"
            uri = uri.replace(/\s+/g, '');

            var oThis = this;

            sap.ui.core.BusyIndicator.show(0);

            $.ajax({
                type: "POST",
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
                                "ORDER": aData[0].object
                            }
                            oThis._base_onloadTable("PMComponentList", oData, "SelloRojo/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/get_components", "Componentes", "");
                        }

                    }
                    else {
                        oThis.getOwnerComponent().openHelloDialog("No se recibio informaci�n");
                    }

                    sap.ui.core.BusyIndicator.hide();

                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud a fallado: Hay conexi�n de red?");
                    }
                    sap.ui.core.BusyIndicator.hide();
                });

        },

        /****************************** END CONSUMPTION ****************************************/

    });
}
);