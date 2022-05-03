<template>
  <div class="navbar">
    <div class="navbar-header">
      <router-link to="/" class="navbar-brand">
         <img src="/static/images/tidesquarelogo.png" alt="toact 정산" style="max-width: 150px;height:auto" />
      </router-link>
    </div>
    <div class="navbar-collapse collapse" id="navbar-mobile" style="height:87px !important;">
      <menu-navigation />
      <ul class="nav navbar-nav navbar-right">
        <li class="dropdown dropdown-user">
          <a class="dropdown-toggle disabled" data-toggle="dropdown" data-hover="dropdown">
            <span>{{$store.getters.userInfo.userName}}({{$store.getters.userInfo.userId}})</span>
          </a>
        </li>
        <li class="dropdown">
          <a @click="onHandleLogout">
            <i class="icon-switch"></i>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import locale from 'element-ui/lib/locale';
import kolocale from 'element-ui/lib/locale/lang/ko';
import menuNavigation from '@/components/menuNavigation';
export default {
  components: {
    menuNavigation
  },
  data() {
    return {
      isChangedPasswordVisibility: false,
      language: null,
      input: null
    };
  },
  beforeCreate() {
    locale.use(kolocale);
    this.$i18n.locale = 'ko';
  },
  methods: {
    goHome() {
      this.routePush({ path: '/' });
    },
    onHandleLogout(e) {
      console.log(e);
      e.preventDefault();

      messageBox.show('', '로그아웃 하시겠습니까?', 'YesNo').then(dialog => {
        if (dialog === 'yes') {
          this.$store
            .dispatch('LOGOUT')
            .then(() => this.$router.push('/login?returnPath=/'));
        }
      });
    }
  }
};
</script>
<style lang="scss">
.navbar {
  height: 87px;
}
.changed-pwd-modal {
  margin: 0px !important;
  width: 320px;
  right: 10px;
  top: 50px;
  position: absolute;
}
</style>
