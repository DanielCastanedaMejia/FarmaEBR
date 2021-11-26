sap.ui.define([
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (BaseController, JSONModel, MessageToast) {
    "use strict";
    return BaseController.extend("sap.ui.demo.webapp.controller.BlockLayout", {
        onInit: function () {
        //this.charge_combo();
        this.getUserInfo();
        },

        getUserInfo: function () {
            var oThis = this;
            jQuery.ajax({
                type: "GET",
                url: "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Illuminator?service=SystemInfo&mode=CurrentProfile&Content-Type=text%2Fxml",
                dataType: "xml",
                cache: false,
                success: function (xml) { // results ready from lookup of current status details in CCstatus
                    var operador = $(xml).find('Profile').attr('IllumLoginName');
                    var nombrecompleto = $(xml).find('Profile').attr('FullName');                    
                    var CadenaNombre = nombrecompleto.split(',');
                    var Nombre = CadenaNombre[1];
                    var Apellido = CadenaNombre[0];

                    console.log(CadenaNombre);
                    /*var roles = $(xml).find('Profile').attr('IllumLoginRoles');

                    var oData = {
                        "user": operador,                        
                        "nombre": Nombre,
                        "apellido": Apellido,
                        "FILTRO": '',
                        "TIPO_FILTRO": "CE"
                    };

                    oThis.insert_user(oData, 'EquipandoXXI/DatosMaestros/Users/Transaction/ins_user');*/                                 
                }
            });
        },

        /*charge_combo: function () {
            var oThis = this;
            var oData = {
                        "FILTRO": '',
                        "TIPO_FILTRO": "FAB"
                    };
            //results ready from lookup of current status details in CCstatus   
                    oThis._base_onloadCOMBO("listPMPlantaBlock", oData, "SelloRojo/DatosTransaccionales/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH","","Planta");
                
            },*/
        onDisplayViewQMOrders: function () {
            var oList = this.byId("listPMPlantaBlock");
           var oKey = oList.getSelectedKey();
            if (oKey === '')
                console.log("Empty");
            else {
                this.getRouter().navTo("viewQMOrders", { "plant": oKey });                
            } 
        },

        onDisplayOrder: function () {
            var oList = this.byId("listPMPlantaBlock");
           var oKey = oList.getSelectedKey();
            if (oKey === '')
                console.log("Empty");
            else {
                this.getRouter().navTo("viewPPOrders", { "plant": oKey });                
            } 
        },


        onDisplayCreatePMNotification: function () {
            var oList = this.byId("listPMPlantaBlock");
            var oKey = oList.getSelectedKey();
            if (oKey == '')
                this.getOwnerComponent().openHelloDialog("No hay planta seleccionada");
            else {         
                this.getRouter().navTo("createPMNotification", { "Plant": "PLANTA" });  
                }                            
        },
        onDisplayViewPMNotification: function () {
            var oList = this.byId("listPMPlantaBlock");
            var oKey = oList.getSelectedKey();
            if (oKey == '')
                this.getOwnerComponent().openHelloDialog("No hay planta seleccionada");
            else {   
                this.getRouter().navTo("viewPMNotification", { "Plant": "PLANTA" });
                }
        },
        onDisplayViewPMOrder: function () {
            var oList = this.byId("listPMPlantaBlock");
            var oKey = oList.getSelectedKey();
            if (oKey == '')
                this.getOwnerComponent().openHelloDialog("No hay planta seleccionada");
            else {   
                this.getRouter().navTo("viewPMOrders", { "Plant": "PLANTA" });
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
            this.getRouter().navTo("viewPMBitacora", { "Plant": "PLANTA" });
                }
        },
        onDisplayViewPMReporteTiempo: function(){
            var oList = this.byId("listPMPlantaBlock");
            var oKey = oList.getSelectedKey();
            if (oKey == '')
                this.getOwnerComponent().openHelloDialog("No hay planta seleccionada");
            else {   
            this.getRouter().navTo("viewPMReporteTiempo", { "Plant": "PLANTA" });
                }
        },
        onDisplayViewPMReporteActividades: function () {
            var oList = this.byId("listPMPlantaBlock");
            var oKey = oList.getSelectedKey();
            if (oKey == '')
                this.getOwnerComponent().openHelloDialog("No hay planta seleccionada");
            else {   
            this.getRouter().navTo("viewPMReporteActividades", { "Plant": "PLANTA" });
                }
        },
        onDisplayViewPMReporteFallos: function () {
            var oList = this.byId("listPMPlantaBlock");
            var oKey = oList.getSelectedKey();
            if (oKey == '')
                this.getOwnerComponent().openHelloDialog("No hay planta seleccionada");
            else {   
            this.getRouter().navTo("viewPMReporteFallos", { "Plant": "PLANTA" });
                }
        },
        onMermas() {
            this.getRouter().navTo("RegistroMermas");
        },

    });
});


      