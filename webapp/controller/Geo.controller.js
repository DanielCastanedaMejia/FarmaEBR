sap.ui.define([
	"sap/ui/demo/webapp/controller/BaseController",
	"sap/ui/demo/webapp/model/formatter",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function (BaseController, formatter, MessageToast, JSONModel) {
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
			this.loadSpotModel();
			//this.addSpot("spotTest", "-105;15;0", "None", "Aviso 3", "Fondo de bikini", "sap-icon://alert", "1")
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
		onSpotClick: function (oEvent) {
			const oSource = oEvent.getSource();
			var id = oSource.getId();
			MessageToast.show("Click on " + this.byId(id).getId() + " -> nav to Spot Detail");
		},
		onContextMenuSpot: function (oEvent) {
			//--------------------------------------------------
			var oItem, oModel, img, sPath;
			oItem = oEvent.getSource();
			console.log(oItem);
			oModel = oItem.getModel("spotM");
			console.log(oModel);			
			img = oModel.IMAGEPATH;
			console.log(img);
			//---------------------------------------------------
			var oThis = this;
			const oSource = oEvent.getSource();
			var id = oSource.getId();
			if (!this.contextMenuDialog) {
				this.contextMenuDialog = this.loadFragment({
					name: "sap.ui.demo.webapp.fragment.geoContextMenu"
				});
			}
			this.contextMenuDialog.then(function (oDialog) {
				var title = oThis.byId(id).getTooltip();
				oDialog.setTitle(title);
				oThis.getView().byId("mainImg").setSrc(img);
				oDialog.open();
			});
		},
		onCloseContextMenu: function (oEvent) {
			const oSource = oEvent.getSource();
			this.byId(oSource.getId() + "Dialog").close();
		},
		loadSpotModel: function () {
			var spotModel = this.getOwnerComponent().getModel("spots");
			this.getView().setModel(spotModel);
			var spotJSON = new JSONModel(spotModel);
			var nModel = spotModel.getProperty("/SPOT").length;
			var spot;
			for (var i = 0; i < nModel; i++) {
				var id = spotModel.getProperty("/SPOT/" + i + "/ID");
				/*var pos = spotModel.getProperty("/SPOT/" + i + "/POS");
				var type = spotModel.getProperty("/SPOT/" + i + "/TYPE");
				var tooltip = spotModel.getProperty("/SPOT/" + i + "/TOOLTIP");
				var text = spotModel.getProperty("/SPOT/" + i + "/TEXT");
				var icon = spotModel.getProperty("/SPOT/" + i + "/ICON");
				var alignment = spotModel.getProperty("/SPOT/" + i + "/ALIGNMENT");
				var contentOffset = spotModel.getProperty("/SPOT/" + i + "/CONTENTOFFSET");
				var imagePath = spotModel.getProperty("/SPOT/" + i + "/IMAGEPATH");*/

				spot = new sap.ui.vbm.Spot(this.getView().getId() + "--" + id);

				spot.setModel(spotJSON.oData.getProperty("/SPOT/" + i), "spotM");
				var sModel = spot.getModel("spotM")

				var pos = sModel.POS;
				var type = sModel.TYPE;
				var tooltip = sModel.TOOLTIP;
				var text = sModel.TEXT;
				var icon = sModel.ICON;
				var alignment = sModel.ALIGNMENT;
				var contentOffset = sModel.CONTENTOFFSET;
				//var imagePath = spotModel.getProperty("/SPOT/" + i + "/IMAGEPATH");

				this.addSpot(spot, pos, type, tooltip, text, icon, alignment, contentOffset);				

				
				/*spot.setPosition(sModel.POS);
				spot.setType(;
				spot.setTooltip(sModel.TOOLTIP);
				spot.setText(sModel.TEXT); //Solo puede asignarse texto o ico,no, no ambos al mismo tiempo
				spot.setIcon(sModel.ICON);
				spot.setAlignment(sModel.ALIGNMENT);
				spot.attachClick(this.onSpotClick, this);
				spot.attachContextMenu(this.onContextMenuSpot, this);
				spot.setContentOffset(sModel.CONTENTOFFSET);

				this.getView().byId("spotsGeo").addItem(spot);*/
			}

		},
		addSpot: function (spot, position, type, tooltip, text, icon, alignment, contentOffset) {
			//var spot = new sap.ui.vbm.Spot(this.getView().getId() + "--" + spotId);
			
			spot.setPosition(position);
			spot.setType(type);
			spot.setTooltip(tooltip);
			spot.setText(text); //Solo puede asignarse texto o icono, no ambos al mismo tiempo
			spot.setIcon(icon);
			spot.setAlignment(alignment);
			spot.attachClick(this.onSpotClick, this);
			spot.attachContextMenu(this.onContextMenuSpot, this);
			spot.setContentOffset(contentOffset);

			this.getView().byId("spotsGeo").addItem(spot);
		}
	});
});