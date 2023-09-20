
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

  socket.on('roomCreated', (roomId) => {
    console.log('room created');
    socket.emit('availableRooms');    
  });

  socket.on('createRoomError', (error) => {
    alert(error);
  });

  socket.on('roomJoinError', (error) => {
    alert(error);
  });

  socket.on('roomClosed', (roomId) => {
    console.log('room created')
  });

  socket.on('start-game', async (isWaiting, roomid) => {
    const lobby = document.getElementById('lobby');
    lobby.style.display = 'none';

    if(isWaiting){
      const GameMessage = document.getElementById('message');
      GameMessage.textContent = 'waiting for player to join';
    }


    else{
      const GameMessage = document.getElementById('message');
      GameMessage.textContent = 'room is full , game is about to start';
      await startCountdown(5);
      GameMessage.textContent = '';
      const getQuestions = await axios.get(`/question/random-question`);
      let questions = getQuestions.data.randomQuestions;
      let questionIndex = 0;
      const displayNextQuestion = async () => {
        while (questionIndex < questions.length) {
          const question = questions[questionIndex];
          displayQuestion(question);
          await startCountdown(10); 
          submitAnswer(questions[questionIndex],roomid);
          clearQuestion();
          questionIndex++;
        }
        const timerElement = document.getElementById('timer');
        timerElement.textContent = '';
        GameMessage.textContent = 'Quiz completed';
        socket.emit('get_final_result', roomid);
      };
      
      displayNextQuestion();
      
    }
  })

  async function displayAvailableRooms(element, roomlist) {
    element.innerHTML = '';
    roomlist.forEach((room) =>{
      const li = document.createElement('li');
      const roomButton = document.createElement('button');
      roomButton.textContent = `click to Join Room`;
      roomButton.id = `${room.id}`;
      roomButton.addEventListener('click', (e)=> {
        e.preventDefault();
        const playerName = prompt('Enter your name:');
        if (playerName) {
          socket.emit('joinRoom', room.id, playerName);
        }
      })
      li.appendChild(roomButton);
      element.appendChild(li);
    })
    
  }

  async function startCountdown(seconds) {
    let time = seconds;
    const timerElement = document.getElementById('timer');
    timerElement.textContent = time;
  
    return new Promise((resolve) => {
      const intervalId = setInterval(function () {
        time--;
        timerElement.textContent = `Timer:${time}`;
  
        if (time < 0) {
          clearInterval(intervalId);
          resolve(); 
        }
      }, 1000);
    });
  }

  function displayQuestion(question){
    const questionElement = document.getElementById('questionForm');
    questionElement.innerHTML=''
    questionChild = `<label> <h2>${question.qns_text}</h2> </label>`;
    questionElement.innerHTML+=(questionChild)
    const childelement = `<label> <input type="radio" value=${question.option1} name=${question.option1}> ${question.option1}
                           </label>
                           <br>
                           <label> <input type="radio" value=${question.option2} name=${question.option2}> ${question.option2}
                           </label>
                           <br>
                           <label> <input type="radio" value=${question.option3} name=${question.option3}> ${question.option3}
                           </label>
                           <br>
                           <label> <input type="radio" value=${question.option4} name=${question.option4}> ${question.option4}
                           </label>`
    questionElement.innerHTML+=(childelement);

  }



  function clearQuestion() {
    const questionElement = document.getElementById('questionForm');
    questionElement.innerHTML = '';
  }



  function submitAnswer(question,roomid) {
  
    const selectedAnswer = document.querySelector('input[type="radio"]:checked');
    let answer = selectedAnswer.value;
    console.log(answer);
    if(answer==question.correct_option){
      socket.emit('end-score',10,roomid);
    }
    else if(answer==null){
      socket.emit('end-score',0,roomid);
    }
    else{
      socket.emit('end-score',0,roomid);
    }
  }
  
socket.on('show-score', (score)=>{
  const scoreElement = document.getElementById('score');
  scoreElement.innerHTML=''
  childelement = `<h2>Score:${score}</h2>`
  scoreElement.innerHTML+= (childelement);
});

socket.on('show_final_result', (finalScores,roomid) => {
  const scoreElement = document.getElementById('score');
  scoreElement.innerHTML=''
  const childelement = `<div>${finalScores[0].name} : ${finalScores[0].score}</div>
                        <div>${finalScores[1].name} : ${finalScores[1].score}</div>`
                        
  scoreElement.innerHTML+=childelement
  if(finalScores[0].score>finalScores[1].score){
    const childelement2 = `<div><h2>${finalScores[0].name} WON</h2></div>`
    scoreElement.innerHTML+=childelement2
  }
  else if(finalScores[0].score==finalScores[1].score){
    const childelement2 = `<div><h2>IT'S A DRAW</h2></div>`
    scoreElement.innerHTML+=childelement2
  }
  else{
    const childelement2 = `<div><h2>${finalScores[1].name} WON</h2></div>`
    scoreElement.innerHTML+=childelement2
  }
  
  socket.emit('closing_room', roomid);

})

socket.on('room_closed', ()=>{
  const lobby = document.getElementById('lobby');
  lobby.style.display = 'block';
})


document.getElementById('logout').onclick = async function (e) {
  try{
      localStorage.clear();
      window.location.href = "../Login/login.html"
  }catch(err) {
      console.log(err);
  }
}
