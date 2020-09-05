import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";

const app = express();

// Middleware
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const history = require("connect-history-api-fallback");
app.use(history());
app.use(express.static(path.join(__dirname, "public")));

app.set("port", process.env.PORT || 3000);
const server = app.listen(app.get("port"), () => {
  console.log("Server listening on port " + app.get("port"));
});

const io = require("socket.io")(server, {
  pingTimeout: 7000,
  pingInterval: 3000,
});

let rooms = [],
  users = {},
  currentRoom = "default",
  currentUserRecep = null;

io.on("connection", function (socket) {
  socket.on("LOG_IN", function ({ user }) {
    socket.user = user;
    users[user] = user;
    console.log(users);
    socket.room = currentRoom;
    rooms[user] = "room-" + user;
    socket.join(rooms[user]);
    socket.broadcast.to(rooms[user]);
    // .emit("UPDATE_CHAT", "SERVER", user + " está en línea contigo!");
    console.log(socket.user);

    io.emit("USER_LOGGED_IN", { user, users });
  });
  socket.on("SEND_MESSAGE", function (data) {
    io.sockets
      .in(socket.room)
      .emit("UPDATE_CHAT", socket.user, data.message, currentUserRecep);
    io.emit("MESSAGE", data);
  });
  socket.on("CHANGE_ROOM", function (user) {
    currentUserRecep = user;
    console.log(socket.user);
    currentRoom = "room-" + user;
    socket.leave(socket.room);
    socket.join(currentRoom);
    socket.room = currentRoom;
    // socket.emit("UPDATE_CHAT", "SERVER", "Has iniciado un chat con " + user);
    // socket.broadcast
    //   .to(currentRoom)
    //   .emit("UPDATE_CHAT", "SERVER", socket.user + " está en línea contigo!");
  });

  socket.on("DISCONNECT", function () {
    delete users[socket.user];
    io.sockets.emit("UPDATE_USERS", users);
    socket.broadcast.emit("DISCONNECT_CHAT", socket.user);
    socket.leave(socket.room);
  });
});
