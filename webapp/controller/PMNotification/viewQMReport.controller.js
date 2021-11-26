sap.ui.define([
    'jquery.sap.global',
    "sap/ui/demo/webapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator"
], function (JQuery, BaseController, MessageToast, MessageBox, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("sap.ui.demo.webapp.controller.PMNotification.viewQMReport", {
        onInit: function () {
            //jQuery.sap.getUriParameters().get("Plant")
            var oRouter = this.getRouter();
            oRouter.getRoute("viewQMReport").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oArgs, oView,
                oArgs = oEvent.getParameter("arguments"),
                oView = this.getView(),
                oTable = oView.byId('PMNotificationList'),
                oStats = oView.byId('IconTabBar_Notifications'),
                oModel_empty = new sap.ui.model.json.JSONModel(),
                oThis = this;

            //clear table
            oModel_empty.setData({})
            oTable.setModel(oModel_empty);
            oStats.setModel(oModel_empty);

            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({ plant: oArgs.Plant });
            oView.setModel(oModel);

            oView.bindElement({
                path: "/",
            });

            var oData = {
                "TIPO_FILTRO": "PRO",
                "FILTRO": oArgs.Plant
            };
            
            this._base_onloadCOMBO("listPMProceso", oData, "EquipandoXXI/DatosTransaccionales/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH","","Proceso");             

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
                this.onCloseDialogAddNotification();

                var oItem, oCtx;
                oItem = oEvent.getSource();
                oCtx = oItem.getBindingContext();
                var oData = {
                    "USUARIO": user.getValue(),
                    "CORREO": mail.getValue(),
                    "TELEFONO": phone.getValue(),
                };
                console.log(oData);
                this.createNotification(oData, 'EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Notificar/Transaction/notification');
            }

        },
        /****************************** END CREATE USER ******************************************/

        /****************************** START DELETE USER ****************************************/

        onOpenDialogDeleteUser: function (oEvent) {
            var oItem, oCtx,
                oItem = oEvent.getSource(),
                oCtx = oItem.getBindingContext(),
                oView = this.getView(),
                oDialog = oView.byId("PMNewUserDialog");

            // create dialog lazily
        },

        onCloseDialogNewUser: function () {
            this.getView().byId("PMNewUserDialog").close();
        },

        onCloseDialogAddNotificationConfirm: function (oEvent) {
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
                this.onCloseDialogAddNotification();

                var oItem, oCtx;
                oItem = oEvent.getSource();
                oCtx = oItem.getBindingContext();
                var oData = {
                    "USUARIO": user.getValue(),
                    "CORREO": mail.getValue(),
                    "TELEFONO": phone.getValue(),
                };
                console.log(oData);
                this.createNotification(oData, 'EquipandoXXI/DatosTransaccionales/Mantenimiento/Orden/Notificar/Transaction/notification');
            }

        },
        /****************************** END DELETE USER ******************************************/



        onChangePMProceso: function (oEvent) {
            var oData = {
                "TIPO_FILTRO": "SUBPRO",
                "FILTRO": oEvent.getParameter("selectedItem").getKey()
            };
            this._base_onloadCOMBO("listPMSubProceso", oData, "EquipandoXXI/DatosTransaccionales/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH", "", "SubProceso");
        },

        onChangePMSubProceso: function (oEvent) {
            var oData = {
                "TIPO_FILTRO": "FUNC",
                "FILTRO": oEvent.getParameter("selectedItem").getKey()
            };
            this._base_onloadCOMBO("listPMFunction", oData, "EquipandoXXI/DatosTransaccionales/UbicacionesTecnicas/Transaction/Ubicaciones_CEMH", "", "Funcion");
        },

        onPMNotificationDetail: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            this.getRouter().navTo("PMNotificationDetail", {
                id: oCtx.getProperty("id")
            });

        },

        onShowOrder: function (oEvent) {
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();
            this.getRouter().navTo("PMOrderDetail", {
                id: oCtx.getProperty("order")
            });

        },

        onShowView: function (oEvent) {      
            var oItem, oCtx;
            oItem = oEvent.getSource();
            oCtx = oItem.getBindingContext();

            var oComboProcess = this.byId("listPMProceso");
            var oComboSubProcess = this.byId("listPMSubProceso");
            var oComboFunction = this.byId("listPMFunction");
            var oCheckStop = this.byId("PMStop"); 
            var oInputStarDate = this.byId("start_date"); 
            var oInputEndDate = this.byId("end_date");

            var oStop = 0;
            if (oCheckStop.getSelected() == true)
                oStop = 'X';
            else
                oStop = '';

            var plant = oCtx.getProperty("plant");
            console.log(oCtx.getProperty("plant"));
            plant = plant.split('-')[1];

            var oData = {
                "BREAKDOWN": oStop,
                "END_DATE": oInputEndDate.getValue(),
                "FUNCTION": oComboFunction.getSelectedKey(),
                "PLANT": plant,
                "PROCESS": oComboProcess.getSelectedKey(),
                "START_DATE": oInputStarDate.getValue(),
                "SUBPROCESS": oComboSubProcess.getSelectedKey(),
            };
            
            this._base_onloadTable("PMNotificationList", oData, "EquipandoXXI/DatosTransaccionales/Mantenimiento/Avisos/Buscar/Transaction/get_avisos", "Avisos","IconTabBar_Notifications");
        },

        handleIconTabBarSelect: function (oEvent) {
            var aFilter = [],
                oTable = this.byId('PMNotificationList'),
                oBinding = oTable.getBinding('items'),
                sKey = oEvent.getParameter("key");

            if (sKey != 'All') {
                if (sKey != 'NORAS')
                    aFilter.push(new Filter("status", FilterOperator.Contains, sKey));
                else
                    aFilter.push(new Filter("noras", FilterOperator.Contains, sKey));
            }                
            
            oBinding.filter(aFilter);
        },
        

    });
}
);

