sap.ui.define([
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/integration/widgets/Card"
], function (Basecontroller, JSONModel, Card) {
    return Basecontroller.extend("sap.ui.demo.webapp.controller.Reportes.Charts", {
        onInit: function () {
            this.getRouter().getRoute("chartView").attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function () {
            const oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/webapp/model/data/cardManifests.json"));
            this.getView().setModel(oModel, "manifest");
        },

        onDrop: function (oEvent) {
            console.log("TEST", oEvent.getParameters('dragSession').draggedControl);
        },

        lineChartCard: function () {
            var oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/webapp/model/data/cardManifests.json")),
                oChart = new Card("", {
                    width:"20rem",
                    manifest:"{/testa}"
                });
            
            

            oChart.setModel(oModel);
            this.byId("dynamicFlex").addItem(oChart);
        }
    });
});