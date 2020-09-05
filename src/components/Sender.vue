<template>
  <v-footer height="75" app inset color="blue" v-if="userSelected">
    <v-row>
      <v-col cols="10" sm="11" md="11" lg="11">
        <v-text-field
          ref="message"
          autofocus
          v-model="message"
          hide-details
          placeholder="Type something here..."
          dense
          rounded
          outlined
          dark
          single-line
          cleareable
          @keyup.enter.native.prevent="sendMessage"
        ></v-text-field>
      </v-col>
      <v-col cols="2" sm="1" md="1" lg="1">
        <v-spacer></v-spacer>
        <v-btn @click="sendMessage" large right icon dark>
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  props: ["userSelected"],
  data: () => ({
    message: null,
  }),
  watch: {
    userSelected: function (val) {
      if (val) setTimeout(() => this.$refs.message.focus());
    },
  },
  methods: {
    sendMessage: function () {
      this.$emit("send-message", this.message);
      this.message = "";
      setTimeout(() => this.$refs.message.focus());
    },
  },
};
</script>
