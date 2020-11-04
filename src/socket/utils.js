module.exports = class SocketUtils {
  static async joinRoom(io, socketId, roomId) {
    try {
      if (roomId.toString()) roomId = roomId.toString();
      if (io.sockets.connected[socketId]) {
        io.sockets.connected[socketId].join(roomId);
      }
      return;
    } catch (error) {
      console.log("joinRoom", error);
      return;
    }
  }

  static leaveRoom(io, socketId, roomId) {
    try {
      if (roomId.toString()) roomId = roomId.toString();
      if (io.sockets.connected[socketId]) {
        io.sockets.connected[socketId].leave(roomId);
      }
      return;
    } catch (error) {
      console.log("leaveRoom", error);
      return;
    }
  }

  static removeAllFromRoom(io, roomId) {
    try {
      if (roomId.toString()) roomId = roomId.toString();
      io.sockets.clients(roomId).forEach(function (s) {
        s.leave(roomId);
      });
      return;
    } catch (err) {
      console.log("removeAllFromRoom", error);
      return;
    }
  }

  static async sendMessageToRoom(io, roomId, subject, data = {}) {
    try {
      io.of("/")
        .in(roomId)
        .clients((error, clients) => {
          console.info("sendMsgToRoom_connected_clients_is");
          console.info(clients);
        });
      console.info("Message_sent_to_RoomID");
      console.info(roomId);
      console.info(subject);
      console.info(data);
      io.to(roomId).emit(subject, data || {});
      return;
    } catch (error) {
      console.log("sendMessageToRoom", error);
      return;
    }
  }

  static async sendMsgToSocket(io, socketId, subject, data = {}) {
    try {
      io.of("/")
        .in(socketId)
        .clients((error, clients) => {
          console.info("sendMsgToSocketConnectedClientIs");
          console.info(clients);
          console.info("sendMsgToSocketError");
          console.info(error);
        });
      console.info("MessageSentToSocketId");
      console.info(socketId);
      console.info(subject);
      console.info(data);
      if (io.sockets.connected[socketId]) {
        io.sockets.connected[socketId].emit(subject, data);
      }
      return;
    } catch (error) {
      console.log("sendMsgToSocket", error);
      return;
    }
  }
};
