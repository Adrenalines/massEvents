/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('MassEvents.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    onRenderMain: function(panel) {
        var but = Ext.ComponentQuery.query('button[reference=DisplayDataButton]')[0];
        //          console.log(but);
        setTimeout(function() {
            but.fireEvent('click', but);
        }, 1000);
    }
});