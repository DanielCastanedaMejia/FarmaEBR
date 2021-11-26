sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox"

], function (JQuery, BaseController, MessageToast, MessageBox) {
    "use strict";

    var plant_gb = '';

    return BaseController.extend("sap.ui.demo.webapp.controller.PMOrder.createPMOrderAGRO", {

        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("createPMOrderAGRO").attachMatched(this._onRouteMatched, this);

        },

        _onRouteMatched: function (oEvent) {
            var oArgs, oView,
                oArgs = oEvent.getParameter("arguments"),
                oView = this.getView(),
                view_button = this.getView().byId("viewButton"),
                oTable = oView.byId('PMOperationList');

            if (view_button.getVisible()) {
                view_button.setVisible(false);
            }

            var oModel = new sap.ui.model.json.JSONModel(),
                oModel_empty = new sap.ui.model.json.JSONModel();
            oModel.setData({ plant: oArgs.plant.split('-')[1] });
            oView.setModel(oModel);

            oTable.setModel(oModel_empty);
            oModel_empty.setData({});

            var create_button = this.getView().byId("createButton");
            if (!create_button.getVisible()) {
                create_button.setVisible(true);
            }

            oView.bindElement({
                path: "/",
            });

            var plant = oArgs.plant,
                tipo_ubi = '';          

            plant_gb = plant.split('-')[1];

            if (plant_gb == '2110' || plant_gb == '2120' || plant_gb == '2130')
                tipo_ubi = 'GPRAN'

            var oData_UBI = {
                "TIPO_FILTRO": "PRO",
                "FILTRO": oArgs.plant,
                "TIPO_UBI": tipo_ubi
            },
                oData = {
                    "PLANT": plant.split('-')[1],
                    "PLANTA": plant.split('-')[1]
                };

            console.log(oData_UBI);

            this._base_onloadCOMBO('WorkCenter', oData, 'EquipandoXXI/DatosMaestros/Produccion/CentroTrabajo/Transaction/get_workCenter', "", "Puesto de trabajo");
            this._base_onloadCOMBO("listPMProceso", oData_UBI, "EquipandoXXI/DatosTransaccionales/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH", "");
            
        },

        onChangePMProceso: function (oEvent) {            
            var oData = {
                "TIPO_FILTRO": "SUBPRO",
                "FILTRO": oEvent.getParameter("selectedItem").getKey()
            };
            this._base_onloadCOMBO("listPMSubproceso", oData, "EquipandoXXI/DatosTransaccionales/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH", "", "");
        },

        onViewPMOrderAGRO: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            this.getRouter().navTo("PMOrderDetailAGRO", {
                id: oCtx.getProperty("order"),
                plant: plant_gb
            });

        },

        onCreatePMOrderAGRO: function (oEvent) {
            var combo_orderType = this.byId("PMType"),
                input_description = this.byId("PM_orderDesc"),
                combo_priority = this.byId("priority"),
                combo_table = this.byId("listPMSubproceso"),
                combo_workCenter = this.byId("WorkCenter"),
                input_time = this.byId('PM_timeOperation'),
                combo_ranch = this.byId('listPMProceso'),
                oItem, oCtx,
                resourceModel = this.getView().getModel("i18n");


            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            if (combo_ranch.getSelectedKey() == '')
                this.getOwnerComponent().openHelloDialog(resourceModel.getResourceBundle().getText("PMCreateOrderAGRO.ranch"));            
            else if (input_description.getValue() == '')
                this.getOwnerComponent().openHelloDialog(resourceModel.getResourceBundle().getText("PMCreateOrderAGRO.description"));
            else if (combo_table.getSelectedKey() == '')
                this.getOwnerComponent().openHelloDialog(resourceModel.getResourceBundle().getText("PMCreateOrderAGRO.table"));
            else if (input_time.getValue() == '')
                this.getOwnerComponent().openHelloDialog(resourceModel.getResourceBundle().getText("PMCreateOrderAGRO.time"));
            else {
                var oData = {
                    "PLANT": oCtx.getProperty("plant"),
                    "ORDER_TYPE": combo_orderType.getSelectedKey(),
                    "PRIORITY": combo_priority.getSelectedKey(),
                    "SHORT_TEXT": input_description.getValue(),
                    "FUNC_LOC": combo_table.getSelectedKey(),
                    "ID_TABLA": combo_table.getSelectedItem().getAdditionalText(),
                    "ROW_COUNT": 1,
                    "WORK_CENTER": combo_workCenter.getSelectedKey(),
                    "TIME": input_time.getValue()
                }
                console.log(oData);
            this.createPMOrderAGRO('PMOrderOperation', oData, 'EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Crear/Transaction/createOrder_AGRO');
            }           
            
        },

        createPMOrderAGRO: function (idObject, oData, path) {

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
                        console.log(opElement);
                        var aData = JSON.parse(opElement.firstChild.data);
                        if (aData[0].error !== undefined) {
                            oThis.getOwnerComponent().openHelloDialog(aData[0].error);
                        }
                        else {
                            //Create  the JSON model and set the data                                                                                                
                            MessageToast.show(aData[0].message);
                            var oData = {
                                "ORDER": aData[0].object
                            },
                                oModel = new sap.ui.model.json.JSONModel(),
                                oView = oThis.getView(),
                                create_button = oThis.getView().byId("createButton"),
                                view_button = oThis.getView().byId("viewButton");

                            oModel.setData({ order: aData[0].object });
                            oView.setModel(oModel);

                            oThis._base_onloadTable('PMOperationList', oData, 'EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Cabecera/Transaction/get_operations', "Operaciones", "");
                            
                            if (create_button.getVisible()) {
                                create_button.setVisible(false);
                            }
                            if (!view_button.getVisible()) {
                                view_button.setVisible(true);
                            }
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

    });
}
);