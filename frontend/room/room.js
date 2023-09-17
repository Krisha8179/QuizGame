const socket = io();

const token = localStorage.getItem('token');
const decodedToken = parseJwt(token);


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


const listOfRooms = document.getElementById('rooms');
const createRoom = document.getElementById('create-button');

window.addEventListener("DOMContentLoaded", async () => {
    try{

        socket.on('connect', () => {
            console.log('Connected to the server');
            socket.emit('availableRooms');
          });

    }
        catch(err)
        {
            console.log(err)
        }
})

socket.on('updateRoom', (room) => {
    listOfRooms.innerHTML = ''; 
    displayAvailableRooms(listOfRooms
      , room);
  });

createRoom.addEventListener('click', async(e) => {
    e.preventDefault();
    const playerName = document.getElementById('player-name').value;
    socket.emit('createRoom', playerName);
  });

  socket.on('roomCreated', async(roomId) => {
    console.log('room created');
    socket.emit('availableRooms');
    const url='../game/game.html?roomId=' + encodeURIComponent(roomId);
    
    window.location.href = url;

  });

  socket.on('createRoomError', (error) => {
    alert(error);
  });

  socket.on('roomJoinError', (error) => {
    alert(error);
  });

  socket.on('roomClosed', (roomId) => {
    const roomButton = document.getElementById(`${roomId}`);
    if (roomButton) {
      roomButton.remove();
    }
    console.log('room closed and user joined')
    window.location.href = `../game/game.html?roomId=${roomId}`;
  });

  async function displayAvailableRooms(element, roomlist) {
    element.innerHTML = '';
    roomlist.forEach((room) =>{
      const li = document.createElement('li');
      const roomButton = document.createElement('button');
      roomButton.textContent = 'Join Room';
      roomButton.id = `${room.id}`;
      roomButton.addEventListener('click', ()=> {
        const playerName = prompt('Enter your name:');
        if (playerName) {
          socket.emit('joinRoom', room.id, playerName);
        }
      })
      li.appendChild(roomButton);
      element.appendChild(li);
    })
    
  }