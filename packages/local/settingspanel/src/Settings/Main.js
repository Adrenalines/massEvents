Ext.define('Settings.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'settingspanel',
    title: 'Настройки',
    scrollable: true,
    collapsed: true,
    collapsible: true,
    collapseFirst: false,
    hideCollapseTool: true,
    width: 600,
    layout: {
          type: 'vbox',
          align: 'stretch'
     },
     defaults: {
          margin: '5 10 5 10'
     },
     items: [
       {
          xtype: 'fieldset',
          title: 'Кол-во графиков на странице',
          layout: {
                    type: 'hbox',
                    align: 'stretch'
               },
               defaults: {
                    flex: 1
               },
               items: [
                    {
                         xtype: 'segmentedbutton',
                         ui: 'toolbar',
                         name: 'countChartBut',
                         items: [
                              {text: '1', value: 1},
                              {text: '2', value: 2},
                              {text: '4', value: 4, pressed: true},
                              {text: '6', value: 6},
                              {text: '9', value: 9},
                              {text: '12', value: 12},
                              {text: '16', value: 16}
                         ],
                         margin: '10 5 10 0'
                    }
               ]
       },
       {
               xtype: 'fieldset',
               title: 'Отображение элементов',
               layout: {
                    type: 'vbox',
                    align: 'stretch'
               },
               defaults: {
                    xtype: 'checkboxfield',
                    flex: 1
               },
               margin: '10',
               items: [
                    {
                         xtype: 'label',
                         text: 'Хинты',
                         itemId: 'hints',
                         name: 'hints'
                    },
                    {
                         xtype: 'radio',
                         name: 'hints',
                         boxLabel: 'Объединить',
                         inputValue: 'shared',
                         margin: '5 0 0 15',
                         checked: true
                    },
                    {
                         xtype: 'radio',
                         name: 'hints',
                         boxLabel: 'Разделить',
                         inputValue: 'noshared',
                         margin: '0 0 0 15'
                    },
                    {
                         xtype: 'radio',
                         name: 'hints',
                         boxLabel: 'Убрать',
                         inputValue: 'disabled',
                         margin: '0 0 10 15'
                    },
                    {
                         boxLabel: 'Легенды',
                         name: 'LegendsChartShowed',
                         checked: true
                    },
                    {
                         boxLabel: 'Подписи оси X',
                         name: 'xAxisLabelsShowed',
                    }
               ]
          },
          {
               xtype: 'fieldset',
               title: 'Визуализация',
               name: 'visualEl',
               layout: {
                    type: 'vbox',
                    align: 'stretch'
               },
               defaults: {
                    xtype: 'checkboxfield',
                    flex: 1
               },
               items: [
                    {
                         xtype: 'radio',
                         name: 'rbchartortable',
                         boxLabel: 'В виде графиков',
                         inputValue: 'chart',
                         margin: '0 0 0 0',
                         checked: true
                    },
                    {
                         xtype: 'radio',
                         name: 'rbchartortable',
                         boxLabel: 'В виде таблиц',
                         inputValue: 'table'
                    },
                    {
                         xtype: 'radio',
                         name: 'rbNeworCurrentTab',
                         boxLabel: 'В новой вкладке',
                         inputValue: 'newTab',
                         margin: '5 0 0 0'
                    },
                    {
                         xtype: 'radio',
                         name: 'rbNeworCurrentTab',
                         boxLabel: 'В текущей вкладке',
                         inputValue: 'currentTab',
                         checked: true
                    }
               ]
          },
          {
               xtype: 'fieldset',
               title: 'Справка',
               layout: {
                    type: 'vbox',
                    padding: '5 0 10 10'
               },
               defaultType: 'button',
               items: [
                    {
                         text: 'Версия ПО: 1.0',
                         fieldInStaticJson: 'version_history',
                         handler: function(element){
                           Ext.Ajax.request({
                              url: './static.json',
                              method: 'GET',
                              success: function (response, opts) {
                                var data = Ext.decode(response.responseText);
                                Ext.MessageBox.alert('Список изменений', data[element.fieldInStaticJson], this.showResult, this);
                              }
                           });
                         }
                    }
               ]
          }
     ]
});