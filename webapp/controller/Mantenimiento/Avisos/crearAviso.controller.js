sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox"

], function (JQuery, BaseController, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.Mantenimiento.Avisos.crearAviso", {        

        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            
            oRouter.getRoute("crearAviso").attachMatched(this._onRouteMatched, this);
            
            this._wizard = this.getView().byId("CreateNotificationWizard");
            this._oNavContainer = this.getView().byId("wizardNavContainer");
            this._oWizardContentPage = this.getView().byId("wizardContentPage");

            this.model = new sap.ui.model.json.JSONModel();
            this.model.setData({
                NotiDescState: "Error",
                NotiAuthorState: "Error"
            });
            this.getView().setModel(this.model);
            this.onloadPriority();
            this.setReportedBy("PMNotiAuthor");
            
        },

        _onRouteMatched: function (oEvent) {
            this._getUsuario("username");
            this.clearAll();

            var oArgs, oView;
            oArgs = oEvent.getParameter("arguments");
            oView = this.getView();

            var tipo_ubi = '';
            var plant = "1710";

            var oData = {
                "TIPO_FILTRO": "PA",
                "FILTRO": ""
            };
            this._base_onloadCOMBO("listPMPlanta", oData, "GIM/DatosMaestros/Mantenimiento/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH", 1710, "Plantas");

            var oData2 = {
                "TIPO_FILTRO": "CE",
                "FILTRO": "1710",
                "TIPO_UBI": tipo_ubi
            };

            this._base_onloadCOMBO("listPMProceso", oData2, "GIM/DatosMaestros/Mantenimiento/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH", "1710-PRD", "Proceso");

            var oData3 = {
                "TIPO_FILTRO": "FAB",
                "FILTRO": "1710-PRD",
                "TIPO_UBI": tipo_ubi
            };

            this._base_onloadCOMBO("listPMSubProceso", oData3, "GIM/DatosMaestros/Mantenimiento/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH", "", "SubProceso");

        },  

        setReportedBy: function (id) {
            var oThis = this;

            $.ajax({
                type: "GET",
                url: "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Illuminator?service=SystemInfo&mode=CurrentProfile&Content-Type=text%2Fxml",
                dataType: "xml",
                cache: false,
                success: function (xml) {
                    var user = $(xml).find('Profile').attr('IllumLoginName');
                    oThis.byId(id).setValue(user);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("ERROR");
                }
            });
        },

        validateStep1: function () {
            var oCombo = this.byId("listPMEquipment");            

            if (oCombo.getSelectedKey() === "") {
                this._wizard.invalidateStep(this.getView().byId("TecnicalLocationStep"));
            } else {
                this._wizard.validateStep(this.getView().byId("TecnicalLocationStep"));
            }          
        },

        descValidation: function () {
            var desc = this.getView().byId("PMNotiDesc").getValue();
            var author = this.getView().byId("PMNotiAuthor").getValue();
            //var weight = parseInt(this.getView().byId("ProductWeight").getValue(), 10);

            if (desc.length < 10) {
                this.model.setProperty("/NotiDescState", "Error");
            } else {
                this.model.setProperty("/NotiDescState", "None");
            }

            if (author.length == 0) {
                this.model.setProperty("/NotiAuthorState", "Error");
            } else {
                this.model.setProperty("/NotiAuthorState", "None");
            }

            if (desc.length < 10 || author.length == 0) {
                this._wizard.invalidateStep(this.getView().byId("DescriptionStep"));
            } else {
                this._wizard.validateStep(this.getView().byId("DescriptionStep"));
            }
        },

        causeActivation: function () {
            var oEqui = this.byId("listPMEquipment"),
                oSubEqui = this.byId("listPMSubEquipment"),
                key;

            if (oSubEqui.getSelectedKey() !== '')
                key = oSubEqui.getSelectedKey();
            else
                key = oEqui.getSelectedKey();

            var aData = {
                "CATALOGO": "B",     
                "EQUIPO": key
            };
            console.log(aData);
            this._base_onloadCOMBO("listPMCategoriaParteObjeto", aData, "GIM/DatosMaestros/Mantenimiento/GrupoCodigos/Transaction/get_GrupoCodigos","","Parte Objeto");

            var aData2 = {
                "CATALOGO": "C",
                "EQUIPO": key
            };
            this._base_onloadCOMBO("listPMCatSintoma", aData2, "GIM/DatosMaestros/Mantenimiento/GrupoCodigos/Transaction/get_GrupoCodigos","","Sintomas");

            var aData3 = {
                "CATALOGO": "5",
                "EQUIPO": key
            };
            this._base_onloadCOMBO("listPMCatCausa", aData3, "GIM/DatosMaestros/Mantenimiento/GrupoCodigos/Transaction/get_GrupoCodigos","","Causas");
        },

        discardNoti: function () {
            var resourceModel = this.getView().getModel("i18n");
            this._handleMessageBoxOpen(resourceModel.getResourceBundle().getText("DiscardPMNoti"), "warning");  
        },

        backToWizardContent: function () {
            this._oNavContainer.backToPage(this._oWizardContentPage.getId());
        },

        _handleNavigationToStep: function (iStepNumber) {
            var fnAfterNavigate = function () {
                this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
                this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
            }.bind(this);

            this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
            this.backToWizardContent();
        },

        clearAll: function () {
            this.repeaterCombosUBI(0);
            var oCombo = this.byId("listPMProceso");
            oCombo.setSelectedKey("");

            var clearContent = function (content) {
                for (var i = 0; i < content.length; i++) {
                    if (content[i].setValue) {
                        content[i].setValue("");
                    }

                    if (content[i].getContent) {
                        clearContent(content[i].getContent());
                    }
                }
            };
            clearContent(this._wizard.getSteps());

            var JSON_E = {};
            var oThis = this;
            var numCombo = 0;

            var JSONListas =
                [
                    { "Lista": "listPMCategoriaParteObjeto" },
                    { "Lista": "listPMParteObjeto" },
                    { "Lista": "listPMCatSintoma" },
                    { "Lista": "listPMCatCausa" },
                    { "Lista": "listPMAveria" },
                    { "Lista": "listPMCausa" }
                ];

            $.each(JSONListas, function (i, x) {
                if (i >= numCombo) {
                    oThis.clearElement(x.Lista, "COMBO");
                }
            });

            var JSONInput =
                [
                    { "Input": "PMSintomaText" },
                    { "Input": "PMCauseText" }
                ];

            $.each(JSONInput, function (i, x) {
                if (i >= numCombo) {
                    oThis.clearElement(x.Input, "INPUT");
                }
            });

            var oCheckStop = this.byId("PMStop");
            oCheckStop.setSelected(false);

            this._handleNavigationToStep(0);
            this._wizard.discardProgress(this._wizard.getSteps()[0]);
            this.model.setProperty("/NotiDescState", "Error");
            this.model.setProperty("/NotiAuthorState", "Error");
        },

        _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
            MessageBox[sMessageBoxType](sMessage, {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        this.clearAll();
                        this.onNavBack();
                    }
                }.bind(this)
            });
        },

        _clearNoti: function () {
            this.repeaterCombosUBI(0);
            var oCombo = this.byId("listPMProceso");
            oCombo.setSelectedKey("");
        },        

        clearElement: function (idObject, tipo) {
            var oModel = new sap.ui.model.json.JSONModel();
            var JSON_E = {};

            var oObject = this.byId(idObject);

            switch (tipo) {
                case "COMBO":
                    oObject.setModel(oModel);
                    oModel.setData(JSON_E);
                    break;
                case "INPUT":
                    oObject.setValue("");
                    break;
            }
            
        },

        repeaterCombosUBI: function(numCombo) {
            var oThis = this;

            var JSONListas =
                [
                    { "Lista": "listPMSubProceso" },
                    { "Lista": "listPMFunction" },
                    { "Lista": "listPMEquipment" },
                    { "Lista": "listPMSubEquipment" }
                ];

            $.each(JSONListas, function (i, x) {
                if (i >= numCombo) {
                    oThis.clearElement(x.Lista, "COMBO");
                }
            });

            this.validateStep1();
        },

        validateInfo: function () {
            var oComboEqui = this.byId("listPMEquipment");
            var oComboSubEqui = this.byId("listPMSubEquipment");
            var oInputDesc = this.byId("PMNotiDesc");
            var oInputAuthor = this.byId("PMNotiAuthor");
            var oInputTexte = this.byId("PMLargeText");
            var oComboCatObj = this.byId("listPMCategoriaParteObjeto");
            var oComboObj = this.byId("listPMParteObjeto");
            var oComboCatSint = this.byId("listPMCatSintoma");
            var oComboSint = this.byId("listPMAveria");
            var oComboCatCause = this.byId("listPMCatCausa");
            var oComboCause = this.byId("listPMCausa");
            var oInputSintText = this.byId("PMSintomaText");
            var oInputCauseText = this.byId("PMCauseText");
            var oCheckStop = this.byId("PMStop");
            var oComboFunction = this.byId("listPMFunction");
            var oComboPriority = this.byId("priority");

            var oStop = 0;
            if (oCheckStop.getSelected() === true)
                oStop = 'X';
            else
                oStop = '';

            var oEqui = "";

            if (oComboEqui.getSelectedKey() === '')
                this.getOwnerComponent().openHelloDialog("Debes seleccionar un equipo");     
            else if (oInputDesc.getValue().length < 10)
                this.getOwnerComponent().openHelloDialog("Ingresa una descripci\u00F3n de al menos 10 caracteres");
            else
                if (oInputAuthor.getValue() === '')
                    this.getOwnerComponent().openHelloDialog("Ingresa un responsable");
                else {
                    if (oComboSubEqui.getSelectedKey() !== "")
                        oEqui = oComboSubEqui.getSelectedKey();
                    else
                        oEqui = oComboEqui.getSelectedKey();

                    var oData = {
                        "AUTOR": oInputAuthor.getValue(),
                        "CAT_CAUSA": oComboCatCause.getSelectedKey(),
                        "CAT_PARTE_OBJETO": oComboCatObj.getSelectedKey(),
                        "CAT_SINTOMA": oComboCatSint.getSelectedKey(),
                        "CAUSA": oComboCause.getSelectedKey(),
                        "PRIORIDAD": oComboPriority.getSelectedKey(),
                        "EQUIPO": oEqui,
                        "PARADA": oStop,
                        "PARTE_OBJETO": oComboObj.getSelectedKey(),
                        "SINTOMA": oComboSint.getSelectedKey(),
                        "TEXTO_AVERIA": oInputSintText.getValue(),
                        "TEXTO_BREVE": oInputDesc.getValue(),
                        "TEXTO_CAUSA": oInputCauseText.getValue(),
                        "TEXTO_LARGO": oInputTexte.getValue(),
                        "TIPO_AVISO": "M2",
                        "UBICACION_TECNICA": oComboFunction.getSelectedKey()
                    };
                    console.log(oData);
                    this.createNoti(oData,"GIM/DatosTransaccionales/Mantenimiento/Avisos/Crear/Transaction/crear_aviso");  
                }
                      
        }, 

        createNoti(oData, path) {
            var uri = "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Runner?Transaction=" + path + "&OutputParameter=JsonOutput&Content-Type=text/xml"
            uri = uri.replace(/\s+/g, '');

            sap.ui.core.BusyIndicator.show(0);
            var oThis = this;
            $.ajax({
                type: "GET",
                dataType: "xml",
                cache: false,
                url: uri,
                data: oData
            })
                .done(function (xmlDOM) {
                    var opElement = xmlDOM.getElementsByTagName("Row")[0].firstChild                    
 
                    if (opElement.firstChild != null) {
                        var aData = eval(opElement.firstChild.data);
                        if (aData[0].error !== undefined) {
                            oThis.getOwnerComponent().openHelloDialog(aData[0].error);
                        }
                        else {
                            //Create  the JSON model and set the data                                                                                                
                            MessageToast.show(aData[0].message);
                            oThis.clearAll();
                        }

                    }    
                    else {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud ha fallado: ¿Hay conexión de red?");
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

        onOpenDialog: function () {
            this.getOwnerComponent().openHelloDialog();
        },

        onChangePMProceso: function (oEvent) {
            this.repeaterCombosUBI(0);
            var oData = {
                "TIPO_FILTRO": "SUBPRO",
                "FILTRO": oEvent.getParameter("selectedItem").getKey()
            };
            this._base_onloadCOMBO("listPMSubProceso", oData, "GIM/DatosMaestros/Mantenimiento/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH","","SubProcesos");
        },

        onChangePMPlant: function (oEvent) {
            var oData = {
                "TIPO_FILTRO": "PRO",
                "FILTRO": oEvent.getParameter("selectedItem").getKey()
            };
            this._base_onloadCOMBO("listPMProceso", oData,"GIM/DatosMaestros/Mantenimiento/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH","","Procesos");            
        },

        onloadPriority: function (oEvent) {
            var oData = {};

            this._base_onloadCOMBO("priority", oData, 'GIM/DatosMaestros/Mantenimiento/Prioridad/Transaction/priority',"","Prioridades");                
        },

        onChangePMSubProceso: function (oEvent) {
            this.repeaterCombosUBI(1);
            var oData = {
                "TIPO_FILTRO": "PRO",
                "FILTRO": oEvent.getParameter("selectedItem").getKey()
            };
            console.log(oData);
            this._base_onloadCOMBO("listPMFunction", oData, "GIM/DatosMaestros/Mantenimiento/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH","","Funciones");                   
        },

        onChangePMFunction: function (oEvent) {
            this.repeaterCombosUBI(2);
            var oData = {
                "TIPO_FILTRO": "EQUI",
                "FILTRO": oEvent.getParameter("selectedItem").getKey()
            };
            this._base_onloadCOMBO("listPMEquipment", oData, "GIM/DatosMaestros/Mantenimiento/UbicacionesTecnicas/Transaction/Equipos_SubEquipos_CEMH","","Equipos");            
        },

        onChangePMEquipment: function (oEvent) {
            this.validateStep1(3);
            var oData = {
                "TIPO_FILTRO": "SUBEQUI",
                "FILTRO": oEvent.getParameter("selectedItem").getKey()
            };
            this._base_onloadCOMBO("listPMSubEquipment", oData, "GIM/DatosMaestros/Mantenimiento/UbicacionesTecnicas/Transaction/Equipos_SubEquipos_CEMH","","SubEquipos");            
        },

        onChangeObjectCategory: function (oEvent) {
            var aData = {
                "CATALOGO": "B",
                "CODEGRUPPE": oEvent.getParameter("selectedItem").getKey()
            };
            this._base_onloadCOMBO("listPMParteObjeto", aData, "GIM/DatosMaestros/Mantenimiento/Codigos/Transaction/get_Codigos","Parte Objetos");
        },

        onChangeSintCategory: function (oEvent) {
            var aData = {
                "CATALOGO": "C",
                "CODEGRUPPE": oEvent.getParameter("selectedItem").getKey()
            };
            this._base_onloadCOMBO("listPMAveria", aData, "GIM/DatosMaestros/Mantenimiento/Codigos/Transaction/get_Codigos", "" , "Averias");
        },

        onChangeCauseCategory: function (oEvent) {
            var aData = {
                "CATALOGO": "5",
                "CODEGRUPPE": oEvent.getParameter("selectedItem").getKey()
            };
            this._base_onloadCOMBO("listPMCausa", aData, "GIM/DatosMaestros/Mantenimiento/Codigos/Transaction/get_Codigos", "", "Causas");
        }
    });
});