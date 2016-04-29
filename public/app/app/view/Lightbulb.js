/*
 * File: app/view/Lightbulb.js
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

Ext.define('MyApp.view.Lightbulb', {
    extend: 'Ext.window.Window',
    alias: 'widget.Lightbulb',

    requires: [
        'MyApp.view.LightbulbViewModel',
        'MyApp.view.LightbulbViewController',
        'Ext.Img',
        'Ext.form.field.ComboBox'
    ],

    controller: 'lightbulb',
    viewModel: {
        type: 'lightbulb'
    },
    constrain: true,
    height: 358,
    width: 425,
    bodyPadding: 10,
    title: 'Fig Leaf Software IoT Demo 1',

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },
    items: [
        {
            xtype: 'image',
            reference: 'lightbulbImg',
            disabled: true,
            height: 256,
            width: 256,
            bind: {
                src: '{lightbulbUrl}'
            }
        },
        {
            xtype: 'combobox',
            reference: 'lightscombo',
            width: 200,
            fieldLabel: '',
            displayField: 'name',
            forceSelection: true,
            queryMode: 'local',
            valueField: 'id',
            bind: {
                store: '{Lights}'
            },
            listeners: {
                change: 'onComboboxChange'
            }
        }
    ],
    listeners: {
        afterrender: 'onWindowAfterRender',
        beforerender: 'onWindowBeforeRender'
    }

});