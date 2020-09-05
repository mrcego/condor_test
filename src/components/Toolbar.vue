<template>
  <v-app-bar dense app color="blue" dark>
    <v-app-bar-nav-icon
      v-if="$vuetify.breakpoint.mobile"
      @click.stop="$emit('sidebar')"
    ></v-app-bar-nav-icon>
    <v-toolbar-title>{{
      userSelected ? `Chat with ${userSelected}` : "Chat"
    }}</v-toolbar-title>
  </v-app-bar>
</template>

<script>
export default {
  props: ["userSelected"],
};
</script>
