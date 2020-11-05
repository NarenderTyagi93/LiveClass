module.exports = class Utils {
  static addSafeReadOnlyGlobal = (prop, val) => {
    Object.defineProperty(global, prop, {
      get: function () {
        return val;
      },
      set: function () {
        console.warn(
          "You are trying to set the READONLY GLOBAL variable `",
          prop,
          "`. This is not permitted. Ignored!"
        );
      },
    });
  };
};
