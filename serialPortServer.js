// serialport
var serialPort = require('serialport');
var SerialPort = serialPort.SerialPort;
var hue = require('./routes/hue');
var ws = require('./wsServer');


// set up serial port listener

serialPort.list(function (err, ports) {
	ports.forEach(function(port) {
	console.log('name: ' + port.comName);
	console.log('port: ' + port.pnpId);
	console.log('manu: ' + port.manufacturer);
	console.log('----------------');
	});
});

var port = new SerialPort('/dev/cu.usbmodem1411',  {
  parser: serialPort.parsers.readline('\n')
});

port.on('data', function (data) {
	data = data.substring(0,3);
	var light=null;
	console.log('data:' + data);
	switch(data) {
	  case '61A': // On  
	    console.log('on');
	    hue.getFullState(function(result) {
	    	
			for (var i=0; i<result.lights.length; i++) {
				light = result.lights[i];
				if (light.reachable) {
					hue.setBulbStatus(light.id,true, function(res) {});
				}
			}
			
			var res = {
		   	 cmd: 'setStatus',
			 status: true   	   
		    };

		    ws.broadcast(JSON.stringify(res));
		   
		});
	    break;
	  case 'BFE': 
	  case 'E11':
	  case '22A':
	    console.log('off');
	    hue.getFullState(function(result) {
	    	console.log(arguments);
			for (var i=0; i<result.lights.length; i++) {
				light = result.lights[i];
				if (light.reachable) {
					hue.setBulbStatus(light.id,false, function(res) {});
				}
			}
			var res = {
		   	 cmd: 'setStatus',
			 status: false   	   
		    };
		    ws.broadcast(JSON.stringify(res));
		});
		break;
	}
});
