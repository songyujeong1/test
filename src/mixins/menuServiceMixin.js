export const menuServiceMixin = {
  methods: {
    getUserMenus(userInfo) {
      return this.httpGet(`/api/common/menu/${userInfo.userId}`);
    },
    getMenus() {
      return this.httpGet('/api/common/menu/');
    },
    getMenu(no, name, pno, linkYn, src) {
      return {
        menuNo: no,
        menuName: name,
        parentMenuNo: pno,
        path: src || '',
        displayYn: 'Y',
        sortNo: 1,
        linkYn: linkYn,
        useYn: 'Y'
      };
    },
    getParentMenus(currntPath) {
      let currentMenu = this.$store.getters.userMenus.findBy(x => x.menuPath, currntPath);

      const menus = currentMenu ? [currentMenu] : [];

      while (currentMenu) {
        currentMenu = this.$store.getters.userMenus.findBy(x => x.menuNo, currentMenu.parentMenuNo);

        if ( currentMenu ) {
          menus.unshift(currentMenu);
        }
      }

      return menus;
    },
    async getAllMenusAsync() {
      let data;

      await this.getAllMenus().then(result => {
        data = result.data;
      });

      return data;
    }
  }
};
