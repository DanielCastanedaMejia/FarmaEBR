sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/json/JSONModel',
    "sap/ui/demo/webapp/model/formatter"
], function (JQuery, BaseController, MessageToast, MessageBox, JSONModel, formatter) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.PMNotification.PMNotificationDetail", {
        formatter: formatter,
        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("PMNotificationDetail").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oArgs, oView, oModel;
            oArgs = oEvent.getParameter("arguments");
            oView = this.getView();
            oModel = this.getOwnerComponent().getModel("noticesModel");            
            var idNotice = this.findIdNotice(oModel, oArgs.id);
            var jModel = new JSONModel(oModel.oData.ITEMS[idNotice]);
            this._onBindingChange(oModel, idNotice);
            this.getView().setModel(jModel)

        },
        _onBindingChange: function (oModel, idNotice) {
            if (!oModel.oData.ITEMS[idNotice]) {
                this.getRouter().getTargets().display("notFound");
            }
        },
        findIdNotice: function (oModel, idAux) {
            var idR = -1;
            for(var i = 0; i < oModel.oData.ITEMS.length; i++) {
                if(oModel.oData.ITEMS[i].id == idAux) {                     
                    idR = i;
                    break;
                }
            }
            return idR;
        },
        onRelease: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();

            var oData = {
                "AVISO": oCtx.getProperty("id")
            };
        },

        onShowCreatePMOrder: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            var desc = oCtx.getProperty("short_text");

            this.getRouter().navTo("createPMOrder", {
                id: oCtx.getProperty("id"),
                short_text: encodeURIComponent(desc),
                priority: oCtx.getProperty("priority"),
            });
        },

        onShowOrder: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            this.getRouter().navTo("PMOrderDetail", {
                id: "01"
            });
        },

    });
});