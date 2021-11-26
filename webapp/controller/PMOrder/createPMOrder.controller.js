sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox"

], function (JQuery, BaseController, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.PMOrder.createPMOrder", {

        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("createPMOrder").attachMatched(this._onRouteMatched, this);
            
        },

        _onRouteMatched: function (oEvent) {
            var oArgs, oView,
                oModel = new sap.ui.model.json.JSONModel(),
                oModel_empty = new sap.ui.model.json.JSONModel(),
                view_button = this.getView().byId("viewButton"),
                create_button = this.getView().byId("createButton");

            oArgs = oEvent.getParameter("arguments");
            oView = this.getView();

            var oTable_Oper = oView.byId('PMOrderOperation');

            oView.byId('PM_orderDesc').setValue(decodeURIComponent(oArgs.short_text));

            oModel.setData({ notification: oArgs.id });
            oModel_empty.setData({});
            oView.setModel(oModel);
            oTable_Oper.setModel(oModel_empty);

            if (view_button.getVisible()) {
                view_button.setVisible(false);
            }

            if (!create_button.getVisible()) {
                create_button.setVisible(true);
            }            

            oView.bindElement({
                path: "/",
            });

            var oData = {};
            this._base_onloadCOMBO('priority', oData, 'SelloRojo/DatosMaestros/Mantenimiento/Prioridad/Transaction/priority', oArgs.priority,"Prioridades");  
        },        

        onViewPMOrder: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            this.getRouter().navTo("PMOrderDetail", {
                id: oCtx.getProperty("order")
            });

        },

        onCreatePMOrder: function (oEvent) {
            var combo_orderType = this.byId("PMType"),
                input_description = this.byId("PM_orderDesc"),
                combo_priority = this.byId("priority"),
                input_work = this.byId("Work_planned");

            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();

            if (input_description.getValue() == '') {
                this.getOwnerComponent().openHelloDialog("Ingresa una descripcion"); 
            }
            else if (input_work.getValue() == '') {
                this.getOwnerComponent().openHelloDialog("Indica el trabajo estimado"); 
            }
            else {
                var oData = {
                    "NOTIFICATION": oCtx.getProperty("notification"),
                    "ORDER_TYPE": combo_orderType.getSelectedKey(),
                    "PRIORITY": combo_priority.getSelectedKey(),
                    "SHORT_TEXT": input_description.getValue(),
                    "ESTIMATED_WORK": input_work.getValue()
                }
                console.log(oData);
                this.createPMOrder('PMOrderOperation', oData, 'SelloRojo/DatosTransaccionales/Mantenimiento/Orden/Crear/Transaction/createOrder');
            }
            
        },

        createPMOrder: function (idObject, oData, path) {

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
                        var aData = eval(opElement.firstChild.data);
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

                            oThis._base_onloadTable('PMOperationList', oData, 'SelloRojo/DatosTransaccionales/Mantenimiento/Orden/Cabecera/Transaction/get_operations', "Operaciones", "");                            

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
