const config = require("./config");
const app = require("express")();
const http = require("http").createServer(app);
const logger = require("morgan");
const bodyParser = require("body-parser");
const appRoutes = require("./controller");
const mongoConn = require("./db/conn");
const Utils = require("./utils");
const users = require("./db/models/User");
const liveClasses = require("./db/models/LiveClass");
const events = require("./db/models/Event");
const table = require("table");

global.config = config;

module.exports = class Server {
  static init = async () => {
    try {
      new mongoConn(config.MONGO_URL);
      require("./socket").instance(http);
      Server.initModels();
      Server.initLogger();
      Server.initServer();
      Server.initRouting();
      setTimeout(() => Server.createDb(), 3000);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };

  static initServer = () => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    http.listen(config.SERVER.PORT, () => {
      console.log(`Server started on port # ${config.SERVER.PORT}`);
    });
  };
  static initLogger = () => {
    app.use(
      logger(
        ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms ":referrer" ":user-agent"'
      )
    );
  };

  static initRouting = () => {
    app.use("/api", appRoutes);

    app.use(function (req, res, next) {
      var err = new Error("Not Found");
      err.status = 404;
      next(err);
    });
  };

  static initModels() {
    Utils.addSafeReadOnlyGlobal("db", {
      users,
      liveClasses,
      events,
    });
  }

  static async createDb() {
    let student, tutor, room;
    if (!!!(await db.users.countDocuments())) {
      student = new db.users({
        name: "NarenderStudent",
        email: "narendertyagi93@gmail.com",
        contact: 9999402624,
        type: 1,
      });
      tutor = new db.users({
        name: "NarenderTeacher",
        email: "narendertyagi93@gmail.com",
        contact: 9999402624,
        type: 0,
      });
      student.save();
      tutor.save();
    }

    if (!!!(await db.liveClasses.countDocuments()) && tutor && student) {
      room = new db.liveClasses({
        name: "LiveClass",
        createdBy: tutor._id,
      });
      room.save();
    }

    if (tutor && student && room) {
      const data = [
        ["Tutor", tutor.name, tutor._id],
        ["Student", student.name, student._id],
        ["Room", room.name, room._id],
      ];
      // Creating column width configuration
      const config = {
        columns: {
          0: {
            width: 10, // Column 0 of width 1
          },
          1: {
            width: 20, // Column 1 of width 20
          },
          2: {
            width: 25, // Column 2 of width 5
          },
        },
      };
      let x = table.table(data, config);
      console.log("Use this Data:");
      console.log(x);
    }
  }
};
