const socket = io();
window.addEventListener("DOMContentLoaded", async () => {
    try{
        socket.on('connect', () => {
            console.log('Connected to the server');
          });
        var fragment = window.location.hash.slice(1); 
        var [roomid, message, socketid] = fragment.split('&').map(decodeURIComponent);
        socket.id= socketid;
        socket.emit('message-info',message,roomid)          
        }
        catch(err)
        {
            console.log(err)
        }
})
socket.on('waiting', (roomid) => {
    const GameMessage = document.getElementById('message');
    console.log('insdide waiting')
    console.log('frontend',roomid);
    GameMessage.textContent = 'waiting for other player to join';
})

socket.on('start', roomid => {
    GameMessage.textContent = 'roo is full Game about to start';
    function startCountdown() {
        let time = 5;
        const intervalId = setInterval(function() {
            document.getElementById('timer').textContent = time;
            time--;
            if (time < 0) {
                clearInterval(intervalId); 
                alert('Countdown is complete!');
            }
        }, 1000); 
    }
    startCountdown();
})