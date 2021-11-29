sap.ui.define([
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/core/syncStyleClass"
], function (BaseController, JSONModel, MessageToast, Fragment, syncStyleClass) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.PP.Visualization.Login", {
        onInit: function () {
            var testModel = this.getOwnerComponent().getModel("salesShare");

            this.getView().setModel(testModel, "salesModel");

        },

        onLogin: function (oEvent) {
            var sUsername = this._getMasterModel("/view/login/username"),
                sPassword = this._getMasterModel("/view/login/password");

            /*var oData = {
                "username": sUsername,
                "password": sPassword
            }*/

            //var server = this._getMasterModel("/server/url");
            //(server);

            //var path="/XMII/Runner?Transaction=Pharma_Prefabricado_Modular/DatosMaestros/Produccion/User/Transaction/select_UsersPhPM_Login&OutputParameter=JsonOutput&Content-Type=text/xml";
            //this._base_loadUser(oData, server, path);
            //CORREGIR: Problema con la asincronía, la verificación se hace dentro de _base_loadUser()
            //this.verifyEnabled();            
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
                if (aData.getProperty("/user/" + validIndex + "/is_enabled") == "1") {                    
                    this.navToOrdersPP();
                } else {
                    console.log("Fragment supervisor");
                }
            } else {
                MessageToast.show("Usuario y/o contraseña incorrectos. Intente de nuevo");
                this._setMasterModel("/view/login/username", "");
                //this._setMasterModel("/view/login/password", "");
            }
        },

        navToOrdersPP: function () {
            var oKey = "PLANTA";
            if (oKey === '')
                console.log("Empty");
            else {
                this.getRouter().navTo("viewPPOrders", {
                    "plant": oKey
                });
            }
        },

        verifyEnabled: function () {
            var oModel = this.getOwnerComponent().getModel("masterModel");
            var oProperty = oModel.getProperty("/user/is_enabled");
            if (oProperty == "1") {
                ("Nav to dashboard");
                this.navToDash();
            } else {
                ("Fragment Supervisor");
                this.onOpenDialog();
            }
        },

        onOpenDialog: function () {
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

        onCloseDialog: function () {
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
        },

        onTestNav: function () {
            this.navToDash();
        }
    });
});