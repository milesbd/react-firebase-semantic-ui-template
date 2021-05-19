
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const realtime = admin.database();
module.exports = {
  admin,
  realtime,
  functions,
};
