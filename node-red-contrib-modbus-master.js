/**
 * node-red-contrib-modbus-serial module 
 * author: John Majerus
 * 
 */
module.exports = function(RED) {
	function ModbusMasterNode(n) {
		RED.nodes.createNode(this, n);

		this.port = n.port;
		this.mode = n.mode;

		var globalContext = this.context().global;

		var SerialPort = globalContext.get("serialport").SerialPort;
		this.serialPort = new SerialPort(this.port, {
			baudrate : 9600
		}, false);

		// create a modbus client using the serial port
		var ModbusRTU = globalContext.get("modbusRTU");
		this.client = new ModbusRTU(this.serialPort);
		master = this;
		
		this.connect = function() {
			if (this.mode == "RTU") {
				master.client.connectRTU(master.port, {baudrate: 9600});
			} else if (this.mode == "ASCII") {
				master.client.connectAsciiSerial(master.port, {baudrate: 9600});
			} else if (this.mode == "TCP") {
				master.client.connectTCP(master.port, {baudrate: 9600});
			} else {
				node.warn("invalid mode: specify RTU, ASCII, or TCP                                                                                                                   6	67Y");
			}
		}
		this.connect();

	}

	RED.nodes.registerType("modbus-master", ModbusMasterNode);
}