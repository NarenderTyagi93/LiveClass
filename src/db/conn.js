const mongoose = require("mongoose");

module.exports = class MongoConn {
  constructor(url) {
    this.mongoUrl = url;
    this._init();
  }
  _init() {
    if (!this.mongoUrl) throw new Error("Mongo Url is required");
    mongoose
      .connect(this.mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(async () => {
        console.log(`DB Connected Successfully : ${this.mongoUrl}`);
        const connection = mongoose.connection;
        connection.db.listCollections().toArray(async (err, names) => {
          if (err) {
            console.log(err);
          } else {
            // const nameArray = names.map((n) => n.name);
            // if (!nameArray.includes("users")) {
            // }
            // for removing
            // for (let i = 0; i < names.length; i++) {
            //   // console.log(names[i].name);
            //   // console.log(`${names[i].name} Collection Exists in DB`);
            //   connection.db.dropCollection(names[i].name, function (
            //     err,
            //     result
            //   ) {
            //     // console.log("Collection droped");
            //   });
            //   // console.log(`${names[i].name} Collection No Longer Available`);
            // }
          }
        });
      })
      .catch((err) => console.error(err));
  }
};
