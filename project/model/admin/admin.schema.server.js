module.exports = function () {
  var mongoose = require("mongoose");

  var AdminSchema = mongoose.Schema({
      username: String,
      password: String
  });

  return AdminSchema;
};