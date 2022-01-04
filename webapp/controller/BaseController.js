sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
], function (Controller, History, MessageToast) {
    "use strict";
    return Controller.extend("sap.ui.demo.webapp.controller.BaseController", {

        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },
        onNavBack: function (oEvent) {
            var oHistory, sPreviousHash;
            oHistory = History.getInstance();
            sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
                //console.log("History")
            } else {
                this.getRouter().navTo("appHome", {}, true /*no history*/ );
                //console.log("no History")
            }
        },
        goToHome: function () {
            this.getRouter().navTo("appHome", {}, true /*no history*/ );
        },

        _selectionColumn: function (oEvent, table) {
            var oTable = this.byId(table),
                index = oEvent.getParameter("listItem").getBindingContext().sPath.split('/')[2];

            if (oEvent.getParameter("selected")) {
                oTable.getColumns()[index].setVisible(true);
            } else {
                oTable.getColumns()[index].setVisible(false);
            }
        },

        _selectColumnsAll: function () {
            var oList = this.byId("columnList"),
                oItems = oList.getItems();

            $.each(oList.getItems(), function (index) {
                oList.setSelectedItem(oItems[index], true, true);
            });
        },

        _openModalColumn: function () {
            var oView = this.getView(),
                oDialog = oView.byId("hideColumns_fragment");
            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.hideColumns", this);
                oView.addDependent(oDialog);
            }
            oDialog.open();
        },


        _setColumns: function (columns, List, Table) {
            var oView = this.getView(),
                oDialog = oView.byId("hideColumns_fragment");
            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.hideColumns", this);
                oView.addDependent(oDialog);
            }

            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData(columns);
            this.byId("hideColumns_fragment").setModel(oModel);

            var oList = this.byId(List),
                oTable = this.byId(Table),
                oItems = oList.getItems(),
                oColumns = oTable.getColumns();

            $.each(columns.columns, function (index) {
                if (this.Visible) {
                    oList.setSelectedItem(oItems[index]);
                } else {
                    oColumns[index].setVisible(false);
                }
            });
        },

        _base_onloadTable2: function (Table, oData, path, name, stats_bar) {
            var oView = this.getView(),
                oTable = oView.byId(Table),
                oModel_empty = new sap.ui.model.json.JSONModel(),
                oThis = this;

            //clear table
            oModel_empty.setData({})
            oTable.setModel(oModel_empty);

            var uri = "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Runner?Transaction=" + path + "&OutputParameter=JsonOutput&Content-Type=text/xml"
            uri = uri.replace(/\s+/g, '');

            oTable.setBusy(true);

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
                        if (aData !== undefined) {
                            if (aData.error !== undefined) {
                                oThis.getOwnerComponent().openHelloDialog(aData.error);
                            } else {
                                //Create  the JSON model and set the data                                                                                                
                                var oModel = new sap.ui.model.json.JSONModel();

                                oModel.setData(aData);
                                //check if exist a header element
                                if (stats_bar != '') {
                                    var oModel_stats = new sap.ui.model.json.JSONModel();
                                    var oSTATS = oThis.byId(stats_bar);

                                    oModel_stats.setData(aData.STATS);
                                    oSTATS.setModel(oModel_stats);
                                }
                                oModel.setSizeLimit(aData.length);

                                oTable.getModel().setSizeLimit(aData.length);
                                oTable.setModel(oModel);
                            }
                        } else {
                            MessageToast.show("No se ha recibido " + name);
                        }
                    } else {
                        MessageToast.show("No se han recibido datos");
                    }

                    oTable.setBusy(false);

                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud ha fallado: \u00BFHay conexi\u00F3n de red?");
                    }
                    oTable.setBusy(false);
                });
        },

        _base_onloadTable: function (Table, oData, path, name, stats_bar) {
            var oView = this.getView(),
                oTable = oView.byId(Table),
                oModel_empty = new sap.ui.model.json.JSONModel(),
                oThis = this;

            //clear table
            oModel_empty.setData({});
            oTable.setModel(oModel_empty);

            var uri = "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Runner?Transaction=" + path + "&OutputParameter=JsonOutput&Content-Type=text/xml";
            uri = uri.replace(/\s+/g, '');
            console.log(uri);
            oTable.setBusy(true);

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

                        if (aData.ITEMS.length > 0) {
                            if (aData.error !== undefined) {
                                oThis.getOwnerComponent().openHelloDialog(aData.error);
                            } else {
                                //Create  the JSON model and set the data                                                                                                
                                var oModel = new sap.ui.model.json.JSONModel();
                                oModel.setData(aData);
                                //check if exist a header element
                                if (stats_bar !== '') {
                                    var oModel_stats = new sap.ui.model.json.JSONModel();
                                    var oSTATS = oThis.byId(stats_bar);

                                    oModel_stats.setData(aData.STATS);
                                    oSTATS.setModel(oModel_stats);
                                }
                                oModel.setSizeLimit(aData.ITEMS.length);
                                console.log("modelo ultimo");
                                console.log(oModel);
                                oTable.setModel(oModel);
                            }
                        } else {
                            MessageToast.show("No se han recibido " + name);
                        }
                    } else {
                        MessageToast.show("No se han recibido datos");
                    }

                    oTable.setBusy(false);

                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud ha fallado: \u00BFHay conexi\u00F3n con el servidor?");
                    }
                    oTable.setBusy(false);
                });
        },

        _base_onloadCOMBO: function (Combo, oData, path, setKey, name) {
            var uri = "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Runner?Transaction=" + path + "&OutputParameter=JsonOutput&Content-Type=text/xml"
            uri = uri.replace(/\s+/g, '');

            var oView = this.getView(),
                oCombo = oView.byId(Combo),
                oModel_empty = new sap.ui.model.json.JSONModel(),
                //save this
                oThis = this,
                oCombo = oView.byId(Combo);

            oCombo.setModel(oModel_empty);
            oModel_empty.setData({});

            oCombo.setBusy(true);

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
                        var aData = eval(opElement.firstChild.data);
                        if (aData[0] !== undefined) {
                            if (aData[0].error !== undefined) {
                                oThis.getOwnerComponent().openHelloDialog(aData[0].error);
                            } else {
                                //Create  the JSON model and set the data                                                                                                
                                var oModel = new sap.ui.model.json.JSONModel();

                                oCombo.setModel(oModel);
                                oCombo.getModel().setSizeLimit(aData.length);
                                oModel.setData(aData);
                            }
                        } else {
                            MessageToast.show("No se ha recibido " + name);
                        }
                    } else {
                        MessageToast.show("No se han recibido datos");
                    }
                    if (setKey != "")
                        oCombo.setSelectedKey(setKey);

                    oCombo.setBusy(false);

                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud ha fallado: \u00BFHay conexi\u00F3n de red?");
                    }
                    oCombo.setBusy(false);
                });
        },

        _base_onloadHeader: function (oData, path, name) {
            var uri = "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Runner?Transaction=" + path + "&OutputParameter=JsonOutput&Content-Type=text/xml"
            uri = uri.replace(/\s+/g, '');

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

                    if (opElement.firstChild != null) {
                        var aData = JSON.parse(opElement.firstChild.data);
                        if (aData !== undefined) {
                            if (aData.error !== undefined) {
                                oThis.getOwnerComponent().openHelloDialog(aData.error);
                            } else {
                                //Create  the JSON model and set the data                                                                                                
                                var oModel = new sap.ui.model.json.JSONModel();
                                oModel.setData(aData);

                                // Assign the model object to the SAPUI5 core
                                oView.getView().setModel(oModel);
                            }
                        } else {
                            MessageToast.show("No se ha recibido " + name);
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

        _base_onloadHeader_changed: function (oData, path, name, oModel) {
            var uri = "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Runner?Transaction=" + path + "&OutputParameter=JsonOutput&Content-Type=text/xml"
            uri = uri.replace(/\s+/g, '');

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
                                oModel.setData(aData);

                                // Assign the model object to the SAPUI5 core
                                oView.getView().setModel(oModel);
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
        _getMasterModel: function (sProperty) {
            var oModel = this.getOwnerComponent().getModel("masterModel");
            var oProperty = oModel.getProperty(sProperty);
            return oProperty;
        },
        _setMasterModel: function (sProperty, oValue) {
            var oModel = this.getOwnerComponent().getModel("masterModel");
            oModel.setProperty(sProperty, oValue);
        },
        _getUsuario: function (id) {
            var oThis = this;

            $.ajax({
                type: "GET",
                url: "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Illuminator?service=SystemInfo&mode=CurrentProfile&Content-Type=text%2Fxml",
                dataType: "xml",
                cache: false,
                success: function (xml) {
                    var nombre = $(xml).find('Profile').attr('firstname');
                    var apellido = $(xml).find('Profile').attr('lastname');

                    oThis.byId(id).setText(nombre + ' ' + apellido);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("ERROR");
                }
            });
        },

    });
});