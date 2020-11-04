module.exports = class Room {
  static async listRoom() {
    return (await db.liveClasses.find({})) || [];
  }

  static async joinRoom(userId, roomId) {
    console.log(userId, roomId);
    const user = await db.users.findOne({ _id: userId });
    if (!user) throw new Error("UserId Invalid");
    const room = await db.liveClasses.findOne({ _id: roomId });
    if (!room) throw new Error("RoomId Invalid");
    if (user.type == 1 && !room.isActive)
      throw new Error("You as Student not allowed in inactive class! Sorry..");
    const promises = [];
    const liveClassesUpdateQuery = {};
    if (user.type == 1) {
      liveClassesUpdateQuery["$addToSet"] = { participantsStudents: userId };
    } else {
      liveClassesUpdateQuery["$addToSet"] = { participantsTeachers: userId };
    }
    promises.push(
      db.liveClasses.updateOne({ _id: roomId }, liveClassesUpdateQuery)
    );
    promises.push(
      await db.events.create({
        doneBy: userId,
        room: roomId,
        type: 0,
      })
    );
    await Promise.all(promises);
    const roomWithParticipant = await db.liveClasses
      .findOne({ _id: roomId })
      .populate("participantsStudents", "name")
      .populate("participantsTeachers", "name");
    return { user, roomWithParticipant };
  }

  static async leaveRoom(userId, roomId) {
    const user = await db.users.findOne({ _id: userId });
    if (!user) throw new Error("UserId Invalid");
    const room = await db.liveClasses.findOne({ _id: roomId });
    if (!room) throw new Error("RoomId Invalid");
    const liveClassesUpdateQuery = {};
    const promises = [];
    if (user.type == 1) {
      if (room.participantsStudents && room.participantsStudents.length == 1) {
        liveClassesUpdateQuery["participantsStudents"] = [];
      } else {
        liveClassesUpdateQuery["$pull"] = {
          participantsStudents: userId,
        };
      }
    } else {
      if (room.participantsTeachers && room.participantsTeachers.length == 1) {
        liveClassesUpdateQuery["participantsTeachers"] = [];
        liveClassesUpdateQuery["isActive"] = false;
        promises.push(
          await db.events.create({ doneBy: userId, room: roomId, type: 4 })
        );
      } else {
        liveClassesUpdateQuery["$pull"] = {
          participantsTeachers: userId,
        };
      }
    }
    promises.push(
      db.liveClasses.updateOne({ _id: roomId }, liveClassesUpdateQuery)
    );
    promises.push(
      await db.events.create({ doneBy: userId, room: roomId, type: 1 })
    );
    await Promise.all(promises);
    const roomWithParticipant = await db.liveClasses
      .findOne({ _id: roomId })
      .populate("participantsStudents", "name")
      .populate("participantsTeachers", "name");
    return { user, roomWithParticipant };
  }

  static async startClass(userId, roomId) {
    const user = await db.users.findOne({ _id: userId });
    if (!user) throw new Error("UserId Invalid");
    const room = await db.liveClasses.findOne({ _id: roomId, isActive: false });
    if (!room) throw new Error("RoomId Invalid");
    if (user.type == 1)
      throw new Error("You as Student not to start class! Sorry..");
    const promises = [];
    promises.push(
      db.liveClasses.updateOne({ _id: roomId }, { isActive: true })
    );
    promises.push(
      await db.events.create({
        doneBy: userId,
        room: roomId,
        type: 2,
      })
    );
    await Promise.all(promises);
    return user;
  }

  static async endClass(userId, roomId) {
    const user = await db.users.findOne({ _id: userId });
    if (!user) throw new Error("UserId Invalid");
    const room = await db.liveClasses.findOne({ _id: roomId, isActive: true });
    if (!room) throw new Error("RoomId Invalid");
    if (user.type == 1)
      throw new Error("You as Student not to stop class! Sorry..");
    const promises = [];
    promises.push(
      db.liveClasses.updateOne(
        { _id: roomId },
        { isActive: false, participantsStudents: [] }
      )
    );
    promises.push(
      await db.events.create({
        doneBy: userId,
        room: roomId,
        type: 3,
      })
    );
    await Promise.all(promises);
    return user;
  }
};
