/**
 * MODBUS node-red-contrib module author: John Majerus version: 2016.1
 * 
 */

function onOpen(err) {
	var cmd = node.cmd;
	function write() {
		if (cmd.search("close")) {
			address = 0x0100;
		} else if (cmd.search("open")) {
			address = 0x0200;
		}
		registers = cmd.match(/\d+/g);
		node.master.client.setID(parseInt(registers[0]));
		// this.warn(registers[1]);
		// write the values 0, 0xffff to registers starting at address
		// on device number n.
		if (!node.master.serialPort.isOpen()) {
			log("modbus serial port is not open");
			node.master.serialPort.open();
		}
		if (node.master.serialPort.isOpen()) {
			log("modbus serial port is open");
		}
	
		result = node.master.client.writeRegister(parseInt(registers[1]), address);
		node.warn("write " + node.master.port);

	}
	function read() {
		// read the 2 registers starting at address
		// on device number 1.
		// this.warn("read");
		function readHoldingRegister(reg) {
			node.master.client.readHoldingRegisters(reg, 1).then(display);
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

	if (err) {
		node.warn("modbus open error");
		node.warn(err.stack);
	} else {
		node.warn(cmd);
		if (cmd.indexOf("read") != -1)
			read();
		else
			write();
		// setTimeout(serialPort.close(),500);
	}
}

module.exports = function(RED) {
	function ModbusOutNode(config) {

		RED.nodes.createNode(this, config);
		// Retrieve the config node
		node = this;
		node.master = RED.nodes.getNode(config.master);
		if (this.master) {
			if (!this.master.client)
				node.warn("Modbus client unavailable");

			if (!node.master.serialPort.isOpen()) {
				log("modbus serial port reconnect");
				node.master.reconnect();
			}
			this.on('input', function(msg) {
				node.cmd = msg.payload;
				node.master.client.open(onOpen);
			});
			this.on('close', function() {
				// tidy up any async code here - shutdown connections and so on.
				if (node.master.serialPort.isOpen()) {
					node.master.serialPort.close();
				}
			});
			node.master.serialPort.on('error', function(err) {
				node.warn("serial port error");
				node.warn(err.stack);
			});
			node.master.serialPort.on('open', function() {
				log("serial port open");
			});
			node.master.serialPort.on('close', function() {
				log("serial port close");
			});

		} else {
			node.warn("Configuration node not set")
		}
	}
	RED.nodes.registerType("modbus-out", ModbusOutNode);

}