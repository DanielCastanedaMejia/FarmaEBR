sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/json/JSONModel',
    "sap/ui/demo/webapp/model/formatter"

], function (JQuery, BaseController, MessageToast, MessageBox, JSONModel, formatter) {
    "use strict";

    var plant_gb = '';

    return BaseController.extend("sap.ui.demo.webapp.controller.PP.Visualization.Operation", {

        formatter: formatter,

        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("operationDetail").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var
                oArgs = oEvent.getParameter("arguments"),
                oView = this.getView();

            var aData = {
                "NUM_ORDEN": oArgs.orden,
                "OPERACION": oArgs.operacion
            };

            this.byId("PMComponentList").setModel(this.getOwnerComponent().getModel("componentsModel"));
            //this._base_onloadTable2("PMComponentList", aData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/components_raiz", "Componentes", "");
            this.byId("PMMAFList").setModel(this.getOwnerComponent().getModel("mafModel"));
            //this._base_onloadTable("PMMAFList", aData, "GIM/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/maf_operation_BD", "MAF", "");

            var oMasterModel = this.getOwnerComponent().getModel("masterModel"),
                oHeadModel = this.getOwnerComponent().getModel("headModel"),
                oOrderModel = this.getOwnerComponent().getModel("ordersModel"),
                oOpeModel = this.getOwnerComponent().getModel("fasesModel"),
                sOrderPath = oMasterModel.getProperty("/selectedOrder"),
                sOpePath = oMasterModel.getProperty("/selectedFase"),
                iDone = oOpeModel.getProperty(sOpePath + "/producido"),
                iLeft, fDone;

            const sOrder = oOrderModel.getProperty(sOrderPath + "/NUM_ORDEN"),
                iQty = oOrderModel.getProperty(sOrderPath + "/CANTIDAD_PROGRAMADA"),
                sOpe = oOpeModel.getProperty(sOpePath + "/Ope");

            fDone = (iDone / iQty) * 100;
            iLeft = iQty - iDone;
            var model = {
                "FALTANTE": iLeft,
                "PRODUCIDO": iDone,
                "ORDEN": sOrder,
                "OPERACION": sOpe,
                "AVANCE": fDone,
                "PROGRAMADO": iQty
            };

            var newModel = new JSONModel(model);

            this.getView().setModel(newModel);
            //this._base_onloadHeader(aData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/operation_header", "Cabecera");

            var columns = {
                columns: [{
                    Column: "Res no",
                    Visible: 0
                },
                {
                    Column: "Res Item",
                    Visible: 0
                },
                {
                    Column: "Codigo",
                    Visible: 1
                },
                {
                    Column: "Material",
                    Visible: 1
                },
                {
                    Column: "Planta",
                    Visible: 1
                },
                {
                    Column: "Almacen",
                    Visible: 1
                },
                {
                    Column: "Lote",
                    Visible: 1
                },
                {
                    Column: "Cantidad",
                    Visible: 1
                },
                {
                    Column: "UM",
                    Visible: 1
                },
                {
                    Column: "Mov",
                    Visible: 0
                }
                ]
            };

            this._setColumns(columns, "columnList", "PMComponentList");
        },

        onCloseDialogHideColumns: function () {
            this.getView().byId("hideColumns_fragment").close();
        },

        /****************************** START NOTIFICATION ***************************************/

        onOpenDialogAddNotification: function (oEvent) {
            var
                oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                oView = this.getView(),
                oDialog = oView.byId("addNotificationDialog"),
                oData = {
                    "NUM_ORDEN": oView.getModel().getProperty('/ORDEN'),
                    "OPERACION": oView.getModel().getProperty('/OPERACION')
                };

            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.addNotification", this);
                oView.addDependent(oDialog);
            }
            var sPath = this._getMasterModel("/selectedOrder"),
                oModel = this.getOwnerComponent().getModel("ordersModel"),
                sId = oModel.getProperty(sPath + "/NUM_ORDEN"),
                sDesc = oModel.getProperty(sPath + "/DESC_MATERIAL"),
                sLote = oModel.getProperty(sPath + "/LOTE"),
                oProdData = new JSONModel({
                    "id": sId,
                    "desc": sDesc
                });

            oView.byId('inputQuantity').setValue('');
            oView.byId('inputBatch').setValue(sLote);
            //this.byId("mov_101").setModel(oProdData, "orderModel");
            oView.setModel(oProdData, "orderModel");

            //this._base_onloadCOMBO("mov_101", oData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/get_101", " ", "Materiales notificar");
            oDialog.open();
        },

        onOpenDialogAdd: function (oEvent) {
            var
                oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                oView = this.getView(),
                oDialogAdd = oView.byId("addRowsMaterials");

            const oMatModel = this.getOwnerComponent().getModel("materialModel"),
                oNewModel = new JSONModel(oMatModel.getProperty("/items"));

            if (!oDialogAdd) {
                oDialogAdd = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.addMaterials", this);
                oView.addDependent(oDialogAdd);
            }

            oDialogAdd.open();
            this.byId("Material_select").setModel(oNewModel);
            //this._base_onloadCOMBO("Material_select", "", "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/materiales_sel", " ", "Materiales agregar");

        },
        addMaterials: function (oEvent) {
            var oTableConsumo = this.byId("PMComponentList");
            var Json_Rows;
            Json_Rows = {
                "RES_NUMBER": "",
                "RES_ITEM": "",
                "MATERIAL": this.getView().byId("Material_select").getSelectedKey(),
                "DESC_MATERIAL": this.getView().byId("Material_select").getSelectedItem().getText(),
                "PLANTA": '1710',
                "ALMACEN": '171C',
                "LOTE": "",
                "ETIQUETA": "",
                "CANTIDAD": "",
                "UM": this.getView().byId("Material_select").getSelectedItem().getAdditionalText(),
                "MOVE_TYPE": '261'
            }

            var oModel = oTableConsumo.getModel();
            var oModelData = oModel.getProperty("/");
            oModelData.push(Json_Rows);
            console.log(oModelData);
            oModel.setProperty("/", oModelData);
            this.onCloseOpenDialogAdd();

        },
        onCloseOpenDialogAdd: function () {
            this.getView().byId("addRowsMaterials").close();
        },
        onDeleteRow: function (oEvent) {
            var oTableConsumo = this.byId("PMComponentList");

            var oTableData = oTableConsumo.getModel().getData();
            var aContexts = oTableConsumo.getSelectedContexts();
            for (var i = aContexts.length - 1; i >= 0; i--) {
                var oThisObj = aContexts[i].getObject();
                var index = $.map(oTableData, function (obj, index) {
                    if (obj === oThisObj) {
                        return index;
                    }
                })
                oTableData.splice(index, 1);
            }

            oTableConsumo.getModel().setData(oTableData);
            oTableConsumo.removeSelections(true);
        },

        onCloseDialogAddNotification: function () {
            this.getView().byId("addNotificationDialog").close();
        },

        onCloseDialogSendTime: function () {
            this.getView().byId("PPTimeDialog").close();
        },

        onCloseDialogInstallMaf: function () {
            this.getView().byId("installMAF").close();
        },

        onSelectionChange: function (oEvent) {
            this._selectionColumn(oEvent, "PMComponentList");
        },

        onConfirmDialogAddNotification: function (oEvent) {
            var
                material = this.byId("mov_101"),
                cantidad = this.byId("inputQuantity"),
                lote = this.byId("inputBatch"),
                oView = this.getView();


            if (material.getSelectedKey() === " ")
                this.getOwnerComponent().openHelloDialog("Selecciona un material");
            else if (cantidad.getValue() === '0' || cantidad.getValue() === '')
                this.getOwnerComponent().openHelloDialog("Ingresa una cantidad válida");
            else {

                var sDate = Date(),
                    oData = {
                        "date": sDate,
                        "MATERIAL": material.getSelectedKey(),
                        //"MOV": material.getSelectedItem().getAdditionalText(),
                        "CANTIDAD": cantidad.getValue(),
                        "NUM_ORDEN": oView.getModel().getProperty('/ORDEN'),
                        "OPERACION": oView.getModel().getProperty('/OPERACION'),
                        "LOTE": lote.getValue()
                    };

                var oModel = this.getOwnerComponent().getModel("notifyProd"),
                    oOpeModel = this.getOwnerComponent().getModel("fasesModel"),
                    oOrderModel = this.getOwnerComponent().getModel("ordersModel"),
                    oHeadModel = this.getOwnerComponent().getModel("headModel"),
                    sPath = this._getMasterModel("/selectedFase"),
                    sOrderPath = this._getMasterModel("/selectedOrder"),
                    iDone = oOpeModel.getProperty(sPath + "/producido"),
                    aData = oModel.getProperty("/items"),
                    iQty = oOrderModel.getProperty(sOrderPath + "/CANTIDAD_PROGRAMADA"),
                    fDone, iLeft;

                aData.push(oData);
                iDone += parseInt(oData.CANTIDAD);
                oOpeModel.setProperty(sPath + "/producido", iDone);
                oView.getModel().setProperty("/PRODUCIDO", iDone);

                fDone = (iDone / iQty) * 100;
                fDone = fDone.toFixed(2);

                oOpeModel.setProperty(sPath + "/avance", fDone);
                oView.getModel().setProperty("/AVANCE", fDone);

                iLeft = iQty - iDone;

                oView.getModel().setProperty("/FALTANTE", iLeft)

                //this.createNotification(oData, 'FARMA/DatosTransaccionales/Produccion/Ordenes/Notificar/Transaction/mov_101');
                this.onCloseDialogAddNotification();
                this.checkRemaining(iLeft);
            }

        },

        checkRemaining: function (iLeft) {
            if (!iLeft) {
                const oThis = this,
                    oViewModel = this.getView().getModel(),
                    sOpePath = this._getMasterModel("/selectedFase"),
                    oOpeModel = this.getOwnerComponent().getModel("fasesModel"),
                    oOpeData = oOpeModel.getProperty("/ITEMS"),
                    iLastItem = oOpeData.length,
                    sOrden = oViewModel.getProperty("/ORDEN");

                var sOpeIndex = sOpePath.split("/"),
                    iCurrentItem = parseInt(sOpeIndex[sOpeIndex.length - 1]) + 1;

                if (iLastItem > iCurrentItem) {
                    MessageBox.confirm("¿Continuar a la siguiente fase?", {
                        title: "Fase finalizada",
                        initialFocus: sap.m.MessageBox.Action.OK,
                        onClose: function (sButton) {
                            if (sButton === MessageBox.Action.OK) {
                                sOpeIndex[sOpeIndex.length - 1] = iCurrentItem;
                                sOpeIndex = sOpeIndex.join("/");
                                oThis._setMasterModel("/selectedFase", sOpeIndex);
                                oThis.getRouter().navTo("operationDetail", {
                                    orden: sOrden,
                                    operacion: oOpeData[iCurrentItem].Ope
                                }, true /* no history*/);
                                return;
                            }
                        }
                    });
                } else {
                    MessageBox.confirm("¿Desea regresar a los detalles de la orden?", {
                        title: "Fase finalizada",
                        initialFocus: sap.m.MessageBox.Action.OK,
                        onClose: function (sButton) {
                            if (sButton === MessageBox.Action.OK) {
                                oThis.getRouter().navTo("orderDetail", {
                                    orden: sOrden
                                }, true);
                            }
                        }
                    });
                }
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
                    if (opElement.firstChild !== null) {
                        var aData = JSON.parse(opElement.firstChild.data);
                        if (aData[0].error !== undefined) {
                            oThis.getOwnerComponent().openHelloDialog(aData[0].error);
                        } else {
                            oThis.getOwnerComponent().openHelloDialog(aData[0].message);
                        }

                    } else {
                        oThis.getOwnerComponent().openHelloDialog("No se recibio informacion");
                    }

                    sap.ui.core.BusyIndicator.hide();

                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud a fallado: Hay conexion de red?");
                    }
                    sap.ui.core.BusyIndicator.hide();
                });
        },

        /****************************** END NOTIFICATION ****************************************/

        /****************************** START CONSUMPTION ****************************************/

        handleValueHelp: function (oEvent) {

            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();

            var oData = {
                "MATERIAL": oCtx.getProperty("MATERIAL"),
                "PLANT": oCtx.getProperty("PLANTA"),
                "STORAGE": oCtx.getProperty("ALMACEN")
            };
            var sInputValue = oEvent.getSource().getValue();

            this.inputId = oEvent.getSource().getId();

            this.onloadBatch(oData, 'FARMA/DatosMaestros/Inventario/Transaction/get_stock', "lotes");

            // create value help dialog
            if (!this._valueHelpDialog) {

                this._valueHelpDialog = sap.ui.xmlfragment(
                    "sap.ui.demo.webapp.fragment.PPBatchSelection",
                    this
                );
                this.getView().addDependent(this._valueHelpDialog);
            }

            // open value help dialog filtered by the input value
            this._valueHelpDialog.open(sInputValue);

        },

        onloadBatch: function (oData, path, name) {
            var uri = "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Runner?Transaction=" + path + "&OutputParameter=JsonOutput&Content-Type=text/xml"
            uri = uri.replace(/\s+/g, '');

            this.getView().getModel().setProperty("/componentes/lotes", {});

            var oView = this;
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
                        var aData = JSON.parse(opElement.firstChild.data);
                        if (aData !== undefined) {
                            if (aData.error !== undefined) {
                                oThis.getOwnerComponent().openHelloDialog(aData.error);
                            } else {
                                //Create  the JSON model and set the data                                                                                                
                                var oModel = new sap.ui.model.json.JSONModel();
                                oModel.setData(aData);
                                // Assign the model object to the SAPUI5 core
                                //oThis.getView().setModel(oModel);
                                oThis.getView().getModel().setProperty("/componentes", aData);
                            }
                        } else {
                            MessageToast.show("No se han recibido " + name);
                        }
                    } else {
                        MessageToast.show("No se han recibido datos");
                    }

                    sap.ui.core.BusyIndicator.hide();

                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud a fallado: \u00BFHay conexi\u00F3n de red??");
                    }
                    sap.ui.core.BusyIndicator.hide();
                });
        },

        _handleValueHelpSearch: function (evt) {

            var sValue = evt.getParameter("value");
            var oFilter = new Filter(
                "batch",
                sap.ui.model.FilterOperator.Contains, sValue
            );
            evt.getSource().getBinding("items").filter([oFilter]);

        },

        _handleValueHelpClose: function (evt) {

            var oSelectedItem = evt.getParameter("selectedItem");
            if (oSelectedItem) {
                var productInput = this.byId(this.inputId),
                    row = this.byId(this.inputId).getParent();

                productInput.setValue(oSelectedItem.getTitle());
                row.getCells()[7].setValue(parseFloat(oSelectedItem.getDescription()));
            }
            evt.getSource().getBinding("items").filter([]);
        },

        onAddConsumption: function (oEvent) {

            var
                oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                resourceModel = this.getView().getModel("i18n"),
                items = this.getView().byId("PMComponentList").getSelectedItems(),
                xml_completo = '<Rowsets>\n',
                oView = this.getView(),
                flag_send = 0,
                oThis = this,
                oContext = this.byId("PMComponentList").getSelectedItem().getBindingContext(),
                sPath = oContext.getPath(),
                iQty = oContext.getModel().getProperty(sPath + "/CANTIDAD");

            if (!iQty) {
                MessageToast.show("Ingrese la cantidad a consumir");
                return;
            }

            if (items.length > 0) {
                xml_completo += '<Rowset>\n';
                items.forEach(function (item) {
                    xml_completo += '<Row>\n';
                    xml_completo += '<RES_NUMBER>' + item.getCells()[0].getText() + '</RES_NUMBER>\n';
                    xml_completo += '<RES_ITEM>' + item.getCells()[1].getText() + '</RES_ITEM>\n';
                    xml_completo += '<ORDER>' + oView.getModel().getProperty('/ORDEN') + '</ORDER>\n';
                    xml_completo += '<OPERATION>' + oView.getModel().getProperty('/OPERACION') + '</OPERATION>\n';
                    xml_completo += '<MATERIAL>' + item.getCells()[2].getText() + '</MATERIAL>\n';
                    xml_completo += '<DESC_MATERIAL>' + item.getCells()[3].getText() + '</DESC_MATERIAL>\n';
                    xml_completo += '<QUANTITY>' + item.getCells()[8].getValue() + '</QUANTITY>\n';
                    xml_completo += '<BATCH>' + item.getCells()[6].getValue() + '</BATCH>\n';
                    xml_completo += '<STORAGE>' + item.getCells()[5].getText() + '</STORAGE>\n';
                    xml_completo += '<PLANT>' + item.getCells()[4].getText() + '</PLANT>\n';
                    xml_completo += '<MOVEMENT>' + '261' + '</MOVEMENT>\n';
                    xml_completo += '<UM>' + item.getCells()[9].getText() + '</UM>\n';
                    xml_completo += "</Row>\n";
                });
                xml_completo += "</Rowset>\n";
                xml_completo += "</Rowsets>\n";

                if (!flag_send) {
                    var oData = {
                        "RECORDS": xml_completo
                    };
                    this._handleMessageBoxOpenConsumption(resourceModel.getResourceBundle().getText("message.consumptionConfirm"), "warning", oData, this);

                }

            } else {
                this.getOwnerComponent().openHelloDialog(resourceModel.getResourceBundle().getText("message.consumptionempty"));
            }
        },

        _handleMessageBoxOpenConsumption: function (sMessage, sMessageBoxType, oData, oThis) {
            MessageBox[sMessageBoxType](sMessage, {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {

                        const oSelected = this.byId("PMComponentList").getSelectedItem(),
                            oContext = oSelected.getBindingContext(),
                            oModel = oContext.getModel(),
                            sPath = oContext.getPath();
                        var iQty = oModel.getProperty(sPath + "/CANTIDAD"),
                            sId = oModel.getProperty(sPath + "/MATERIAL"),
                            sDesc = oModel.getProperty(sPath + "/DESC_MATERIAL"),
                            sUm = oModel.getProperty(sPath + "/UM"),
                            oConsModel = this.getOwnerComponent().getModel("consumeModel"),
                            iConsLength = oConsModel.getProperty("/items").length,
                            aConsData = oConsModel.getProperty("/items"),
                            sDate = Date();

                        iQty = parseInt(iQty);

                        var oNewModel = {
                            "id": sId,
                            "desc": sDesc,
                            "um": sUm,
                            "qty": iQty,
                            "date": sDate
                        };
                        for (var i = 0; i < iConsLength; i++) {
                            if (oConsModel.getProperty("/items/" + i + "/id") == sId) {
                                iQty += parseInt(oConsModel.getProperty("/items/" + i + "/qty"));
                                oConsModel.setProperty("/items/" + i + "/qty", iQty);
                                return;
                            }
                        }
                        if (i == iConsLength) {
                            aConsData.push(oNewModel);
                            oConsModel.setProperty("/items", aConsData);
                        }
                        this.onDeleteRow();
                        MessageToast.show("Material consumido");


                        //oThis.createConsumption(oData, 'FARMA/DatosTransaccionales/Produccion/Ordenes/Notificar/Transaction/mov_261');
                    }
                }.bind(this)
            });
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
                        } else {
                            //Create  the JSON model and set the data                                                                                                                            
                            oThis.getOwnerComponent().openHelloDialog(aData[0].message);
                            var oView = oThis.getView(),
                                xData = {
                                    "NUM_ORDEN": oView.getModel().getProperty('/ORDEN'),
                                    "OPERACION": oView.getModel().getProperty('/OPERACION')
                                };
                            oThis._base_onloadTable2("PMComponentList", xData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/components_raiz", "Componentes", "");
                        }

                    } else {
                        oThis.getOwnerComponent().openHelloDialog("No se recibio informacion");
                    }

                    sap.ui.core.BusyIndicator.hide();

                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud a fallado: Hay conexion de red?");
                    }
                    sap.ui.core.BusyIndicator.hide();
                });

        },

        /****************************** END CONSUMPTION ****************************************/

        /****************************** START MANAGE MAF **************************************/

        onOpenModalInstall: function (oEvent) {
            var
                oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                oView = this.getView(),
                oDialog = oView.byId("installMAF");

            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.installMaf", this);
                oView.addDependent(oDialog);
            }

            var oData = {};
            this._base_onloadTable("List_MafAvailable", oData, "GIM/DatosTransaccionales/Mantenimiento/Reportes/Transaction/maf_disponible", "MAF", "");

            oDialog.open();
        },

        onInstallMaf: function (oEvent) {

            var
                oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                resourceModel = this.getView().getModel("i18n"),
                items = this.getView().byId("List_MafAvailable").getSelectedItems(),
                xml_completo = '<Rowsets>\n',
                oView = this.getView(),
                flag_send = 0,
                oThis = this;

            if (items.length > 0) {
                xml_completo += '<Rowset>\n';
                items.forEach(function (item) {
                    xml_completo += '<Row>\n';
                    xml_completo += '<EQUI>' + item.getCells()[0].getText() + '</EQUI>\n';
                    xml_completo += '<ORDER>' + oView.getModel().getProperty('/ORDEN') + '</ORDER>\n';
                    xml_completo += '<OPERATION>' + oView.getModel().getProperty('/OPERACION') + '</OPERATION>\n';
                    xml_completo += "</Row>\n";
                });
                xml_completo += "</Rowset>\n";
                xml_completo += "</Rowsets>\n";

                if (!flag_send) {
                    var oData = {
                        "EQUIPOS": xml_completo
                    };
                    console.log(xml_completo);
                    this._handleMessageBoxInstallMaf(resourceModel.getResourceBundle().getText("message.installMafConfirm"), "warning", oData, this);

                }

            } else {
                this.getOwnerComponent().openHelloDialog(resourceModel.getResourceBundle().getText("message.installMafEmpty"));
            }
        },

        _handleMessageBoxInstallMaf: function (sMessage, sMessageBoxType, oData, oThis) {
            MessageBox[sMessageBoxType](sMessage, {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        oThis.installMaf(oData, 'GIM/DatosTransaccionales/Mantenimiento/MAF/Transaction/install_maf');
                    }
                }.bind(this)
            });
        },

        installMaf: function (oData, path) {

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
                        } else {
                            //Create  the JSON model and set the data                                                                                                                            
                            oThis.getOwnerComponent().openHelloDialog(aData[0].message);
                            var oView = oThis.getView(),
                                xData = {
                                    "NUM_ORDEN": oView.getModel().getProperty('/ORDEN'),
                                    "OPERACION": oView.getModel().getProperty('/OPERACION')
                                };
                            oThis._base_onloadTable("PMMAFList", xData, "GIM/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/maf_operation_BD", "MAF", "");
                            oThis.onCloseDialogInstallMaf();
                        }

                    } else {
                        oThis.getOwnerComponent().openHelloDialog("No se recibio informacion");
                    }

                    sap.ui.core.BusyIndicator.hide();

                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud a fallado: Hay conexion de red?");
                    }
                    sap.ui.core.BusyIndicator.hide();
                });

        },

        onCheckMAFInstall: function (oEvent) {

            var
                oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                resourceModel = this.getView().getModel("i18n"),
                items = this.getView().byId("PMMAFList").getSelectedItems(),
                xml_completo = '<Rowsets>\n',
                oView = this.getView(),
                flag_send = 0,
                oThis = this;

            if (items.length > 0) {
                xml_completo += '<Rowset>\n';
                items.forEach(function (item) {
                    xml_completo += '<Row>\n';
                    xml_completo += '<EQUI>' + item.getCells()[0].getText() + '</EQUI>\n';
                    xml_completo += '<ORDER>' + oView.getModel().getProperty('/ORDEN') + '</ORDER>\n';
                    xml_completo += '<OPERATION>' + oView.getModel().getProperty('/OPERACION') + '</OPERATION>\n';
                    xml_completo += "</Row>\n";
                });
                xml_completo += "</Rowset>\n";
                xml_completo += "</Rowsets>\n";

                if (!flag_send) {
                    var oData = {
                        "EQUIPOS": xml_completo
                    };
                    console.log(xml_completo);
                    this._handleMessageBoxDesinstallMaf(resourceModel.getResourceBundle().getText("message.desinstallMafConfirm"), "warning", oData, this);

                }

            } else {
                this.getOwnerComponent().openHelloDialog(resourceModel.getResourceBundle().getText("message.installMafEmpty"));
            }
        },

        _handleMessageBoxDesinstallMaf: function (sMessage, sMessageBoxType, oData, oThis) {
            MessageBox[sMessageBoxType](sMessage, {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        oThis.desinstallMaf(oData, 'GIM/DatosTransaccionales/Mantenimiento/MAF/Transaction/desinstall_maf');
                    }
                }.bind(this)
            });
        },

        desinstallMaf: function (oData, path) {

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
                        } else {
                            //Create  the JSON model and set the data                                                                                                                            
                            oThis.getOwnerComponent().openHelloDialog(aData[0].message);
                            var oView = oThis.getView(),
                                xData = {
                                    "NUM_ORDEN": oView.getModel().getProperty('/ORDEN'),
                                    "OPERACION": oView.getModel().getProperty('/OPERACION')
                                };
                            oThis._base_onloadTable("PMMAFList", aData, "GIM/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/maf_operation_BD", "MAF", "");
                        }

                    } else {
                        oThis.getOwnerComponent().openHelloDialog("No se recibio informacion");
                    }

                    sap.ui.core.BusyIndicator.hide();

                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud a fallado: Hay conexion de red?");
                    }
                    sap.ui.core.BusyIndicator.hide();
                });

        },
        /****************************** END MANAGE MAF ***************************************/

        /****************************** START SEND TIME ****************************************/

        onOpenDialogSendTime: function (oEvent) {
            var
                oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                oView = this.getView(),
                oDialog = oView.byId("PPTimeDialog");

            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.sendTime", this);
                oView.addDependent(oDialog);
            }

            this.byId('start_date').setValue('');
            this.byId('end_date').setValue('');
            this.byId('yield').setValue('');
            this.byId('scrap').setValue('');

            oDialog.open();
        },

        onCloseDialogSendTimeConfirm: function (oEvent) {
            var fecha_inicio = this.byId('start_date').getValue(),
                fecha_fin = this.byId('end_date').getValue(),
                piezas_buenas = this.byId('yield').getValue(),
                piezas_malas = this.byId('scrap').getValue(),
                orden, operacion,
                oView = this.getView();

            if (fecha_inicio === '')
                this.getOwnerComponent().openHelloDialog("Selecciona fecha inicio");
            else if (fecha_fin === '')
                this.getOwnerComponent().openHelloDialog("Selecciona fecha fin");
            else if (piezas_buenas === '' && piezas_malas === '')
                this.getOwnerComponent().openHelloDialog("Ingresa piezas buenas o piezas malas");
            else {
                var oData = {
                    "FECHA_INICIO": fecha_inicio + ':00',
                    "FECHA_FIN": fecha_fin + ':00',
                    "CANTIDAD": piezas_buenas,
                    "SCRAP": piezas_malas,
                    "NUM_ORDEN": oView.getModel().getProperty('/ORDEN'),
                    "OPERACION": oView.getModel().getProperty('/OPERACION')
                };

                var oModel = this.getOwnerComponent().getModel("notifyTime"),
                    aData = oModel.getProperty("/times");

                aData.push(oData);

                //this.sendTime(oData, 'FARMA/DatosTransaccionales/Produccion/Ordenes/Notificar/Transaction/tiempos');
                // var aData = {
                //     "NUM_ORDEN": oView.getModel().getProperty('/ORDEN'),
                //     "OPERACION": oView.getModel().getProperty('/OPERACION')
                // };
                //this._base_onloadHeader(aData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/operation_header", "Cabecera");

                this.onCloseDialogSendTime();
            }
        },

        sendTime: function (oData, path) {
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
                    if (opElement.firstChild !== null) {
                        var aData = JSON.parse(opElement.firstChild.data);
                        if (aData[0].error !== undefined) {
                            oThis.getOwnerComponent().openHelloDialog(aData[0].error);
                        } else {
                            oThis.getOwnerComponent().openHelloDialog(aData[0].message);
                            var
                                oView = oThis.getView(),
                                xData = {
                                    "NUM_ORDEN": oView.getModel().getProperty('/ORDEN'),
                                    "OPERACION": oView.getModel().getProperty('/OPERACION')
                                };


                            oThis._base_onloadTable("PMMAFList", xData, "GIM/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/maf_operation_BD", "MAF", "");
                        }

                    } else {
                        oThis.getOwnerComponent().openHelloDialog("No se recibio informacion");
                    }

                    sap.ui.core.BusyIndicator.hide();

                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud a fallado: Hay conexion de red?");
                    }
                    sap.ui.core.BusyIndicator.hide();
                });
        },

        /****************************** END SEND TIME   ****************************************/

        onViewConsumption: function () {
            var
                oView = this.getView();

            this.getRouter().navTo("operationConsumption", {
                orden: oView.getModel().getProperty('/ORDEN'),
                operacion: oView.getModel().getProperty('/OPERACION')
            });
        },

        onViewNotification: function () {
            var
                oView = this.getView();

            this.getRouter().navTo("operationNotification", {
                orden: oView.getModel().getProperty('/ORDEN'),
                operacion: oView.getModel().getProperty('/OPERACION')
            });
        },

        onViewInventory: function () {
            var
                oView = this.getView();

            this.getRouter().navTo("viewInventory", {
                orden: oView.getModel().getProperty('/ORDEN'),
                operacion: oView.getModel().getProperty('/OPERACION')
            });
        },
        onQA: function () {
            var
                oView = this.getView();

            this.getRouter().navTo("QA", {
                orden: "001",
                operacion: "010"
            });
        },
        onQtyChange: function (oEvent) {
            var val = Number(this.byId("inputQuantity").getValue());
            var max = Number(this.getView().getModel().getProperty("/FALTANTE"));
            if (val > max) {
                this.byId("inputQuantity").setValue(max);
            } else if (val < 0) {
                this.byId("inputQuantity").setValue("0")
            }
        }
    });
});