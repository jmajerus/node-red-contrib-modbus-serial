/**
 * node-red-contrib-modbus-serial module author: John Majerus input command in
 * format: open/close <device#> <relay#>
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
			node.log("opening serial port");
			node.master.serialPort.open();
		}
		if (node.master.serialPort.isOpen()) {
			node.log("modbus serial port is open");
		}

		result = node.master.client.writeRegister(parseInt(registers[1]),
				address);
		node.warn("write " + node.master.port);
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
				node.log("modbus serial port connect");
				node.master.connect();
			}
			this.on('input', function(msg) {
				node.cmd = msg.payload;
				node.master.client.open(onOpen);
			});
			this.on('close', function() {
				// tidy up any async code here - shutdown connections and so
				// on.
				if (node.master.serialPort.isOpen()) {
					node.master.serialPort.close();
				}
			});
			node.master.serialPort.on('error', function(err) {
				node.warn("serial port error");
				node.warn(err.stack);
			});
			node.master.serialPort.on('open', function() {
				node.log("serial port open");
			});
			node.master.serialPort.on('close', function() {
				node.log("serial port close");
			});

		} else {
			node.warn("Configuration node not set");
		}
	}
	RED.nodes.registerType("modbus-out", ModbusOutNode);

}
