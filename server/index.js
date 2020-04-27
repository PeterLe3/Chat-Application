const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const bodyParser = require('body-parser');

const {addUser, removeUser, getUser, getUsersInRoom} = require('./users.js');

const router = require('./router'); // require router module that was created
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

var db = require('./db');

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
var User = require('./models/Users');




app.use(bodyParser.urlencoded({extened:true}));
app.use(bodyParser.json());

app.use(cors());
app.use(router);



app.post('/api/login',function(req,res) {
    const email = req.body.email;
    const password = req.body.password;
    //console.log('test');
    User.findOne({
        where: {
            email:email
        }
    }).then(user => {
       let hash = user.dataValues.password;
       bcrypt.compare(password,hash,function(err,result){
           if(result) {
               console.log('User logged in');
           }
           else{
            res.status(400).send({
                message: `Password was incorrect`
            })
       
        }  

       })
    
    })

    
})



app.post('/api/register',function(req,res) {
    const email = req.body.email;
    const name  = req.body.name;
    const password = req.body.password;

    bcrypt.genSalt(function(err,salt){
        bcrypt.hash(password,salt,function(error,hash) {
            User.findOrCreate({
                where:{email:email},
                defaults:{
                    name:name,
                    password:hash
                }
            }
           )
           .spread(function(user,created) {
             if(created) {
                console.log('New User Created'); 
             }
             else{
                 res.status(400).send({
                     message: `Email: ${email} was already created`
                 })
            
             }  


        });
    });
 
   })
    //console.log('test');

})






//listen for incomining sockets at the connection event
io.on('connection', (socket) => {
    console.log('We have a new connection!');
   

    //listen for user join event and prints out name and room 
    socket.on('join', ({name,room}, callback) => {
        const {error, user} = addUser({id:socket.id, name, room});
        
        if(error) return callback(error);
       
        //Tells user that he is welcomed to the chat, emit message from backend to front end
        socket.emit('message',{ user:'admin', text: `${user.name}, welcome to the room ${user.room}`});
        //lets evreyone else in room besides the user know that he/she joined the chat
        socket.broadcast.to(user.room).emit('message', {user:'admin', text:`${user.name}, has joined!`});
        // joins a user in a room
        socket.join(user.room);

        io.to(user.room).emit('roomData', {room :user.room, users: getUsersInRoom(user.room)});
        callback();
    
      
   
    })
    // expect message from front-end to backend
    socket.on('sendMessage', (message,callback) => {
        const user = getUser(socket.id);
        // send this message to all users in the same room
        io.to(user.room).emit('message',{user:user.name, text:message});
        io.to(user.room).emit('roomData',{room:user.room, users: getUsersInRoom(user.room)});

        callback();

    })
    //handles the specific socket that just joined
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if(user) {
            io.to(user.room).emit('message', {user:'admin', text: `${user.name} has left.`});
        }
    })
}) 


//${PORT} is template literal in ES6, required backtick not quotes
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));