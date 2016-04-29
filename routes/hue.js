// express + cylon
var express = require('express');
var router = express.Router();
var Cylon = require('cylon');

var host = '172.30.1.241';
var username = 'rDxBBPHW3DpkWK9ebIjSGRua86RbiUP6F6yF5DMb';
var redAlert = null;

router.getFullState = function(callback) {
	Cylon.robot({
		connections: {
			hue: {
				adaptor: 'hue',
				host: host,
				username: username
			}
		},

		devices: {
			bridge: {
				driver: 'hue-bridge'
			}
		},

		work: function(my) {
			my.bridge.getFullState(function(err, config) {

				if (err) {
					var result = {
						success: false,
						error: err
					}
				} else {
					var lights = [];
					for (var i in config.lights) {
						lights.push({
							'id': i,
							'state': config.lights[i].state.on,
							'reachable': config.lights[i].state.reachable,
							'name': config.lights[i].name
						});
					}
					var result = {
						success: true,
						lights: lights,
						config: config.config
					}
				}
				callback.call(this,result);
			});
		}
	}).start();
}

router.setBulbStatus = function(lightId, turnOn, callback) {

	Cylon.robot({
		connections: {
			hue: {
				adaptor: 'hue',
				host: host,
				username: username
			}
		},

		devices: {
			bulb: {
				driver: 'hue-light',
				lightId: lightId
			}
		},

		work: function(my) {

			if (turnOn) {
				my.bulb.turnOn();
				my.bulb.rgb(0, 102, 51);
			} else {
				if (global.redAlert) {		
					clearInterval(global.redAlert);
					global.redAlert = null;
				}
				my.bulb.turnOff();
			}

			var result = {
				success: true
			};		
			callback.call(this,result);
		}
	}).start();
}


router.soundGeneralQuarters = function(lightId,turnOn, callback) {
	Cylon.robot({
		connections: {
			hue: {
				adaptor: 'hue',
				host: host,
				username: username
			}
		},

		devices: {
			bulb: {
				driver: 'hue-light',
				lightId: lightId
			}
		},

		work: function(my) {

			if (!global.redAlert) {
				my.bulb.turnOn();
				my.bulb.rgb(255, 0, 0);
				
				global.redAlert = every((0.8).second(), function() {
					my.bulb.toggle();
				});
			}
			
			callback.call(this,{success:true});

		}
	}).start();
}

// handle AJAX GET Request - return all lights
router.get('/', function(req, res, next) {
	router.getFullState(function(result) {
		res.writeHead(200, {
			"Content-Type": "application/json"
		});
		res.write(JSON.stringify(result));
		res.end();
	});
});

// toggle state
router.put('/', function(req, res) {
	router.setBulbStatus(
		req.body.id, 
		req.body.turnOn == 'true',
		function(result) {
			res.writeHead(200, {
				"Content-Type": "application/json"
			});
			res.write(JSON.stringify(result));
			res.end();
		}
	);
});

// RED ALERT!
router.post('/', function(req, res) {

	var lightId = req.body.id;
	var turnOn = (req.body.turnOn == 'true');

	router.soundGeneralQuarters(
		req.body.id, 
		req.body.turnOn == 'true',
		function(result) {
			res.writeHead(200, {
				"Content-Type": "application/json"
			});
			res.write(JSON.stringify(result));
			res.end();
		}
	);
});

module.exports = router;