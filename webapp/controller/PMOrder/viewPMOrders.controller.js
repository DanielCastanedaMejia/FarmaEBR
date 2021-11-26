sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator"

], function (JQuery, BaseController, MessageToast, MessageBox, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.PMOrder.viewPMOrders", {
        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("viewPMOrders").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oArgs, oView,
                oArgs = oEvent.getParameter("arguments"),
                oView = this.getView(),
                oTable = oView.byId('PMOrdersList'),
                oStats = oView.byId('IconTabBar_Orders'),
                oModel_empty = new sap.ui.model.json.JSONModel();                

            //clear table
            oModel_empty.setData({});
            oTable.setModel(oModel_empty);
            oStats.setModel(oModel_empty);

            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({ plant: oArgs.Plant });
            oView.setModel(oModel);

            oView.bindElement({
                path: "/",
            });

            var oData = {
                "TIPO_FILTRO": "PRO",
                "FILTRO": oArgs.Plant
            };

            this._base_onloadCOMBO("listPMProceso", oData, "SelloRojo/DatosTransaccionales/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH", "", "Proceso");           

        },  

        onPMOrderDetail: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            this.getRouter().navTo("PMOrderDetail", {
                id: oCtx.getProperty("order")
            });

        },

       onDisplayViewPMBitacora: function () {

            this.getRouter().navTo("viewPMBitacora");
                
        },

        onChangePMProceso: function (oEvent) {
            var oData = {
                "TIPO_FILTRO": "SUBPRO",
                "FILTRO": oEvent.getParameter("selectedItem").getKey()
            };
            this._base_onloadCOMBO("listPMSubProceso", oData, "SelloRojo/DatosTransaccionales/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH", "", "SubProceso");
        },

        onChangePMSubProceso: function (oEvent) {
            var oData = {
                "TIPO_FILTRO": "FUNC",
                "FILTRO": oEvent.getParameter("selectedItem").getKey()
            };
            this._base_onloadCOMBO("listPMFunction", oData, "SelloRojo/DatosTransaccionales/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH", "", "Funcion");
        },

        onShowNoti: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            this.getRouter().navTo("PMNotificationDetail", {
                id: oCtx.getProperty("notification")
            });

        },

        onShowView: function (oEvent) {
            var oItem, oCtx,
                oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                oComboProcess = this.byId("listPMProceso"),
                oComboSubProcess = this.byId("listPMSubProceso"),
                oComboFunction = this.byId("listPMFunction"),
                oInputStartDate = this.byId("start_date"),
                oInputEndDate = this.byId("end_date"),
                oCOR = this.byId("PMCorrective"),
                oCPV = this.byId("PMCorrectivePre"),
                oPRV = this.byId("PMPrevent"),
                start_date = '',
                end_date = '',
                send_start_date = '',
                send_end_date = '',
                plant = "P003",
                xml_data = '';

                xml_data += '<FILTERS>\n';

                xml_data += '<FILTER>\n';
                xml_data += '<FIELD_NAME>OPTIONS_FOR_PLANPLANT</FIELD_NAME>\n';
                xml_data += '<LOW_VALUE>' + plant+ '</LOW_VALUE>\n';  //yyyyMMdd
                xml_data += '<HIGH_VALUE />\n';
                xml_data += '<OPTION>EQ</OPTION>\n';
                xml_data += '</FILTER>\n';

            if (oComboProcess.getSelectedKey() != "" || oComboSubProcess.getSelectedKey() != "" || oComboFunction.getSelectedKey() != "") {
                xml_data += '<FILTER>\n';
                xml_data += '<FIELD_NAME>OPTIONS_FOR_FUNCLOC</FIELD_NAME>\n';

                if (oComboFunction.getSelectedKey() != '')
                    xml_data += '<LOW_VALUE>' + oComboFunction.getSelectedKey() + '</LOW_VALUE>\n';
                else if (oComboSubProcess.getSelectedKey() != "")
                    xml_data += '<LOW_VALUE>' + oComboSubProcess.getSelectedKey() + '*</LOW_VALUE>\n';
                else if (oComboProcess.getSelectedKey() != "")
                    xml_data += '<LOW_VALUE>' + oComboProcess.getSelectedKey() + '*</LOW_VALUE>\n';

                xml_data += '<HIGH_VALUE />\n';
                xml_data += '<OPTION>CP</OPTION>\n';                
                xml_data += '</FILTER>\n';
            }

            start_date = oInputStartDate.getValue();

            if (start_date != "") {
                start_date = start_date.split('-');
                send_start_date = start_date[2] + start_date[1] + start_date[0];
            }
                

                xml_data += '<FILTER>\n';
                xml_data += '<FIELD_NAME>SHOW_DOCS_WITH_FROM_DATE</FIELD_NAME>\n';
                xml_data += '<LOW_VALUE>' + send_start_date + '</LOW_VALUE>\n';  //yyyyMMdd
                xml_data += '<HIGH_VALUE />\n';
                xml_data += '<OPTION>EQ</OPTION>\n';
                xml_data += '</FILTER>\n';

                end_date = oInputEndDate.getValue();
                if (end_date != "") {
                    end_date = end_date.split('-');
                    send_end_date = end_date[2] + end_date[1] + end_date[0];
                }
                

                xml_data += '<FILTER>\n';
                xml_data += '<FIELD_NAME>SHOW_DOCS_WITH_TO_DATE</FIELD_NAME>\n';
                xml_data += '<LOW_VALUE>' + send_end_date + '</LOW_VALUE>\n';  //yyyyMMdd
                xml_data += '<HIGH_VALUE />\n';
                xml_data += '<OPTION>EQ</OPTION>\n';
                xml_data += '</FILTER>\n';

            if (oCOR.getSelected() == true) {
                xml_data += '<FILTER>\n';
                xml_data += '<FIELD_NAME>OPTIONS_FOR_MAINT_ACTIVITYTYPE</FIELD_NAME>\n';
                xml_data += '<LOW_VALUE>' + 'COR' + '</LOW_VALUE>\n'; 
                xml_data += '<HIGH_VALUE/>\n';
                xml_data += '<OPTION>EQ</OPTION>\n';
                xml_data += '</FILTER>\n';
            }

            if (oCPV.getSelected() == true) {
                xml_data += '<FILTER>\n';
                xml_data += '<FIELD_NAME>OPTIONS_FOR_MAINT_ACTIVITYTYPE</FIELD_NAME>\n';
                xml_data += '<LOW_VALUE>' + 'CPV' + '</LOW_VALUE>\n';
                xml_data += '<HIGH_VALUE/>\n';
                xml_data += '<OPTION>EQ</OPTION>\n';
                xml_data += '</FILTER>\n';
            }

            if (oPRV.getSelected() == true) {
                xml_data += '<FILTER>\n';
                xml_data += '<FIELD_NAME>OPTIONS_FOR_MAINT_ACTIVITYTYPE</FIELD_NAME>\n';
                xml_data += '<LOW_VALUE>' + 'PRV' + '</LOW_VALUE>\n';
                xml_data += '<HIGH_VALUE/>\n';
                xml_data += '<OPTION>EQ</OPTION>\n';
                xml_data += '</FILTER>\n';
            }

            xml_data += '<FILTER>\n';
            xml_data += '<FIELD_NAME>SHOW_COMPLETED_DOCUMENTS</FIELD_NAME>\n';
            xml_data += '<LOW_VALUE>X</LOW_VALUE>\n';  //yyyyMMdd
            xml_data += '<HIGH_VALUE />\n';
            xml_data += '<OPTION>EQ</OPTION>\n';
            xml_data += '</FILTER>\n';


            xml_data += '</FILTERS>\n'

            console.log(xml_data);

            var oData = {
                "FILTERS": xml_data,                
            };

            this._base_onloadTable("PMOrdersList", oData, "SelloRojo/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/get_orders", "Ordenes", "IconTabBar_Orders");
        },

        handleIconTabBarSelect: function (oEvent) {
            var aFilter = [],
                oTable = this.byId('PMOrdersList'),
                oBinding = oTable.getBinding('items'),
                sKey = oEvent.getParameter("key");

            if (sKey != 'All') {
                aFilter.push(new Filter("status", FilterOperator.Contains, sKey));
            }

            oBinding.filter(aFilter);
        },

    });
}
);