Ext.define('MassEvents.view.options.mainOptionsPanController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.options-mainoptionspan',
    onAboutClick: function(but) {
        var ver = Global.getLastChange();
        Ext.Msg.alert('Список изменений | ver. ' + ver.version, '<b>' + ver.version + ' (' + ver.dateChange + '): </b>' + ver.lastChange + '<br><br>' + ver.changeLog);
    },

});