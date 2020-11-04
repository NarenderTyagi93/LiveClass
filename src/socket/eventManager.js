const CONSTANTS = require("../constants");
const RoomService = require("../services/room");
const SocketUtils = require("./utils");

module.exports = class EventManager {
  static async handleEvent(io, socketId, payload, userId, callback) {
    try {
      switch (payload.action) {
        case CONSTANTS.SOCKET.RECEIVE_EVENTS.LIST_ROOM: {
          const list = await RoomService.listRoom();
          callback({ status: true, message: list });
          break;
        }
        case CONSTANTS.SOCKET.RECEIVE_EVENTS.JOIN_ROOM: {
          const { roomId } = payload;
          const data = await RoomService.joinRoom(userId, roomId);
          SocketUtils.joinRoom(io, socketId, roomId);
          SocketUtils.sendMessageToRoom(
            io,
            roomId,
            CONSTANTS.SOCKET.EMIT_EVENTS.JOINED_ROOM,
            data
          );
          callback({ status: true, message: null });
          break;
        }
        case CONSTANTS.SOCKET.RECEIVE_EVENTS.LEAVE_ROOM: {
          const { roomId } = payload;
          const data = await RoomService.leaveRoom(userId, roomId);
          SocketUtils.sendMessageToRoom(
            io,
            roomId,
            CONSTANTS.SOCKET.EMIT_EVENTS.LEFT_ROOM,
            data
          );
          SocketUtils.leaveRoom(io, socketId, roomId);
          callback({ status: true, message: null });
          break;
        }
        case CONSTANTS.SOCKET.RECEIVE_EVENTS.START_CLASS: {
          const { roomId } = payload;
          const user = await RoomService.startClass(userId, roomId);
          SocketUtils.sendMessageToRoom(
            io,
            roomId,
            CONSTANTS.SOCKET.EMIT_EVENTS.START_CLASS,
            { roomId, user }
          );
          callback({ status: true, message: null });
          break;
        }
        case CONSTANTS.SOCKET.RECEIVE_EVENTS.END_CLASS: {
          const { roomId } = payload;
          const user = await RoomService.endClass(userId, roomId);
          SocketUtils.sendMessageToRoom(
            io,
            roomId,
            CONSTANTS.SOCKET.EMIT_EVENTS.END_CLASS,
            { user, roomId }
          );
          callback({ status: true, message: null });
          break;
        }
        default: {
          console.log("Invalid Action");
          return;
        }
      }
    } catch (error) {
      callback({ status: false, message: error.message });
      console.log(error);
    }
  }
};
