const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');

const userRoutes = require('./routes/user');
const forgotPasswordRoutes = require('./routes/forgotPassword');
const questionRoutes = require('./routes/questions')


const cors = require('cors');
const User = require('./models/User');
const ForgotPassword = require('./models/ForgotPassword');
const Room = require('./models/Room');
const Player = require('./models/Player');
const Question = require('./models/Question')
const sequelize = require('./util/database');
 

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json({extended: false}));



app.use(cors());


app.use(userRoutes);
app.use(forgotPasswordRoutes);
app.use(questionRoutes);

app.use((req, res) => {
    console.log('url is:', req.url);
    res.sendFile(path.join(__dirname, `client/${req.url}`));
})

io.on('connection', socket => {
    
    socket.on('createRoom', async(playerName) => {
        const t = await sequelize.transaction();
        try{
            const playerRoomExists = await Room.findOne({where: {id:socket.id}});
            const playerExists = await Player.findOne({where: {id:socket.id}})
            if(playerRoomExists && playerExists){
              socket.emit('createRoomError', 'You are already in a room.');
            }
            else{
              const room = await Room.create({ id: socket.id }, { transaction: t });
              const player = await Player.create({ id: socket.id, name: playerName, roomId: room.id }, { transaction: t });
              await t.commit();
              socket.join(room.id);
              io.emit('roomCreated', room.id);
              let isWaiting=true;
              io.to(room.id).emit('start-game', isWaiting,room.id);
            }
        }catch(err){
            await t.rollback();
            res.status(500).json({
                error: err
            })
        }
    })
    socket.on('availableRooms', async () => {
      try{
        const rooms = await Room.findAll({ include: Player })
        const availableRoomsList = rooms.filter((room) => room.players.length === 1);
        io.emit('updateRoom',availableRoomsList); 
      }catch(err){
        console.log(err);
      }
})
socket.on('joinRoom', async(roomId, playerName) => {
  try{
    const playerExists = await Player.findOne({where:{id: socket.id}});
    const roomExists = await Room.findOne({where:{id:socket.id}});
    if(playerExists && roomExists){
      socket.emit('roomJoinError','you are already in room');
    } 
    else{
      const room = await Room.findByPk(roomId);
      const players = await Player.findAll({where: {id: roomId}});
      if(room && players.length === 1){
        const newPlayer = await Player.create({id: socket.id, name: playerName, roomId: roomId});
        socket.join(room.id);
        const rooms = await Room.findAll({ include: Player })
        const availableRoomsList = rooms.filter((room) => room.players.length === 1);
        io.emit('updateRoom',availableRoomsList); 
        let isWaiting=false;
        io.to(room.id).emit('start-game', isWaiting,room.id);
        const players = await Player.findAll({where: {roomId: room.id}});
        if (players.length === 2) {
          socket.emit('roomClosed', room.id); 
        }
      }
      else{
        socket.emit('roomJoinError', 'room is full or not found');
      }
    }
  }
  catch(err){
    console.log(err);
  }

});
 socket.on('end-score', async (score,roomid) => {
  const scoreUpdate = await Player.findOne({where:{id: socket.id, roomId:roomid}});
  const totalScore = Number(scoreUpdate.score)+Number(score);
  await scoreUpdate.update({score:totalScore});
  socket.emit('show-score',scoreUpdate.score);
 })

 socket.on('get_final_result', async (roomid) => {
  const finalScores = await Player.findAll({where:{roomId : roomid}});
  io.to(roomid).emit('show_final_result', finalScores,roomid);
 })

 socket.on('closing_room', async(roomid)=>{
  await Room.destroy({where:{id:roomid}});
  const deleteRoomPlayers = await Player.findAll({where:{roomId: roomid}});
  if(deleteRoomPlayers){
    await Player.destroy({where:{roomId: roomid}});
  };
  socket.emit('room_closed');

 });


});
User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

Room.hasMany(Player);
Player.belongsTo(Room);


sequelize
.sync()
.then(result => {
    //console.log(result);
    server.listen(3000);
})
.catch(err => {
    console.log(err);
});
