sap.ui.define([
	"sap/ui/demo/webapp/controller/BaseController",
	"sap/ui/demo/webapp/model/formatter",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/m/Image"
], function (BaseController, formatter, MessageToast, JSONModel, Image) {
	"use strict";

	return BaseController.extend("sap.ui.demo.webapp.controller.Geo", {
		formatter: formatter,
		onInit: function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("Geo").attachMatched(this._onRouteMatched, this);
			/*var oModel = new sap.ui.model.json.JSONModel(),
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
			//this.getView().setModel(oModel, "HEADER");
			this.getView().setModel(oModelS, "STATE");*/
			this.getView().setModel(this.getOwnerComponent().getModel("spots"), "SPOTSMOD");
			//this.getView().byId("PMNotificationList").setModel(this.getOwnerComponent().getModel("noticesModel"));

			//console.log(this.getView().byId("PMNotificationList").getModel());
			this.loadSpotModel();
			//this.addSpot("spotTest", "-105;15;0", "None", "Aviso 3", "Fondo de bikini", "sap-icon://alert", "1")
		},
		_onRouteMatched: function (oEvent) {

			var accessTokenMapbox = 'pk.eyJ1IjoiYXhlbG16IiwiYSI6ImNrd3djdHdiMDAyZGwzMW1vcnVhODNzMG4ifQ.NzMxATEqq6w-D1LPD92tqg';

			var appCode = 'xqjCK7HxKbj-oYA-K6yw_w';
			var appId = 'dhTVPAlSKvlkx5WaEWs0';

			var url = "https://api.mapbox.com/styles/v1/axelmz/ckx6c614e5dlu14mkn9o89cdq/tiles/256/{LOD}/{X}/{Y}@2x?access_token=";

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
						"refMapProvider": "MAPBOX_STARTER"
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
			var oItem, oModel;
			oItem = oEvent.getSource();
			oModel = oItem.getModel("spotM");
			//console.log(oModel);
			var aModel = new JSONModel(oModel);
			this.getView().setModel(aModel, "HEADER");
			var nModel = new JSONModel(this.getOwnerComponent().getModel("noticesModel"));
			var aData = nModel.oData.oData;
			var indexSpotClicked = id.at(-1);
			//console.log(nModel);
			var selNoticeModel = {
				"ITEMS": []
			};

			for (var i = 0; i < aData.ITEMS.length; i++) {
				//console.log("iItems = " + i + " | spotId = " + aData.ITEMS[i].spotId + " -> Spot Clicked: " + indexSpotClicked);
				if (aData.ITEMS[i].spotId == indexSpotClicked) {					
					selNoticeModel.ITEMS.push(aData.ITEMS[i]);
				}
			}
			var auxModel = new JSONModel(selNoticeModel)
			this.getView().byId("PMNotificationList").setModel(auxModel);
		},
		onContextMenuSpot: function (oEvent) {
			//---------------------------------------------------
			var oItem, oModel;
			oItem = oEvent.getSource();
			oModel = oItem.getModel("spotM");
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
				//-------------------------------------------------
				var title = oThis.byId(id).getTooltip();
				oDialog.setTitle(title);
				//--------------------------------------------------
				oThis.byId("carouselImg").setActivePage("mainImg0");
				oThis.byId("mainImg0").setSrc(oThis.getView().getModel("SPOTSMOD").getProperty("/SPOT/" + oModel.ID + "/IMAGEPATH/0/PATH"));
				oThis.byId("mainImg1").setSrc(oThis.getView().getModel("SPOTSMOD").getProperty("/SPOT/" + oModel.ID + "/IMAGEPATH/1/PATH"));
				//---------------------------------------------------
				var posArray = oModel.POS.toString().split(";", 2);
				var lat = posArray[0],
					lon = posArray[1];
				oThis.byId("ubiId").setHref("https://www.google.com.mx/maps/dir//" + lon + "," + lat + "/@" + lon + "," + lat + ",13.1z");
				//-----------------------------------------------------
				var tel = oModel.TEL;
				oThis.byId("telId").setHref("tel://" + tel);
				//-----------------------------------------------------
				oDialog.open();
			});
		},
		onCloseContextMenu: function (oEvent) {
			const oSource = oEvent.getSource();
			this.byId("ubiId").setHref("");
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
				spot = new sap.ui.vbm.Spot(this.getView().getId() + "--" + id);
				spot.setModel(spotModel.getProperty("/SPOT/" + i), "spotM");
				var sModel = spot.getModel("spotM");
				var pos = sModel.POS;
				var type = sModel.TYPE;
				var tooltip = sModel.TOOLTIP;
				var text = sModel.TEXT;
				var icon = sModel.ICON;
				var alignment = sModel.ALIGNMENT;
				var contentOffset = sModel.CONTENTOFFSET;
				var image_r = sModel.IMAGE_R;
				var scale = sModel.SCALE;
				this.addSpot(spot, pos, type, tooltip, text, icon, alignment, contentOffset, image_r, scale, id);
			}

		},
		addSpot: function (spot, position, type, tooltip, text, icon, alignment, contentOffset, image_r, scale, id) {
			spot.setPosition(position);
			spot.setType(type);
			spot.setTooltip(tooltip);
			spot.setText(text); //Solo puede asignarse texto o icono, no ambos al mismo tiempo
			spot.setIcon(icon);
			//spot.setAlignment(alignment);
			spot.setContentOffset(contentOffset);
			spot.attachClick(this.onSpotClick, this);
			spot.attachContextMenu(this.onContextMenuSpot, this);

			this.getView().byId("spotsGeo").addItem(spot);

			//---------------------------------------------------------
			if (image_r != "") {
				var spotImg = new sap.ui.vbm.Spot(this.getView().getId() + "--" + id + "i");
				spotImg.setPosition(position);
				//spotImg.setType("None");				
				spotImg.setContentOffset("0;0");
				//spot.setTooltip(tooltip);
				//spot.setText(text);
				spotImg.setAlignment(alignment);
				spotImg.setScale(scale);
				spotImg.setTooltip("-");
				spotImg.setImage(image_r)
				spotImg.invalidate();
				//spotImg.attachClick(this.onSpotImageClick, this);				

				this.getView().byId("spotsGeo").addItem(spotImg);
			}
			//----------------------------------------------------------
		},
		onChangeInput: function () {
			//console.log(1);
			
			//this.getView().byId("spotsGeo").removeAllAggregation();
			//this.getView().byId("spotsGeo").destroyItems();
			//this.getView().byId("spotsGeo").removeAllItems();
			this.loadSpotModel();
		}
	});
});