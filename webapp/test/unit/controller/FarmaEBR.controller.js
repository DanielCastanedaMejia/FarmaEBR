/*global QUnit*/

sap.ui.define([
	"farma/controller/FarmaEBR.controller"
], function (Controller) {
	"use strict";

	QUnit.module("FarmaEBR Controller");

	QUnit.test("I should test the FarmaEBR controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
