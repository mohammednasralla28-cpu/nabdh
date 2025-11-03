// main.js
import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import router from "./router";
// mitt
import mitt from "mitt";
const emitter = mitt();
// pinia
import { createPinia } from "pinia";
// swiper
import "swiper/css";
import "swiper/css/pagination";
const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(router);
app.provide("emitter", emitter);
app.mount("#app");
