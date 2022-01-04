sap.ui.define([
	"sap/ui/demo/webapp/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("sap.ui.demo.webapp.controller.Reportes.Charts", {

		onInit: function () {
			let oGrid = this.byId("grid");

			oGrid.setModel(new JSONModel([ {
				"rows": 1,
				"columns": 3,
				"manifest": {
					"sap.app": {
						"type": "card"
					},
					"sap.card": {
						"type": "Analytical",
						"header": {
							"type": "Numeric",
							"data": {
								"json": {
									"number": "65.34",
									"unit": "K",
									"trend": "Down",
									"state": "Error",
									"target": {
										"number": 100,
										"unit": "min"
									},
									"deviation": {
										"number": 34.7
									},
									"details": "Datos de la semana"
								}
							},
							"title": "Paros",
							"subTitle": "Tiempo de paro",
							"unitOfMeasurement": "min",
							"mainIndicator": {
								"number": "{number}",
								"unit": "{unit}",
								"trend": "{trend}",
								"state": "{state}",
								"range": {
									"Critical": [
										0,
										100
									],
									"Good": [
										100,
										1000
									]
								}
							},
							"details": "{details}",
							"sideIndicators": [
								{
									"title": "Objetivo",
									"number": "500",
									"unit": "{target/unit}"
								},
								{
									"title": "Desviacion",
									"number": "{deviation/number}",
									"unit": "%"
								}
							]
						},
						"content": {
							"chartType": "Line",
							"legend": {
								"visible": true,
								"position": "Bottom",
								"alignment": "Left"
							},
							"plotArea": {
								"dataLabel": {
									"visible": true
								},
								"categoryAxisText": {
									"visible": false
								},
								"valueAxisText": {
									"visible": false
								}
							},
							"title": {
								"text": "Minutos de paro",
								"visible": true,
								"alignment": "Left"
							},
							"measureAxis": "valueAxis",
							"dimensionAxis": "categoryAxis",
							"data": {
								"json": {
									"list": [
										{
											"Week": "D14",
											"Minutos": 680
										},
										{
											"Week": "D15",
											"Minutos": 494
										},
										{
											"Week": "D16",
											"Minutos": 491
										},
										{
											"Week": "D17",
											"Minutos": 536
										},
										{
											"Week": "D18",
											"Minutos": 675
										},
										{
											"Week": "D19",
											"Minutos": 680
										},
										{
											"Week": "D20",
											"Minutos": 659
										}
									]
								},
								"path": "/list"
							},
							"dimensions": [
								{
									"label": "Weeks",
									"value": "{Week}"
								}
							],
							"measures": [
								{
									"label": "Paros",
									"value": "{Minutos}"
								}
							]
						}
					}
				}
			}, {
				"rows": 1,
				"columns": 3,
				"manifest": {
					"sap.app": {
						"type": "card"
					},
					"sap.card": {
						"type": "Analytical",
						"header": {
							"type": "Numeric",
							"data": {
								"json": {
									"n": 6547394.45496,
									"u": "kWh",
									"trend": "Down",
									"valueColor": "Critical"
								}
							},
							"subTitle": "Consumo de energía",
							"mainIndicator": {
								"number": "{n}",
								"unit": "{u}",
								"trend": "{trend}",
								"state": "{valueColor}"
							}
						},
						"content": {
							"chartType": "StackedBar",
							"legend": {
								"visible": true,
								"position": "Bottom",
								"alignment": "Center"
							},
							"plotArea": {
								"dataLabel": {
									"visible": true,
									"showTotal": false
								},
								"categoryAxisText": {
									"visible": false
								},
								"valueAxisText": {
									"text": "Value Axis text"
								}
							},
							"title": {
								"text": "Consumo por máquina",
								"visible": true,
								"alignment": "Bottom"
							},
							"measureAxis": "valueAxis",
							"dimensionAxis": "categoryAxis",
							"data": {
								"json": {
									"list": [
										{
											"Week": "MQ1",
											"Consumo": 431000.22
										},
										{
											"Week": "MQ2",
											"Consumo": 494000.30
										},
										{
											"Week": "MQ3",
											"Consumo": 491000.17
										},
										{
											"Week": "MQ4",
											"Consumo": 536000.34
										},
										{
											"Week": "MQ5",
											"Consumo": 675000.00
										},
										{
											"Week": "MQ6",
											"Consumo": 680000.00
										}
									]
								},
								"path": "/list"
							},
							"dimensions": [
								{
									"label": "Weeks",
									"value": "{Week}"
								}
							],
							"measures": [
								{
									"label": "Revenue",
									"value": "{Consumo}"
								}
							]
						}
					}
				}
			}, {
				"rows": 1,
				"columns": 3,
				"manifest": {
					"sap.app": {
						"id": "donut_sample",
						"type": "card"
					},
					"sap.card": {
						"type": "Analytical",
						"header": {
							"type": "Numeric",
							"data": {
								"json": {
									"n": 3260,
									"u": "min",
									"valueColor": "Error"
								}
							},
							"subTitle": "Causas de paro",
							"mainIndicator": {
								"number": "{n}",
								"unit": "{u}",
								"trend": "{trend}",
								"state": "{valueColor}"
							}
						},
						"content": {
							"chartType": "Donut",
							"legend": {
								"visible": true,
								"position": "Top",
								"alignment": "Center"
							},
							"plotArea": {
								"dataLabel": {
									"visible": true,
									"showTotal": true
								}
							},
							"title": {
								"text": "Causas",
								"visible": true,
								"alignment": "Bottom"
							},
							"measureAxis": "size",
							"dimensionAxis": "color",
							"data": {
								"json": {
									"milk": [
										{
											"Store Name": "Preparación",
											"Revenue": 345292.06,
											"Fat Percentage": "2 Percent"
										},
										{
											"Store Name": "Falla en banda",
											"Revenue": 1564235.29,
											"Fat Percentage": "2 Percent"
										},
										{
											"Store Name": "Cambio de troquel",
											"Revenue": 1085567.22,
											"Fat Percentage": "2 Percent"
										},
										{
											"Store Name": "Preparación",
											"Revenue": 82922.07,
											"Fat Percentage": "1 Percent"
										},
										{
											"Store Name": "Falla en banda",
											"Revenue": 157913.07,
											"Fat Percentage": "1 Percent"
										},
										{
											"Store Name": "Cambio de troquel",
											"Revenue": 245609.486884,
											"Fat Percentage": "1 Percent"
										}
									]
								},
								"path": "/milk"
							},
							"dimensions": [
								{
									"label": "Store Name",
									"value": "{Store Name}"
								}
							],
							"measures": [
								{
									"label": "Revenue",
									"value": "{Revenue}"
								}
							]
						}
					}
				}
			}, {
				"rows": 1,
				"columns": 3,
				"manifest": {
					"sap.app": {
						"type": "card"
					},
					"sap.card": {
						"type": "Analytical",
						"header": {
							"type": "Numeric",
							"data": {
								"json": {
									"number": "77.71",
									"unit": "%",
									"trend": "Down",
									"state": "Critical",
									"target": {
										"number": 100,
										"unit": "%"
									},
									"deviation": {
										"number": 3.29
									},
									"details": "Datos de la semana"
								}
							},
							"title": "OEE",
							"subTitle": "Cálculo de OEE",
							"mainIndicator": {
								"number": "{number}",
								"unit": "{unit}",
								"trend": "{trend}",
								"state": "{state}",
								"range": {
									"Critical": [
										0,
										100
									],
									"Good": [
										100,
										1000
									]
								}
							},
							"details": "{details}",
							"sideIndicators": [
								{
									"title": "Objetivo",
									"number": "81",
									"unit": "{target/unit}"
								},
								{
									"title": "Desviacion",
									"number": "{deviation/number}",
									"unit": "%"
								}
							]
						},
						"content": {
							"chartType": "Line",
							"legend": {
								"visible": true,
								"position": "Bottom",
								"alignment": "Left"
							},
							"plotArea": {
								"dataLabel": {
									"visible": true
								},
								"categoryAxisText": {
									"visible": false
								},
								"valueAxisText": {
									"visible": false
								}
							},
							"title": {
								"text": "OEE",
								"visible": true,
								"alignment": "Left"
							},
							"measureAxis": "valueAxis",
							"dimensionAxis": "categoryAxis",
							"data": {
								"json": {
									"list": [
										{
											"Week": "D14",
											"OEE": 78
										},
										{
											"Week": "D15",
											"OEE": 59
										},
										{
											"Week": "D16",
											"OEE": 85
										},
										{
											"Week": "D17",
											"OEE": 92
										},
										{
											"Week": "D18",
											"OEE": 77
										},
										{
											"Week": "D19",
											"OEE": 78
										},
										{
											"Week": "D20",
											"OEE": 75
										}
									]
								},
								"path": "/list"
							},
							"dimensions": [
								{
									"label": "Weeks",
									"value": "{Week}"
								}
							],
							"measures": [
								{
									"label": "Paros",
									"value": "{OEE}"
								}
							]
						}
					}
				}
			}]
			));
			this.setChartModels();
		},

		setChartModels: function () {
			/**
			 * Loads manifest model from fiori card model to content card
			 */
			const oGrid = this.byId("grid"),
				oModel = oGrid.getModel(),
				oModelData = oModel.getData(),
				iItems = oModelData.length;

			for (let i = 0, oChart; i < iItems; i++) {
				oChart = oGrid.getItems()[i].getContent();
				oChart.setModel(new JSONModel(oModelData[i].manifest));
			}
		},

		onDrop: function (oInfo) {
			/**
			 * Changes model position between dragged and dropped positions
			 */
			let oDragged = oInfo.getParameter("draggedControl"),
				oDropped = oInfo.getParameter("droppedControl"),
				sInsertPosition = oInfo.getParameter("dropPosition"),

				oDragContainer = oDragged.getParent(),
				oDropContainer = oInfo.getSource().getParent(),

				oDragModel = oDragContainer.getModel(),
				oDropModel = oDropContainer.getModel(),
				oDragModelData = oDragModel.getData(),
				oDropModelData = oDropModel.getData(),

				iDragPosition = oDragContainer.indexOfItem(oDragged),
				iDropPosition = oDropContainer.indexOfItem(oDropped),

				oChartModel = oDragged.getAggregation("content").getModel();

			// remove the item
			let oItem = oDragModelData[iDragPosition];
			oDragModelData.splice(iDragPosition, 1);

			if (oDragModel === oDropModel && iDragPosition < iDropPosition) {
				iDropPosition--;
			}

			if (sInsertPosition === "After") {
				iDropPosition++;
			}

			// insert the control in target aggregation
			oDropModelData.splice(iDropPosition, 0, oItem);

			if (oDragModel !== oDropModel) {
				oDragModel.setData(oDragModelData);
				oDropModel.setData(oDropModelData);
			} else {
				oDropModel.setData(oDropModelData);
			}

			this.setChartModels();

			this.byId("grid").focusItem(iDropPosition);
		}
	});
});