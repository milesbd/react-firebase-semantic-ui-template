const { functions, admin } = require("../admin");

const Ref = "users";
const SUCCESS_CODE = 0;

exports.roleUpdate = functions.database
  .ref(Ref + "/{child}/roles")
  .onUpdate((change, context) => {
    const AFTER = change.after.val();
    const UID = change.after.ref.parent.ref.key;
    if (!Object.prototype.hasOwnProperty.call(AFTER, "ADMIN")) {
      return admin
        .auth()
        .setCustomUserClaims(UID, {
          admin: false,
        })
        .then(() => {
          return console.log("Admin Role removed");
        });
    } else if (Object.prototype.hasOwnProperty.call(AFTER, "ADMIN")) {
      return admin
        .auth()
        .setCustomUserClaims(UID, {
          admin: true,
        })
        .then(() => {
          return console.log("Admin role Added");
        });
    } else {
      const response = Promise.resolve(SUCCESS_CODE);
      return response;
    }
  });
