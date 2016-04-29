/*
 * File: app/view/LightbulbViewController.js
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

Ext.define('MyApp.view.LightbulbViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.lightbulb',

    onLightbulbClick: function() {
                var vm = this.getViewModel();
                var lightId = vm.get('lightId');
                if (lightId == 0) {
                    Ext.Msg.alert("Error","You must select a bulb");
                    return;
                }
                var status = vm.get('lightStatus');
                var data = {
                    cmd: 'setStatus',
                    lightId: vm.get('lightId'),
                    status: !status
                };
                var ws = MyApp.wsConnection;
                ws.send(JSON.stringify(data));

    },

    onComboboxChange: function(field, newValue, oldValue, eOpts) {

        var vm = this.getViewModel();
        var selection = field.getSelection();
        vm.set('lightId',selection.get('id'));
        vm.set('lightStatus', selection.get('state'));

    },

    onWindowAfterRender: function(component, eOpts) {
        var l = this.lookupReference('lightbulbImg');
        l.getEl().on('click', this.onLightbulbClick, this);
    },

    onWindowBeforeRender: function(component, eOpts) {
        var ws = MyApp.wsConnection;
        var me = this;
        ws.onmessage = function (e) {
            var data = Ext.decode(e.data);
            console.log('rcvd data from websocket server:', data);

            switch(data.cmd) {
                case 'listbulbs' :
                var store = me.getViewModel().getStore('Lights');
                store.removeAll(true);
                var lights = data.data.lights;
                for (var i=0; i<lights.length; i++) {
                    if (lights[i].reachable) {
                        store.add({
                            id: lights[i].id,
                            state: lights[i].state,
                            reachable: lights[i].reachable,
                            name: lights[i].name
                        });
                    }
                }
                break;

                case 'setStatus' :

                var vm = me.getViewModel();
                vm.set('lightStatus',data.status);
                me.lookupReference('lightscombo').getSelection().set('state', data.status );
                break;
            }
        };

        ws.onopen = function(e) {
            ws.send('{"cmd": "listbulbs"}');
        };

    }

});
