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

//Initializing socket.io instance
const io = require("socket.io")(server, {
  pingTimeout: 7000,
  pingInterval: 3000,
});

/* Needed to separate rooms. 'Default' is the lobby room. */
let rooms = [],
  users = {},
  currentRoom = "default";

io.on("connection", function (socket) {
  /* Setting first socket data for logged in user */
  socket.on("LOG_IN", function ({ user }) {
    socket.user = user;
    users[user] = user;
    socket.room = currentRoom;
    rooms[user] = "room-" + user;
    socket.join(rooms[user]);

    io.emit("USER_LOGGED_IN", { user, users });
  });

  /* Emitting messages and room receptor respectively */
  socket.on("SEND_MESSAGE", function (data) {
    io.emit("MESSAGE", data);
  });

  /* Updating room on switch at moment to select a new user */
  socket.on("CHANGE_ROOM", function (user) {
    currentRoom = "room-" + user;
    socket.leave(socket.room);
    socket.join(currentRoom);
    socket.room = currentRoom;
  });

  /* Handling disconnect event */
  socket.on("DISCONNECT", function () {
    delete users[socket.user];
    io.emit("UPDATE_USERS", users);
    socket.broadcast.emit("DISCONNECT_CHAT", socket.user);
    socket.leave(socket.room);
  });
});
