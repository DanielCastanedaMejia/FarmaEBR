sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator"
], function (JQuery, BaseController, MessageToast, MessageBox, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.PMNotification.viewPMNotification", {
        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("viewPMNotification").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oArgs, oView,
                oArgs = oEvent.getParameter("arguments"),
                oView = this.getView(),
                oTable = oView.byId('PMNotificationList'),
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
            
            this._base_onloadCOMBO("listPMProceso", oData, "FARMA/DatosTransaccionales/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH","","Proceso");             

        },  

        onChangePMProceso: function (oEvent) {
            var oData = {
                "TIPO_FILTRO": "SUBPRO",
                "FILTRO": oEvent.getParameter("selectedItem").getKey()
            };
            this._base_onloadCOMBO("listPMSubProceso", oData, "FARMA/DatosTransaccionales/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH", "", "SubProceso");
        },

        onChangePMSubProceso: function (oEvent) {
            var oData = {
                "TIPO_FILTRO": "FUNC",
                "FILTRO": oEvent.getParameter("selectedItem").getKey()
            };
            this._base_onloadCOMBO("listPMFunction", oData, "FARMA/DatosTransaccionales/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH", "", "Funcion");
        },

        onPMNotificationDetail: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            this.getRouter().navTo("PMNotificationDetail", {
                id: oCtx.getProperty("id")
            });

        },

        onShowOrder: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            this.getRouter().navTo("PMOrderDetail", {
                id: oCtx.getProperty("order")
            });

        },

        onShowView: function (oEvent) {      
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();

            var oComboProcess = this.byId("listPMProceso");
            var oComboSubProcess = this.byId("listPMSubProceso");
            var oComboFunction = this.byId("listPMFunction");
            var oCheckStop = this.byId("PMStop"); 
            var oInputStarDate = this.byId("start_date"); 
            var oInputEndDate = this.byId("end_date");

            var oStop = 0;
            if (oCheckStop.getSelected() == true)
                oStop = 'X';
            else
                oStop = '';

            var plant = oCtx.getProperty("plant");
            console.log(oCtx.getProperty("plant"));
            plant = plant.split('-')[1];

            var oData = {
                "BREAKDOWN": oStop,
                "END_DATE": oInputEndDate.getValue(),
                "FUNCTION": oComboFunction.getSelectedKey(),
                "PLANT": "P003",
                "PROCESS": oComboProcess.getSelectedKey(),
                "START_DATE": oInputStarDate.getValue(),
                "SUBPROCESS": oComboSubProcess.getSelectedKey(),
            };
            
            this._base_onloadTable("PMNotificationList", oData, "FARMA/DatosTransaccionales/Mantenimiento/Avisos/Buscar/Transaction/get_avisos", "Avisos","IconTabBar_Notifications");
        },

        onDisplayCreatePMNotification: function () {    
                this.getRouter().navTo("createPMNotification", { "Plant": "PLANTA" });  
                                           
        },

        handleIconTabBarSelect: function (oEvent) {
            var aFilter = [],
                oTable = this.byId('PMNotificationList'),
                oBinding = oTable.getBinding('items'),
                sKey = oEvent.getParameter("key");

            if (sKey != 'All') {
                if (sKey != 'NORAS')
                    aFilter.push(new Filter("status", FilterOperator.Contains, sKey));
                else
                    aFilter.push(new Filter("noras", FilterOperator.Contains, sKey));
            }                
            
            oBinding.filter(aFilter);
        },

    });
}
);
