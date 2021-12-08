sap.ui.define([
	"sap/ui/demo/webapp/controller/BaseController",
	"sap/ui/demo/webapp/model/formatter",
	"sap/m/MessageToast"
], function (BaseController, formatter, MessageToast) {
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

			var spot = new sap.ui.vbm.Spot("spotTest");

			spot.setPosition("-105;15;0");
			spot.setType("None");
			spot.setTooltip("Spot Test");
			spot.setText("Fondo de bikini");
			spot.setAlignment("1");
			//spot.setIcon("sap-icon://alert");
			spot.attachClick(this.onSpotTestclick, this);

			this.getView().byId("spotsGeo").addItem(spot);

		},

		_onRouteMatched: function (oEvent) {

			var accessTokenMapbox = 'pk.eyJ1IjoiYXhlbG16IiwiYSI6ImNrd3djdHdiMDAyZGwzMW1vcnVhODNzMG4ifQ.NzMxATEqq6w-D1LPD92tqg';

			var appCode = 'xqjCK7HxKbj-oYA-K6yw_w';
			var appId = 'dhTVPAlSKvlkx5WaEWs0';
			
			//var urlAux = "https://api.mapbox.com/styles/v1/axelmz/ckwwo614r08f014pfb52qlkjj/wmts?access_token=pk.eyJ1IjoiYXhlbG16IiwiYSI6ImNrd3djdHdiMDAyZGwzMW1vcnVhODNzMG4ifQ.NzMxATEqq6w-D1LPD92tqg";

			//var url = "https://api.mapbox.com/styles/v1/axelmz/ckwwo614r08f014pfb52qlkjj/tiles/{LOD}/{X}/{Y}@2x?access_token=";

			var url = "https://api.mapbox.com/styles/v1/axelmz/ckwwdvtkb0pvo14mswi19e7xp/tiles/{LOD}/{X}/{Y}@2x?access_token=";

			// If you have not set up any Map Provider keys, then we will set a default map for one of the providers so that you can see something
			//var defaultUrlHA = appCode === "NOT CONFIGURED" | undefined ? "https://a.tile.openstreetmap.org/{LOD}/{X}/{Y}.png" : "https://1.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/satellite.day/{LOD}/{X}/{Y}/256/png8?app_code=" + appCode + "&app_id=" + appId;
			//var defaultUrlHB = appCode === "NOT CONFIGURED" | undefined ? "https://b.tile.openstreetmap.org/{LOD}/{X}/{Y}.png" : "https://2.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/satellite.day/{LOD}/{X}/{Y}/256/png8?app_code=" + appCode + "&app_id=" + appId;
			var defaultUrlMBA = accessTokenMapbox === "NOT CONFIGURED" | undefined ? "https://a.tile.openstreetmap.org/{LOD}/{X}/{Y}.png" : url + accessTokenMapbox;
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
						"copyright": defaultCopyright,
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

		onSpotTestclick: function () {
			MessageToast.show("Click on SpotTest");
		},

		onContextMenuSpot: function () {
			MessageToast.show("Context Menu");
		}
	});
});