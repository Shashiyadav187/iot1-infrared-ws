/*
 * File: app.js
 *
 * This file was generated by Sencha Architect version 3.2.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 5.1.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 5.1.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

// @require @packageOverrides
Ext.Loader.setConfig({

});


Ext.application({
    models: [
        'Light'
    ],
    views: [
        'MyViewport',
        'Lightbulb'
    ],
    name: 'MyApp',

    launch: function() {
        Ext.create('MyApp.view.MyViewport');
        MyApp.wsConnection = new WebSocket('ws://localhost:3001');
        Ext.ComponentQuery.query('viewport')[0].add({
            xtype: 'Lightbulb'
        }).show();

    }

});
