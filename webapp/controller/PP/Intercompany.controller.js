sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/json/JSONModel'

], function (JQuery, BaseController, MessageToast, MessageBox, JSONModel) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.Produccion.Ordenes.instalarLamina_corr", {
        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("Intercompany").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            this._getUsuario("username");

            var oArgs, oView;
            oArgs = oEvent.getParameter("arguments");
            oView = this.getView();

            var oTable = oView.byId("intercompany_tabla");
            var oModel_empty = new sap.ui.model.json.JSONModel();
            oModel_empty.setData({});
            oTable.setModel(oModel_empty);

            oView.bindElement({
                path: "/"
            });

            this._base_onloadTable('intercompany_tabla', '', 'FARMA/DatosTransaccionales/Intercompañia/Transaction/intercompany_select', "Intercompany", "");
        },
        onIntercompany : function(oEvent){
        var uri = "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Runner?Transaction=FARMA/DatosTransaccionales/Intercompañia/Transaction/intercompania_farma&OutputParameter=*&Content-Type=text/xml"
        uri = uri.replace(/\s+/g, '');
        var Othis=this;
        sap.ui.core.BusyIndicator.show(0);
          var  ctd= sap.ui.getCore().getElementById('cantidad');
        jQuery.ajax({
        type: "GET",
        url: uri,
        dataType: "xml",
        data: {
            'ALMACEN': this.byId('almacen').getValue(),
            'CANTIDAD': this.getView().byId("cantidad").getValue(),
            'CENTRO_EMISORA': '5010',
            'CENTRO_RECEPTOR': '1710',
            'LOTE': this.getView().byId("input_batch").getValue(),
            'MATERIAL': this.getView().byId("material").getValue(),
            'UM': 'PZA'
        },
        cache: false,
        success: function (xml) {
            sap.ui.core.BusyIndicator.hide();
            $(xml).find('Row').each(function () {
                var estado = $(this).find('ESTADO').text();
                var texto = $(this).find('MENSAJE').text();
                if (estado==0) {
                       sap.m.MessageBox.show(
                              texto, {
                                  icon: sap.m.MessageBox.Icon.WARNING,
                                  title: "Proceso incompleto.",
                                  actions: [sap.m.MessageBox.Action.YES],
                                    onClose: function(oAction) { / * do function * / }
                                      }
                              );
                Othis._base_onloadTable('intercompany_tabla', {}, 'FARMA/DatosTransaccionales/Intercompañia/Transaction/intercompany_select', "Intercompany", "");
                }else{
                Othis._base_onloadTable('intercompany_tabla', {}, 'FARMA/DatosTransaccionales/Intercompañia/Transaction/intercompany_select', "Intercompany", "");
                    sap.m.MessageBox.show(
                              texto, {
                                  icon: sap.m.MessageBox.Icon.INFORMATION,
                                  title: "Proceso completado.",
                                  actions: [sap.m.MessageBox.Action.YES],
                                    onClose: function(oAction) { / * do function * / }
                                      }
                              );

                }
            });

        }
    });
        },


    });
}
);