const express = require("express"); //подключить express (модуль для помощи работы с сервером) //очень маленький и быстрый серверный веб-фреймворк, построенном на базе connect
const http = require("http");

const users = [];
const app = express();
const server = http.Server(app);
const port = process.env.PORT || 3000;
const io = require("socket.io")(server); //вебсокет с расширенными функциями; подключили наш сокет к серверу
const db = require("./db.js");

app.get("/", (req, res) => { //Тут создается web-сервер, «слушающий» порт 3000 и обрабатывающий запрос к /, ответом на который есть отправка заглавного файла сайта
  res.sendFile(__dirname + "/client/index.html");
});

app.get("/db", (req, res) => { //Тут создается web-сервер, «слушающий» порт 3000 и обрабатывающий запрос к /db, ответом на который есть считка строк базы данных
  db.all("SELECT * FROM messages", (err, rows) => {
    res.send(rows);
  });
});

app.get("/users", (req, res) => {
  res.send(users.join(","));
});

app.use(express.static("./client"));

io.on("connection", socket => { //вызывается, когда сокет подключен к серверу
  socket.on("set username", username => {
    users.push(username); //берет имя текущего пользователя
    socket.username = username;
    socket.broadcast.emit("system new", socket.username); //передать сообщение или данные всем пользователям, кроме тех, которые делают запрос
  });
  socket.on("message", message => {
    //берет сообщение текущего пользователя
    const data = { //создаем обьект и туда записуем текущие данные
      username: socket.username,
      message
    };
    db.run(
      `INSERT INTO messages VALUES (NULL, '${socket.username}', '${message} \n')`
    );
    io.emit("render message", data); //передаем введенные данные на всех клиентов
  });
  socket.on("disconnect", () => {
    users.splice(users.indexOf(socket.username), 1);
  });
});

server.listen(port, () => { //когда сервер работает, выводится сообщение
  console.log("listening on *:" + port);
});
