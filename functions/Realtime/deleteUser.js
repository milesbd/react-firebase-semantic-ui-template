const { functions, admin } = require("../admin");

const Ref = "users";

exports.deleteUser = functions.database
  .ref(Ref + "/{child}")
  .onDelete((snapshot, context) => {
    return admin.auth().deleteUser(context.params.child);
  });
