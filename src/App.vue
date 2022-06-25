<script lang="ts" setup>
import HelloWorld from './components/HelloWorld.vue'
import { Authenticator } from '@aws-amplify/ui-vue'
import '@aws-amplify/ui-vue/styles.css'
</script>

<template>
  <v-app>
    <authenticator>
      <template v-slot="{ user, signOut }">
        <v-container>
          <h1>Hello {{ user.username }}!</h1>
          <v-btn color="secondary" @click="signOut">Sign Out</v-btn>
        </v-container>
        <v-main>
          <HelloWorld />
        </v-main>
      </template>
    </authenticator>
  </v-app>
</template>
