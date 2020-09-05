<template>
  <v-row v-if="userSelected">
    <v-col>
      <v-list three-line dense class="pt-0">
        <template v-for="(message, index) in messagesList">
          <v-row :key="index">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  style="font-size: 16px"
                  :class="
                    userSelected == message.user ? 'text-left' : 'text-right'
                  "
                  v-html="message.user"
                ></v-list-item-title>

                <v-chip
                  :id="`chip-${index + 1}`"
                  pill
                  dark
                  label
                  :color="
                    userSelected == message.user
                      ? 'blue lighten-3'
                      : 'blue-grey darken-1'
                  "
                  >{{ message.message }}</v-chip
                >
              </v-list-item-content>
            </v-list-item>
          </v-row>
        </template>
      </v-list>
    </v-col>
  </v-row>
  <v-row align="center" justify="center" v-else>
    <v-col cols="12" class="text-center">
      <v-img
        class="mx-auto"
        :src="messagesBackground"
        max-height="450"
        max-width="500"
      ></v-img>
      <v-btn
        v-if="$vuetify.breakpoint.mobile"
        color="primary"
        @click="$emit('sidebar')"
        >Let's start chatting!</v-btn
      >
    </v-col>
  </v-row>
</template>

<script>
import messagesBackground from "@/assets/messages.png";

export default {
  props: ["userSelected", "messagesList"],
  data: () => ({
    messagesBackground: messagesBackground,
  }),
};
</script>
