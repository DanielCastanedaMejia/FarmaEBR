sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator"

], function (JQuery, BaseController, MessageToast, MessageBox, Filter, FilterOperator) {
    "use strict";

    var plant_gb = '';

    return BaseController.extend("sap.ui.demo.webapp.controller.PMOrder.viewPMOrdersAGRO", {
        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("viewPMOrdersAGRO").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oArgs, oView,
                oArgs = oEvent.getParameter("arguments"),
                oView = this.getView(),
                oAGR = this.byId('PMAgro'),
                oTable = oView.byId('PMOrdersList'),
                oModel_empty = new sap.ui.model.json.JSONModel(),
                xml_data = '';

            //clear table
            oModel_empty.setData({})
            oTable.setModel(oModel_empty);

            oAGR.setSelected(true);

            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({ plant: oArgs.Plant });
            oView.setModel(oModel);

            plant_gb = oArgs.Plant.split('-')[1];

            oView.bindElement({
                path: "/",
            });

            xml_data += '<FILTERS>\n';

            xml_data += '<FILTER>\n';
            xml_data += '<FIELD_NAME>OPTIONS_FOR_PLANPLANT</FIELD_NAME>\n';
            xml_data += '<LOW_VALUE>' + oArgs.Plant.split('-')[1] + '</LOW_VALUE>\n';  //yyyyMMdd
            xml_data += '<HIGH_VALUE />\n';
            xml_data += '<OPTION>EQ</OPTION>\n';
            xml_data += '</FILTER>\n';

            xml_data += '<FILTER>\n';
            xml_data += '<FIELD_NAME>SHOW_COMPLETED_DOCUMENTS</FIELD_NAME>\n';
            xml_data += '<LOW_VALUE>X</LOW_VALUE>\n';  //yyyyMMdd
            xml_data += '<HIGH_VALUE />\n';
            xml_data += '<OPTION>EQ</OPTION>\n';
            xml_data += '</FILTER>\n';

            xml_data += '<FILTER>\n';
            xml_data += '<FIELD_NAME>OPTIONS_FOR_MAINT_ACTIVITYTYPE</FIELD_NAME>\n';
            xml_data += '<LOW_VALUE>' + 'AGR' + '</LOW_VALUE>\n';
            xml_data += '<HIGH_VALUE/>\n';
            xml_data += '<OPTION>EQ</OPTION>\n';
            xml_data += '</FILTER>\n';

            xml_data += '</FILTERS>\n';

            var oData = {
                "FILTERS": xml_data,
                "START_DATE": "",
                "END_DATE": ""
            };

            console.log(oData);

            this._base_onloadTable("PMOrdersList", oData, "EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/get_ordersAGRO", "Ordenes", "IconTabBar_Orders");

        },

        onPMOrderDetail: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();

            if (oCtx.getProperty("order_type") == 'AGRO')
                this.getRouter().navTo("PMOrderDetailAGRO", {
                    id: oCtx.getProperty("order"),
                    plant: plant_gb
                });
            else
                this.getRouter().navTo("PMOrderDetail", {
                    id: oCtx.getProperty("order"),
                    plant: plant_gb
                });

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
                oInputStartDate = this.byId("start_date"),
                oInputEndDate = this.byId("end_date"),
                oCOR = this.byId("PMCorrective"),
                oCPV = this.byId("PMCorrectivePre"),
                oPRV = this.byId("PMPrevent"),
                oAGR = this.byId('PMAgro'),
                start_date = '',
                end_date = '',
                plant = oCtx.getProperty("plant"),
                xml_data = '';

            xml_data += '<FILTERS>\n';
            xml_data += '<FILTER>\n';
            xml_data += '<FIELD_NAME>OPTIONS_FOR_PLANPLANT</FIELD_NAME>\n';
            xml_data += '<LOW_VALUE>' + plant.split('-')[1] + '</LOW_VALUE>\n';  //yyyyMMdd
            xml_data += '<HIGH_VALUE />\n';
            xml_data += '<OPTION>EQ</OPTION>\n';
            xml_data += '</FILTER>\n';

            if (oInputStartDate.getValue() != "") {

                start_date = oInputStartDate.getValue();
                start_date = start_date.split('-');

                xml_data += '<FILTER>\n';
                xml_data += '<FIELD_NAME>SHOW_DOCS_WITH_FROM_DATE</FIELD_NAME>\n';
                xml_data += '<LOW_VALUE>' + start_date[2] + start_date[1] + start_date[0] + '</LOW_VALUE>\n';  //yyyyMMdd
                xml_data += '<HIGH_VALUE />\n';
                xml_data += '<OPTION>EQ</OPTION>\n';
                xml_data += '</FILTER>\n';
            }

            if (oInputEndDate.getValue() != "") {

                end_date = oInputEndDate.getValue();
                end_date = end_date.split('-');

                xml_data += '<FILTER>\n';
                xml_data += '<FIELD_NAME>SHOW_DOCS_WITH_TO_DATE</FIELD_NAME>\n';
                xml_data += '<LOW_VALUE>' + end_date[2] + end_date[1] + end_date[0] + '</LOW_VALUE>\n';  //yyyyMMdd
                xml_data += '<HIGH_VALUE />\n';
                xml_data += '<OPTION>EQ</OPTION>\n';
                xml_data += '</FILTER>\n';
            }

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

            if (oAGR.getSelected() == true) {
                xml_data += '<FILTER>\n';
                xml_data += '<FIELD_NAME>OPTIONS_FOR_MAINT_ACTIVITYTYPE</FIELD_NAME>\n';
                xml_data += '<LOW_VALUE>' + 'AGR' + '</LOW_VALUE>\n';
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

            xml_data += '</FILTERS>\n';            

            var oData = {
                "FILTERS": xml_data,
                "START_DATE": start_date,
                "END_DATE": end_date
            };
            console.log(xml_data);
            this._base_onloadTable("PMOrdersList", oData, "EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/get_ordersAGRO", "Ordenes", "IconTabBar_Orders");
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