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

    return BaseController.extend("sap.ui.demo.webapp.controller.PMReport.viewPMReporteFallos", {
        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("viewPMReporteFallos").attachMatched(this._onRouteMatched, this);
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

                /****************************** START CREATE NEW USER *******************************/

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

        onShowGraphic:function(){
            this.getRouter().navTo("viewPMGraficoFallos");
        },
        

    });
    
});

