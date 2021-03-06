const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
var ssn;


const bodyParser = require('body-parser');

const {addUser, removeUser, getUser, getUsersInRoom} = require('./users.js');

const router = require('./router'); // require router module that was created
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const db = require('./db');

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
var User = require('./models/Users');
var Room = require('./models/Room');
var UsersInRoom = require('./models/UsersInRoom');



app.use(bodyParser.urlencoded({extened:true}));
app.use(bodyParser.json());

app.use(cors());
app.use(router);

app.use(session({
    secret:'shhh',
    resave: false,
    saveUnitialized:true,
    cookie: {secure:true}
}));


app.post('/api/login',function(req,res) {
    ssn = req.session;
    ssn.email = req.body.email;
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    User.findOne({
        where: {
            email
        }
    }).then(function(user){
        if(user){
            let hash =  user.dataValues.password;
            let id = user.dataValues.id;
            ssn.id = id;
            bcrypt.compare(password,hash,function(err,result){
             
                if(result) {
                    console.log('User logged in');
                    const payload = {id,email,name};
                    jwt.sign({payload},'secretkey', (err,token) =>{
                        res.json({token});
                    })
                    
                }
                // error for if password is incorrect for user
                else{ 
                 res.status(400).send({
                     message: `Password was incorrect`
                 })
            
             }  
     
            })

        }
        //error for if user doesn't exist in DB
        else{
            res.status(400).send({
                message: `User does not exist`
            })

        }
    })
    
    
})

app.post('/api/JoinChat',function(req,res) {
    const RoomName = req.body.roomName;
    Room.findOrCreate({
        where: {
            RoomName
        }
    }).spread(function(room,created){
        if(created){
            console.log('Room exists');
            res.end();
            
        }
        else{
            Room.create({
                RoomName
            })
        }
    })



})

app.post('/api/register',function(req,res) {
    const email = req.body.email;
    const name  = req.body.name;
    const password = req.body.password;

    bcrypt.genSalt(function(err,salt){
        bcrypt.hash(password,salt,function(error,hash) {
            User.findOrCreate({
                where:{email},
                defaults:{
                    name,
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

})






//listen for incomining sockets at the connection event
io.on('connection', (socket) => {
    console.log('We have a new connection!');
   
    //listen for user join event and prints out name and room 
    socket.on('join', ({name,room}, callback) => {
        
        /*let id = ssn.id;
        console.log(id);
        
        UsersInRoom.findOrCreate({
            where:{email: ssn.email},
            defaults:{
                name:name,
                password:hash
            }
        }
       )
       .spread(function(user,created) {
         if(created) {
            console.log(`${user} in room`); 
         }
        })
    
        
        */
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

// veryify token function
function verifyToken(req,res,next) {
    //get auth header value
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined') {

    const bearer = bearerHeader.split(' ');

    const bearerToken = bearer[1];
    req.token = bearerToken;

    //call next Middleware
    next();
    }
    else {
        //Forbidden 
        res.sendStatus(403);
    }
}
//${PORT} is template literal in ES6, required backtick not quotes
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));