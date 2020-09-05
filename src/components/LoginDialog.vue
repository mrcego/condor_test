<template>
  <v-dialog v-model="loginDialog" persistent max-width="360">
    <v-card>
      <v-toolbar color="primary" dark dense elevation="0">
        <v-toolbar-title>Log-in</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text class="pt-5">
        <v-text-field
          autofocus
          v-model="user"
          hide-details
          placeholder="Type username..."
          dense
          rounded
          outlined
          single-line
          cleareable
          @keyup.enter.native="setUser"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn depressed small color="primary" @click="setUser">Log in</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["value"],
  data: () => ({
    user: null,
  }),
  computed: {
    loginDialog: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  methods: {
    /* Emitting event from child to parent */
    setUser: function () {
      this.$emit("set-user", this.user);
      this.loginDialog = false;
    },
  },
};
</script>
