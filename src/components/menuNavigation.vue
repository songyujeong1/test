<template>
<div class="nav navbar-nav">
  <ul class="nav navbar-nav navbar-right top-level-menu">
    <li v-for="(menu) in this.$store.getters.treeMenu" :key="menu.menuNo" class="dropdown" v-show="menu.displayYn === 'N'">
      <router-link :to="menu.menuPath || ''" class="dropdown-toggle">{{menu.menuName}}</router-link>
      <ul v-if="isEmpty(menu.children) !== true" class="second-level-menu dropdown-menu dropdown-menu-left">
        <li v-for="(smenu) in menu.children" :key="smenu.menuNo" :class="isEmpty(smenu.children) === true ? '' : 'dropdown-submenu'" >
          <router-link :to="smenu.menuPath || ''">{{smenu.menuName}}</router-link>
          <ul v-if="isEmpty(smenu.children) !== true" class="third-level-menu dropdown-menu dropdown-menu-left">
            <li v-for="(tmenu) in smenu.children" :key="tmenu.menuNo" :class="isEmpty(tmenu.children) === true ? '' : 'dropdown-submenu'">
              <router-link :to="tmenu.menuPath || ''">{{tmenu.menuName}}</router-link>
              <ul v-if="isEmpty(tmenu.children) !== true" class="four-level-menu dropdown-menu dropdown-menu-left">
                <li v-for="(fmenu) in tmenu.children" :key="fmenu.menuNo">
                  <router-link :to="fmenu.menuPath || ''">{{fmenu.menuName}}</router-link>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</div>
</template>
<script>
import { menuServiceMixin } from '@/mixins/menuServiceMixin';

export default {
  name: 'menuNavigation',
  mixins: [menuServiceMixin],
  data() {
    return {
      menus: null,
      activeIndex: null
    };
  },
  methods: {
    hasDisplayMenu(menuInfo) {
      let hasChild = false;
      if (menuInfo.children) {
        menuInfo.children.forEach(function(item) {
          if (item.linkYn === 'Y' && item.displayYn === 'Y') {
            hasChild = true;
          } else {
            if (item.children) {
              item.children.forEach(function(leafMenu) {
                if (leafMenu.linkYn === 'Y' && leafMenu.displayYn === 'Y') {
                  hasChild = true;
                }
              });
            }
          }
        });
      }

      return hasChild === true;
    },
    pushRoute(menuInfo) {
      this.routePush(menuInfo.viewName, { menuNo: menuInfo.menuNo });
    }
  }
};
</script>

<style lang="scss" scoped>

.top-level-menu {
  .dropdown {
    height: 87px;
    >a {
      height: 87px;
    }
  }
  li
  {
      position: relative;
  }
  li:hover {
    > ul {
      display: inline !important;
    }
  }

  .second-level-menu {
    position: absolute;
    background-color: #fff;
    top: 85px;
    left: 0;
    width: 210px;
    list-style: none;
    padding: 0;
    margin: 0;
    display: none;
    .third-level-menu {
      position: absolute;
      top: 0;
      left: 210px;
      width: 210px;
      list-style: none;
      padding: 0;
      margin: 0;
      display: none;
      .four-level-menu {
        position: absolute;
        top: 0;
        left: 210px;
        width: 210px;
        list-style: none;
        padding: 0;
        margin: 0;
        display: none;
      }
    }
  }
}
</style>
