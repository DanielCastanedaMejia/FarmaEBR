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
		},
		_onRouteMatched: function (oEvent) {
			var accessTokenMapbox = 'pk.eyJ1IjoiYXhlbG16IiwiYSI6ImNrd3djdHdiMDAyZGwzMW1vcnVhODNzMG4ifQ.NzMxATEqq6w-D1LPD92tqg';
			var appCode = 'xqjCK7HxKbj-oYA-K6yw_w';
			var appId = 'dhTVPAlSKvlkx5WaEWs0';
			var url = "https://api.mapbox.com/styles/v1/axelmz/ckx6c614e5dlu14mkn9o89cdq/tiles/256/{LOD}/{X}/{Y}@2x?access_token=";

			// If you have not set up any Map Provider keys, then we will set a default map for one of the providers so that you can see something
			//var defaultUrlHA = appCode === "NOT CONFIGURED" | undefined ? "https://a.tile.openstreetmap.org/{LOD}/{X}/{Y}.png" : "https://1.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/satellite.day/{LOD}/{X}/{Y}/256/png8?app_code=" + appCode + "&app_id=" + appId;
			//var defaultUrlHB = appCode === "NOT CONFIGURED" | undefined ? "https://b.tile.openstreetmap.org/{LOD}/{X}/{Y}.png" : "https://2.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/satellite.day/{LOD}/{X}/{Y}/256/png8?app_code=" + appCode + "&app_id=" + appId;
			// @ts-ignore
			var defaultUrlMBA = accessTokenMapbox === "NOT CONFIGURED" | undefined ? "https://a.tile.openstreetmap.org/{LOD}/{X}/{Y}.png" : url + accessTokenMapbox;
			// @ts-ignore
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
			this.getView().setModel(this.getOwnerComponent().getModel("spots"), "spots")
			var tam = this.getView().byId("spotsGeo").getItems().length;
			if (tam > 0) {
				var spotItems = this.getView().byId("spotsGeo").getItems();
				this.getView().byId("spotsGeo").removeAllItems();
				for (var i = 0; i < tam; i++) {
					spotItems[i].destroy();
				}
			}
			this.onLoadSpotByModel();
		},
		onSpotClick: function (oEvent) {
			const oSource = oEvent.getSource();
			var oItem, oModel;
			oItem = oEvent.getSource();
			oModel = oItem.getModel("spots");
			var aModel = new JSONModel(oModel);
			this.getView().setModel(aModel, "HEADER");
			var nModel = new JSONModel(this.getOwnerComponent().getModel("noticesModel"));
			var aData = nModel.oData.oData;
			var indexSpotClicked = oModel.ID;
			var selNoticeModel = {
				"ITEMS": []
			};

			for (var i = 0; i < aData.ITEMS.length; i++) {
				//console.log("iItems = " + i + " | spotId = " + aData.ITEMS[i].spotId + " -> Spot Clicked: " + indexSpotClicked);
				if (aData.ITEMS[i].spotId == indexSpotClicked) {
					selNoticeModel.ITEMS.push(aData.ITEMS[i]);
					break;
				}
			}
			var auxModel = new JSONModel(selNoticeModel)
			this.getView().byId("PMNotificationList").setModel(auxModel);
		},
		onContextMenuSpot: function (oEvent) {
			//---------------------------------------------------
			var oItem, oModel, aModel;
			oItem = oEvent.getSource();
			oModel = oItem.getModel("spots");
			// @ts-ignore
			aModel = this.getOwnerComponent().getModel("spots");
			//---------------------------------------------------
			var oThis = this;
			const oSource = oEvent.getSource();
			var id = oSource.getId();
			var idImagePath;
			for (var i = 0; i < aModel.getProperty("/SPOT/").length; i++) {
				if (aModel.getProperty("/SPOT/" + i + "/ID") == oModel.ID) {
					idImagePath = i;
					break;
				}

			}
			if (!this.contextMenuDialog) {
				// @ts-ignore
				this.contextMenuDialog = this.loadFragment({
					name: "sap.ui.demo.webapp.fragment.geoContextMenu"
				});
			}
			this.contextMenuDialog.then(function (oDialog) {
				//-------------------------------------------------
				// @ts-ignore
				var title = oThis.byId(id).getTooltip();
				oDialog.setTitle(title);
				//--------------------------------------------------
				// @ts-ignore
				oThis.byId("carouselImg").setActivePage("mainImg0");
				// @ts-ignore
				oThis.byId("mainImg0").setSrc(oThis.getView().getModel("spots").getProperty("/SPOT/" + idImagePath + "/IMAGEPATH/0/PATH"));
				// @ts-ignore
				oThis.byId("mainImg1").setSrc(oThis.getView().getModel("spots").getProperty("/SPOT/" + idImagePath + "/IMAGEPATH/1/PATH"));
				//---------------------------------------------------
				var posArray = oModel.POS.toString().split(";", 2);
				var lat = posArray[0],
					lon = posArray[1];
				// @ts-ignore
				oThis.byId("ubiId").setHref("https://www.google.com.mx/maps/dir//" + lon + "," + lat + "/@" + lon + "," + lat + ",13.1z");
				//-----------------------------------------------------
				var tel = oModel.TEL;
				if (tel != "") {
					// @ts-ignore
					oThis.byId("telId").setHref("tel://" + tel);
				} else {
					// @ts-ignore
					oThis.byId("telId").setHref("");
				}
				//-----------------------------------------------------
				oDialog.open();
			});
		},
		onCloseContextMenu: function (oEvent) {
			const oSource = oEvent.getSource();
			this.byId("ubiId").setHref("");
			this.byId(oSource.getId() + "Dialog").close();
		},

		onChangeInput: function () {
			this.getView().byId("spotsGeo").getItems()[0].setProperty("text", this.getView().byId("testInput").getValue());
		},
		onLoadSpotByModel: function () {
			var spot = new sap.ui.vbm.Spot();
			var spotLength = this.getOwnerComponent().getModel("spots").getProperty("/SPOT/").length;
			for (var i = 0; i < spotLength; i++) {
				spot = new sap.ui.vbm.Spot(this.getView().getId() + "--" + this.getOwnerComponent().getModel("spots").getProperty("/SPOT/" + i + "/ID"));
				spot.setModel(this.getOwnerComponent().getModel("spots").getProperty("/SPOT/" + i), "spots");
				spot.setPosition(this.getOwnerComponent().getModel("spots").getProperty("/SPOT/" + i + "/POS"));
				spot.setText(this.getOwnerComponent().getModel("spots").getProperty("/SPOT/" + i + "/TEXT"));
				spot.setType(this.getOwnerComponent().getModel("spots").getProperty("/SPOT/" + i + "/TYPE"));
				spot.setTooltip(this.getOwnerComponent().getModel("spots").getProperty("/SPOT/" + i + "/TOOLTIP"));
				spot.setIcon(this.getOwnerComponent().getModel("spots").getProperty("/SPOT/" + i + "/ICON"));
				spot.setContentOffset(this.getOwnerComponent().getModel("spots").getProperty("/SPOT/" + i + "/CONTENTOFFSET"));
				spot.attachClick(this.onSpotClick, this);
				spot.attachContextMenu(this.onContextMenuSpot, this);
				this.getView().byId("spotsGeo").addItem(spot);
				//---------------------------------------------------------
				if (this.getOwnerComponent().getModel("spots").getProperty("/SPOT/" + i + "/IMAGE_R") != "") {
					var spotImg = new sap.ui.vbm.Spot(this.getView().getId() + "--" + this.getOwnerComponent().getModel("spots").getProperty("/SPOT/" + i + "/ID") + "i");
					spotImg.setPosition(this.getOwnerComponent().getModel("spots").getProperty("/SPOT/" + i + "/POS"));
					spotImg.setContentOffset("0;0");
					spotImg.setAlignment(this.getOwnerComponent().getModel("spots").getProperty("/SPOT/" + i + "/ALIGNMENT"));
					spotImg.setScale(this.getOwnerComponent().getModel("spots").getProperty("/SPOT/" + i + "/SCALE"));
					spotImg.setTooltip("-");
					spotImg.setImage(this.getOwnerComponent().getModel("spots").getProperty("/SPOT/" + i + "/IMAGE_R"))
					this.getView().byId("spotsGeo").addItem(spotImg);
				}
				//----------------------------------------------------------
			}
		},
		onNavToEditSpot: function () {
			this.getRouter().navTo("GeoSpotEdit");
		}
	});
});