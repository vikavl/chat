const express = require("express");
const http = require("http");

const app = express();
const server = http.Server(app);
const port = process.env.PORT || 3000;
const io = require("socket.io")(server); //вебсокет с расширенными функциями; подключили наш сокет к серверу

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

app.use(express.static("./client"));

io.on("connection", socket => { //подключение к сокету 
  socket.on("set username", username => { //(считка с сервера) настройка имени для даного сокета (как связь между сервером и юзером)
    socket.username = username;
    io.emit("new user", socket.username); //отправка на клиент
  });
});

server.listen(port, () => {
  console.log("listening on *:" + port);
});
