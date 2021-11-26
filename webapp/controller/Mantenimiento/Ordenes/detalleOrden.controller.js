sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/json/JSONModel'

], function (JQuery, BaseController, MessageToast, MessageBox, JSONModel) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.Mantenimiento.Ordenes.detalleOrden", {
        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("detalleOrdenPM").attachMatched(this._onRouteMatched, this);            
        },

        _onRouteMatched: function (oEvent) {
            this._getUsuario("username");
            var oArgs, oView;
            oArgs = oEvent.getParameter("arguments");
            oView = this.getView();   

            var oTable = oView.byId("PMOperationList");
            var oModel_empty = new sap.ui.model.json.JSONModel();
            oModel_empty.setData({});
            oTable.setModel(oModel_empty);

            oView.bindElement({
                path: "/"
            });

            var aData = {
                "ORDER": oArgs.id
            };

            this._base_onloadHeader(aData, "GIM/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/visualizar_orden","Cabecera");
            this._base_onloadTable('PMOperationList', aData, 'GIM/DatosTransaccionales/Mantenimiento/Orden/Cabecera/Transaction/get_operations',"Operaciones","");
        },

        onOpenDialogAddOperation : function (oEvent) {
            var oView = this.getView();
            var oDialog = oView.byId("AddOperationDialog");
            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.PMOperationMod", this);
                oView.addDependent(oDialog);
            }
            var
                oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                oData = {
                    "PLANT": oCtx.getProperty("plant")
                };

            oView.byId('inputDescOperation').setValue('');
            oView.byId('inputWorkOperation').setValue('');

            this._base_onloadCOMBO("workCenter_list", oData, "GIM/DatosMaestros/Produccion/CentroTrabajo/Transaction/get_workCenter", oCtx.getProperty("work_center"), "Centro Trabajo");

            oDialog.open();
        },

        onOpenDialogCloseOrder: function (oEvent) {
            var oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                order = oCtx.getProperty("order"),
                resourceModel = this.getView().getModel("i18n"),
                oData = {
                    "ORDER": order
                };

            this._handleMessageBoxOpen(resourceModel.getResourceBundle().getText("MessageConfirmCTEC"), "warning", oData, this);
        },

        _handleMessageBoxOpen: function (sMessage, sMessageBoxType, oData, oThis) {
            MessageBox[sMessageBoxType](sMessage, {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        oThis.changeOrderStatus(oData, 'GIM/DatosTransaccionales/Mantenimiento/Orden/Cerrar/Transaction/cerrar_orden');
                    }
                }.bind(this)
            });
        },

        onCloseDialogAddOperation: function () {
            this.getView().byId("AddOperationDialog").close();
        },

        onCloseDialogAddOperationConfirm: function (oEvent) {
            var descOperation = this.byId('inputDescOperation');
            var work = this.byId('inputWorkOperation');
            var workCenter_list = this.byId('workCenter_list');
            

            if (descOperation.getValue() == '')
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
                    "DESCRIPTION": descOperation.getValue(),
                    "ORDER": oCtx.getProperty("order"),
                    "WORK_CENTER": workCenter_list.getSelectedKey(),
                    "WORK": work.getValue(),
                    "PLANT": oCtx.getProperty("plant")
                };
                console.log(oData);
                this.createPMOperation('PMOrderOperation', oData, 'GIM/DatosTransaccionales/Mantenimiento/Orden/Crear/Transaction/add_operation');
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
                            var xData = {
                                "ORDER": aData[0].object
                            };
                            oThis._base_onloadTable('PMOperationList', xData, 'GIM/DatosTransaccionales/Mantenimiento/Orden/Cabecera/Transaction/get_operations', "Operaciones", "");
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
            this.changeOrderStatus(oData, 'GIM/DatosTransaccionales/Mantenimiento/Orden/Liberar/Transaction/liberar_orden');
        },

        onPMOrderOperation: function (oEvent) {            
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            
            this.getRouter().navTo("detalleOperacionPM", {
                order: oCtx.getProperty("order"),
                activity: oCtx.getProperty("operation"),
                plant: oCtx.getProperty('plant')
            });        
        },

        onShowNoti: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            this.getRouter().navTo("avisoDetalle", {
                id: oCtx.getProperty("notification")
            });

        },

        onOpenDialog: function () {
            this.getOwnerComponent().openHelloDialog();
        },

        /********************************************* START CHANGE ORDER STATUS **********************************************/

        onOpenDialogAcceptWork: function () {
            var oView = this.getView(),
                resourceModel = this.getView().getModel("i18n"),
                oData = {
                    "ORDER": oView.getModel().getProperty('/order'),
                    "STATUS": "ACEP"
                };            
            this._MessageBoxChangeOrderEstatus(resourceModel.getResourceBundle().getText("PMChageUserStatus.confirm"), "warning", oData, this);
        },

        _MessageBoxChangeOrderEstatus: function (sMessage, sMessageBoxType, oData, oThis) {
            MessageBox[sMessageBoxType](sMessage, {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        oThis.changeOrderStatus(oData, 'GIM/DatosTransaccionales/Mantenimiento/Orden/Estatus/Transaction/user_status');
                    }
                }.bind(this)
            });
        },

        /********************************************* END CHANGE ORDER STATUS ************************************************/

        changeOrderStatus: function (oData, path) {

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
                            var xData = {
                                "ORDER": aData[0].object
                            };

                            oThis._base_onloadHeader(xData, "GIM/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/visualizar_orden", "Cabecera");
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

        }

    });
}
);