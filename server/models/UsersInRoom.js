//create a model for chat datatable

var Sequelize = require('sequelize');

var db = require("../db"); 

 var UserInRoom = db.define('UsersInRoom', {
  UserID: {
    type: Sequelize.INTEGER
  },
  RoomID: {
    type: Sequelize.INTEGER
  },
  LoggedOn: {
    type: Sequelize.BOOLEAN
  }

  

});

module.exports= UserInRoom;