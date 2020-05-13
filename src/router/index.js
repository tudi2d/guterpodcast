import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import LoginCallback from "../views/LoginCallback.vue";
import Impressum from "../views/Impressum.vue";
import { LOGIN_CALLBACK_URL } from "../../utils/SpotifyAuthentification";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    props: true
  },
  {
    path: LOGIN_CALLBACK_URL,
    name: "Login",
    component: LoginCallback
  },
  {
    path: "/impressum",
    name: "Impressum",
    component: Impressum
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
