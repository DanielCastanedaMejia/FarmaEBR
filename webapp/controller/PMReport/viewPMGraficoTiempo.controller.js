sap.ui.define([
        'jquery.sap.global',
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/data/FlattenedDataset',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        './InitPMGraficoTiempo'

    ], function(jQuery, Controller, JSONModel, FlattenedDataset, ChartFormatter, Format, InitPageUtil) {
    "use strict";
    
    var Controller = Controller.extend("sap.ui.demo.webapp.controller.PMReport.viewPMGraficoTiempo", {
        
        //dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_cost_consume",
        
        settingsModel : {
            series : {
                name : "Series",
                //defaultSelected : 0,
                values : [{
                    name : "1 Series",
                    value : [["Cost"],["Budget"]]
                }
                ]},
            dataLabel : {
                name : "Value Label",
                defaultState : false,
                enabled: false,
            },
            axisTitle : {
                name : "Axis Title",
            },
            valuesDisplayed : {
                name : "Values Displayed",
                defaultSelected : 0,
                values : [{
                    key : "0",
                    name : "Primary Only",
                    enabled : true,
                    vizProperties : {
                        plotArea: {
                            colorPalette: null,
                            gap: {
                                visible: false
                            }
                        }
                    }
                },{
                    key : "1",
                    name : "Primary + Additional",
                    enabled : true,
                    vizProperties : {
                        plotArea: {
                            colorPalette: null,
                            gap: {
                                visible: false
                            }
                        }
                    }
                }]
            },
            dimensions: {
                Medium: [{
                    name: 'Week',
                    value: "{Week}",
                }]
            },
            measures: [{
               name: 'Cost',
               value: '{Cost}'
            },{
               name: 'Budget',
               value: '{Budget}'
            }],
            rules: {
                primary : [{
                    plotArea : {
                        dataPointStyle : {
                            rules : [{
                                dataContext : {Cost : "*"},
                                properties : {
                                    //COLOR DE BARRAS
                                    color : "sapUiChartPaletteSequentialHue1Light1"
                                },
                                displayName : "Actual",
                                dataName : {Cost : "Actual"} 
                            }]
                        }
                    }
                }, {
                    plotArea : {
                        dataPointStyle : {
                        }
                    }
                }],
                primaryAdditional : [{
                    plotArea : {
                        dataPointStyle : {
                        }
                    }
                }]
            },
            feeds: {
                oneSeries : {
                    primary : [["Cost"], ["Budget"]],
                }
            }
        },
        
        oVizFrame : null,
        feedActualValues : null, feedCategoryAxis : null, feedTargetValues : null,
        feedAdditionalValues : null, feedForecastValues : null, seriesRadioGroup : null,
 
        onInit : function (evt) {
            Format.numericFormatter(ChartFormatter.getInstance());
            var formatPattern = ChartFormatter.DefaultPattern;
            // set explored app's demo model on this sample
            var oModel = new JSONModel(this.settingsModel);
            oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
            this.getView().setModel(oModel);
            
            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            oVizFrame.setVizProperties({
                plotArea: {
                    dataLabel: {
                        formatString:formatPattern.SHORTFLOAT_MFD2,
                        visible: true
                    },
                    gap: {
                        visible: false
                    }
                },
                valueAxis: {
                    label: {
                        formatString: formatPattern.SHORTFLOAT
                    },
                    title: {
                        visible: true
                    }
                },
                categoryAxis: {
                    title: {
                        visible: true
                    }
                },
                title: {
                    visible: true,
                    text: 'ORDENES REALIZADAS'
                }
            });
            var dataModel = new JSONModel();
                var dataa = {
  'Row': [{
        "Week": "Week 1",
        "Cost": 23000.00,
        "Budget": 21000.00
    },
    {
        "Week": "Week 5",
        "Cost": 23800.00,
        "Budget": 22400.00
    },
    {
        "Week": "Week 9",
        "Cost": 22100.00,
        "Budget": 23800.00
    },
    {
        "Week": "Week 17",
        "Cost": 23000.00,
        "Budget": 26600.00
    },
    {
        "Week": "Week 21",
        "Cost": 25000.00,
        "Budget": 28000.00
    },
    {
        "Week": "Week 25",
        "Cost": 32500.00,
        "Budget": 29400.00
    },
    {
        "Week": "Week 29",
        "Cost": 3500.00,
        "Budget": 30000.00
    },
    {
        "Week": "Week 47",
        "Cost": 5600.00,
        "Budget": 36000.00
    }]};
                dataModel.setData(dataa);
                oVizFrame.setModel(dataModel);
            
            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(formatPattern.STANDARDFLOAT);
            oVizFrame.setVizProperties(this.settingsModel.rules.primary[0]);
            
            InitPageUtil.initPageSettings(this.getView());
            this.LoadGraphic2();
            this.LoadGraphic3();
        },



        LoadGraphic2:function(evt){

                        Format.numericFormatter(ChartFormatter.getInstance());
            var formatPattern = ChartFormatter.DefaultPattern;
            // set explored app's demo model on this sample
            var oModel = new JSONModel(this.settingsModel);
            oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
            this.getView().setModel(oModel);
            
            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame-1");
            oVizFrame.setVizProperties({
                plotArea: {
                    dataLabel: {
                        formatString:formatPattern.SHORTFLOAT_MFD2,
                        visible: true
                    },
                    gap: {
                        visible: false
                    }
                },
                valueAxis: {
                    label: {
                        formatString: formatPattern.SHORTFLOAT
                    },
                    title: {
                        visible: true
                    }
                },
                categoryAxis: {
                    title: {
                        visible: true
                    }
                },
                title: {
                    visible: true,
                    text: 'HORAS INVERTIDAS EN MANTENIMIENTO'
                }
            });
            var dataModel = new JSONModel();
                var dataa = {
  'Row': [{
        "Week": "Week 1",
        "Cost": 23000.00
    },
    {
        "Week": "Week 5",
        "Cost": 23800.00
    },
    {
        "Week": "Week 9",
        "Cost": 22100.00
    },
    {
        "Week": "Week 17",
        "Cost": 23000.00
    },
    {
        "Week": "Week 21",
        "Cost": 25000.00
    },
    {
        "Week": "Week 25",
        "Cost": 32500.00
    },
    {
        "Week": "Week 29",
        "Cost": 3500.00
    },
    {
        "Week": "Week 47",
        "Cost": 5600.00
    }]};
                dataModel.setData(dataa);
                oVizFrame.setModel(dataModel);
            
            var oPopOver = this.getView().byId("idPopOver-1");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(formatPattern.STANDARDFLOAT);
            oVizFrame.setVizProperties(this.settingsModel.rules.primary[0]);
            
            InitPageUtil.initPageSettings(this.getView());

        },



        LoadGraphic3:function(evt){

                        Format.numericFormatter(ChartFormatter.getInstance());
            var formatPattern = ChartFormatter.DefaultPattern;
            // set explored app's demo model on this sample
            var oModel = new JSONModel(this.settingsModel);
            oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
            this.getView().setModel(oModel);
            
            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame-2");
            oVizFrame.setVizProperties({
                plotArea: {
                    dataLabel: {
                        formatString:formatPattern.SHORTFLOAT_MFD2,
                        visible: true
                    },
                    gap: {
                        visible: false
                    }
                },
                valueAxis: {
                    label: {
                        formatString: formatPattern.SHORTFLOAT
                    },
                    title: {
                        visible: true
                    }
                },
                categoryAxis: {
                    title: {
                        visible: true
                    }
                },
                title: {
                    visible: true,
                    text: 'HORAS INVERTIDAS EN MANTENIMIENTO'
                }
            });
            var dataModel = new JSONModel();
                var dataa = {
  'Row': [{
        "Week": "Week 1",
        "Cost": 23000.00
    },
    {
        "Week": "Week 5",
        "Cost": 23800.00
    },
    {
        "Week": "Week 9",
        "Cost": 22100.00
    },
    {
        "Week": "Week 17",
        "Cost": 23000.00
    },
    {
        "Week": "Week 21",
        "Cost": 25000.00
    },
    {
        "Week": "Week 25",
        "Cost": 32500.00
    },
    {
        "Week": "Week 29",
        "Cost": 3500.00
    },
    {
        "Week": "Week 47",
        "Cost": 5600.00
    }]};
                dataModel.setData(dataa);
                oVizFrame.setModel(dataModel);
            
            var oPopOver = this.getView().byId("idPopOver-2");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(formatPattern.STANDARDFLOAT);
            oVizFrame.setVizProperties(this.settingsModel.rules.primary[0]);
            
            InitPageUtil.initPageSettings(this.getView());

        },



        onNavBack: function (oEvent) {
                window.history.go(-1);
        },
    }); 
    return Controller;
});