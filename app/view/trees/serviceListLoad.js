Ext.define("MassEvents.view.trees.serviceListLoad", {
  extend: "Ext.panel.Panel",
  layout: "fit",
  xtype: "servListLoad",
  dockedItems: [
    {
      xtype: "toolbar",
      items: [
        {
          xtype: "label",
          text: "Список KPI",
          margin: "5 0 0 5",
          style: {
            fontSize: "12px",
            fontWeight: "bold",
            color: "#333"
          }
        },
        { xtype: "tbfill" },
        {
          xtype: "button",
          icon: "resources/images/ok-icon.png",
          iconCls: "background-size-contain",
          tooltip: "Выбрать все",
          handler: function() {
            let tree = Ext.ComponentQuery.query(
              "treepanel[reference=checkSrvListLoad]"
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
              "treepanel[reference=checkSrvListLoad]"
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
                "treepanel[reference=checkSrvListLoad]"
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
        }
      ]
    },
    {
      xtype: "toolbar",
      items: [
        {
          xtype: "SearchToolbar",
          name: "serviceListLoadSearchToolbar",
          width: "100%",
          sourceSearch: true, // добавлять или нет возможность выбора поля для поиска
          style: {
            border: 0,
            background: "none"
          }
        }
      ]
    },
    {
      xtype: "toolbar",
      items: [
        {
          xtype: "combo",
          id: "comboKpiSets",
          emptyText: "KPI-сеты",
          flex: 1,
          autoSelect: true,
          valueField: "KPI_Set",
          displayField: "KPI_Set",
          queryMode: "remote",
          typeAhead: true,
          listeners: {
            render: function(e) {
              setTimeout(function() {
                let kpiSetStore = Ext.data.Store({
                  storeId: "kpiSetStore",
                  proxy: {
                    type: "ajax",
                    url: "./data/load.php",
                    extraParams: {
                      table_name: "loadKpiSet",
                      user: Global.resp.USER
                    },
                    reader: {
                      type: "json",
                      rootProperty: "data"
                    }
                  }
                });
                e.setStore(kpiSetStore);
              }, 1000);
            }
          }
        },
        {
          xtype: "button",
          itemId: "chooseKpiSetButton",
          text: "Выбрать",
          border: 2,
          style: {
            borderColor: "#2C7AC3",
            borderStyle: "solid"
          },
          handler: function(e) {
            let combo = Ext.ComponentQuery.query("combo[id=comboKpiSets]")[0];
            if (combo.findRecordByValue(combo.getValue())) {
              Ext.Ajax.request({
                url: Global.getUrl("load", "chooseKpiSet"),
                method: "POST",
                timeout: 60000,
                params: {
                  kpiSet: combo.getValue(),
                  user: Global.resp.USER
                },
                success: function(response) {
                  let resp = Ext.decode(response.responseText),
                    tree = Ext.ComponentQuery.query(
                      "treepanel[reference=checkSrvListLoad]"
                    )[0],
                    findedNode;
                  tree.getRootNode().cascadeBy(function(childNode) {
                    this.set("checked", false);
                  });
                  Ext.Array.each(resp.data, function(item, j) {
                    if (
                      tree.getRootNode().findChild("id", item.KPI, true) != null
                    ) {
                      findedNode = tree
                        .getRootNode()
                        .findChild("id", item.KPI, true);
                      findedNode.set("checked", true);
                      tree.selectPath(findedNode.getPath());
                    }
                  });
                }
              });
            } else {
              Ext.Msg.alert("Ошибка", "Выберите существующий KPI-сет.");
            }
          }
        },
        {
          xtype: "button",
          itemId: "deleteKpiSetButton",
          text: "Удалить",
          border: 2,
          style: {
            borderColor: "#2C7AC3",
            borderStyle: "solid"
          },
          handler: function(e) {
            let combo = Ext.ComponentQuery.query("combo[id=comboKpiSets]")[0];
            if (combo.findRecordByValue(combo.getValue())) {
              Ext.Ajax.request({
                url: Global.getUrl("load", "checkCommonKpiSet"),
                method: "POST",
                timeout: 60000,
                params: {
                  kpiSet: combo.getValue(),
                  user: Global.resp.USER
                },
                success: function(response) {
                  let resp = Ext.decode(response.responseText);
                  // resp.total == 1 counts, that [USER] == Global.USER
                  if (resp.total == 1) {
                    let acceptWindow = Ext.create("Ext.window.Window", {
                      title: "Удалить KPI-сет?",
                      modal: true,
                      width: 300,
                      height: 70,
                      items: [
                        {
                          xtype: "button",
                          text: "ОК",
                          style:
                            "margin-left:30px; margin-top:10px; width:80px;",
                          handler: function(e) {
                            Ext.Ajax.request({
                              url: Global.getUrl("load", "deleteKpiSet"),
                              method: "POST",
                              timeout: 60000,
                              params: {
                                kpiSet: combo.getValue(),
                                user: Global.resp.USER
                              },
                              success: function(response) {
                                combo.getStore().reload();
                                combo.setValue("");
                              }
                            });
                            Ext.WindowManager.getActive().close();
                          }
                        },
                        {
                          xtype: "button",
                          text: "Отмена",
                          style:
                            "margin-left:70px; margin-top:10px; width:80px;",
                          handler: function(e) {
                            Ext.WindowManager.getActive().close();
                          }
                        }
                      ]
                    });
                    acceptWindow.show();
                  } else {
                    Ext.Msg.alert("Ошибка", "Нельзя удалить общий KPI-сет.");
                    combo.setValue("");
                  }
                }
              });
            } else {
              Ext.Msg.alert("Ошибка", "Выберите существующий KPI-сет.");
            }
          }
        }
      ]
    }
  ],
  items: [
    {
      xtype: "treepanel",
      rootVisible: false,
      id: "checkSrvListLoad",
      name: "checkSrvListLoad",
      reference: "checkSrvListLoad",
      store: Ext.create("MassEvents.store.kpiStore"),
      folderSort: false,
      listeners: {
        checkchange: function(node, checked, eOpts) {
          if (node.hasChildNodes()) {
            node.eachChild(function(childNode) {
              childNode.set("checked", checked);
            });
          }
        }
      }
    }
  ],
  bbar: [
    {
      xtype: "tbfill"
    },
    {
      xtype: "button",
      itemId: "addKpiSetButton",
      text: "Создать KPI-сет",
      border: 2,
      margin: "0 0 5 0",
      style: {
        borderColor: "#2C7AC3",
        borderStyle: "solid"
      },
      handler: function(e) {
        let kpiBefore = Ext.ComponentQuery.query(
            "treepanel[reference=checkSrvListLoad]"
          )[0],
          kpiContinue = kpiBefore.getChecked(),
          kpiArr = [];
        Ext.Array.each(kpiContinue, function(item, i) {
          if (item.data.leaf == true) {
            kpiArr.push(item.data.id);
          }
        });
        if (kpiArr.length === 0) {
          Ext.Msg.alert("Ошибка", "Не выбрано ни одного KPI.");
        } else {
          let addKpiWindow = Ext.create("Ext.window.Window", {
            title: "Создание KPI-сета",
            modal: true,
            width: 300,
            height: 120,
            items: [
              {
                xtype: "combo",
                id: "comboUserKpiSets",
                emptyText: "KPI-сеты",
                flex: 1,
                autoSelect: true,
                valueField: "KPI_Set",
                displayField: "KPI_Set",
                queryMode: "remote",
                typeAhead: true,
                store: Ext.data.Store({
                  storeId: "kpiSetStore",
                  proxy: {
                    type: "ajax",
                    url: "./data/load.php",
                    extraParams: {
                      table_name: "loadUserKpiSet",
                      user: Global.resp.USER
                    },
                    reader: {
                      type: "json",
                      rootProperty: "data"
                    }
                  }
                }),
                style: "margin-left:10px; margin-top:5px; width:270px;"
              },
              {
                xtype: "button",
                text: "Заменить существующий KPI-сет",
                style: "margin-left:10px; margin-top:3px; width:270px;",
                handler: function() {
                  let comboUser = Ext.ComponentQuery.query(
                    "combo[id=comboUserKpiSets]"
                  )[0];
                  if (comboUser.findRecordByValue(comboUser.getValue())) {
                    Ext.Ajax.request({
                      url: Global.getUrl("load", "replaceKpiSet"),
                      method: "POST",
                      timeout: 60000,
                      params: {
                        kpiSet: comboUser.getValue(),
                        kpis: [kpiArr],
                        user: Global.resp.USER
                      },
                      success: function(response) {
                        let combo = Ext.ComponentQuery.query(
                            "combo[id=comboKpiSets]"
                          )[0],
                          win = Ext.WindowManager.getActive();
                        combo.getStore().reload();
                        win.close();
                      }
                    });
                  } else {
                    Ext.Msg.alert("Ошибка", "Выберите существующий KPI-сет.");
                  }
                }
              },
              {
                xtype: "button",
                text: "Создать новый KPI-сет",
                style: "margin-left:10px; margin-top:5px; width:270px;",
                handler: function() {
                  let addNewKpiWindow = Ext.create("Ext.window.Window", {
                    title: "Создать новый KPI-сет",
                    modal: true,
                    width: 300,
                    height: 100,
                    items: [
                      {
                        xtype: "textfield",
                        id: "inputNewKpiSets",
                        emptyText: "Введите название нового KPI-сета",
                        flex: 1,
                        style: "margin-left:10px; margin-top:5px; width:270px;"
                      },
                      {
                        xtype: "button",
                        text: "Создать",
                        style: "margin-left:100px; margin-top:3px; width:80px;",
                        handler: function(e) {
                          let inputNewKpiSet = Ext.ComponentQuery.query(
                              "textfield[id=inputNewKpiSets]"
                            )[0],
                            combo = Ext.ComponentQuery.query(
                              "combo[id=comboKpiSets]"
                            )[0];
                          if (inputNewKpiSet.getValue().length > 30) {
                            Ext.Msg.alert(
                              "Ошибка",
                              "Название должно быть не длиннее 30 символов."
                            );
                          } else if (
                            combo.findRecordByValue(inputNewKpiSet.getValue())
                          ) {
                            Ext.Msg.alert(
                              "Ошибка",
                              "Такой KPI-сет уже существует."
                            );
                          } else {
                            Ext.Ajax.request({
                              url: Global.getUrl("load", "addNewKpiSet"),
                              method: "POST",
                              timeout: 60000,
                              params: {
                                kpiSet: inputNewKpiSet.getValue(),
                                kpis: [kpiArr],
                                user: Global.resp.USER
                              },
                              success: function(response) {
                                combo.getStore().reload();
                                for (let i = 0; i < 2; i++) {
                                  Ext.WindowManager.getActive().close();
                                }
                              }
                            });
                          }
                        }
                      }
                    ]
                  });
                  addNewKpiWindow.show();
                }
              }
            ]
          });
          addKpiWindow.show();
        }
      }
    },
    {
      xtype: "tbfill"
    }
  ]
});
