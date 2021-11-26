sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator",
    "sap/ui/demo/webapp/model/formatter"
], function (JQuery, BaseController, MessageToast, MessageBox, Filter, FilterOperator,formatter) {
    "use strict";

    var plant_gb = '';

    return BaseController.extend("sap.ui.demo.webapp.controller.QM.QMOrders", {

        formatter: formatter,

        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("viewQMOrders").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {  
            var oArgs;
            oArgs = oEvent.getParameter("arguments");

            plant_gb = 'PLANTA';
            this.QMOrders_view();            

            var columns = {
                columns: [
                    {
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
            
        },

        QMOrders_view: function () {
            var oData = {
                "END_DATE": this.byId("end_date").getValue(),
                "PLANT": plant_gb,
                "START_DATE": this.byId("start_date").getValue()
            };

            this._base_onloadTable("PPOrders_list", oData, "FARMA/DatosTransaccionales/Calidad/Visualizar/Transaction/sel_ordenes", "Ordenes", "IconTabBar_Orders");
        },

        viewStartOrder: function (oEvent) {

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
                }
                else {
                this.getOwnerComponent().openHelloDialog(resourceModel.getResourceBundle().getText("message.consumptionempty"));
                }

            var oDialog = oView.byId("startOrderDialog");
            var oData = {
                    "NUM_ORDEN": order,
                };
                console.log(oData);

            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.fragment.startOrderDialog", this);
                oView.addDependent(oDialog);
            }

            oView.byId('inputOrder').setValue(order);

            //this._base_onloadCOMBO("mov_101", oData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/get_101", " ", "Materiales notificar");
            oDialog.open();
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
                }
                else {
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

        onChangeStatusStart: function(oEvent){
            var oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                oView = this.getView(),
                order = oView.byId('inputOrder').getValue(),
                resourceModel = this.getView().getModel("i18n"),
                oData = {
                    "Param.1": order,
                    "Param.2":"INICIADA"
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
                        oThis.getOwnerComponent().openHelloDialog("La solicitud a fallado: Hay conexión de red?");
                    }
                });
            this.onCloseDialogAddNotification();
            this.PPOrders_view();
        },


        onChangeStatusStop: function(oEvent){
            var oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                oView = this.getView(),
                order = oView.byId('inputOrder1').getValue(),
                resourceModel = this.getView().getModel("i18n"),
                oData = {
                    "Param.1": order,
                    "Param.2":"FINALIZADA"
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
                success:function(){
                    console.log("")
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    oThis.getOwnerComponent().openHelloDialog("TEST");
                }   
            })
            .done(function () {
                    console.log(oData);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud a fallado: Hay conexión de red?");
                    }
                });
            this.onCloseDialogStopOrder();
            this.PPOrders_view();
        },


        onCloseDialogAddNotification: function () {
            this.getView().byId("startOrderDialog").close();
        },
        onCloseDialogStopOrder: function () {
            this.getView().byId("stopOrderDialog").close();
        },

        handleIconTabBarSelect: function (oEvent) {
            var aFilter = [],
                oTable = this.byId('PPOrders_list'),
                oBinding = oTable.getBinding('items'),
                sKey = oEvent.getParameter("key");

            if (sKey !== 'All') {
                if (sKey !== 'NORAS')
                    aFilter.push(new Filter("ESTATUS", FilterOperator.Contains, sKey));
                else
                    aFilter.push(new Filter("noras", FilterOperator.Contains, sKey));
            }

            oBinding.filter(aFilter);
        },

        onSelectionChange: function (oEvent) {
            this._selectionColumn(oEvent, "PPOrders_list");   
        },

        onCloseDialogHideColumns: function () {
            this.getView().byId("hideColumns_fragment").close();
        },

        onRecordCapture_view: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            this.getRouter().navTo("QMOperation", {
                orden: oCtx.getProperty("NUM_ORDEN")
            });
        }
    });
});