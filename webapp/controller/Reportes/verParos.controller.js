sap.ui.define([
    "sap/ui/demo/webapp/controller/BaseController",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator",
    "../../model/formatter",
    "sap/m/MessageBox",
], function (BaseController, Filter, FilterOperator, formatter, MessageBox) {
    "use strict";

    var plant_gb = '';

    return BaseController.extend("sap.ui.demo.webapp.controller.Reportes.verParos", {

        formatter: formatter,

        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("verParos").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            this._getUsuario("username");

            this.byId("planta").setSelectedKey("1710");

            var columns = {
                columns: [
                    {
                        Column: "ID",
                        Visible: 0
                    },
                    {
                        Column: "Fecha inicio",
                        Visible: 1
                    },
                    {
                        Column: "Fecha Fin",
                        Visible: 1
                    },
                    {
                        Column: "Duracion",
                        Visible: 1
                    },
                    {
                        Column: "Causa",
                        Visible: 1
                    },
                    {
                        Column: "Agrupador",
                        Visible: 0
                    }
                ]
            };

            this._setColumns(columns, "columnList", "Paros_list");

        },

        verParos: function () {
            var oData = {
                "FECHA_FIN": this.byId("end_date").getValue(),
                "PLANT": "1710",
                "FECHA_INICIO": this.byId("start_date").getValue()
            };

            this._base_onloadTable("Paros_list", oData, "GIM/DatosTransaccionales/Paros/Transaction/sel_paros", "Paros", "");
        },

        onSelectionChange: function (oEvent) {
            this._selectionColumn(oEvent, "Paros_list");
        },

        onCloseDialogHideColumns: function () {
            this.getView().byId("hideColumns_fragment").close();
        },

        onRevisarSeleccion: function () {
            var oTable = this.byId('Paros_list');
            //console.log(oTable.getSelectedItem().getBindingContext().getProperty("NUM_ORDEN"));
            if (oTable.getSelectedItem() !== null && oTable.getSelectedItem().getBindingContext().getProperty("DESC_CAUSA") === '---')
                this.onOpenDialogJustificar();
            else
                this.getOwnerComponent().openHelloDialog("Selecciona un paro sin justificar");     
        },

        onOpenDialogJustificar: function (oEvent) {
            var                
                oView = this.getView(),
                oTable = this.byId('Paros_list'),
                oDialog = oView.byId("justificarParoDialog");

            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.Paros.justificarParo", this);
                oView.addDependent(oDialog);
            }

            this._base_onloadCOMBO("causas_paro", {}, "GIM/DatosMaestros/Paros/Transaction/sel_causas", " ", "Causa de Paro");
            //this.byId('duracionParo').setValue(oTable.getSelectedItem().getBindingContext().getProperty("DURACION"));
            oDialog.open();
        },

        onCloseDialogJustificar: function () {
            this.getView().byId("justificarParoDialog").close();
        },

        onJustificarParo: function () {
            var oTable = this.byId('Paros_list'),
                oCombo = this.byId('causas_paro'),
                oData = {
                    "ID_PARO": oTable.getSelectedItem().getBindingContext().getProperty("ID_PARO"),
                    "ID_CAUSA": oCombo.getSelectedKey()
                };

            if (oCombo.getSelectedKey() !== " ") {
                this.justificarParo(oData, 'GIM/DatosTransaccionales/Paros/Transaction/justificar_paro');
                this.onCloseDialogJustificar();
            }                
            else
                this.getOwnerComponent().openHelloDialog("Selecciona una causa"); 
        },

        justificarParo: function (oData, path) {

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
                        }
                        else {
                            oThis.getOwnerComponent().openHelloDialog(aData[0].message);
                            oThis.verParos();
                        }

                    }
                    else {
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

        onReversarParo: function () {
            var oTable = this.byId('Paros_list');
            if (oTable.getSelectedItem() !== null && oTable.getSelectedItem().getBindingContext().getProperty("DESC_CAUSA") !== '---') {
                var 
                oData = {
                    "ID_PARO": oTable.getSelectedItem().getBindingContext().getProperty("ID_PARO")
                };

                this.handleMessageReversarParo("Desea revertir el paro?", "warning", oData, this);
            }                
            else
                this.getOwnerComponent().openHelloDialog("Selecciona un paro justificado");                 
        },

        handleMessageReversarParo: function (sMessage, sMessageBoxType, oData, oThis) {
            MessageBox[sMessageBoxType](sMessage, {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        oThis.justificarParo(oData, 'GIM/DatosTransaccionales/Paros/Transaction/reversar_paro');
                    }
                }.bind(this)
            });
        }

    });
});