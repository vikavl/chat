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

let messages;
let isHistory = false;
let checkAcc = false; //для проверки на просмотр истории

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("chat").onsubmit = async e => {
    e.preventDefault();
    const username = e.target.elements[0].value;
    if (!(await fetchUsers(username))) {
      e.target.elements[0].value = "";
      socket.emit("set username", username);
      document.getElementById("username").innerHTML = username;
      checkAcc = true;
    }
    else{
      alert("Имя уже занято!");
    }
  };

  document.getElementById("messageForm").onsubmit = e => {
    e.preventDefault();
    socket.emit("message", e.target.elements[0].value);
    e.target.elements[0].value = "";
  };
});

document.getElementById("toHistory").onclick = async () => {
  if (!isHistory && checkAcc) {
    await fetch("/db")
      .then(response => {
        return response.json();
      })
      .then(data => {
        const box = document.getElementById("messages");
        messages = box.innerText;
        isHistory = true;
        box.innerText = "";
        data.forEach(elem => {
          box.innerText += `[${elem.username}]: ${elem.message}`;
        });
      });
  } else {
    alert("Сначала войдите!");
  }
};

document.getElementById("toChat").onclick = () => {
  if (isHistory) {
    document.getElementById("messages").innerText = messages;
    isHistory = false;
  }
};

const fetchUsers = async username => { //запрос на сервер
  const usersFetched = await fetch("/users")
    .then(response => {
      if (response.ok) {
        return response.text();
      }
    })
    .then(data => data.split(","));
  return usersFetched.some(elem => elem === username);
};

socket.on("system new", name => {
  document.getElementById("messages").innerText += `${name} joined! \n`;
});

socket.on("render message", data => {
  if (checkAcc) {
    document.getElementById(
      "messages"
    ).innerText += `[${data.username}]: ${data.message} \n`;
  } else {
    alert("Сначала войдите!");
  }
});
