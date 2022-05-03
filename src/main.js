import 'es6-promise/auto';
import Vue from 'vue';
import App from './App';
import router from './router';

import IdleVue from 'idle-vue';

import UUID from 'vue-uuid';
import i18n from './i18n';

import ElementUi from 'element-ui';
import InfiniteLoading from 'vue-infinite-loading';
import messageBox from './plugins/messageBox';
import prototypeExtend from './plugins/prototypeExtend';
import filterExtend from './plugins/filterExtend';

import store from './store';

import SharedComponent from './components';

import './assets/js/json.date-extensions.js';
import './assets/js/array.prototype.js';

JSON.useDateParser();

const eventsHub = new Vue();

Vue.use(UUID);
Vue.use(prototypeExtend);
Vue.use(filterExtend);
Vue.use(messageBox);
Vue.use(SharedComponent);
Vue.use(ElementUi);
Vue.use(InfiniteLoading);
Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  idleTime: 5400000
});
Vue.config.productionTip = process.env.NODE_ENV === 'production';
// Vue.config.errorHandler = function (err, vm, info) {
//   console.error(err);
//   window.messageBox.show(vm.$vnode.tag, `[${info}] - ${err.message || ''}<br />${(err.stack || '').replace(/(\r\n|\n|\r)/g, '<br />')}`, 'Ok', 'error');
// };

router.beforeEach(function (to, from, next) {
  const hasAuthenticated = store.getters.isAuthenticated;

  if (to.matched.some(function(routeInfo) {
    let isAuthRequired = !routeInfo.meta.hasOwnProperty('authRequired') || routeInfo.meta.authRequired;
    return hasAuthenticated || !isAuthRequired;
  })) {
    return next();
  }
  next(`/login?returnPath=${to.fullPath}`);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  components: {
    App
  },
  template: '<App/>',
  created() {
    document.addEventListener('beforeunload', this.handler);
    document.title = process.env.TITLE;
    document.querySelector("link[rel='icon']").href = process.env.FAVICON;
  },
  onIdle() {
    if ( store.getters.isAuthenticated) {
      window.messageBox.show('', '장시간 미사용으로 인해 자동 로그아웃 되었습니다.');
      store.dispatch('LOGOUT').then(() => this.$router.push('/login?returnPath=/'));
    }
  },
  onActive() {
  },
  methods: {
    handler: function handler() {
      delete localStorage.accessToken;
      delete localStorage.userinfo;
    }
  }
});
