sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator",
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/viz/ui5/controls/common/feeds/FeedItem',
    'sap/viz/ui5/data/FlattenedDataset',
    'sap/viz/ui5/format/ChartFormatter',
    'sap/viz/ui5/api/env/Format'
], function (JQuery, BaseController,Controller,JSONModel,FeedItem,FlattenedDataset,ChartFormatter, InitPageUtil,MessageToast, MessageBox, Filter, FilterOperator,Format) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.PMReport.viewPMReporteTiempo", {
        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("viewPMReporteActividades").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oArgs, oView,
                oArgs = oEvent.getParameter("arguments"),
                oView = this.getView(),
                oTable = oView.byId('PMTiemposList'),
                oStats = oView.byId('IconTabBar_Notifications'),
                oModel_empty = new sap.ui.model.json.JSONModel(),
                oThis = this;

            //clear table
            oModel_empty.setData({})
            oTable.setModel(oModel_empty);
            oStats.setModel(oModel_empty);

            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({ plant: oArgs.Plant });
            oView.setModel(oModel);

            oView.bindElement({
                path: "/",
            });

            var oData = {
                "TIPO_FILTRO": "CE",
                "FILTRO": ""
            };
            
            this._base_onloadCOMBO("listPMProceso", oData, "SelloRojo/DatosTransaccionales/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH","","Proceso");           
        },  


        onChangePMProceso: function (oEvent) {
            var oData = {
                "TIPO_FILTRO": "SUBPRO",
                "FILTRO": oEvent.getParameter("selectedItem").getKey()
            };
            this._base_onloadCOMBO("listPMSubProceso", oData, "EquipandoXXI/DatosTransaccionales/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH", "", "SubProceso");
        },

        onChangePMSubProceso: function (oEvent) {
            this.repeaterCombosUBI(1);
            var oData = {
                "TIPO_FILTRO": "FUNC",
                "FILTRO": oEvent.getParameter("selectedItem").getKey()
            };
            this._base_onloadCOMBO("listPMFunction", oData, "SelloRojo/DatosTransaccionales/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH","","Funciones");                   
        },

        onChangePMFunction: function (oEvent) {
            this.repeaterCombosUBI(2);
            var oData = {
                "TIPO_FILTRO": "EQUI",
                "FILTRO": oEvent.getParameter("selectedItem").getKey()
            };
            this._base_onloadCOMBO("listPMEquipment", oData, "SelloRojo/DatosTransaccionales/UbicacionesTecnicas/Transaction/Equipos_SubEquipos_CEMH","","Equipos");            
        },

        /*onChangePMSubProceso: function (oEvent) {
            var oData = {
                "TIPO_FILTRO": "FUNC",
                "FILTRO": oEvent.getParameter("selectedItem").getKey()
            };
            this._base_onloadCOMBO("listPMFunction", oData, "EquipandoXXI/DatosTransaccionales/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH", "", "Funcion");
        },*/

        onLoadTable: function (oEvent,oThis) {

            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();

            var oComboProcess = this.byId("listPMProceso");
            var oComboSubProcess = this.byId("listPMSubProceso");
            var oComboFunction = this.byId("listPMFunction");
            var oCheckStop = this.byId("PMStop"); 
            var oInputStarDate = this.byId("start_date"); 
            var oInputEndDate = this.byId("end_date");
            var oComboEquipment = this.byId("listPMEquipo");
            var oData = {
                "END_DATE": oInputEndDate.getValue(),
                "FUNCTION": oComboFunction.getSelectedKey(),
                "PLANT": "P003",
                "PROCESS": oComboProcess.getSelectedKey(),
                "START_DATE": oInputStarDate.getValue(),
                "SUBPROCESS": oComboSubProcess.getSelectedKey(),
                "EQUIPMENT" : oComboEquipment.getSelectedKey(),
            };

            this._base_onloadTable("PMTiemposList", oData, "SelloRojo/DatosTransaccionales/Mantenimiento/Avisos/Buscar/Transaction/get_avisos", "Avisos","IconTabBar_Notifications");

            var button = this.byId("searchGraphic");    
            var buttonGraphic = button.setProperty('enabled', true);

        },

        onShowGraphic: function(){

            var oView = this.getView(),
                oDialog = oView.byId("PMGraphicTimes"),

            // create dialog lazily

                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.view.PMViewGraphic", this);
                oView.addDependent(oDialog);


            oDialog.open();

        },

        onShowGraphic:function(){
            this.getRouter().navTo("viewPMGraficoTiempo");
        },

        loadGraphic: function(oData){

        var oView = this.getView(),
            oModel_empty = new sap.ui.model.json.JSONModel(),
            oThis = this;

            //clear table
            oModel_empty.setData({})
            

        var oVizFrame = this.getView().byId("idcolumn");
        var oPopOver = this.getView().byId("idPopOver");
            oVizFrame.setModel(oModel_empty);
             

        var uri = "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Runner?Transaction=" + "SelloRojo/DatosTransaccionales/............." + "&OutputParameter=JsonOutput&Content-Type=text/xml"
            uri = uri.replace(/\s+/g, '');

            oVizFrame.setBusy(true);

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
                            }
                            else {
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
                                oVizFrame.setModel(oModel);

                                var data = {
                                    'Cars' : [
                                    {"Model": "Electrica","Value": aData[0]},
                                    {"Model": "Mecanica","Value": aData[1]},
                                    {"Model": "Hidraulica","Value": aData[2]},
                                    {"Model": "Neumatica","Value": aData[3]},
                                    {"Model": "Operacion","Value": aData[4]},
                                    {"Model": "Suministros","Value": aData[5]},
                                    {"Model": "Instrumentacion","Value": aData[6]},
                                    {"Model": "Control","Value": aData[7]},
                                    {"Model": "Automatizacion","Value": aData[8]},
                                    {"Model": "Programacion","Value": aData[9]},
                                    {"Model": "Infraestructura","Value": aData[10]},
                                    {"Model": "Soldadura","Value": aData[11]},
                                    {"Model": "Diseño","Value": aData[12]},
                                    {"Model": "Servicio","Value": "974010"},
                                    {"Model": "Preventivo","Value": "974010"},
                                    {"Model": "Predictivo","Value": "974010"},
                                    ]};
                                    oModel.setData(data);

                                    // Create Viz dataset to feed to the data to the graph
            var oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions : [{
            name : 'Model',
            value : "{Model}"}],

            measures : [{
            name : 'Cars Bought',
            value : '{Value}'} ],

            data : {
            path : "/Cars"
            }
            });

            oVizFrame.setDataset(oDataset);
            oVizFrame.setModel(oModel);
            oVizFrame.setVizType('vertical_bullet');

            //                4.Set Viz properties
            oVizFrame.setVizProperties({
            plotArea: {
            colorPalette : d3.scale.category20().range(),
            },
            title: {
                    visible: true,
                    text: 'ORDENES REALIZADAS'
                },
            });

            var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["Cars Bought"]
            }),
            feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
            'uid': "categoryAxis",
            'type': "Dimension",
            'values': ["Model"]
            });
            oVizFrame.addFeed(feedValueAxis);
            oVizFrame.addFeed(feedCategoryAxis);
                            }
                        }                        
                        else {
                            MessageToast.show("No se han recibido " + name);
                        }
                    }
                    else {
                        MessageToast.show("No se han recibido datos");
                    }

                    oVizFrame.setBusy(false);

                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud ha fallado: \u00BFHay conexi\u00F3n de red?");
                    }
                    oVizFrame.setBusy(false);
                });
            

            
        }


        

    });
    
});

