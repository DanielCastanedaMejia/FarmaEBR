sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator"
], function (JQuery, BaseController, MessageToast, MessageBox, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.PMNotification.viewPMUser", {
        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("viewPMUser").attachMatched(this._onRouteMatched, this);

        },


        _onRouteMatched: function (oEvent) {
            var oArgs, oView,
                oArgs = oEvent.getParameter("arguments"),
                oView = this.getView(),
                oTable = oView.byId('PMUserList'),
                oModel_empty = new sap.ui.model.json.JSONModel(),
                oThis = this;

            //clear table
            oModel_empty.setData({})
            oTable.setModel(oModel_empty);

            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({ plant: oArgs.Plant });
            oView.setModel(oModel);

            oView.bindElement({
                path: "/",
            });

            var oData = {
                "OP": "LOAD"
            };
            
            this._base_onloadTable("PMUserList", oData, "SelloRojo/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/visualizar_usuarios","Usuarios", "");
console.log(oData);
        },  


                /****************************** START CREATE NEW USER *******************************/

        onOpenDialogNewUser: function (oEvent) {
            var oItem, oCtx,
                oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                oView = this.getView(),
                oDialog = oView.byId("PMNewUserDialog");

            // create dialog lazily
            if (!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.webapp.view.PMNewUser", this);
                oView.addDependent(oDialog);
            }
            
            oDialog.open();
        },

        onCloseDialogNewUser: function () {
            this.getView().byId("PMNewUserDialog").close();
        },

        onCloseDialogCreateUser: function (oEvent) {
            var user = this.byId('inputUser'),
                mail = this.byId('inputMail'),
                phone = this.byId('inputPhone');

            if (user.getValue() == '') {
                this.getOwnerComponent().openHelloDialog("Ingresa el nombre completo del Usuario");
            }
            else if (mail.getValue() == '') {
                this.getOwnerComponent().openHelloDialog("Ingresa un e-mail de contacto");
            }
            else if (phone.getValue() == '') {
                this.getOwnerComponent().openHelloDialog("Ingresa un numero celular de contacto");
            }
            else {

                var oData = {
                    "OP":"CREATE",
                    "USUARIO": user.getValue(),
                    "CORREO": mail.getValue(),
                    "TELEFONO": phone.getValue()
                };
                console.log(oData);
                this.createUser(oData,"SelloRojo/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/visualizar_usuarios");
            }

        },

        createUser: function (oData, path) {

            var uri = "http://" + this.getOwnerComponent().getManifestEntry("/sap.ui5/initData/server") + "/XMII/Runner?Transaction=" + path + "&OutputParameter=JsonOutput&Content-Type=text/xml"
            uri = uri.replace(/\s+/g, '');
            var oThis = this;
            sap.ui.core.BusyIndicator.show(0);

            $.ajax({
                type: "GET",
                dataType: "xml",
                cache: false,
                url: uri,
                data: oData
            })  
                .done(function (xmlDOM) {
                    var opElement = xmlDOM.getElementsByTagName("Row")[0].firstChild;
                    console.log(opElement);
                    if (opElement.firstChild != null) {
                        var aData = JSON.parse(opElement.firstChild.data);
                        if (aData[0].error !== undefined) {
                            oThis.getOwnerComponent().openHelloDialog(aData[0].error);
                        }
                        else {
                            //Create  the JSON model and set the data                                                                                                
                            MessageToast.show(aData[0].message);

                            var oData = {
                                "OP": "LOAD",
                            }
                            oThis._base_onloadTable("PMUserList", oData, "SelloRojo/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/visualizar_usuarios","Usuarios", "");
                        }

                    }
                    else {
                        window.location.reload()
                    }

                    sap.ui.core.BusyIndicator.hide();

                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    if (console && console.log) {
                        oThis.getOwnerComponent().openHelloDialog("La solicitud a fallado: Hay conexi�n de red?");
                    }
                    sap.ui.core.BusyIndicator.hide();
                });

        },
        /****************************** END CREATE USER ******************************************/

        /****************************** START DELETE USER ****************************************/

        onDeleteUser: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext().getProperty("user");
            console.log(oCtx);
            var items = this.getView().byId("PMUserList").getItems();
            var xml_completo;
            items.forEach(function (item) {
                    xml_completo = ''+item.getCells()[0].getProperty("text")+'';
            });

            var oData = {
                "OP": "DELETE",
                "DATA": xml_completo
            }
            
            //this._base_onloadTable("PMUserList", oData, "SelloRojo/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/visualizar_usuarios");
            console.log(oData);
            
        },

        onCloseDialogNewUser: function () {
            this.getView().byId("PMNewUserDialog").close();
        },

       
        /****************************** END DELETE USER ******************************************/


    });
}
);