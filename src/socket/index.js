const { config } = require("bluebird");
const socketIo = require("socket.io");
const redisAdapter = require("socket.io-redis");
const userService = require("../services/user");
const EventManager = require("./eventManager");
global.userSocketMap = {};

module.exports = class SocketConn {
  constructor() {}
  static instance(server) {
    if (!server) throw new Error("Server instance is required");
    this.io = socketIo(server);
    this.io.adapter(
      redisAdapter({
        port: 6379,
        host: config.REDIS_URL_HOST,
      })
    );
    this.openConnection();
  }

  static async openConnection() {
    this.io.on("connection", async (socket) => {
      const socketId = socket.id;
      const userId =
        (socket.handshake.query && socket.handshake.query.userId) || null;
      const isAuthenticated =
        (userId && userService.authenticate(userId)) || false;
      if (!isAuthenticated) {
        console.log("unauthorized Socket");
        return socket.disconnect();
      }
      //payload is the data sent as message from client
      //callback is to provide EmitAcks for client
      socket.on("live_class", (payload, callback) => {
        console.log(payload);
        EventManager.handleEvent(this.io, socketId, payload, userId, callback);
      });
      userSocketMap[socketId] = userId;
      socket.on("disconnect", () => {
        delete userSocketMap[socketId];
        // this.leaveRoom(io, socketId, roomId);
      });
    });
  }
};
