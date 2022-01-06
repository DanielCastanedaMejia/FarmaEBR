sap.ui.define([
    "sap/ui/demo/webapp/controller/BaseController"

], function (BaseController) {
    "use strict";
    return BaseController.extend("sap.ui.demo.webapp.controller.Home", {
        onInit: function () {
            //this._getUsuario("username");
            //this.apiServices();
        },

        apiServices: function () {
            // @ts-ignore
            var oThis = this;

            sap.ui.core.BusyIndicator.show(0);
            var apiKey = "Bkvw5KRDxcM9ft2byQ2pVDmXMh9gEIGD";


            console.log(oData);

            var data = new FormData();
            data = this.byId("logo");

            var oData = {
                files: data,
                options: {
                    "lang": "en",
                    "outputType": "txt",
                    "pageSegMode": "1",
                    "modelType": "lstmStandard"
                }
            };
            console.log(data)

            // @ts-ignore
            $.ajax({
                type: "POST",
                headers: {
                    "APIkey": apiKey
                },
                dataServiceVersion: "2.0",
                accept: "aplication/json; charset=utf-8",
                formData: {
                    files: data,
                    options: {
                        "lang": "en",
                        "outputType": "txt",
                        "pageSegMode": "1",
                        "modelType": "lstmStandard"
                    }
                },
                contentType: "multipart/form-data",
                url: "http://localhost:8020/proxy",
                // @ts-ignore
                success: function (result) {
                    console.log("OK");
                    sap.ui.core.BusyIndicator.hide();

                },
                // @ts-ignore
                error: function (XMLHttpRequest, textStatus) {
                    console.log("Error");
                    sap.ui.core.BusyIndicator.hide();
                }
            });

        },

        createCORSRequest: function (method, url) {
            var xhr = new XMLHttpRequest();
            if ("withCredentials" in xhr) {

                // Check if the XMLHttpRequest object has a "withCredentials" property.
                // "withCredentials" only exists on XMLHTTPRequest2 objects.
                xhr.open(method, url, true);

            // @ts-ignore
            } else if (typeof XDomainRequest != "undefined") {

                // Otherwise, check if XDomainRequest.
                // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
                // @ts-ignore
                xhr = new XDomainRequest();
                xhr.open(method, url);

            } else {

                // Otherwise, CORS is not supported by the browser.
                xhr = null;

            }
            return xhr;
            // @ts-ignore
            var xhr = createCORSRequest('GET', url);
            if (!xhr) {
                throw new Error('CORS not supported');
            }
        },

        onLogout: function () {
            this.getRouter().navTo("appHome");
            this.getOwnerComponent().getModel("masterModel").setProperty("/view/login/username", "");
            this.getOwnerComponent().getModel("masterModel").setProperty("/view/login/password", "");
            this.getOwnerComponent().getModel("masterModel").setProperty("/view/supervisorLogin/username", "");
            this.getOwnerComponent().getModel("masterModel").setProperty("/view/supervisorLogin/password", "");
        },

        onOpenDialog: function () {
            this.getOwnerComponent().openHelloDialog();
        },

        onGotoHome() {
            // Mantener como IP remoto 
            // window.location.href="http://localhost:8010/proxy/XMII/CM/MenuTiles/index.html"; 
            window.location.href = "http://baycomiidemo.ddns.net:50000/XMII/CM/MenuTilesP/index.html";
        },

        onDisplayViewQMOrders: function () {
            //var oList = this.byId("listPMPlantaBlock");
            //var oKey = oList.getSelectedKey();
            var oKey = "1710";
            if (oKey === '')
                console.log("Empty");
            else {
                this.getRouter().navTo("viewQMOrders", {
                    "plant": oKey
                });
            }
        },

        onDisplayOrder: function () {
            //var oList = this.byId("listPMPlantaBlock");
            //var oKey = oList.getSelectedKey();
            var oKey = "1710";
            if (oKey === '')
                console.log("Empty");
            else {
                /*this.getRouter().navTo("viewPPOrders", {
                    "plant": oKey
                });*/
                this.getRouter().navTo("viewPPOrders", {					
					"?query": {
						plant: oKey
					}
				});
			
            }
        },


        onDisplayCreatePMNotification: function () {
            var oList = this.byId("listPMPlantaBlock");
            var oKey = oList.getSelectedKey();
            if (oKey == '')
                this.getOwnerComponent().openHelloDialog("No hay planta seleccionada");
            else {
                this.getRouter().navTo("createPMNotification", {
                    "Plant": "PLANTA"
                });
            }
        },
        onDisplayViewPMNotification: function () {
            //var oList = this.byId("listPMPlantaBlock");
            //var oKey = oList.getSelectedKey();
            var oKey = "PLANTA";
            if (oKey == '')
                this.getOwnerComponent().openHelloDialog("No hay planta seleccionada");
            else {
                this.getRouter().navTo("viewPMNotification", {
                    "Plant": "PLANTA"
                });
            }
        },
        onDisplayViewPMOrder: function () {
            var oList = this.byId("listPMPlantaBlock");
            var oKey = oList.getSelectedKey();
            if (oKey == '')
                this.getOwnerComponent().openHelloDialog("No hay planta seleccionada");
            else {
                this.getRouter().navTo("viewPMOrders", {
                    "Plant": "PLANTA"
                });
            }
        },
        onDisplayViewPMUser: function () {
            var oList = this.byId("listPMPlantaBlock");
            var oKey = oList.getSelectedKey();
            if (oKey == '')
                this.getOwnerComponent().openHelloDialog("No hay planta seleccionada");
            else {
                this.getRouter().navTo("viewPMUser");
            }
        },
        onDisplayViewPMBitacora: function () {
            var oList = this.byId("listPMPlantaBlock");
            var oKey = oList.getSelectedKey();
            if (oKey == '')
                this.getOwnerComponent().openHelloDialog("No hay planta seleccionada");
            else {
                this.getRouter().navTo("viewPMBitacora", {
                    "Plant": "PLANTA"
                });
            }
        },
        onDisplayViewPMReporteTiempo: function () {
            var oList = this.byId("listPMPlantaBlock");
            var oKey = oList.getSelectedKey();
            if (oKey == '')
                this.getOwnerComponent().openHelloDialog("No hay planta seleccionada");
            else {
                this.getRouter().navTo("viewPMReporteTiempo", {
                    "Plant": "PLANTA"
                });
            }
        },
        onDisplayViewPMReporteActividades: function () {
            var oList = this.byId("listPMPlantaBlock");
            var oKey = oList.getSelectedKey();
            if (oKey == '')
                this.getOwnerComponent().openHelloDialog("No hay planta seleccionada");
            else {
                this.getRouter().navTo("viewPMReporteActividades", {
                    "Plant": "PLANTA"
                });
            }
        },
        onDisplayViewPMReporteFallos: function () {
            var oList = this.byId("listPMPlantaBlock");
            var oKey = oList.getSelectedKey();
            if (oKey == '')
                this.getOwnerComponent().openHelloDialog("No hay planta seleccionada");
            else {
                this.getRouter().navTo("viewPMReporteFallos", {
                    "Plant": "PLANTA"
                });
            }
        },
        onMermas() {
            this.getRouter().navTo("RegistroMermas");
        },
        onGenerarEBR() {
            this.getRouter().navTo("generarEBR");
        },
        onVerificacionEBR() {
            this.getRouter().navTo("verificacionEBR");
        },
        onRegistroPesos() {
            this.getRouter().navTo("registroPesos");
        },
        // @ts-ignore
        onGeolocalizacion: function (oEvent) {
            this.getRouter().navTo("Geo");
        },
        onVerAvisos() {
            this.getRouter().navTo("verAvisos");
        },

        onCrearAviso() {
            this.getRouter().navTo("crearAviso");
        },

        onVerOrdenes() {
            this.getRouter().navTo("verOrdenes");
        },
        onVerMAF() {
            this.getRouter().navTo("verMAF");
        },
        onVerParos() {
            this.getRouter().navTo("verParos");
        },
        onVerReportes() {
            this.getRouter().navTo("verReportes");
        },
        onIntercompany() {
            this.getRouter().navTo("Intercompany");
        },
        onVerGeo() {
            this.getRouter().navTo("Geo");
        },

    });
});