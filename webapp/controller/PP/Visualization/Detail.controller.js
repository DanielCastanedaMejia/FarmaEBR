sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/json/JSONModel',
    "../../../model/formatter",
    "sap/ui/core/syncStyleClass"

], function (JQuery, BaseController, MessageToast, MessageBox, JSONModel, formatter, syncStyleClass) {
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
        onOpenOrderConfirmation: function () {
            const oStart = this._getMasterModel("/view/startedOrder"),
                sNumOrder = this.getView().getModel().getProperty("/NUM_ORDEN");

            if (!oStart)
                this.onOpenStartOrderConfirmation();
            else
            if (oStart !== sNumOrder)
                this.onOpenStartOrderConfirmation();
            else
                this.onOpenFinishOrderDialog();
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
                    name: "sap.ui.demo.webapp.fragment.StartOrderConfirmation"
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

            oOrderModel.setProperty(sOrderPath + "/ESTATUS_MII", "ABIERTA");
            this._setMasterModel("/view/startedOrder", sOrder);

            this.closeDialog("startOrderConfirmationDialog");
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
        onOpenFinishOrderConfirmation: function () {
            if (!this.closeOrderConfirmationDialog) {
                this.closeOrderConfirmationDialog = this.loadFragment({
                    name: "sap.ui.demo.webapp.fragment.CloseOrderConfirmation"
                });
            }
            this.closeOrderConfirmationDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onOpenFinishOrderDialog: function () {
            if (!this.finishOrderDialog) {
                this.finishOrderDialog = this.loadFragment({
                    name: "sap.ui.demo.webapp.fragment.FinishOrder"
                });
            }
            this.finishOrderDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onOpenImageDetailDialog: function () {
            if (!this.imageDetailDialog) {
                this.imageDetailDialog = this.loadFragment({
                    name: "sap.ui.demo.webapp.fragment.ImageDetail"
                });
            }
            this.imageDetailDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onCloseDialog: function (oEvent) {
            const oSource = oEvent.getSource();
            this.byId(oSource.getId() + "Dialog").close();
        },
        closeDialog: function (sId) {
            this.byId(sId).close();
        },
        onFinishOrder: function () {
            const sPath = this._getMasterModel("/selectedOrder"),
                oOrderModel = this.getOwnerComponent().getModel("ordersModel");

            oOrderModel.setProperty(sPath + "/ESTATUS_MII", "CERRADA");
            this._setMasterModel("/selectedOrder", "");
            this._setMasterModel("/view/startedOrder", false);
            this._setMasterModel("/view/prepProcessFinished", false);
            const resetValidations = new JSONModel({
                "values": {
                    "sfc": "0000102429-025",
                    "date": "2021-11-01",
                    "user": "P446327"
                },
                "vStep1": false,
                "vStep2": false,
                "vStep3": false,
                "step1": {
                    "v1": false,
                    "v2": false,
                    "v3": false,
                    "v4": false,
                    "v5": false
                },
                "step2": {
                    "values": {
                        "t1": "",
                        "t2": "",
                        "t3": "",
                        "t4": "",
                        "t5": "",
                        "t6": "",
                        "t7": ""
                    },
                    "v1": false,
                    "v2": false,
                    "v3": false,
                    "v4": false,
                    "v5": false,
                    "v6": false,
                    "v7": false
                },
                "step3": {
                    "v1": false,
                    "v2": false,
                    "v3": false,
                    "v4": false,
                    "v5": false,
                    "v6": false,
                    "v7": false,
                    "v8": false,
                    "v9": false,
                    "v10": false,
                    "v11": false,
                    "v12": false
                }
            });
            this._setMasterModel("/validations", resetValidations);
            this.closeDialog("finishOrderDialog");
            this.closeDialog("FinishOrderConfirmationDialog");
            window.history.go(-1);
        },
        onAcceptStep1Dialog: function () {
            this.setEbrStatus("1");
            this._setMasterModel("/validations/vStep1", true);
            this.closeDialog("step1Dialog");
        },
        onCloseCharts: function () {
            this.byId("oDialogReport").close();
        },
        onAcceptStep2Dialog: function () {
            this.setEbrStatus("2");
            this._setMasterModel("/validations/vStep2", true);
            this.closeDialog("step2Dialog");
        },
        onCloseStep2Dialog: function () {
            this.closeDialog("step2Dialog");
        },
        onAcceptStep3Dialog: function () {            
            this.onOpenSuperVDialog();
            //this._setMasterModel("/view/prepProcessFinished", true);
            //this.closeDialog("step3Dialog");
            //this.closeDialog("prepProcessDialog");

            //MessageToast.show("Proceso finalizado, ahora puede iniciar la orden");
        },
        onOpenSuperVDialog: function () {
            // create dialog lazily
            if (!this.pDialog) {
                // @ts-ignore
                this.pDialog = this.loadFragment({
                    name: "sap.ui.demo.webapp.view.PP.Visualization.SupervisorLogin"
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
        onCloseSuperDialog: function () {
            // note: We don't need to chain to the pDialog promise, since this event-handler
            // is only called from within the loaded dialog itself.
            this.byId("supervisorLogDialog").close();
        },
        onAcceptDialog: function () {
            var sUsername = this._getMasterModel("/view/supervisorLogin/username"),
                sPassword = this._getMasterModel("/view/supervisorLogin/password");

            var oData = {
                "username": sUsername,
                "password": sPassword
            }

            var server = this._getMasterModel("/server/url");
            (server);

            //var path="/XMII/Runner?Transaction=Pharma_Prefabricado_Modular/DatosMaestros/Produccion/User/Transaction/select_UsersPhPM_Login&OutputParameter=JsonOutput&Content-Type=text/xml";
            //this._base_loadSuperv(oData, server, path);
            //this.byId("supervisorLogDialog").close();

            var oModel = new JSONModel();
            var aData = this.getOwnerComponent().getModel("usersModel");
            oModel.setData(aData);
            var nModel = oModel.oData.getProperty("/user").length;
            var userModel, passModel;
            var validIndex, validUser = false;
            for (var i = 0; i < nModel; i++) {
                userModel = aData.getProperty("/user/" + i + "/username");
                passModel = aData.getProperty("/user/" + i + "/password");
                if (userModel == sUsername && sPassword == passModel) {
                    validUser = true;
                    validIndex = i;
                    break;
                }
            }
            if (validUser) {
                if (aData.getProperty("/user/" + validIndex + "/is_supervisor") == "1") {
                    this.setEbrStatus("3");
                    this._setMasterModel("/view/prepProcessFinished", true);
                    this._setMasterModel("/validations/supervisorValidation", true);
                    this.closeDialog("step3Dialog");
                    this.closeDialog("prepProcessDialog");
                    this.closeDialog("supervisorLogDialog");
                    this._setMasterModel("/validations/vStep3", true);

                    MessageToast.show("Proceso finalizado, ahora puede iniciar la orden");
                } else {
                    MessageToast.show("Es necesario el inicio de sesión de un supervisor. Intente de nuevo");
                    this._setMasterModel("/view/supervisorLogin/password", "");

                }
            } else {
                MessageToast.show("Usuario y/o contraseña incorrectos. Intente de nuevo");
                this._setMasterModel("/view/supervisorLogin/password", "");
                //this._setMasterModel("/view/login/password", "");
            }
        },
        onRangeChange: function () {
            //MessageToast.show("Cambio el valor prro");
            if(this.byId("rangeId").getValue() >= 380 && this.byId("rangeId").getValue() <= 400) {
                this.byId("switchRangeId").setState(true);
            } else {
                this.byId("switchRangeId").setState(false);
            }
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
        },
        setEbrStatus: function (sStatus) {
            var sPath = this._getMasterModel("/selectedOrder"),
                oOrderModel = this.getOwnerComponent().getModel("ordersModel");

            oOrderModel.setProperty(sPath + "/EBR_STATUS", sStatus);
        }

    });
});