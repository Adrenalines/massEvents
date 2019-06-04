var btsCellStore = new Ext.data.TreeStore({
  storeId: "btsCellStore",
  fields: ["id", "name", "text", "leaf"],
  proxy: {
    type: "ajax",
    url: "./data/main.php?type=NEW_BTS_CELL_TREE"
  },
  listeners: {}
});

Ext.define("MassEvents.view.trees.BTSCellList", {
  extend: "Ext.panel.Panel",
  layout: "fit",
  xtype: "btsCellList",
  reference: "btsCellList",
  dockedItems: [
    {
      xtype: "toolbar",
      items: [
        {
          xtype: "label",
          text: "BTS / CELL",
          margin: "5 0 0 5",
          style: {
            fontSize: "12px",
            fontWeight: "bold",
            color: "#333"
          }
        },
        {
          xtype: "tbfill"
        },
        {
          xtype: "button",
          icon: "resources/images/ok-icon.png",
          iconCls: "background-size-contain",
          tooltip: "Выбрать все",
          handler: function() {
            var tree = Ext.ComponentQuery.query(
              "treepanel[reference=btsCellList]"
            )[0];
            tree.getRootNode().cascadeBy(function(childNode) {
              this.set("checked", true);
            });
          }
        },
        {
          xtype: "button",
          icon: "resources/images/cancel-icon.png",
          iconCls: "background-size-contain",
          tooltip: "Снять выделение",
          handler: function() {
            var tree = Ext.ComponentQuery.query(
              "treepanel[reference=btsCellList]"
            )[0];
            tree.getRootNode().cascadeBy(function(childNode) {
              this.set("checked", false);
            });
          }
        },
        {
          xtype: "button",
          icon: "resources/images/showall-icon.png",
          iconCls: "background-size-contain",
          tooltip: "Развернуть",
          enableToggle: true,
          align: "right",
          listeners: {
            click: function(element) {
              var tree = Ext.ComponentQuery.query(
                "treepanel[reference=btsCellList]"
              )[0];
              if (element.pressed) {
                element.setTooltip("Свернуть");
                element.setIcon("resources/images/hiddenall-icon.png");
                tree.expandAll();
              } else {
                element.setTooltip("Развернуть");
                element.setIcon("resources/images/showall-icon.png");
                tree.collapseAll();
              }
            }
          }
        },
        {
          xtype: "button",
          icon: "resources/images/refresh-icon.png",
          iconCls: "background-size-contain",
          itemId: "refreshButton",
          tooltip: "Обновить",
          height: 20,
          handler: function(e) {
            btsCellStore.reload();
          }
        }
      ]
    },
    {
      xtype: "toolbar",
      items: [
        {
          xtype: "SearchToolbar",
          name: "btsCellListSearchToolbar",
          width: "100%",
          sourceSearch: true, // добавлять или нет возможность выбора поля для поиска
          style: {
            border: 0,
            background: "none"
          }
        }
      ]
    }
  ],
  items: [
    {
      xtype: "treepanel",
      id: "btsCellTree",
      name: "btsCellTree",
      reference: "btsCellTree",
      rootVisible: false,
      store: btsCellStore
    }
  ]
});
