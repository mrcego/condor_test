<template>
  <v-navigation-drawer v-model="usersSidebar" app>
    <v-list v-if="Object.keys(users).length > 0">
      <v-subheader class="title">Chats</v-subheader>
      <v-list-item
        v-for="(user, index) in users"
        link
        :key="index"
        @click="selectUserToChat(user)"
      >
        <v-list-item-action class="mr-1">
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ user }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-row v-else align="center" justify="center">
      <v-col class="mx-auto">
        <v-subheader class="title">No hay más usuarios conectados</v-subheader>
      </v-col>
    </v-row>
    <template v-slot:append>
      <v-list-item>
        <v-list-item-action class="mr-1">
          <v-icon>mdi-account-circle</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Bienvenido, {{ userLogged }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: ["value", "usersList", "userLogged"],
  computed: {
    usersSidebar: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    users: function () {
      return this.usersList;
    },
  },
  methods: {
    /* Emitting event from child to parent */
    selectUserToChat: function (user) {
      this.$emit("user-selected", user);
    },
  },
};
</script>
