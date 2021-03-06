jQuery.sap.registerModulePath("root", "/XMII/CM/FARMA/WEB/");
jQuery.sap.require("sap.m.MessageBox")
jQuery.sap.require("sap.ui.core.util.Export")
jQuery.sap.require("sap.ui.core.util.ExportType")
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV")
sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator",
    "sap/ui/demo/webapp/model/formatter",
    "sap/ui/core/syncStyleClass",
    "sap/ui/model/json/JSONModel"
], function (JQuery, BaseController, MessageToast, MessageBox, Filter, FilterOperator, formatter, syncStyleClass, JSONModel) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.PP.Visualization.Orders", {

        formatter: formatter,

        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("viewPPOrders").attachMatched(this._onRouteMatched, this);

            var auxModel = this.getOwnerComponent().getModel("salesShare");
            this.getView().setModel(auxModel, "salesModel");
        },

        _onRouteMatched: function (oEvent) {
            var oArgs;
            oArgs = oEvent.getParameter("arguments");
            this.loadOrders(oArgs.plant);
            this.getView().byId("planta").setSelectedKey(oArgs.plant);
            var columns = {
                columns: [{
                        Column: "Orden",
                        Visible: 1
                    },
                    {
                        Column: "Material",
                        Visible: 1
                    },
                    {
                        Column: "Desc Material",
                        Visible: 1
                    },
                    {
                        Column: "Planta",
                        Visible: 1
                    },
                    {
                        Column: "Inicio Prog",
                        Visible: 1
                    },
                    {
                        Column: "Fin Prog",
                        Visible: 0
                    },
                    {
                        Column: "Tipo",
                        Visible: 0
                    },
                    {
                        Column: "Lote",
                        Visible: 1
                    },
                    {
                        Column: "Cant Prog",
                        Visible: 1
                    },
                    {
                        Column: "Estatus",
                        Visible: 1
                    }
                ]
            };

            this._setColumns(columns, "columnList", "PPOrders_list");
            console.log(sap.ui.getCore().getComponent( "webapp").getMetadata().getComponentName());

        },

        PPOrders_view: function () {

            var oKey = this.getView().byId("planta").getSelectedKey();
            this.getRouter().navTo("viewPPOrders", {
                plant: oKey
            }, true /*no history*/ );
            /*var oData = {
                "END_DATE": this.byId("end_date").getValue(),
                "PLANT": plant_gb,
                "START_DATE": this.byId("start_date").getValue()
            };
            
            this._base_onloadTable("PPOrders_list", oData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/sel_ordenes", "Ordenes", "IconTabBar_Orders");*/
            //this.byId("PPOrders_list").setModel(this.getOwnerComponent().getModel("filterDateOrdersModel"));            
            /*var plant = this.getView().byId("planta").getSelectedItem().getKey();
            this.loadOrders(plant);
            var columns = {
                columns: [{
                        Column: "Orden",
                        Visible: 1
                    },
                    {
                        Column: "Material",
                        Visible: 1
                    },
                    {
                        Column: "Desc Material",
                        Visible: 1
                    },
                    {
                        Column: "Planta",
                        Visible: 1
                    },
                    {
                        Column: "Inicio Prog",
                        Visible: 1
                    },
                    {
                        Column: "Fin Prog",
                        Visible: 0
                    },
                    {
                        Column: "Tipo",
                        Visible: 0
                    },
                    {
                        Column: "Lote",
                        Visible: 1
                    },
                    {
                        Column: "Cant Prog",
                        Visible: 1
                    },
                    {
                        Column: "Estatus",
                        Visible: 1
                    }
                ]
            };

            this._setColumns(columns, "columnList", "PPOrders_list");*/
        },
        loadOrders: function (plant) {
            var auxJSON = {
                "ITEMS": [{}]
            };
            var oModel = this.getOwnerComponent().getModel("ordersModel");
            var aModel = new JSONModel(auxJSON);
            var existeItem = false;
            var j = 0;
            for (var i = 0; i < oModel.oData.ITEMS.length; i++) {
                if (oModel.getProperty("/ITEMS/" + i + "/PLANTA") == plant) {
                    existeItem = true;
                    aModel.setProperty("/ITEMS/" + j++, oModel.getProperty("/ITEMS/" + i));
                }
            }
            //this.byId("PPOrders_list").setModel(this.getOwnerComponent().getModel("ordersModel"));
            if (existeItem)
                this.byId("PPOrders_list").setModel(aModel);
        },

        viewStartOrder: function (oEvent) {

            var oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                resourceModel = this.getView().getModel("i18n"),
                items = this.getView().byId("PPOrders_list").getSelectedItems(),
                oView = this.getView(),
                oThis = this,
                order, estatus;

            if (items.length > 0) {
                items.forEach(function (item) {
                    order = item.getCells()[0].getText();
                    estatus = item.getCells()[11].getText();
                });
            } else {
                this.getOwnerComponent().openHelloDialog(resourceModel.getResourceBundle().getText("message.consumptionempty"));
            }

            var oDialog = oView.byId("startOrderDialog");
            console.log(estatus, "ESTE ES EL ESTATUS");
            var oData = {
                "NUM_ORDEN": order,
            };
            console.log(oData);

            // create dialog lazily
            if (!oDialog) {
                if (estatus == "INICIADA") {
                    oThis.getOwnerComponent().openHelloDialog("La orden seleccionada ya se encuentra iniciada");
                } else if (estatus == "CERRADA") {
                    oThis.getOwnerComponent().openHelloDialog("No se puede iniciar una orden cerrada");
                } else {
                    //create dialog via fragment factory
                    oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.startOrderDialog", this);
                    oView.addDependent(oDialog);
                }
            }

            oView.byId('inputOrder').setValue(order);

            //this._base_onloadCOMBO("mov_101", oData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/get_101", " ", "Materiales notificar");
            oDialog.open();

            this._base_onloadCOMBO("listPrimario", oData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/sel_usu_prim", "", "Usuario Primario");
            this._base_onloadCOMBO("listSecundario", oData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/sel_usu_sec", "", "Usuario Secundario");
        },

        viewStopOrder: function (oEvent) {

            var oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                resourceModel = this.getView().getModel("i18n"),
                items = this.getView().byId("PPOrders_list").getSelectedItems(),
                oView = this.getView(),
                oThis = this,
                order;

            if (items.length > 0) {
                items.forEach(function (item) {
                    order = item.getCells()[0].getText();
                });
            } else {
                this.getOwnerComponent().openHelloDialog(resourceModel.getResourceBundle().getText("message.consumptionempty"));
            }

            var oDialog = oView.byId("stopOrderDialog");
            var oData = {
                "NUM_ORDEN": order,
            };
            console.log(oData);

            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.stopOrderDialog", this);
                oView.addDependent(oDialog);
            }

            oView.byId('inputOrder1').setValue(order);

            //this._base_onloadCOMBO("mov_101", oData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/get_101", " ", "Materiales notificar");
            oDialog.open();
        },

        onChangeStatusStart: function (oEvent) {
            var oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                oView = this.getView(),
                order = oView.byId('inputOrder').getValue(),
                usuprim = oView.byId('listPrimario').getValue(),
                ususec = oView.byId('listSecundario').getValue(),
                resourceModel = this.getView().getModel("i18n"),
                oData = {
                    "Param.1": order,
                    "Param.2": "INICIADA",
                    "Param.3": usuprim,
                    "Param.4": ususec
                };
            var uri = "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Illuminator?QueryTemplate=FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Query/upd_status&IsTesting=T&Content-Type=text/xml"
            uri = uri.replace(/\s+/g, '');
            var oThis = this;
            $.ajax({
                    type: "GET",
                    dataType: "xml",
                    cache: false,
                    url: uri,
                    data: oData
                })
                .done(function () {
                    console.log(oData);
                })
                .fail(function (jqXHR, textStatus, error9Thrown) {
                    if (console && console.log) {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud a fallado: Hay conexi??n de red?");
                    }
                });
            this.onCloseDialogAddNotification();
            //this.onOpenValidaciones(order);
            this.PPOrders_view();
        },

        onOpenValidaciones: function (order) {
            var oView = this.getView();
            var oDialog = oView.byId("dataStartOrderPerformActivities");
            var oData = {
                "NUM_ORDEN": order,
            };
            console.log(oData);

            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.StartOrderPerformActivities", this);
                oView.addDependent(oDialog);
            }
            oDialog.open();
        },

        callOpenDialogValida: function (oEvent) {
            var oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                resourceModel = this.getView().getModel("i18n"),
                items = this.getView().byId("PPOrders_list").getSelectedItems(),
                oView = this.getView(),
                oThis = this,
                order;


            if (items.length > 0) {
                items.forEach(function (item) {
                    order = item.getCells()[0].getText();
                });
            } else {
                this.getOwnerComponent().openHelloDialog(resourceModel.getResourceBundle().getText("message.consumptionempty"));
            }
            var oDialog = oView.byId("dataComponents");

            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.dataComponents", this);
                oView.addDependent(oDialog);
                var oData = {
                    "NUM_ORDEN": order
                };
                console.log(oData);
                this._base_onloadTable("PPComponents", oData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/components_get", "Componentes", "");

            }


            //this._base_onloadCOMBO("mov_101", oData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/get_101", " ", "Materiales notificar");
            oDialog.open();
        },

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
            }
            evt.getSource().getBinding("items").filter([]);
        },

        onSaveMaterial: function (oEvent) {
            var oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                resourceModel = this.getView().getModel("i18n"),
                items = this.getView().byId("PPComponents").getSelectedItems(),
                torden = this.getView().byId("PPOrders_list").getSelectedItems(),
                oView = this.getView(),
                oThis = this,
                orden, material, um, lote, etiqueta, estatus, bueno, proximo, desc_material, res_num, res_item, operacion;

            if (items.length > 0) {
                items.forEach(function (item) {
                    orden = item.getCells()[0].getText();
                    res_num = item.getCells()[1].getText();
                    res_item = item.getCells()[2].getText();
                    material = item.getCells()[3].getText();
                    um = item.getCells()[4].getText();
                    lote = item.getCells()[5].getValue();
                    etiqueta = item.getCells()[6].getValue();
                    bueno = item.getCells()[7].getState();
                    proximo = item.getCells()[8].getState();
                    desc_material = item.getCells()[9].getText();
                    operacion = item.getCells()[10].getText();
                    console.log(bueno, proximo);
                    if (bueno = "true") {
                        estatus = "1"
                    } else {
                        estaus = "2"
                    }
                    if (proximo == "true") {
                        estatus = "3"
                    }

                });
            } else {
                this.getOwnerComponent().openHelloDialog(resourceModel.getResourceBundle().getText("message.consumptionempty"));
            }

            if (items.length == 0) {
                oThis.getOwnerComponent().openHelloDialog("Seleccione el componente a enviar");
            } else {
                if (etiqueta == "1000001551" || etiqueta == "1000001557" || etiqueta == "1000001560") {

                    oThis.getOwnerComponent().openHelloDialog("El material: " + etiqueta + " no esta habilitado para: " + lote);


                } else {

                    var oData = {
                        "ORDEN": orden,
                        "RES_NUMBER": res_num,
                        "RES_ITEM": res_item,
                        "COD_MATERIAL": material,
                        "UM": um,
                        "LOTE": lote,
                        "ETIQUETA": etiqueta,
                        "ESTATUS": estatus,
                        "MATERIAL": desc_material,
                        "OPERACION": operacion
                    };

                    console.log(oData);

                    var uri = "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Runner?Transaction=" + "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/lote_material_ins" + "&OutputParameter=JsonOutput&Content-Type=text/xml"
                    uri = uri.replace(/\s+/g, '');

                    $.ajax({
                            type: "GET",
                            dataType: "xml",
                            cache: false,
                            url: uri,
                            data: oData
                        })
                        .done(function (xmlDOM) {
                            oThis.getOwnerComponent().openHelloDialog("Se a asignado el material: " + etiqueta + " al lote: " + lote);
                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                            if (console && console.log) {
                                oThis.getOwnerComponent().openHelloDialog("La solicitud a fallado: \u00BFHay conexi\u00F3n de red??");
                            }
                            sap.ui.core.BusyIndicator.hide();
                        });


                }
            }
        },

        onCloseSaveMaterial: function (oEvent) {
            this.getView().byId("dataComponents").close();
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

        callOpenDialogStep4: function (oEvent) {

            var oView = this.getView();
            var oDialog = oView.byId("dataStartOrderScanToolsCheck");

            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.STEP4", this);
                oView.addDependent(oDialog);
            }

            //this._base_onloadCOMBO("mov_101", oData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/get_101", " ", "Materiales notificar");
            oDialog.open();

        },


        onChangeStatusStop: function (oEvent) {
            var oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                oView = this.getView(),
                order = oView.byId('inputOrder1').getValue(),
                resourceModel = this.getView().getModel("i18n"),
                oData = {
                    "Param.1": order,
                    "Param.2": "FINALIZADA"
                };
            var uri = "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Illuminator?QueryTemplate=FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Query/upd_status_stop&IsTesting=T&Content-Type=text/xml"
            uri = uri.replace(/\s+/g, '');
            var oThis = this;
            $.ajax({
                    type: "GET",
                    dataType: "xml",
                    cache: false,
                    url: uri,
                    data: oData,
                    success: function () {
                        console.log("")
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        oThis.getOwnerComponent().openHelloDialog("TEST");
                    }
                })
                .done(function () {
                    console.log(oData);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud a fallado: Hay conexi??n de red?");
                    }
                });
            this.onCloseDialogStopOrder();
            this.PPOrders_view();
        },


        onCloseDialogAddNotification: function () {
            var oView = this.getView();
            var oDialog = oView.byId("startOrderDialog");
            if (!oDialog) {

                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.startOrderDialog", this);
                oView.addDependent(oDialog);
            }
            oDialog.destroy();
        },
        onCloseDialogStopOrder: function () {
            var oView = this.getView();
            var oDialog = oView.byId("stopOrderDialog");
            if (!oDialog) {

                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.stopOrderDialog", this);
                oView.addDependent(oDialog);
            }
            oDialog.destroy();
        },

        handleIconTabBarSelect: function (oEvent) {
            var aFilter = [],
                oTable = this.byId('PPOrders_list'),
                oBinding = oTable.getBinding('items'),
                sKey = oEvent.getParameter("key");

            if (sKey !== 'All') {
                if (sKey == 'LIB.') {
                    //aFilter.push(new Filter("ESTATUS", FilterOperator.Contains, sKey));
                } else
                    aFilter.push(new Filter("ESTATUS_MII", FilterOperator.Contains, sKey));
            }
            //console.log(sKey);.
            //console.log(aFilter);
            oBinding.filter(aFilter);
        },

        onSelectionChange: function (oEvent) {
            this._selectionColumn(oEvent, "PPOrders_list");
        },

        onCloseDialogHideColumns: function () {
            this.getView().byId("hideColumns_fragment").close();
        },

        callOpenDialogStep3: function () {

            this.dialogStep3 = sap.ui.xmlfragment("Step3", "sap.ui.demo.webapp.fragment.STEP3", this);
            this.getView().addDependent(this.dialogStep3);
            this.dialogStep3.open();
            sap.ui.getCore().byId("Step3--PDFSTEP3").setContent("<iframe height='700' width='1500' src='/XMII/CM/FARMA/POS/instructionFiles/STEP3_WorkInstructions.pdf' ></iframe>")
        },

        callOpenDialogStep0: function (oEvent) {
            var oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                resourceModel = this.getView().getModel("i18n"),
                items = this.getView().byId("PPOrders_list").getSelectedItems(),
                oView = this.getView(),
                oThis = this,
                order;


            if (items.length > 0) {
                items.forEach(function (item) {
                    order = item.getCells()[0].getText();
                });
            } else {
                this.getOwnerComponent().openHelloDialog(resourceModel.getResourceBundle().getText("message.consumptionempty"));
            }

            console.log(order);

            if (items.length == 0) {
                oThis.getOwnerComponent().openHelloDialog("Seleccione una Orden");
            } else {
                this.dialogStep0 = sap.ui.xmlfragment("Step0", "sap.ui.demo.webapp.fragment.STEP0", this);
                this.getView().addDependent(this.dialogStep0);
                this.dialogStep0.open();
                sap.ui.getCore().byId("Step0--PDFSTEP0").setContent("<iframe height='700' width='1500' src='/XMII/CM/FARMA/POS/instructionFiles/STEP_0WorkInstructions.pdf' ></iframe>");
            }
        },

        executeStep0: function () {
            this.dialogStep0.destroy();
        },

        executeStep3: function () {
            this.dialogStep3.destroy();
        },

        onCloseDialogStartOrderPerformActivities: function () {
            var oView = this.getView();
            var oDialog = oView.byId("oDialogStartOrderScanSFC");
            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.StartOrderPerformActivities", this);
                oView.addDependent(oDialog);
            }

            //this._base_onloadCOMBO("mov_101", oData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/get_101", " ", "Materiales notificar");
            oDialog.destroy();
        },

        onPerformed: function () {
            this.PPOrders_view();
            this.onCloseDialogStartOrderPerformActivities();
            this.callOpenDHRReview();
        },

        callOpenDialogStep1: function (oEvent) {
            var oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                resourceModel = this.getView().getModel("i18n"),
                items = this.getView().byId("PPOrders_list").getSelectedItems(),
                oView = this.getView(),
                oDialog = oView.byId("oDialogStep1"),
                oThis = this,
                order;


            if (items.length > 0) {
                items.forEach(function (item) {
                    order = item.getCells()[0].getText();
                });
            } else {
                this.getOwnerComponent().openHelloDialog(resourceModel.getResourceBundle().getText("message.consumptionempty"));
            }

            if (items.length == 0) {
                oThis.getOwnerComponent().openHelloDialog("Seleccione una Orden");
            } else {

                if (!oDialog) {
                    // create dialog via fragment factory
                    oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.STEP1", this);
                    oView.addDependent(oDialog);
                }


                oDialog.open();
            }
        },

        onCloseDialogStep1: function (oEvent) {
            var oView = this.getView(),
                oDialog = oView.byId("oDialogStep1");
            oDialog.close();
        },

        callOpenDHRReview: function () {
            var aDataDHR = [];
            aDataDHR.push({
                "ID": "1",
                "STATUS": "1",
                "TEXT": "All the units have been fully processed through all previous operations?",
                "VALUE": "",
                "VISIBLE": "0"
            });
            aDataDHR.push({
                "ID": "2",
                "STATUS": "1",
                "TEXT": "All In.Process Non-Conformance Activities hac??ve been dispositioned?",
                "VALUE": "",
                "VISIBLE": "0"
            });
            aDataDHR.push({
                "ID": "3",
                "STATUS": "1",
                "TEXT": "All the Required component Assembly activities have been completed Succesfully?",
                "VALUE": "",
                "VISIBLE": "0"
            });
            aDataDHR.push({
                "ID": "4",
                "STATUS": "0",
                "TEXT": "The Total physical count of GOOD UNITS in the order equals?",
                "VALUE": "5",
                "VISIBLE": "1"
            });
            aDataDHR.push({
                "ID": "5",
                "STATUS": "1",
                "TEXT": "All Open Messages have been Closed?",
                "VALUE": "",
                "VISIBLE": "0"
            });
            aDataDHR.push({
                "ID": "6",
                "STATUS": "1",
                "TEXT": "All Notifications have been Dispositioned?",
                "VALUE": "",
                "VISIBLE": "0"
            });
            var oModelDHR = new sap.ui.model.json.JSONModel();
            oModelDHR.setData({
                Row: aDataDHR
            });
            var oView = this.getView();
            var oDialog = oView.byId("oDialogDHRReview");

            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.DHRReview", this);
                oView.addDependent(oDialog);
            }

            var oTable = this.byId('oTableDHR');
            oTable.setModel(oModelDHR);

            //this._base_onloadCOMBO("mov_101", oData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/get_101", " ", "Materiales notificar");
            oDialog.open();
        },


        onCloseDHRReview: function () {
            var oView = this.getView();
            var oDialog = oView.byId("oDialogDHRReview");

            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.DHRReview", this);
                oView.addDependent(oDialog);
            }
            //this._base_onloadCOMBO("mov_101", oData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/get_101", " ", "Materiales notificar");
            oDialog.destroy();
        },


        callOpenDialogStep2: function () {
            var oView = this.getView();
            var oDialog = oView.byId("oDialogStep2");
            var oModelCOLLECTION = new sap.ui.model.json.JSONModel();
            var aDataCollection = [];


            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.STEP2", this);
                oView.addDependent(oDialog);
            }

            //this._base_onloadCOMBO("mov_101", oData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/get_101", " ", "Materiales notificar");
            oDialog.open();


            // Data Collection Entry
            aDataCollection.push({
                "ID": "1",
                "COLOR": "#00CC00",
                "PARAMETER": "Tiempo",
                "VALUE": "4",
                "MIN_VALUE": "4",
                "MAX_VALUE": "4",
                "DATA_TYPE": "Num??rico",
                "UOM": "Minutos"
            });
            aDataCollection.push({
                "ID": "2",
                "COLOR": "#00CC00",
                "PARAMETER": "Presi??n",
                "VALUE": "5",
                "MIN_VALUE": "4",
                "MAX_VALUE": "6",
                "DATA_TYPE": "Num??rico",
                "UOM": "Psi"
            });
            aDataCollection.push({
                "ID": "3",
                "COLOR": "#00CC00",
                "PARAMETER": "Temparatura",
                "VALUE": "11",
                "MIN_VALUE": "8",
                "MAX_VALUE": "12",
                "DATA_TYPE": "Num??rico",
                "UOM": "C??"
            });
            oModelCOLLECTION.setData({
                Row: aDataCollection
            });
            var oTable = this.byId('oTableDataCollection');
            oTable.setModel(oModelCOLLECTION);


        },

        onCloseDialogStep2: function (oEvent) {
            var oView = this.getView(),
                oDialog = oView.byId("oDialogStep2");

            oDialog.close();
        },

        onChangeBarcodeValue: function (oEvent) {
            var oColorRED = "#CC0000";
            var oColorGREEN = "#00CC00";
            var oColorYELLOW = "#D7DF01";
            var oColorWHITE = "#FFFFFF";
            var calibracion = this.byId('oColorCalibracion');

            this.byId('oColorCalibracion').setProperty('color', oColorWHITE);
            this.byId('oMsgCalibracion').setProperty('text', "");
            this.byId('CreaAviso').setProperty('visible', false);

            if (oEvent.mParameters.newValue == "0000042972-001") {
                this.byId('oColorCalibracion').setProperty('color', oColorGREEN);
                this.byId('oMsgCalibracion').setProperty('text', "Calibraci??n al d??a");
                this.byId('CreaAviso').setProperty('visible', false);

            } else {
                if (oEvent.mParameters.newValue == "0000042972-002") {
                    this.byId('oColorCalibracion').setProperty('color', oColorYELLOW);
                    this.byId('oMsgCalibracion').setProperty('text', "Calibraci??n por Expirar");
                    this.byId('CreaAviso').setProperty('visible', false);
                } else {
                    this.byId('oColorCalibracion').setProperty('color', oColorRED);
                    this.byId('oMsgCalibracion').setProperty('text', "Calibraci??n Expirada");
                    this.byId('CreaAviso').setProperty('visible', true);
                }
            }
        },


        onChangeValue: function (oEvent) {

            var oModelCOLLECTION = new sap.ui.model.json.JSONModel();
            var aDataCollection = [];
            // Data Collection Entry
            var index = oEvent.getSource().getParent().getIndex();
            var oTable = this.byId('oTableDataCollection');
            var rowContext = oTable.getContextByIndex(index);
            var objRow = rowContext.getObject();

            if (oEvent.mParameters.newValue >= objRow.MIN_VALUE && oEvent.mParameters.newValue <= objRow.MAX_VALUE) {
                objRow.COLOR = "#00CC00";
                oModelCOLLECTION.refresh()
            } else {
                objRow.COLOR = '#CC0000';
                oModelCOLLECTION.refresh()


            }
        },

        onCrearAviso() {
            this.getRouter().navTo("crearAviso");
        },

        onDetal_view: function (oEvent) {
            var oItem, oCtx, estatus, sPath;
            var oKey = this.getView().byId("planta").getSelectedKey();
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            sPath = oCtx.getPath();
            this.getOwnerComponent().getModel("masterModel").setProperty("/selectedOrder", sPath);
            estatus = oCtx.getProperty("ESTATUS_MII");
            if (estatus !== "PENDIENTE" && estatus !== "ABIERTA") {
                this.getOwnerComponent().openHelloDialog("Seleccione una orden abierta o pendiente");
            } else {
                this.getRouter().navTo("orderDetail", {
                    orden: oCtx.getProperty("NUM_ORDEN"),
                    plant: oKey
                });
            }
        },
        onChart: function () {
            const othis = this;
            this.getView().setBusy(true);
            if (!this.chartsDialog) {
                // @ts-ignore
                this.chartsDialog = this.loadFragment({
                    name: "sap.ui.demo.webapp.fragment.Charts"
                });
            }
            this.chartsDialog.then(function (oDialog) {
                var cardManifests = new JSONModel();
                //var card = this.getView().byId("myCard");

                cardManifests.loadData(sap.ui.require.toUrl("sap/ui/demo/webapp/model/data/cardManifests.json"));
                oDialog.setModel(cardManifests, "manifests");
                var oDialog2 = oDialog;
                othis.getView().setBusy(false);
                oDialog.open();

                oDialog2.open();
            });
        },
        onNavToCharts: function (oEvent) {
            this.getRouter().navTo("chartView");
        },
        onCloseCharts: function () {
            this.byId("oDialogReport").close();
        }
    });
});