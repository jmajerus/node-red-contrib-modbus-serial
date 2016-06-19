/**
 * 
 */
module.exports = function(RED) {
	function ModbusMasterNode(n) {
		RED.nodes.createNode(this, n);

		this.port = n.port;
		this.mode = n.mode;
	
		/* this.init = function() {
			this.serialPort = new SerialPort(this.port, {
				baudrate : 9600
			}, false);
			this.client = new ModbusRTU(this.serialPort);
		}.bind(this); */

		var globalContext = this.context().global;

		var SerialPort = globalContext.get("serialport").SerialPort;
		this.serialPort = new SerialPort(this.port, {
			baudrate : 9600
		}, false);

		// create a modbus client using the serial port
		var ModbusRTU = globalContext.get("modbusRTU");
		this.client = new ModbusRTU(this.serialPort);
		var master = this;
		
		this.reconnect = function() {
			master.client.connectRTU(master.port, {baudrate: 9600});
		}

	}

	RED.nodes.registerType("modbus-master", ModbusMasterNode);
}