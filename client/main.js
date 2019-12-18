document.addEventListener("DOMContentLoaded", () => { //загрузили контент
  const socket = io(); //подключ сокета
  document.getElementById("chat").onsubmit = e => { //нажатие на кнопку
    e.preventDefault(); //нет перезагрузке страницы
    socket.emit("set username", e.target.elements[0].value); //сообщение серверу о новом пользователе
  };
  socket.on("new user", name => {
    document.getElementById("username").innerHTML = name; //в сокете переприсвоили(внесли) имя пользователя
  });
});
