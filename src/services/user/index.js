module.exports = class User {
  static async authenticate(id) {
    console.log(id);
    return !!(await db.users.findOne({ id }));
  }
};
