sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    'sap/ui/model/json/JSONModel'
], function (jQuery, BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.Reportes.verReportes", {
        onInit: function () {
            var cardManifests = new JSONModel();
            this._getUsuario("username");
            //var card = this.getView().byId("myCard");

            cardManifests.loadData(sap.ui.require.toUrl("sap/ui/demo/webapp/model/data/cardManifests.json"));
            this.getView().setModel(cardManifests, "manifests");
            /*
            card.attachBrowserEvent("click", function (event) {
                console.log("CLICKED");
            }, this);
            */
        }

    });   

});
