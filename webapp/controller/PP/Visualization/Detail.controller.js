sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/json/JSONModel',
    "../../../model/formatter"

], function (JQuery, BaseController, MessageToast, MessageBox, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.PP.Visualization.Detail", {
        formatter: formatter,
        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("orderDetail").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oArgs, oView;
            oArgs = oEvent.getParameter("arguments");
            oView = this.getView();

            var oTable = oView.byId("PMOperationList");
            var oModel_empty = new sap.ui.model.json.JSONModel();
            oModel_empty.setData({});
            oTable.setModel(oModel_empty);

            oView.bindElement({
                path: "/"
            });

            var aData = {
                "NUM_ORDEN": oArgs.orden,
                "FILTRO": oArgs.orden
            };

            var sPath = this.getOwnerComponent().getModel("masterModel").getProperty("/selectedOrder");

            var orderModel = this.getOwnerComponent().getModel("ordersModel").getProperty(sPath);

            var newModel = new JSONModel(orderModel);
            this.getView().setModel(newModel);
            //this._base_onloadHeader(aData, "FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/header", "Cabecera");

            for (var i = 0; i < 3; i++) {
                this.getOwnerComponent().getModel("fasesModel").setProperty("/ITEMS/" + i.toString() + "/orden", newModel.getProperty("/NUM_ORDEN"));
                this.getOwnerComponent().getModel("fasesModel").setProperty("/ITEMS/" + i.toString() + "/ctdopera", newModel.getProperty("/CANTIDAD_PROGRAMADA"));
            }
            this.byId("PMOperationList").setModel(this.getOwnerComponent().getModel("fasesModel"));

            //this._base_onloadTable('PMOperationList', aData, 'FARMA/DatosTransaccionales/Produccion/Ordenes/Visualizar/Transaction/Operaciones_componentes_RESPALDO_', "Operaciones", "");
        },
        onOpenDialogAddOperation: function (oEvent) {
            var oView = this.getView();
            var oDialog = oView.byId("AddOperationDialog");
            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.view.PMOperationMod", this);
                oView.addDependent(oDialog);
            }
            var
                oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                oData = {
                    "PLANT": oCtx.getProperty("plant")
                };

            oView.byId('inputDescOperation').setValue('');
            oView.byId('inputWorkOperation').setValue('');

            this._base_onloadCOMBO("workCenter_list", oData, "EquipandoXXI/DatosMaestros/Produccion/CentroTrabajo/Transaction/get_workCenter", oCtx.getProperty("work_center"), "Centro Trabajo");

            oDialog.open();
        },
        onOpenDialogCloseOrder: function (oEvent) {
            var oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                order = oCtx.getProperty("order"),
                resourceModel = this.getView().getModel("i18n"),
                oData = {
                    "ORDER": order
                };

            this._handleMessageBoxOpen(resourceModel.getResourceBundle().getText("MessageConfirmCTEC"), "warning", oData, this);
        },
        _handleMessageBoxOpen: function (sMessage, sMessageBoxType, oData, oThis) {
            MessageBox[sMessageBoxType](sMessage, {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        oThis.changeOrderStatus(oData, 'EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Cerrar/Transaction/cerrar_orden');
                    }
                }.bind(this)
            });
        },
        onPPOrderOperation: function (oEvent) {
            var oItem, oCtx, sPath;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            sPath = oCtx.getPath();
            this.getOwnerComponent().getModel("masterModel").setProperty("/selectedFase", sPath);
            this.getRouter().navTo("operationDetail", {
                orden: oCtx.getProperty("orden"),
                operacion: oCtx.getProperty("Ope"),
                planta: oCtx.getProperty('1710')
            });
        },
        onOpenDialog: function () {
            this.getOwnerComponent().openHelloDialog();
        },
        onOpenDialogStart: function (oEvent) {
            var oItem, oCtx,
                oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                oView = this.getView(),
                oDialog = oView.byId("PMNewUserDialog");

            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.view.PMNewUser", this);
                oView.addDependent(oDialog);
            }
        },
        changeOrderStatus: function (oData, path) {

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
                        } else {
                            //Create  the JSON model and set the data                                                                                                
                            MessageToast.show(aData[0].message);
                            var aData = {
                                "ORDER": aData[0].object,
                            };

                            oThis._base_onloadHeader(aData, "EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/visualizar_orden", "Cabecera");
                        }

                    } else {
                        MessageToast.show("No se recibio información");
                    }

                    sap.ui.core.BusyIndicator.hide();

                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud a fallado: Hay conexión de red?");
                    }
                    sap.ui.core.BusyIndicator.hide();
                });

        },
        onOpenOrderConfirmation: function() {
            const oStart = this._getMasterModel("/view/startedOrder"),
                sNumOrder = this.getView().getModel().getProperty("/NUM_ORDEN");
            
            if(!oStart)
                this.onOpenStartOrderConfirmation();
            else
                if(oStart !== sNumOrder) 
                    this.onOpenStartOrderConfirmation();
                else
                    this.onOpenFinishOrderConfirmation();
        },
        onOpenStartOrderConfirmation: function () {
            var oThis = this;

            if (this._getMasterModel("/view/startedOrder")) {
                const i18n = this.getView().getModel("i18n").getResourceBundle();

                MessageToast.show(i18n.getText("alreadyStartedOrderMsg"));
                return;
            }

            if (!this.startOrderConfirmationDialog) {
                this.startOrderConfirmationDialog = this.loadFragment({
                    name: "sap.ui.demo.webapp.fragment.startOrderConfirmation"
                });
            }
            this.startOrderConfirmationDialog.then(function (oDialog) {
                const sPath = oThis._getMasterModel("/selectedOrder"),
                    oOrderModel = oThis.getOwnerComponent().getModel("ordersModel"),
                    NUM_ORDEN = oOrderModel.getProperty(sPath + "/NUM_ORDEN"),
                    TIPO = oOrderModel.getProperty(sPath + "/TIPO"),
                    MATERIAL = oOrderModel.getProperty(sPath + "/MATERIAL"),
                    DESC_MATERIAL = oOrderModel.getProperty(sPath + "/DESC_MATERIAL"),
                    CANTIDAD_PROGRAMADA = oOrderModel.getProperty(sPath + "/CANTIDAD_PROGRAMADA"),
                    INICIO_PLANEADO = oOrderModel.getProperty(sPath + "/INICIO_PLANEADO"),
                    FIN_PLANEADO = oOrderModel.getProperty(sPath + "/FIN_PLANEADO"),
                    PLANTA = oOrderModel.getProperty(sPath + "/PLANTA"),
                    LOTE = oOrderModel.getProperty(sPath + "/LOTE"),
                    LOTE_INSPECCION = oOrderModel.getProperty(sPath + "/LOTE_INSPECCION").substring(0, 10),
                    UNIDA_MEDIDA = oOrderModel.getProperty(sPath + "/UNIDA_MEDIDA").substring(0, 10);

                var oStartModel = new JSONModel({
                    "NUM_ORDEN": NUM_ORDEN,
                    "TIPO": TIPO,
                    "MATERIAL": MATERIAL,
                    "DESC_MATERIAL": DESC_MATERIAL,
                    "CANTIDAD_PROGRAMADA": CANTIDAD_PROGRAMADA,
                    "INICIO_PLANEADO": INICIO_PLANEADO,
                    "FIN_PLANEADO": FIN_PLANEADO,
                    "PLANTA": PLANTA,
                    "LOTE": LOTE,
                    "LOTE_INSPECCION": LOTE_INSPECCION,
                    "UNIDA_MEDIDA": UNIDA_MEDIDA
                });

                oThis.getView().setModel(oStartModel, "startOrder");
                oDialog.open();
            });
        },
        onStartOrder: function () {
            const sOrderPath = this._getMasterModel("/selectedOrder"),
                oOrderModel = this.getOwnerComponent().getModel("ordersModel"),
                sOrder = oOrderModel.getProperty(sOrderPath + "/NUM_ORDEN");

            oOrderModel.setProperty(sOrderPath + "/ESTATUS_MII", "INICIADA");
            this._setMasterModel("/view/startedOrder", sOrder);

            this.onCloseStartOrderConfirmation();
        },
        onOpenProcessDialog: function () {
            if (!this.prepProcessDialog) {
                this.prepProcessDialog = this.loadFragment({
                    name: "sap.ui.demo.webapp.fragment.PrepProcess"
                });
            }
            this.prepProcessDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onCloseStartOrderConfirmation: function () {
            this.byId("startOrderConfirmationDialog").close();
        },
        onOpenFinishOrderConfirmation: function() {
            if(!this.closeOrderConfirmationDialog) {
                this.closeOrderConfirmationDialog = this.loadFragment({
                    name: "sap.ui.demo.webapp.fragment.closeOrderConfirmation"
                });
            }
            this.closeOrderConfirmationDialog.then(function(oDialog) {
                oDialog.open();
            });
        },
        onFinishOrder: function() {
            const sPath = this._getMasterModel("/selectedOrder"),
                oOrderModel = this.getOwnerComponent().getModel("ordersModel");

            oOrderModel.setProperty(sPath + "/ESTATUS_MII", "CERRADA");
            this._setMasterModel("/selectedOrder", "");
            this._setMasterModel("/view/startedOrder", false);
            
            this.onCloseFinishOrderConfirmation();
            window.history.go(-1);
        },
        onCloseFinishOrderConfirmation: function() {
            this.byId("FinishOrderConfirmationDialog").close();
        },
        onCloseProcessDialog: function () {
            this.byId("prepProcessDialog").close();
        },
        onCloseStep1Dialog: function () {
            this.byId("step1Dialog").close();
        },
        onAcceptStep1Dialog: function () {
            this._setMasterModel("/validations/vStep1", true);
            this.onCloseStep1Dialog();
        },
        onCloseCharts: function () {
            this.byId("oDialogReport").close();
        },
        onAcceptStep2Dialog: function () {
            this._setMasterModel("/validations/vStep2", true);
            this.onCloseStep2Dialog();
        },
        onCloseStep2Dialog: function () {
            this.byId("step2Dialog").close();
        },
        onAcceptStep3Dialog: function () {
            this._setMasterModel("/validations/vStep3", true);
            this._setMasterModel("/view/prepProcessFinished", true);
            this.onCloseStep3Dialog();
            this.onCloseProcessDialog();

            MessageToast.show("Proceso finalizado, ahora puede iniciar la orden");
        },
        onCloseStep3Dialog: function () {
            this.byId("step3Dialog").close();
        },
        onScrapComponent: function () {
            MessageToast.show("Componente de Scrap");
        },
        onScrapUnit: function () {
            MessageToast.show("Unidad de Scrap");
        },
        onBuyOff: function () {
            MessageToast.show("BuyOff");
        },
        onGraphics: function () {
            MessageToast.show("Gráficas");
            if (!this.pDialog) {
                // @ts-ignore
                this.pDialog = this.loadFragment({
                    name: "sap.ui.demo.webapp.fragment.Charts"
                }).then(function (oDialog) {
                    // forward compact/cozy style into dialog
                    syncStyleClass("sapUiSizeCondensed", this.getView(), oDialog);
                    return oDialog;
                }.bind(this));
            }
            this.pDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onReports: function () {
            MessageToast.show("Reportes");
        },
        onDHRReview: function () {
            MessageToast.show("Revisión de DHR");
        },
        onFirstStep: function () {
            if (!this.step1Dialog) {
                this.step1Dialog = this.loadFragment({
                    name: "sap.ui.demo.webapp.fragment.Step1"
                });
            }
            this.step1Dialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onSecondStep: function () {
            if (!this._getMasterModel("/validations/vStep1")) {
                MessageToast.show("Verifique el proceso anterior antes de continuar");
                return;
            }
            if (!this.step2Dialog) {
                this.step2Dialog = this.loadFragment({
                    name: "sap.ui.demo.webapp.fragment.Step2"
                });
            }
            this.step2Dialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onThirdStep: function () {
            if (!this._getMasterModel("/validations/vStep2")) {
                MessageToast.show("Verifique el proceso anterior antes de continuar");
                return;
            }
            if (!this.step3Dialog) {
                this.step3Dialog = this.loadFragment({
                    name: "sap.ui.demo.webapp.fragment.Step3"
                });
            }
            this.step3Dialog.then(function (oDialog) {
                oDialog.open();
            });
            var oDate = new Date();
            var sToday = oDate.toJSON();
            sToday = sToday.substring(0, 10);

            var oDate = this._getMasterModel("/validations/values/date");
        },
        onPressTimer: function (oEvent) {
            var idLength = oEvent.getSource().getId().toString();
            var nId = idLength.at(idLength.length - 1);
            var minutes;
            var second;
            var actualTimer
            var timer_isPressed = this.getOwnerComponent().getModel("masterModel").getProperty("/buttonTimer/" + nId + "/started");
            if (timer_isPressed == "0") {
                this.getOwnerComponent().getModel("masterModel").setProperty("/buttonTimer/" + nId + "/started", "1");
                var time = this.getView().byId("timer" + nId);
                var fiveMinutesLater = new Date();
                var scs = fiveMinutesLater.setMinutes(fiveMinutesLater.getMinutes());

                var countdowntime = scs;

                this.x = setInterval(function () {
                    var now = new Date().getTime();
                    var cTime = now - countdowntime;
                    minutes = Math.floor((cTime % (1000 * 60 * 60)) / (1000 * 60));
                    second = Math.floor((cTime % (1000 * 60)) / 1000);
                    this.minStatic = String(minutes);
                    this.secStatic = second.toString();
                    if (second.toString().length == 1)
                        time.setText(minutes + ":" + "0" + second);
                    else
                        time.setText(minutes + ":" + second);
                });
            } else {
                this.getOwnerComponent().getModel("masterModel").setProperty("/buttonTimer/" + nId + "/started", "0");
                this.getOwnerComponent().getModel("masterModel").setProperty("/buttonTimer/" + nId + "/complete", "1");
                this.getOwnerComponent().getModel("masterModel").setProperty("/buttonTimer/" + (parseInt(nId) + 1) + "/complete", "0");
                this.getOwnerComponent().getModel("masterModel").setProperty("/validations/step2/values/t" + nId, true);

                clearInterval(this.x);
            }
        }

    });
});