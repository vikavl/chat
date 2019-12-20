const express = require("express"); //подключить express
const http = require("http");

const app = express();
const server = http.Server(app);
const port = process.env.PORT || 3000;
const io = require("socket.io")(server); //вебсокет с расширенными функциями; подключили наш сокет к серверу
const db = require("./db.js");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

app.get('/db', (req, res) => {   
  db.all('SELECT * FROM messages', (err, rows) => {
    res.send(rows);
  });
});

app.use(express.static("./client"));

io.on("connection", socket => {
  //вызывается, когда сокет подключен к серверу
  socket.on("set username", username => {
    //берет имя текущего пользователя
    socket.username = username;
    socket.broadcast.emit("system new", socket.username); //передать сообщение или данные всем пользователям, кроме тех, которые делают запрос
  });
  socket.on("message", message => {
    //берет сообщение текущего пользователя
    const data = {
      //создаем обьект ии туда записуем текущие данные
      username: socket.username,
      message
    };
    db.run(
      `INSERT INTO messages VALUES (NULL, '${socket.username}', '${message} \n')`
    );
    io.emit("render message", data); //передаем введенные данные на всех клиентов
  });
});

server.listen(port, () => {
  //когда сервер работает, выводится сообщение
  console.log("listening on *:" + port);
});
