sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, formatter, JSONModel) {
	"use strict";

	return Controller.extend("sap.ui.demo.webapp.controller.Reportes.Charts", {

		formatter: formatter,

		onInit: function () {
			this.byId("grid").setModel(new sap.ui.model.json.JSONModel([{
					"title": "Uno",
					"rows": 4,
					"columns": 4,
					"manifest": {
						"sap.app": {
						  "id": "test_sample_card",
						  "type": "card"
						},
						"sap.card": {
						  "type": "Analytical",
						  "header": {
							"title": "Titulo",
							"subTitle": "subtitulo",
							"icon": {
							  "src": "sap-icon://home"
							}
						  },
						  "content": {
							"title": {
							  "text": "",
							  "visible": true,
							  "alignment": "Center"
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
							"chartType": "line",
							"measureAxis": "valueAxis",
							"dimensionAxis": "categoryAxis",
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
									"Store Name": "Preparación2",
									"Revenue": 82922.07,
									"Fat Percentage": "1 Percent"
								  },
								  {
									"Store Name": "Falla en banda2",
									"Revenue": 157913.07,
									"Fat Percentage": "1 Percent"
								  },
								  {
									"Store Name": "Cambio de troquel2",
									"Revenue": 245609.486884,
									"Fat Percentage": "1 Percent"
								  },
								  {
									"Store Name": "Cambio de troquel3",
									"Revenue": 245609.486884,
									"Fat Percentage": "1 Percent"
								  },
								  {
									"Store Name": "Cambio de troquel4",
									"Revenue": 245609.486884,
									"Fat Percentage": "1 Percent"
								  },
								  {
									"Store Name": "Cambio de troquel5",
									"Revenue": 245609.486884,
									"Fat Percentage": "1 Percent"
								  },
								  {
									"Store Name": "Cambio de troquel6",
									"Revenue": 245609.486884,
									"Fat Percentage": "1 Percent"
								  },
								  {
									"Store Name": "Cambio de troquel7",
									"Revenue": 245609.486884,
									"Fat Percentage": "1 Percent"
								  },
								  {
									"Store Name": "Cambio de troquel8",
									"Revenue": 245609.486884,
									"Fat Percentage": "1 Percent"
								  },
								  {
									"Store Name": "Cambio de troquel9",
									"Revenue": 245609.486884,
									"Fat Percentage": "1 Percent"
								  },
								  {
									"Store Name": "Cambio de troquel10",
									"Revenue": 245609.486884,
									"Fat Percentage": "1 Percent"
								  },
								  {
									"Store Name": "Cambio de troquel11",
									"Revenue": 245609.486884,
									"Fat Percentage": "1 Percent"
								  },
								  {
									"Store Name": "Cambio de troquel12",
									"Revenue": 245609.486884,
									"Fat Percentage": "1 Percent"
								  },
								  {
									"Store Name": "Cambio de troquel13",
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
					  },
				},{
					"title": "Dos",
					"rows": 4,
					"columns": 2
				},{
					"title": "Tres",
					"rows": 3,
					"columns": 2
				},{
					"title": "Cuatro",
					"rows": 1,
					"columns": 3
				},{
					"title": "Cinco",
					"rows": 3,
					"columns": 3
				},{
					"title": "Seis",
					"rows": 1,
					"columns": 2
				},{
					"title": "Siete",
					"rows": 1,
					"columns": 1
				}]
			));
		},

		onDrop: function (oInfo) {
			var oDragged = oInfo.getParameter("draggedControl"),
				oDropped = oInfo.getParameter("droppedControl"),
				sInsertPosition = oInfo.getParameter("dropPosition"),

				oDragContainer = oDragged.getParent(),
				oDropContainer = oInfo.getSource().getParent(),

				oDragModel = oDragContainer.getModel(),
				oDropModel = oDropContainer.getModel(),
				oDragModelData = oDragModel.getData(),
				oDropModelData = oDropModel.getData(),

				iDragPosition = oDragContainer.indexOfItem(oDragged),
				iDropPosition = oDropContainer.indexOfItem(oDropped);

			// remove the item
			var oItem = oDragModelData[iDragPosition];
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

			this.byId("grid").focusItem(iDropPosition);
		}
	});
});