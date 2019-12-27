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

document.addEventListener("DOMContentLoaded", () => { //загрузили контент
  document.getElementById("chat").onsubmit = async e => { //Событие onsubmit возникает при отправке формы
    e.preventDefault(); //нет перезагрузке страницы
    const username = e.target.elements[0].value;
    if (!(await fetchUsers(username))) { //если во время текущей сессии введенное имя занято, то на странице выводиться сообщение 
      e.target.elements[0].value = "";
      socket.emit("set username", username); //сообщение серверу о новом пользователе
      document.getElementById("username").innerHTML = username; //меняем имя клиента согласно считанному с сервера (в хтмл файле)
      checkAcc = true; //когда клиент вошел (ввел свое имя и нажал кнопку), то он сможет просматривать историю чата
    }
    else{
      alert("Имя уже занято!");
    }
  };

  document.getElementById("messageForm").onsubmit = e => { //берем сообщение с формы //Событие onsubmit возникает при отправке формы
    e.preventDefault(); //нет перезагрузке страницы
    socket.emit("message", e.target.elements[0].value); //передаем серверу сообщение клиента
    e.target.elements[0].value = "";
  };
});

document.getElementById("toHistory").onclick = async () => { //вывод всех сообщений на форму (соответственная считка с сервера (запросы и ответы оттуда))
  if (!isHistory && checkAcc) { 
    await fetch("/db") //делает сетевой запрос и получать информацию с сервера (по адрессу "/db")
      .then(response => { //получаем ответ с запроса
        return response.json(); //Возвращает promise (обещание), который, когда ответ будет получен, вызовет коллбэк с результатом парсинга тела ответа в JSON объект.
      })
      .then(data => {
        const box = document.getElementById("messages"); //в форме (там где поле прокрутки сообщений) выводим сообщения
        messages = box.innerText;
        isHistory = true; //открываем доступ к истории
        box.innerText = "";
        data.forEach(elem => {
          box.innerText += `[${elem.username}]: ${elem.message}`;
        });
      });
  } else {
    alert("Сначала войдите!"); //если клиент не ввел свое имя, то у него нет возможности вводить сообщения
  }
};

document.getElementById("toChat").onclick = () => {
  if (isHistory) { //если есть доступ к истории, то выводим сообщения
    document.getElementById("messages").innerText = messages;
    isHistory = false;
  }
};

const fetchUsers = async username => { //запрос на сервер
  const usersFetched = await fetch("/users") //запрос на сервер о имени клиентов
    .then(response => { //ответ с сервера
      if (response.ok) {
        return response.text();
      }
    })
    .then(data => data.split(","));
  return usersFetched.some(elem => elem === username);
};

socket.on("system new", name => { //если клиент впервые вошел в систему, то выводим всем пользователям сообщение о присоиденении нового клиента
  document.getElementById("messages").innerText += `${name} joined! \n`;
});

socket.on("render message", data => { //берем с серевера информацию о клментах
  if (checkAcc) { //если клиент вошел, то выводим сообщения
    document.getElementById(
      "messages"
    ).innerText += `[${data.username}]: ${data.message} \n`;
  } else {
    alert("Сначала войдите!");
  }
});
