sap.ui.define([
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/ui/core/routing/History"
], function (BaseController, History) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.GeoSpotEdit", {
        onInit: function () {
            this.aItem = "";
            this.aPath = "";
            // @ts-ignore
            var oRouter = this.getRouter();
            // @ts-ignore
            oRouter.getRoute("GeoSpotEdit").attachMatched(this._onRouteMatched, this);
        },        
        // @ts-ignore
        _onRouteMatched: function (oEvent) {
            this.getView().setModel(this.getOwnerComponent().getModel("spots"));
        },
        fillTypeComboBox: function (idComboBox) {
            var oThis = this;

            var itemTest = new sap.ui.core.Item();
            itemTest.setText("Success");
            itemTest.setKey("0");
            // @ts-ignore
            oThis.byId(idComboBox).addItem(itemTest);

            itemTest = new sap.ui.core.Item();
            itemTest.setText("Default");
            itemTest.setKey("1");
            // @ts-ignore
            oThis.byId(idComboBox).addItem(itemTest);

            itemTest = new sap.ui.core.Item();
            itemTest.setText("Warning");
            itemTest.setKey("2");
            // @ts-ignore
            oThis.byId(idComboBox).addItem(itemTest);

            itemTest = new sap.ui.core.Item();
            itemTest.setText("None");
            itemTest.setKey("3");
            // @ts-ignore
            oThis.byId(idComboBox).addItem(itemTest);

            itemTest = new sap.ui.core.Item();
            itemTest.setText("Inactive");
            itemTest.setKey("4");
            // @ts-ignore
            oThis.byId(idComboBox).addItem(itemTest);

            itemTest = new sap.ui.core.Item();
            itemTest.setText("Error");
            itemTest.setKey("5");
            // @ts-ignore
            oThis.byId(idComboBox).addItem(itemTest);
        },
        onSpotRowClicked: function (oEvent) {
            var oThis = this;
            const oSource = oEvent.getSource();
            var oCtx = oSource.getBindingContext();
            var sPath = oCtx.getPath();
            if (!this.spotEditDialog) {
                // @ts-ignore
                this.spotEditDialog = this.loadFragment({
                    name: "sap.ui.demo.webapp.fragment.spotEdit"
                });
            }
            this.spotEditDialog.then(function (oDialog) {
                //aPath es global para la funci??n de actualizar los cambios
                // @ts-ignore
                oThis.aPath = sPath;
                // @ts-ignore
                oThis.setFragmentValues(sPath);
                var idCombo = "comboTypesEdit";
                // @ts-ignore
                if (oThis.byId(idCombo).getItems().length == 0)
                    // @ts-ignore
                    oThis.fillTypeComboBox(idCombo);
                oDialog.open();
            });
        },
        onPressAdd: function () {
            var oThis = this;
            if (!this.spotAddDialog) {
                // @ts-ignore
                this.spotAddDialog = this.loadFragment({
                    name: "sap.ui.demo.webapp.fragment.spotAdd"
                });
            }
            this.spotAddDialog.then(function (oDialog) {

                // @ts-ignore
                var tam = oThis.getOwnerComponent().getModel("spots").getProperty("/SPOT").length;
                // @ts-ignore
                var existeId = false;

                for (var i = 0; i < tam; i++) {
                    // @ts-ignore
                    if (oThis.getOwnerComponent().getModel("spots").getProperty("/SPOT/" + i + "/ID") == tam) {
                        existeId = true;
                    }
                    if (existeId == true) {                        
                        // @ts-ignore
                        if (tam <= oThis.getOwnerComponent().getModel("spots").getProperty("/SPOT/" + i + "/ID")) {
                            // @ts-ignore
                            tam = oThis.getOwnerComponent().getModel("spots").getProperty("/SPOT/" + i + "/ID");
                            tam++;
                        }
                    }
                }
                // @ts-ignore
                oThis.byId("spotAddidID").setValue(tam);
                // @ts-ignore
                var idCombo = "comboTypes";
                // @ts-ignore
                if (oThis.byId(idCombo).getItems().length == 0)
                    // @ts-ignore
                    oThis.fillTypeComboBox(idCombo);
                oDialog.open();
            });
        },
        onSaveSpot: function (oEvent) {
            var oThis = this;
            const oSource = oEvent.getSource();
            const oParent = oSource.getParent();
            const id = oParent.getId();
            this.updateSpotValues();            
            this.byId(id).close();            
            setTimeout(function() {
                oThis.clearinputSpotModel();
              }, 60);
        },
        onCloseDialog: function (oEvent) {
            this.clearinputSpotModel();
            const oSource = oEvent.getSource();
            this.byId(oSource.getId() + "Dialog").close();
        },
        setFragmentValues: function (sPath) {            
            this.getView().byId("spotidID").setValue(this.getOwnerComponent().getModel("spots").getProperty(sPath + "/ID"));
            this.getView().byId("nombreId").setValue(this.getOwnerComponent().getModel("spots").getProperty(sPath + "/NOMBRE"));
            this.getView().byId("textoId").setValue(this.getOwnerComponent().getModel("spots").getProperty(sPath + "/TEXT"));
            this.getView().byId("tooltipId").setValue(this.getOwnerComponent().getModel("spots").getProperty(sPath + "/TOOLTIP"));
            this.getView().byId("ubiId").setValue(this.getOwnerComponent().getModel("spots").getProperty(sPath + "/POS"));
            this.getView().byId("ubitId").setValue(this.getOwnerComponent().getModel("spots").getProperty(sPath + "/UBICACION_TECNICA"));
            this.getView().byId("provId").setValue(this.getOwnerComponent().getModel("spots").getProperty(sPath + "/PROVEEDOR"));
            this.getView().byId("telId").setValue(this.getOwnerComponent().getModel("spots").getProperty(sPath + "/TEL"));            
            var typeKey;
            switch (this.getOwnerComponent().getModel("spots").getProperty(sPath + "/TYPE")) {
                case "Success":
                    typeKey = 0
                    break;
                case "Default":
                    typeKey = 1
                    break;
                case "Warning":
                    typeKey = 2
                    break;
                case "None":
                    typeKey = 3;                    
                    break;
                case "Inactive":
                    typeKey = 4
                    break;
                case "Error":
                    typeKey = 5
                    break;
                default:
                    break;
            }
            this.getView().byId("comboTypesEdit").setSelectedKey(typeKey);
        },
        updateSpotValues: function () {
            var type, contOffset = "0;80";
            switch (this._getMasterModel("/inputSpot/typeKey")) {
                case "0":
                    type = "Success"
                    break;
                case "1":
                    type = "Default"
                    break;
                case "2":
                    type = "Warning"
                    break;
                case "3":
                    type = "None";
                    contOffset = "0;-24";
                    break;
                case "4":
                    type = "Inactive"
                    break;
                case "5":
                    type = "Error"
                    break;
                default:
                    break;
            }
            this.getOwnerComponent().getModel("spots").setProperty(this.aPath + "/NOMBRE", this.getView().byId("nombreId").getValue());
            this.getOwnerComponent().getModel("spots").setProperty(this.aPath + "/TEXT", this.getView().byId("textoId").getValue());
            this.getOwnerComponent().getModel("spots").setProperty(this.aPath + "/TOOLTIP", this.getView().byId("tooltipId").getValue());
            this.getOwnerComponent().getModel("spots").setProperty(this.aPath + "/POS", this.getView().byId("ubiId").getValue());
            this.getOwnerComponent().getModel("spots").setProperty(this.aPath + "/UBICACION_TECNICA", this.getView().byId("ubitId").getValue());
            this.getOwnerComponent().getModel("spots").setProperty(this.aPath + "/PROVEEDOR", this.getView().byId("provId").getValue());
            this.getOwnerComponent().getModel("spots").setProperty(this.aPath + "/TEL", this.getView().byId("telId").getValue());
            this.getOwnerComponent().getModel("spots").setProperty(this.aPath + "/TYPE", type);
            this.getOwnerComponent().getModel("spots").setProperty(this.aPath + "/CONTENTOFFSET", contOffset);
        },
        onAddSpot: function (oEvent) {
            var oThis = this;
            const oSource = oEvent.getSource();
            const oParent = oSource.getParent();
            const id = oParent.getId();
            var type = "",
                contOffset = "0;80",
                gasto = Number((Math.random() * (200 - 0) + 0).toFixed(0)),
                color_gasto = "Good",
                alerta_visible = "0",
                mensaje_alerta = "";
            switch (this._getMasterModel("/inputSpot/typeKey")) {
                case "0":
                    type = "Success"
                    break;
                case "1":
                    type = "Default"
                    break;
                case "2":
                    type = "Warning"
                    break;
                case "3":
                    type = "None";
                    contOffset = "0;-24";
                    break;
                case "4":
                    type = "Inactive"
                    break;
                case "5":
                    type = "Error"
                    break;
                default:
                    break;
            }

            if (gasto > 100) {
                color_gasto = "Error";
                alerta_visible = "1";
                mensaje_alerta = "Alerta reportada"
            }

            var idinputSpot = this.byId("spotAddidID").getValue();
            var tam = this.getOwnerComponent().getModel("spots").getProperty("/SPOT").length;
            var newItem = {
                "ID": idinputSpot.toString(),
                "POS": this._getMasterModel("/inputSpot/ubicacion"),
                "TYPE": type,
                "TOOLTIP": this._getMasterModel("/inputSpot/tooltip"),
                "TEXT": this._getMasterModel("/inputSpot/texto"),
                "ICON": "sap-icon://factory",
                "ALIGNMENT": "1",
                "CONTENTOFFSET": contOffset,
                "IMAGEPATH": [{
                        "PATH": "/images/plant1_1.png"
                    },
                    {
                        "PATH": "/images/plant1_2.jpg"
                    }
                ],
                "TEL": this._getMasterModel("/inputSpot/tel"),
                "IMAGE_R": "facto",
                "SCALE": "0.2;0.2",

                "NOMBRE": this._getMasterModel("/inputSpot/nombre"),
                "UBICACION_TECNICA": this._getMasterModel("/inputSpot/ubi_tecnica"),
                "ALERTA": mensaje_alerta,
                "GASTO": gasto,
                "COLOR_GASTO": color_gasto,
                "PROVEEDOR": this._getMasterModel("/inputSpot/proveedor"),
                "CALIDAD": (Math.random() * (99 - 79) + 79).toFixed(2).toString(),
                "DISPONIBILIDAD": (Math.random() * (95 - 65) + 65).toFixed(2).toString(),
                "DESEMPENO": (Math.random() * (92 - 59) + 59).toFixed(2).toString(),
                "OEE": (Math.random() * (80 - 49) + 49).toFixed(2).toString(),
                "ALERTA_VISIBLE": alerta_visible
            };
            this.getOwnerComponent().getModel("spots").setProperty("/SPOT/" + tam + "/", newItem);

            this.byId(id).close();
            
            setTimeout(function() {
                oThis.clearinputSpotModel();                
              }, 70);
        },
        clearinputSpotModel: function () {
            this._setMasterModel("/inputSpot/nombre", "");
            this._setMasterModel("/inputSpot/texto", "");
            this._setMasterModel("/inputSpot/tooltip", "");
            this._setMasterModel("/inputSpot/ubicacion", "");
            this._setMasterModel("/inputSpot/ubi_tecnica", "");
            this._setMasterModel("/inputSpot/proveedor", "");
            this._setMasterModel("/inputSpot/tel", "");
            this._setMasterModel("/inputSpot/typeKey", "0");
        },
        onDeleteSpot: function (oEvent) {
            var oThis = this;
            this.aItem = oEvent.getParameter("listItem");
            if (!this.spotConfDelDialog) {
                // @ts-ignore
                this.spotConfDelDialog = this.loadFragment({
                    name: "sap.ui.demo.webapp.fragment.confirmDeleteSpot"
                });
            }
            this.spotConfDelDialog.then(function (oDialog) {
                var sPath = oThis.aItem.getBindingContext().getPath();
                //------------------------------------------------------
                // @ts-ignore
                oThis.byId("idLabel").setText(oThis.getOwnerComponent().getModel("spots").getProperty(sPath + "/ID"));
                // @ts-ignore
                oThis.byId("nombreLabel").setText(oThis.getOwnerComponent().getModel("spots").getProperty(sPath + "/NOMBRE"));
                // @ts-ignore
                oThis.byId("coorLabel").setText(oThis.getOwnerComponent().getModel("spots").getProperty(sPath + "/POS"));
                // @ts-ignore
                oThis.byId("provLabel").setText(oThis.getOwnerComponent().getModel("spots").getProperty(sPath + "/PROVEEDOR"));
                //-------------------------------------------------------
                oDialog.open();
            });
        },
        deleteSpotModel: function (oItem) {
            var sPath = oItem.getBindingContext().getPath();
            var sPathSplit = sPath.split("/", 3);
            var index = sPathSplit.at(-1);
            var oModel = this.getOwnerComponent().getModel("spots").getProperty("/SPOT");
            oModel.splice(index, 1);
            this.getOwnerComponent().getModel("spots").setProperty("/SPOT", oModel);
        },
        onConfirmDelete: function (oEvent) {
            this.deleteSpotModel(this.aItem);
            const oSource = oEvent.getSource();
            const oParent = oSource.getParent();
            const id = oParent.getId();
            this.byId(id).close();
        }
    });
});