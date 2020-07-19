//create a model for chat datatable

var Sequelize = require('sequelize');

var db = require("../db"); 

 var Room = db.define('Rooms', {

  RoomName: {
    type: Sequelize.STRING
  }

  

});

module.exports= Room;