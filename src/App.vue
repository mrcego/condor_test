<template>
  <v-app id="app">
    <login-dialog v-model="loginDialog" @set-user="setUser" />

    <users-sidebar
      v-model="usersSidebar"
      :usersList="usersList"
      :userLogged="user"
      @user-selected="selectUserToChat"
    ></users-sidebar>

    <toolbar
      :userSelected="userSelected"
      @sidebar="usersSidebar = !usersSidebar"
    />

    <v-main>
      <v-container fluid class="pt-0">
        <v-snackbar color="success" :timeout="4000" top v-model="chatAlert">
          <template>
            <v-icon>mdi-check-circle-outline</v-icon>&nbsp;
            <span v-html="alertBody" />
          </template>
        </v-snackbar>

        <messages-chat
          :messagesList="messagesList"
          :userSelected="userSelected"
          @sidebar="usersSidebar = true"
        />
      </v-container>
    </v-main>
    <sender :userSelected="userSelected" @send-message="sendMessage" />
  </v-app>
</template>

<script>
import io from "socket.io-client";
import * as easings from "vuetify/es5/services/goto/easing-patterns";

import LoginDialog from "@/components/LoginDialog";
import UsersSidebar from "@/components/UsersSidebar";
import Toolbar from "@/components/Toolbar";
import MessagesChat from "@/components/MessagesChat";
import Sender from "@/components/Sender";

export default {
  data: () => ({
    loginDialog: true,
    user: "",
    userSelected: null,
    alertBody: null,
    users: [],
    message: "",
    messages: [],
    socket: io("https://chat-condor.herokuapp.com/"),
    // socket: io("localhost:3000"),
    usersSidebar: null,
    duration: 300,
    offset: 0,
    easing: "easeInOutCubic",
    easings: Object.keys(easings),
    chatAlert: false,
  }),
  created() {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("beforeunload", this.beforeWindowUnload);
  },
  mounted() {
    this.setSocketio(); // Setting initial socket.io-client setup
    this.onResize(); // To get width screen for offset value to autoscrolling on text
  },
  watch: {
    /* Watching to scroll to bottom chat list*/
    messagesList: function (val) {
      if (val.length > 0)
        setTimeout(() => {
          this.$vuetify.goTo(this.target, this.options);
        });
    },
  },
  computed: {
    target: function () {
      const value = `#chip-${this.messagesList.length}`;
      if (!isNaN(value)) return Number(value);
      else return value;
    },
    options: function () {
      return {
        duration: this.duration,
        offset: this.offset,
        easing: this.easing,
      };
    },

    /*Filter messages according chat members*/
    messagesList: function () {
      return this.messages.filter(
        (message) =>
          (message.user == this.user &&
            message.userSelected == this.userSelected) ||
          (message.user == this.userSelected &&
            message.userSelected == this.user)
      );
    },

    /*Filter users from current user dictionary to show online users */
    usersList: function () {
      return Object.fromEntries(
        Object.entries(this.users).filter(([, user]) => user != this.user)
      );
    },
  },
  components: {
    LoginDialog,
    UsersSidebar,
    Toolbar,
    MessagesChat,
    Sender,
  },
  methods: {
    setSocketio: function () {
      this.socket.on("USER_LOGGED_IN", ({ user, users }) => {
        this.users = users;
        if (user == this.user) {
          this.alertBody = `Bienvenido al chat, <strong>${user}</strong>!!`;
        } else {
          this.alertBody = `<strong>${user}</strong> ha entrado al chat!! `;
        }
        this.chatAlert = true;
      });
      this.socket.on("MESSAGE", (data) => {
        this.messages = [...this.messages, data];
        console.log(this.messages);
      });
      this.socket.on("UPDATE_CHAT", (user, data) => {
        console.log(user, data);
      });
      this.socket.on("UPDATE_USERS", (users) => {
        this.users = users;
      });
      this.socket.on("DISCONNECT_CHAT", (user) => {
        this.alertBody = `<strong>${user}</strong> se ha desconectado del chat!! `;
        this.chatAlert = true;
      });
    },

    /* Method executed when user is logged in and register in socket instance*/
    setUser: function (user) {
      this.user = user;
      this.socket.emit("LOG_IN", {
        user,
      });
    },

    /* Set active chatting user and emit room switch */
    selectUserToChat: function (user) {
      this.userSelected = user;

      if (this.$vuetify.breakpoint.mobile) this.usersSidebar = false;

      this.socket.emit("CHANGE_ROOM", user);
    },

    /* Message sender */
    sendMessage: function (message) {
      this.socket.emit("SEND_MESSAGE", {
        user: this.user,
        message,
        userSelected: this.userSelected,
      });
    },

    /* Handling disconnect event on close browser window or tab */
    beforeWindowUnload: function () {
      if (this.user) {
        this.socket.emit("DISCONNECT", {
          user: this.user,
        });
      }
    },

    onResize: function () {
      this.offset = window.innerWidth;
    },
  },

  /* Destroying listeners */
  beforeDestroy: function () {
    window.removeEventListener("beforeunload", this.beforeWindowUnload);
    window.removeEventListener("resize", this.onResize);
  },
};
</script>
