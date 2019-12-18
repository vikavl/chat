// const socket = io();

// document.addEventListener("DOMContentLoaded", () => { //загрузили контент
//   const socket = io(); //подключ сокета
//   document.getElementById("chat").onsubmit = e => { //нажатие на кнопку
//     e.preventDefault(); //нет перезагрузке страницы
//     socket.emit("set username", e.target.elements[0].value); //сообщение серверу о новом пользователе
//   };
//   socket.on("new user", name => {
//     document.getElementById("username").innerHTML = name; //в сокете переприсвоили(внесли) имя пользователя
//   });
// });

// socket.on('system new', (name) => {
//     document.getElementById('messages').innerHTML += `${name} joined!\n`
// })

const socket = io();


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('chat').onsubmit = (e) => {
    e.preventDefault();
    const username = e.target.elements[0].value;
    e.target.elements[0].value = '';
    socket.emit('set username', username)
    document.getElementById('username').innerHTML = username;
    }
    document.getElementById('messageForm').onsubmit = (e) => {
        e.preventDefault();
        socket.emit('message', e.target.elements[0].value)
        e.target.elements[0].value = '';
    }
});

socket.on('system new', (name) => {
    document.getElementById('messages').innerText += `${name} joined! \n`
})

socket.on('render message', (data) => {
    document.getElementById('messages').innerText += `[${data.username}]: ${data.message} \n`
})