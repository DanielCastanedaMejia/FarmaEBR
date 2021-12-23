sap.ui.define([
    "sap/ui/integration/widgets/Card"
], function(Card) {
    'use strict';
    return Card.extend("sap.ui.demo.webapp.control.ChartCard", {
        metadata: {
            dnd: {
                droppable:true
            }
        },
        renderer: {}
    });
});