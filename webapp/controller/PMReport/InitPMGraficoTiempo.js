sap.ui.define([
   ], function() {
    return {
        initPageSettings : function(oView) {

            // try to load sap.suite.ui.commons for using ChartContainer
            // sap.suite.ui.commons is available in sapui5-sdk-dist but not in demokit
            var libraries = sap.ui.getVersionInfo().libraries || [];
            var bSuiteAvailable = libraries.some(function(lib){
                return lib.name.indexOf("sap.suite.ui.commons") > -1;
            });
            if (bSuiteAvailable) {
                jQuery.sap.require("sap/suite/ui/commons/ChartContainer");
                var vizframe = oView.byId("idVizFrame");
                var vizframe1 = oView.byId("idVizFrame-1");
                var vizframe2 = oView.byId("idVizFrame-2");
                var oChartContainerContent = new sap.suite.ui.commons.ChartContainerContent({
                    icon : "sap-icon://vertical-waterfall-chart",
                    title : "vizFrame Waterfall Chart Sample",
                    content : [ vizframe]
                });
                var oChartContainerContent1 = new sap.suite.ui.commons.ChartContainerContent({
                    icon : "sap-icon://vertical-waterfall-chart",
                    title : "vizFrame Waterfall Chart Sample",
                    content : [vizframe1]
                });
                var oChartContainerContent2 = new sap.suite.ui.commons.ChartContainerContent({
                    icon : "sap-icon://vertical-waterfall-chart",
                    title : "vizFrame Waterfall Chart Sample",
                    content : [vizframe2]
                });
                var oChartContainer = new sap.suite.ui.commons.ChartContainer({
                    content : [ oChartContainerContent ]
                });
                oChartContainer.setShowFullScreen(true);
                oChartContainer.setAutoAdjustHeight(true);
                oView.byId('chartFixFlex').setFlexContent(oChartContainer);

                var oChartContainer1 = new sap.suite.ui.commons.ChartContainer({
                    content : [ oChartContainerContent1 ]
                });
                oChartContainer1.setShowFullScreen(true);
                oChartContainer1.setAutoAdjustHeight(true);
                oView.byId('chartFixFlex-1').setFlexContent(oChartContainer1);

                var oChartContainer2 = new sap.suite.ui.commons.ChartContainer({
                    content : [ oChartContainerContent2 ]
                });
                oChartContainer2.setShowFullScreen(true);
                oChartContainer2.setAutoAdjustHeight(true);
                oView.byId('chartFixFlex-2').setFlexContent(oChartContainer2);

            }
        }
    };
});