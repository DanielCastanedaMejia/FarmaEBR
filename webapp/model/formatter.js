sap.ui.define([], function () {
    "use strict";
    return {
        date: function (sDate) {
            //var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
            try {
                if (sDate !== null) {
                    if (sDate === "TimeUnavailable")
                        return '';
                    else {
                        var sDate_aux,
                            sDate_format = '';
                        if (sDate !== null) {
                            sDate_aux = sDate.split('T');
                            sDate_format = sDate_aux[0] + ' ' + sDate_aux[1];
                        }
                        return sDate_format;
                    }
                }
                else {
                    return sDate;
                }
            }
            catch (err) {
                ("ERROR");
            }
        },

        miiStateColor: function (sState) {
            switch (sState) {
                case "CERRADA":
                    return "Error";
                case "PENDIENTE":
                    return "Warning";
                case "ABIERTA":
                    return "Success";              
            }
        },

        orderStateColor: function (sState) {
            switch (sState) { 
                case "1":
                    return "Success";
                case "3":
                    return "Warning";
                case "2":
                    return "Error";                
            }
        },

        orderState: function (sState) {
            switch (sState) {
                case "1":
                    return "LIB.";
                case "3":
                    return "PEND";
                case "2":
                    return "CERR";
            }
        },

		statusTimer: function (sStatus) {
			switch (sStatus) {
				case "0":
					return "Tomar tiempo";
				case "1":
					return "Detener tiempo;";
				default:
					return"";
			}
		},

		statusTimComp: function (sStatus) {
			switch (sStatus) {
				case "0":
					return true;
				case "1":
					return false;
				default:
					return"";
			}
		},
        conditionColor: function (sState) {
            switch (sState) {
                case "0":
                    return "Success";
                case "1":
                    return "Warning";
                case "2":
                    return "Error";
            }
        },

        conditionState:function(sState) {
            switch (sState) {
                case "1":
                    return "BUENO";
                case "3":
                    return "PROX VENCER";
                case "2":
                    return "MALO";
            }
        },
        causaParo: function (sData) {
            if (sData === '---')
                return 'Sin Causa';
            else
                return sData;
        },
        orderButtonType: function (sStarted, sNum) {
            if(!sStarted)
                return "Accept";
            if(sStarted != sNum)
                return "Accept";
            else
                return "Reject";
        },
        orderButtonText: function (sStarted, sNum) {
            const oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle(),
                sStart = oBundle.getText("startOrderButton"),
                sEnd = oBundle.getText("closeOrderButton");

            if(!sStarted)
                return sStart;
            if(sStarted != sNum)
                return sStart;
            else
                return sEnd;
        },
        orderButtonPress: function(sStarted, sNum) {
            if(!sStarted)
                return "onOpenStartOrderConfirmation";
            if(sStarted != sNum)
                return "onOpenStartOrderConfirmation";
            else
                return "onOpenFinishOrderConfirmation";
        },
        orderButtonIcon: function(sStarted, sNum) {
            if(!sStarted)
                return "sap-icon://begin";
            if(sStarted != sNum)
                return "sap-icon://begin";
            else
                return "sap-icon://decline";
        },
        ebrStateText: function(sStatus) {
            switch(sStatus) {
                case "1":
                    return "20%";
                case "2":
                    return "40%";
                case "3":
                    return "60%";
                case "4":
                    return "80%";
                case "5":
                    return "100%";
                default:
                    return "0%";
            }
        },
        ebrStateColor: function(sStatus) {
            switch(sStatus) {
                case "1":
                    return "Indication02";
                case "2":
                    return "Indication03";
                case "3":
                    return "Indication03";
                case "4":
                    return "Indication04";
                case "5":
                    return "Indication05";
                default:
                    return "Indication01";
            }
        }
    };
});