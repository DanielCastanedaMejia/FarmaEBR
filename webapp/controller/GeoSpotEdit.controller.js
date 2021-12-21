sap.ui.define([
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/ui/core/routing/History"
], function (BaseController, History) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.GeoSpotEdit", {
        onInit: function () {
            this.aPath = "";
            var oRouter = this.getRouter();
            oRouter.getRoute("GeoSpotEdit").attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
            //console.log("Editar spots");
            this.getView().setModel(this.getOwnerComponent().getModel("spots"));
            //console.log(this.getView().byId("spotsGeo"));
            //console.log(this.getView().getModel();
        },
        onSpotRowClicked: function (oEvent) {
            var oThis = this;
            const oSource = oEvent.getSource();
            var oCtx = oSource.getBindingContext();
            var sPath = oCtx.getPath();
            //console.log(sPath);
            if (!this.spotEditDialog) {
                this.spotEditDialog = this.loadFragment({
                    name: "sap.ui.demo.webapp.fragment.spotEdit"
                });
            }
            this.spotEditDialog.then(function (oDialog) {
                //aPath es global
                oThis.aPath = sPath;
                oThis.setFragmentValues(sPath);
                oDialog.open();
            });
        },
        onSaveSpot: function (oEvent) {
            //console.log("Guardar");
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
        }
    });
});