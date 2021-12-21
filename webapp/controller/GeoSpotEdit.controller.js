sap.ui.define([
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/ui/core/routing/History",
    // @ts-ignore
// @ts-ignore
], function (BaseController, History) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.GeoSpotEdit", {
        onInit: function () {
            this.aPath = "";
            // @ts-ignore
            var oRouter = this.getRouter();
            // @ts-ignore
            oRouter.getRoute("GeoSpotEdit").attachMatched(this._onRouteMatched, this);
        },
        // @ts-ignore
        // @ts-ignore
        _onRouteMatched: function (oEvent) {
            this.getView().setModel(this.getOwnerComponent().getModel("spots"));
        },
        fillTypeComboBox: function () {
            var oThis = this;

            var itemTest = new sap.ui.core.Item();
            itemTest.setText("Success");
            itemTest.setKey("0");
            // @ts-ignore
            oThis.byId("comboTypes").addItem(itemTest);

            itemTest = new sap.ui.core.Item();
            itemTest.setText("Default");
            itemTest.setKey("1");
            // @ts-ignore
            oThis.byId("comboTypes").addItem(itemTest);

            itemTest = new sap.ui.core.Item();
            itemTest.setText("Warning");
            itemTest.setKey("2");
            // @ts-ignore
            oThis.byId("comboTypes").addItem(itemTest);

            itemTest = new sap.ui.core.Item();
            itemTest.setText("None");
            itemTest.setKey("3");
            // @ts-ignore
            oThis.byId("comboTypes").addItem(itemTest);

            itemTest = new sap.ui.core.Item();
            itemTest.setText("Inactive");
            itemTest.setKey("4");
            // @ts-ignore
            oThis.byId("comboTypes").addItem(itemTest);

            itemTest = new sap.ui.core.Item();
            itemTest.setText("Error");
            itemTest.setKey("5");
            // @ts-ignore
            oThis.byId("comboTypes").addItem(itemTest);
        },
        onSpotRowClicked: function (oEvent) {
            var oThis = this;
            const oSource = oEvent.getSource();
            var oCtx = oSource.getBindingContext();
            var sPath = oCtx.getPath();
            //console.log(sPath);
            if (!this.spotEditDialog) {
                // @ts-ignore
                this.spotEditDialog = this.loadFragment({
                    name: "sap.ui.demo.webapp.fragment.spotEdit"
                });
            }
            this.spotEditDialog.then(function (oDialog) {
                //aPath es global
                // @ts-ignore
                oThis.aPath = sPath;
                // @ts-ignore
                oThis.setFragmentValues(sPath);
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
                oThis.byId("spotAddidID").setValue(tam);
                // @ts-ignore
                if (oThis.byId("comboTypes").getItems().length == 0)
                    // @ts-ignore
                    oThis.fillTypeComboBox();
                oDialog.open();
            });
        },
        onSaveSpot: function (oEvent) {
            const oSource = oEvent.getSource();
            const oParent = oSource.getParent();
            const id = oParent.getId();
            console.log(this.aPath);
            this.updateSpotValues();
            //console.log(oParent.getId());
            //this.getOwnerComponent().getModel("spots").setProperty(sPath + "/NOMBRE", this.getView().byId("nombreId").getValue());
            this.byId(id).close();
        },
        onCloseDialog: function (oEvent) {
            const oSource = oEvent.getSource();
            this.byId(oSource.getId() + "Dialog").close();
        },
        setFragmentValues: function (sPath) {
            //console.log(sPath);
            this.getView().byId("spotidID").setValue(this.getOwnerComponent().getModel("spots").getProperty(sPath + "/ID"));
            this.getView().byId("nombreId").setValue(this.getOwnerComponent().getModel("spots").getProperty(sPath + "/NOMBRE"));
            this.getView().byId("textoId").setValue(this.getOwnerComponent().getModel("spots").getProperty(sPath + "/TEXT"));
            this.getView().byId("tooltipId").setValue(this.getOwnerComponent().getModel("spots").getProperty(sPath + "/TOOLTIP"));
            this.getView().byId("ubiId").setValue(this.getOwnerComponent().getModel("spots").getProperty(sPath + "/POS"));
            this.getView().byId("ubitId").setValue(this.getOwnerComponent().getModel("spots").getProperty(sPath + "/UBICACION_TECNICA"));
            this.getView().byId("provId").setValue(this.getOwnerComponent().getModel("spots").getProperty(sPath + "/PROVEEDOR"));
            this.getView().byId("telId").setValue(this.getOwnerComponent().getModel("spots").getProperty(sPath + "/TEL"));
        },
        updateSpotValues: function () {
            this.getOwnerComponent().getModel("spots").setProperty(this.aPath + "/NOMBRE", this.getView().byId("nombreId").getValue());
            this.getOwnerComponent().getModel("spots").setProperty(this.aPath + "/TEXT", this.getView().byId("textoId").getValue());
            this.getOwnerComponent().getModel("spots").setProperty(this.aPath + "/TOOLTIP", this.getView().byId("tooltipId").getValue());
            this.getOwnerComponent().getModel("spots").setProperty(this.aPath + "/POS", this.getView().byId("ubiId").getValue());
            this.getOwnerComponent().getModel("spots").setProperty(this.aPath + "/UBICACION_TECNICA", this.getView().byId("ubitId").getValue());
            this.getOwnerComponent().getModel("spots").setProperty(this.aPath + "/PROVEEDOR", this.getView().byId("provId").getValue());
            this.getOwnerComponent().getModel("spots").setProperty(this.aPath + "/TEL", this.getView().byId("telId").getValue());
        },
        onAddSpot: function (oEvent) {
            console.log("Spot agregado");
            const oSource = oEvent.getSource();
            const oParent = oSource.getParent();
            const id = oParent.getId();

            var tam = this.getOwnerComponent().getModel("spots").getProperty("/SPOT").length;
            console.log(this.getOwnerComponent().getModel("spots").getProperty("/SPOT"));
            console.log(tam);

            var type;
            switch (this._getMasterModel("/newSpot/typeKey")) {
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
                    type = "None"
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

            var newItem = {
                "ID": tam.toString(),
                "POS": this._getMasterModel("/newSpot/ubicacion"),
                "TYPE": type,
                "TOOLTIP": this._getMasterModel("/newSpot/tooltip"),
                "TEXT": this._getMasterModel("/newSpot/texto"),
                "ICON": "sap-icon://factory",
                "ALIGNMENT": "1",
                "CONTENTOFFSET": "0;80",
                "IMAGEPATH": [{
                        "PATH": "/images/plant1_1.png"
                    },
                    {
                        "PATH": "/images/plant1_2.jpg"
                    }
                ],
                "TEL": this._getMasterModel("/newSpot/tel"),
                "IMAGE_R": "facto",
                "SCALE": "0.2;0.2",

                "NOMBRE": this._getMasterModel("/newSpot/nombre"),
                "UBICACION_TECNICA": this._getMasterModel("/newSpot/ubi_tecnica"),
                "ALERTA": "",
                "GASTO": Number((Math.random() * (200 - 0) + 0).toFixed(0)),
                "COLOR_GASTO": "Error",
                "PROVEEDOR": this._getMasterModel("/newSpot/proveedor"),
                "CALIDAD": (Math.random() * (99 - 79) + 79).toFixed(2).toString(),
                "DISPONIBILIDAD": (Math.random() * (95 - 65) + 65).toFixed(2).toString(),
                "DESEMPENO": (Math.random() * (92 - 59) + 59).toFixed(2).toString(),
                "OEE": (Math.random() * (80 - 49) + 49).toFixed(2).toString(),
                "ALERTA_VISIBLE": "0"
            };
            this.getOwnerComponent().getModel("spots").setProperty("/SPOT/" + tam + "/", newItem);
            console.log(this.getOwnerComponent().getModel("spots").getProperty("/SPOT"));

            this.byId(id).close();
        }
    });
});