<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated :class="getTheme() + ' text-white'">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="title-group">
          <q-avatar @click="changeTheme" class="logo">
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          <!-- <p class="title">{{title}}</p> -->
          <span class="title">{{title}}</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :class="getTheme() + ' text-white'"
      :width="180"
      :mini="miniMode"
    >
      <q-avatar class="q-mt-md logo">
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
      </q-avatar>
      <q-list class="q-mt-sm">
        <q-item to="/" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="apps" />
          </q-item-section>
          <q-item-section class="text-left"> My Vis-Demos </q-item-section>
        </q-item>
        <q-item to="/Dashboard2" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="account_box" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-left">About me</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2 pt-sm">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, nextTick, reactive} from "vue";
let title = 'Tinsuy Space';

const leftDrawerOpen = ref(true);
const miniMode = ref(false);
const toggleLeftDrawer = () => {
  miniMode.value = !miniMode.value;
};
const themes = [
    'bg-mytheme-blue',
    'bg-mytheme-brown'
  ];
const rdata = reactive({
  theme: 0
})
const changeTheme = async ()=>{
  rdata.theme = rdata.theme+1 < themes.length ? rdata.theme+1 : 0;
}
const getTheme = ()=>{
  return themes[rdata.theme]
}
</script>

<style scoped>
.pt-sm {
  padding-top: 0 !important;
}
.title-group {
  margin-left: -8vw;
}
.text-left {
  margin-left: -20px;
}
.title {
  font: italic .8em Georgia, serif;
  margin-left: 20px;
}
</style>
