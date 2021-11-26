sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/json/JSONModel'

], function (JQuery, BaseController, MessageToast, MessageBox, JSONModel) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.PP.RegistroMermas", {
        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("RegistroMermas").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {


            var oArgs, oView;
            oArgs = oEvent.getParameter("arguments");
            oView = this.getView();

            var oTable = oView.byId("Tabla_mermas");
            var oModel_empty = new sap.ui.model.json.JSONModel();
            oModel_empty.setData({});
            oTable.setModel(oModel_empty);

            oView.bindElement({
                path: "/"
            });


            this._base_onloadCOMBO("ordenActiva", {}, "ZPRY_B/Corrugado/DatosTransaccionales/Materiales/Transaction/sel_ordenes_activas", "", "Ordenes activas"); 
            this._base_onloadTable("Tabla_mermas", "", "ZPRY_B/Corrugado/DatosTransaccionales/Materiales/Transaction/mermas_registradas", "Tabla_mermass", "");           
        },
        onChangeOrden : function(){
            var InputMaterial=this.getView().byId("material");
            InputMaterial.setValue("EMP_F01");
        },
        onGuardarMermas:function(){
        
        sap.ui.core.BusyIndicator.show(0);
        var uri = "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Runner?Transaction=ZPRY_B/Moldeo/DatosTransaccionales/Produccion/Mermas/Transaction/consumo_merma_demo&OutputParameter=*&Content-Type=text/xml"
        uri = uri.replace(/\s+/g, '');
        var Othis=this;
        console.log(this.byId('ordenActiva').getSelectedKey());
        console.log(this.byId('ordenActiva').getSelectedItem().getText());
        console.log(this.getView().byId("cantidad").getValue());
        var separa=this.byId('ordenActiva').getSelectedItem().getText().split('-');
        var  orden=separa[1]
        console.log(orden);
        $.ajax({
        type: "GET",
        url:uri,
        dataType: "xml",
        data: {
            "ID_MATERIAL": this.byId('ordenActiva').getSelectedKey(),
            "NUM_ORDEN": orden,
            "PLANTA":"1710",
            "CANTIDAD":this.getView().byId("cantidad").getValue()
        },
        success: function (xml) {
            sap.ui.core.BusyIndicator.hide();
            var estatus = "";
            var mensaje = "";

            $(xml).find('Row').each(function () {
                estatus = $(this).find('ESTATUS').text();
                mensaje = $(this).find('MENSAJE').text();
            });

            if (estatus==0) {
                         sap.m.MessageBox.show(
                              mensaje, {
                                  icon: sap.m.MessageBox.Icon.WARNING,
                                  title: "Proceso incompleto.",
                                  actions: [sap.m.MessageBox.Action.YES],
                                    onClose: function(oAction) { / * do function * / }
                                      }
                              );
            
            }else{
            Othis._base_onloadTable("Tabla_mermas", "", "ZPRY_B/Corrugado/DatosTransaccionales/Materiales/Transaction/mermas_registradas", "Tabla_mermass", "");           
                            sap.m.MessageBox.show(
                              'Merma registrada en sistema.', {
                                  icon: sap.m.MessageBox.Icon.INFORMATION,
                                  title: "Proceso incompleto.",
                                  actions: [sap.m.MessageBox.Action.YES],
                                    onClose: function(oAction) { / * do function * / }
                                      }
                              );

            }
        }
    });
        }

    });
}
);