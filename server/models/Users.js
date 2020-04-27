//create a model for chat datatable

var Sequelize = require('sequelize');

var db = require("../db"); 

 var User = db.define('User', {
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }

  

});
/*User.sync({force:true}).then(() => {
    console.log('created user table?')
}); */
module.exports= User;