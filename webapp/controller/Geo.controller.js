sap.ui.define([
	"sap/ui/demo/webapp/controller/BaseController",
	"sap/ui/demo/webapp/model/formatter"
], function (BaseController, formatter) {
	"use strict";

	return BaseController.extend("sap.ui.demo.webapp.controller.Geo", {
		formatter: formatter,
		onInit: function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("Geo").attachMatched(this._onRouteMatched, this);
			var oModel = new sap.ui.model.json.JSONModel(),
				oModelS = new sap.ui.model.json.JSONModel(),
				oData = {
					"ALERTA_VISIBLE": "0"
				},
				oDataS = {
					"status": "Error",
					"icon": "sap-icon://add-equipment",
					"text": "Alerta"
				},
				xData = {
					"UBICACION_TECNICA": "FPSO01"
				};
			oModel.setData(oData);
			oModelS.setData(oDataS);
			this.getView().setModel(oModel, "HEADER");
			this.getView().setModel(oModelS, "STATE");
		},

		_onRouteMatched: function (oEvent) {			

			var accessTokenMapbox = 'pk.eyJ1Ijoib3NjYXJtYXJ4IiwiYSI6ImNqeXVqZzQ0NzAwdTEza21zb3F0NXA1am8ifQ.LktymKMtKad0q8HeWgd-ww';
			var appCode = 'xqjCK7HxKbj-oYA-K6yw_w';
			var appId = 'dhTVPAlSKvlkx5WaEWs0';

			// If you have not set up any Map Provider keys, then we will set a default map for one of the providers so that you can see something
			var defaultUrlHA = appCode === "NOT CONFIGURED" | undefined ? "https://a.tile.openstreetmap.org/{LOD}/{X}/{Y}.png" : "https://1.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/satellite.day/{LOD}/{X}/{Y}/256/png8?app_code=" + appCode + "&app_id=" + appId;
			var defaultUrlHB = appCode === "NOT CONFIGURED" | undefined ? "https://b.tile.openstreetmap.org/{LOD}/{X}/{Y}.png" : "https://2.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/satellite.day/{LOD}/{X}/{Y}/256/png8?app_code=" + appCode + "&app_id=" + appId;
			var defaultUrlMBA = accessTokenMapbox === "NOT CONFIGURED" | undefined ? "https://a.tile.openstreetmap.org/{LOD}/{X}/{Y}.png" : "https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{LOD}/{X}/{Y}@2x?access_token=" + accessTokenMapbox;
			var defaultCopyright = appCode === "NOT CONFIGURED" | undefined ? "Tile courtesy of OpenStreetMap" : "Tiles Courtesy of HERE Maps";

			var oMapConfig = {
				"MapProvider": [

					{
						"name": "MAPBOX_STARTER",
						"type": "",
						"description": "",
						"tileX": "256",
						"tileY": "256",
						"maxLOD": "20",
						"copyright": "Tiles Courtesy of HERE Maps",
						"Source": [{
							"id": "s1",
							"url": defaultUrlMBA
						}]
					},
				],
				"MapLayerStacks": [{
					"name": "Default",
					"MapLayer": [{
						"name": "MapBox",
						"refMapProvider": "MAPBOX_STARTER",
						"colBkgnd": "RGB(255,255,255)"
					}]
				}]
			};

			var geoMap = this.getView().byId("geoMap");
			geoMap.setMapConfiguration(oMapConfig);

			//this._base_onloadTable("PMComponentList", aData, "GIM/DatosTransaccionales/Mantenimiento/Orden/Visualizar/Transaction/get_components", "Componentes", "");   

		},
	});
});