import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import routes from './router';

import './styles/main.scss'; // Подключаем SCSS

const app = createApp(App);
const router = createRouter({
  history: createWebHistory(), routes
});

app.use(router);
app.use(createPinia());
app.mount('#app');