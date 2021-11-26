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
                case "FINALIZADA":
                    return "Error";  
                case "INICIADA":
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
        }
    };
});