import Vue from 'vue';
import Router from 'vue-router';

import notFoundComponent from '@/components/notFoundComponent';

import home from '@/pages/home';
import login from '@/pages/login';
import iConPage from '@/pages/iconPage';
import examplePage from '@/pages/examplePage';

Vue.use(Router);

const authRequiredMata = {
  authRequired: false
};

export default new Router({
  mode: 'history',
  routes: [
    {path: '*', name: 'error.404', component: notFoundComponent},
    {path: '/', name: '/', component: home},
    {path: '/home', name: 'home', component: home},
    {path: '/login', name: 'login', component: login, meta: authRequiredMata},
    {path: '/example', name: 'example', component: examplePage},
    {path: '/icon', name: 'icon', component: iConPage}
  ]
});
