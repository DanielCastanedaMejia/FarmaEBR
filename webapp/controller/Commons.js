sap.ui.define([
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (MessageBox, Fragment, JSONModel) {
    'use strict';

    return {
        trxExe: function (oParams, sPath, fCallback = null, oControl = null) {
            /**
             * Generic function for transaction execution
             * @param {Object} oParams Transaction input data
             * @param {String} sPath Route path of the transaction
             * @param {function} fCallback (Optional) Function called on succesful transaction
             *  Use fCallback.bind(this) as parameter for correct "this" object context
             * @param {Object} oControl (Optional) Control to set response as model
             */
            const sServer = "localhost:8010/proxy",
                oEmptyModel = new JSONModel(),
                sUri = "http://"
                    + sServer
                    + "/XMII/Runner?Transaction="
                    + sPath
                    + "&OutputParameter=JsonOutput&Content-Type=text/xml";

            if (oControl)
                oControl.setModel(oEmptyModel);

            $.ajax({
                type: "GET",
                dataType: "xml",
                cache: false,
                url: sUri,
                data: oParams
            }).done(function (xmlDOM) {
                var opElement = xmlDOM.getElementsByTagName("Row")[0].firstChild;

                if (opElement.firstChild !== null) {
                    var oResponse = JSON.parse(opElement.firstChild.data);

                    if (oResponse.ERROR !== undefined) {
                        MessageBox.error(oResponse.ERROR);
                    } else {
                        if (oResponse.MESSAGE)
                            MessageBox.information(oResponse.MESSAGE);
                        if (oControl)
                            oControl.setModel(new JSONModel(oResponse));
                        if (fCallback)
                            fCallback(oResponse);
                    }
                } else {
                    MessageToast.show("No se han recibido datos");
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                if (console && console.log) {
                    MessageBox.error("La solicitud ha fallado: \u00BFHay conexi\u00F3n con el servidor?");
                }
            });
        },

        openFragmentDialog: function (oThis, sFragmentName, oModel = null) {
            /**
             * Opens a fragment inside a generic dialog
             * @param {Object} oThis this object context
             * @param {String} sFragmentName Fragment path
             * @param {Object} oModel (Optional) Model to set on dialog fragment
             */
            this.openGenericDialog(oThis, oModel, function (oDialog) {
                Fragment.load({
                    id: oThis.getView().getId(),
                    name: sFragmentName,
                    controller: oThis
                }).then(function (oDialogContent) {
                    oDialog.addContent(oDialogContent);
                });
            });
        },

        openGenericDialog: function (oThis, oModel, fCallback) {
            /**
             * Creates an instance of a generic dialog and calls the callback
             * @param {Object} oThis this object context
             * @param {Object} oModel Model to set on dialog
             * @param {function} fCallback Function to call on generic dialog
             *  load
             */
            oThis.loadFragment({
                name: "sap.ui.test.fragment.GenericDialog"
            }).then(function (oDialog) {
                fCallback(oDialog);
                if (oModel)
                    oDialog.setModel(oModel);
                    oThis.getView().addDependent(oDialog);
                oDialog.open();
            });
        },

        dialogEscapeHandler: function (oEscapeHandler) {
            /**
             * Rejects the escape function on dialogs
             */
            oEscapeHandler.reject();
        },

        onCloseDialog: function (oEvent) {
            /**
             * Closes and destroys the Dialog where the source (close button) is
             *  instanced and the content fragment
             */
            const oSource = oEvent.getSource();
            let oParent = oSource.getParent(),
                oFragment = oParent.getContent()[0];

            while (!oParent.getId().includes("dialog"))
                oParent = oParent.getParent();

            oParent.close();
            oParent.destroy();
            oFragment.destroy();
        }
    }
});