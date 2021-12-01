sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/json/JSONModel',
    "sap/ui/demo/webapp/model/formatter"

], function (JQuery, BaseController, MessageToast, MessageBox, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.PP.Visualization.QA", {
        formatter: formatter,
        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("QA").attachMatched(this._onRouteMatched, this);
            const oMatModel = this.getOwnerComponent().getModel("materialModel"),
               oNewModel = new JSONModel(oMatModel.getProperty("/items"));

            var oQAModel = this.getOwnerComponent().getModel("QAModel"),
                qNewModel = new JSONModel(oQAModel.getProperty("/items"));

            this.byId("charListQM").setModel(qNewModel);
            this.byId("MMBarchChars").setModel(oNewModel);
        },
        _onRouteMatched: function (oEvent) {
            var
                oArgs = oEvent.getParameter("arguments"),
                oView = this.getView();

            var aData = {
                "NUM_ORDEN": oArgs.orden,
                "OPERACION": oArgs.operacion
            };

            //this.byId("PMComponentList").setModel(this.getOwnerComponent().getModel("componentsModel"));
            //this._base_onloadTable2("PMComponentList", aData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/components_raiz", "Componentes", "");
            //this.byId("PMMAFList").setModel(this.getOwnerComponent().getModel("mafModel"));
            //this._base_onloadTable("PMMAFList", aData, "GIM/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/maf_operation_BD", "MAF", "");

            var oMasterModel = this.getOwnerComponent().getModel("masterModel"),
                oHeadModel = this.getOwnerComponent().getModel("headModel"),
                oOrderModel = this.getOwnerComponent().getModel("ordersModel"),
                oOpeModel = this.getOwnerComponent().getModel("fasesModel"),
                sOrderPath = oMasterModel.getProperty("/selectedOrder"),
                sOpePath = oMasterModel.getProperty("/selectedFase"),
                fDone = oOpeModel.getProperty(sOpePath + "/avance"),
                iDone, iLeft;

            const sOrder = oOrderModel.getProperty(sOrderPath + "/NUM_ORDEN"),
                iQty = oOrderModel.getProperty(sOrderPath + "/CANTIDAD_PROGRAMADA"),
                sOpe = oOpeModel.getProperty(sOpePath + "/Ope");

            if (fDone == "NA") {
                iDone = 0;
            } else {
                iDone = Math.floor(iQty * (fDone / 100));
            }
            iLeft = iQty - iDone;

            oHeadModel.setProperty("/FALTANTE", iLeft);
            oHeadModel.setProperty("/PRODUIDO", iDone);
            oHeadModel.setProperty("/ORDEN", sOrder);
            oHeadModel.setProperty("/OPERACION", sOpe);
            oHeadModel.setProperty("/AVANCE", fDone);
            oHeadModel.setProperty("/PROGRAMADO", iQty);

            var newModel = new JSONModel(oHeadModel.getProperty("/"));

            this.getView().setModel(newModel);
            //this._base_onloadHeader(aData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/operation_header", "Cabecera");

            var columns = {
                columns: [{
                        Column: "Res no",
                        Visible: 0
                    },
                    {
                        Column: "Res Item",
                        Visible: 0
                    },
                    {
                        Column: "Codigo",
                        Visible: 1
                    },
                    {
                        Column: "Material",
                        Visible: 1
                    },
                    {
                        Column: "Planta",
                        Visible: 1
                    },
                    {
                        Column: "Almacen",
                        Visible: 1
                    },
                    {
                        Column: "Lote",
                        Visible: 1
                    },
                    {
                        Column: "Cantidad",
                        Visible: 1
                    },
                    {
                        Column: "UM",
                        Visible: 1
                    },
                    {
                        Column: "Mov",
                        Visible: 0
                    }
                ]
            };

            this._setColumns(columns, "columnList", "PMComponentList");
        },
        onButtonChange: function(oEvent) {
            var oModel = this.getOwnerComponent().getModel("QAModel"),
                oSource = oEvent.getSource(),
                oContext = oSource.getBindingContext(),
                sPath = oContext.getPath(),
                bFlag = oSource.getSelectedKey();
            
            if(bFlag == "1") {
                oModel.setProperty(sPath + "/estatus", "APROBADO");
                this.byId("charListQM").getModel().setProperty(sPath + "/estatus", "APROBADO");                
            } else {
                oModel.setProperty(sPath + "/estatus", "DESAPROBADO"); 
                this.byId("charListQM").getModel().setProperty(sPath + "/estatus", "DESAPROBADO");   
            }
        },
        confirmRegister: function() {
            MessageBox["warning"]("¿Seguro que desea registrar los resultados?", {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {

                        var oModel = this.getOwnerComponent().getModel("QAModel");

                        oModel.setProperty("/register", true);
                        console.log("ENTRAAAA")
                        MessageToast.show("Resultados registrados");
                    }
                }.bind(this)
            });
        },
        job: function(){
            if (!this.jD) {
                this.jD = this.loadFragment({
                    name: "sap.ui.demo.webapp.fragment.ConfirmJob"
                });
            }
            this.jD.then(function(oD) {
                oD.open();
            });
        },
        onCancelJob: function() {
            this.byId("jobDialog").close();
        },
        onCloseJob: function() {
            MessageToast.show("Decisión de empleo grabada");
            this.onCancelJob();
        }
    });

});