<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          DQR Tech
        </q-toolbar-title>

        <div>🚀 Eduardo Cappellotto</div>
      </q-toolbar>
    </q-header>


    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';




export default defineComponent({
  name: 'MainLayout',



  setup() {


    return {


    }
  }
});
</script>
