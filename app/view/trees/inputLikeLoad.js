Ext.define("MassEvents.view.trees.inputLikeLoad", {
    extend: "Ext.panel.Panel",
    layout: "fit",
    xtype: "inputLikeLoad",
    reference: "inputLikeLoad",
    items: [{
        xtype: "toolbar",
        items: [{
                xtype: "checkboxfield"
            },
            {
                xtype: "label",
                text: "LIKE %",
                margin: "5 0 0 15",
                style: {
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#333"
                }
            },

            {
                xtype: "textfield",
                flex: 1
            },
            {
                xtype: "label",
                text: "%",
                margin: "5 5 0 0",
                style: {
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#333"
                }
            }
        ]
    }]
});