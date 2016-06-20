/**
 * node-red-contrib-modbus-serial module 
 * author: John Majerus
 * 
 */

function onOpen(err) {
	var cmd = this.context().get("cmd");
	if (err) {
		this.warn("modbus open error");
		this.warn(err.stack);
	} else {
		if (cmd.indexOf("read") != -1)
			read();
	}
}



function read() {
	var cmd = this.context().get("cmd");
	// read the 2 registers starting at address
	// on device number 1.
	// this.warn("read");
	function readHoldingRegister(reg) {
		this.client.readHoldingRegisters(reg, 1).then(display);
	}

	switch (cmd) {
	case "open1": {
		readHoldingRegister(1);
		break;
	}
	case "open2": {
		readHoldingRegister(2);
		break;
	}
	case "close1": {
		readHoldingRegister(1);
		break;
	}
	case "close2": {
		readHoldingRegister(2);
		break;
	}
	case "read1": {
		readHoldingRegister(1);
		break;
	}
	case "read2": {
		readHoldingRegister(2);
		break;
	}
	}
}

module.exports = function(RED) {


	function ModbusInNode(config) {
		RED.nodes.createNode(this, config);
		// Retrieve the config node
        this.master = RED.nodes.getNode(config.master);
        if (this.master) {
			this.client = this.master.client;
			if (!this.client) this.warn("Modbus client unavailable");
			this.on('input', function(msg) {
				this.context().set('cmd',msg.payload);
				this.client.open(onOpen);
			});
        } else {
        	this.warn("Configuration node not set")
        }
	}
	RED.nodes.registerType("modbus-in", ModbusInNode);
}