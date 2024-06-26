const opcua = require("node-opcua");

class OPCUAClientManager {
  constructor() {
    this.clients = {};
    this.sessions = {};
  }

  async connectToServer(machineId, url) {
    try {
      if (this.clients[machineId]) {
        // console.log(`Already connected to machine ${machineId}`);
        return;
      }
      const client = opcua.OPCUAClient.create({ endpoint_must_exist: false });
      await client.connect(url);
      console.log(`Connected to OPC UA Server for machine ${machineId}`);

      const session = await client.createSession();
      console.log(`Session created for machine ${machineId}`);

      this.clients[machineId] = client;
      this.sessions[machineId] = session;
    } catch (error) {
      console.error(
        `Failed to connect to OPC UA Server for machine ${machineId}: ${error.message}`
      );
    }
  }

  async disconnectFromServer(machineId) {
    try {
      const session = this.sessions[machineId];
      const client = this.clients[machineId];

      if (session) {
        await session.close();
        console.log(`Session closed for machine ${machineId}`);
      }
      if (client) {
        await client.disconnect();
        console.log(`Disconnected from OPC UA Server for machine ${machineId}`);
      }

      delete this.sessions[machineId];
      delete this.clients[machineId];
    } catch (error) {
      console.error(
        `Failed to disconnect from OPC UA Server for machine ${machineId}: ${error.message}`
      );
    }
  }

  async readNodeValue(machineId, nodeId) {
    try {
      const session = this.sessions[machineId];
      if (!session)
        throw new Error(`No active session for machine ${machineId}`);
      const dataValue = await session.readVariableValue(nodeId);
      return dataValue.value.value;
    } catch (error) {
      console.error(
        `Failed to read node value for machine ${machineId}: ${error.message}`
      );
      throw error;
    }
  }
}

module.exports = OPCUAClientManager;
