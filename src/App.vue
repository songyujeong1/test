<template>
     <div class="app">
    <div class="header">
      <header-bar></header-bar>
    </div>
    <div class="page-container routerView fullHeight">
      <div class="page-content fullHeight">
        <div class="content-wrapper fullHeight">
          <div class="content fullHeight">
            <transition>
              <router-view></router-view>
            </transition>
            <div class="footer text-muted">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import store from '@/store';
import headerBar from '@/components/HeaderBar';
import { menuServiceMixin } from '@/mixins/menuServiceMixin';
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';

export default {
  components: {
    headerBar
  },
  name: 'app',
  mixins: [commonCodeServiceMixin, menuServiceMixin],
  data() {
    return {
      hasExistRoute: false,
      hasHome: true,
      hasPopupWindow: null
    };
  },
  computed: {
    isAuthenticated: function() {
      if (store.getters.isAuthenticated) {
        return true;
      }

      return false;
    }
  },
  watch: {
    $route(to) {
      if (to.name === 'error.404') {
        this.hasExistRoute = false;
      } else {
        this.hasExistRoute = true;
      }

      if (to.name === '/') {
        this.hasHome = true;
      } else {
        this.hasHome = false;
      }
      this.onMenuNaviUpdate();
    }
  },
  created() {
    if (this.$route.name === 'error.404') {
      this.hasExistRoute = false;
    } else {
      this.hasExistRoute = true;
    }

    if (this.$route.name === '/') {
      this.hasHome = true;
    } else {
      this.onMenuNaviUpdate();
      this.hasHome = false;
    }

    axios.all(
      [this.getMultiDetailCodeList([
        '4020'])]
    )
      .then(axios.spread((result) => {
        let payload4020 = [];
        result.data.forEach(row => {
          switch (row.grpCode) {
            case '4020':
              payload4020 = row.detailCodeList;
              break;
            default:
              break;
          }
        });
        this.$store.dispatch('SETCODE', {
          bookingState: payload4020
        });
      }));
  },
  mounted() {
    this.onMenuNaviUpdate();
  },
  methods: {
    goPrevPage(menuInfo) {
      var params = { menuNo: menuInfo.menuNo };

      if (menuInfo.viewName === 'reserveRetrieve' && this.$route.name === 'reserveManagement') {
        params = Object.assign({}, params, this.$route.params);
      }

      this.routePush(menuInfo.viewName, params);
    },
    onNoticeView() {
      this.routePush({
        path: '/notice',
        query: { noticeNo: this.notice.noticeNo }
      });
    },
    onMenuNaviUpdate() {
      const curMenu = this.getCurrentMenu();
      this.menuPaths = curMenu ? this.getParentMenus(curMenu.menuPath) : [];
    }
  }
};
</script>

<style lang="scss">
@import './styles/common.scss';
body {
  .app {
    display: flex;
    display: -moz-box;
    display: -webkit-flexbox;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: -moz-flex;
    display: flex;
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .header {
    width: 100%;
    height: 87px;
    padding: 0px;
  }

  .routerView {
    position: relative;
    -webkit-flex: 1;
    flex: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    > .base-content-presenter {
      position: relative;
      overflow: hidden;
      height: 100%;
    }
  }
}
</style>
