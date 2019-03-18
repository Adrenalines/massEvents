/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('MassEvents.Application', {
    extend: 'Ext.app.Application',

    name: 'MassEvents',

    stores: [
        // TODO: add global / shared stores here
    ],

    launch: function() {
        // TODO - Launch the application
        Ext.Ajax.request({
            url: './data/auth.php',
            params: {},
            scope: this,
            success: function(r) {
                var response = Ext.decode(r.responseText);
                Global.resp = response.USER;
            }
        });
    },

    onAppUpdate: function() {
        Ext.Msg.alert('Модуль обновлен!', 'В модуль внесены изменения. Для корректной работы модуля его необходимо обновить, нажав "OK".',
            function() {
                window.location.reload();
            });
    }
});