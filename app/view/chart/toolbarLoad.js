Ext.define("MassEvents.view.chart.toolbarLoad", {
  extend: "Ext.toolbar.Toolbar",
  requires: ["MassEvents.view.chart.toolbarController"],
  controller: "load-toolbar",
  xtype: "loadTBar",
  dock: "top",
  ui: "top",
  fit: 1,
  layout: {
    type: "vbox",
    align: "stretch"
  },
  items: [
    {
      xtype: "panel",
      name: "LoadValuesPanel",
      layout: {
        type: "vbox",
        align: "stretch"
      },
      items: [
        {
          xtype: "panel",
          tbar: [
            {
              xtype: "label",
              text: "Задать период",
              padding: "5 0 5 5",
              style: {
                fontWeight: "bold",
                fontSize: "12px",
                color: "dimGray"
              }
            }
          ],
          layout: {
            type: "hbox"
          },
          flex: 1,
          defaults: {
            xtype: "button",
            padding: 10
          },
          items: [
            {
              xtype: "fieldcontainer",
              layout: "hbox",
              defaults: {
                xtype: "button",
                margin: "7 0 0 5"
              },
              items: [
                {
                  icon: "resources/images/home-icon.png",
                  iconCls: "background-size-contain",
                  tooltip: "На главную страницу портала",
                  margin: "7 10 0 0",
                  handler: function() {
                    window.open("/");
                  }
                },
                {
                  xtype: "displayfield",
                  name: "StartDateLabelLoad",
                  value: "Дата с:"
                },
                {
                  reference: "startDateLoad",
                  xtype: "datefield",
                  format: "Y-m-d H:00",
                  submitFormat: "Y-m-d H:00",
                  value: new Date(new Date() - 86400000),
                  startDay: 1,
                  grow: true,
                  editable: true,
                  margin: "7 10 0 5"
                },
                {
                  xtype: "displayfield",
                  name: "EndDateLabelLoad",
                  value: "по:"
                },
                {
                  reference: "endDateLoad",
                  xtype: "datefield",
                  format: "Y-m-d H:00",
                  submitFormat: "Y-m-d H:00",
                  startDay: 1,
                  value: new Date(),
                  grow: true,
                  editable: true
                },
                {
                  xtype: "displayfield",
                  value: "Сдвиг(дн.)",
                  margin: "7 0 0 24"
                },
                {
                  reference: "shiftDatesUpLoad",
                  text: "<",
                  inputValue: -1,
                  tooltip: "Сдвигает дату на 1 день назад",
                  margin: "7 0 0 2",
                  handler: "onShiftDataLoad"
                },
                {
                  reference: "shiftDatesDownLoad",
                  text: ">",
                  inputValue: 1,
                  tooltip: "Сдвигает дату на 1 день вперед",
                  margin: "7 0 0 0",
                  handler: "onShiftDataLoad"
                },
                {
                  xtype: "label",
                  margin: "11 0 0 24",
                  text: "Агрегация:"
                },
                {
                  id: "AggregationButtonLoad",
                  reference: "AggregationButtonLoad",
                  xtype: "segmentedbutton",
                  items: [
                    {
                      text: "Hourly",
                      inputValue:
                        "[-0.041], [-0.125], [-0.25], [-0.5], [-0.75], [-1], [-2], [-3], [-4], [-5], [-6], [-7]",
                      defaultPeriod: "-0.041",
                      chartPointInterval: 1,
                      pressed: true
                    },
                    {
                      text: "Daily",
                      inputValue: "[-1], [-2], [-3], [-4], [-5], [-6], [-7]",
                      defaultPeriod: "-1",
                      chartPointInterval: 1
                    }
                  ],
                  listeners: {
                    toggle: "toggleButLoad"
                  }
                },
                {
                  xtype: "label",
                  reference: "periodValuesLabel",
                  margin: "11 0 0 25",
                  html: "Период:"
                },
                {
                  xtype: "segmentedbutton",
                  reference: "periodValuesLoad",
                  defaults: {
                    disabled: true
                  },
                  items: [
                    {
                      text: "1h",
                      inputValue: "-0.041",
                      disabled: false,
                      pressed: true
                    },
                    { text: "3h", inputValue: "-0.125", disabled: false },
                    { text: "6h", inputValue: "-0.25", disabled: false },
                    { text: "12h", inputValue: "-0.5", disabled: false },
                    { text: "18h", inputValue: "-0.75", disabled: false },
                    { text: "1d", inputValue: "-1", disabled: false },
                    { text: "2d", inputValue: "-2", disabled: false },
                    { text: "3d", inputValue: "-3", disabled: false },
                    { text: "4d", inputValue: "-4", disabled: false },
                    { text: "5d", inputValue: "-5", disabled: false },
                    { text: "6d", inputValue: "-6", disabled: false },
                    { text: "7d", inputValue: "-7", disabled: false }
                  ],
                  listeners: {
                    toggle: "togglePeriodButLoad"
                  }
                }
              ]
            },
            {
              text: "Выгрузить",
              id: "displayDataButtonLoad",
              reference: "DisplayDataButtonLoad",
              icon: "resources/images/chart_stock.png",
              iconCls: "background-size-contain",
              margin: "5 5 0 5",
              padding: "10 30 10 30",
              border: 2,
              style: {
                borderColor: "red",
                borderStyle: "dotted"
              },
              listeners: {
                click: "loadKPI"
              }
            },
            {
              xtype: "tbfill"
            },
            {
              name: "HelpMenu",
              text: "Справка",
              margin: "6 15 0 5",
              padding: "10 10 10 10",
              iconCls: "background-size-contain",
              icon: "resources/images/help.png",
              //   link: '/Help_doc_web/availreg/Help_availReg.docx',
              handler: function(but, refs) {
                //        window.open(but.link);
                //  console.log(refs.AggregationButtonLoad.getValue());
              }
            }
          ]
        }
      ]
    }
  ]
});
