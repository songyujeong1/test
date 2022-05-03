<template>
<el-button :size="size" :type="getButtonType()" :disabled="hasPermission === false || disabled" @click="onHandleClick">
  <i :class="getIconClass()" />
  <slot />
  <slot name="dialogSlot" />
</el-button>
</template>
<script>
import { menuServiceMixin } from '@/mixins/menuServiceMixin';

export default {
  name: 'fr-button',
  mixins: [menuServiceMixin],
  props: {
    disabled: {
      default: false,
      type: Boolean,
      required: false
    },
    size: {
      default: 'small',
      type: String,
      required: false
    },
    type: {
      default: 'R',
      type: String,
      required: false
    }
  },
  data() {
    return {
      hasPermission: false
    };
  },
  mounted() {
    this.setPermission(1);
  },
  methods: {
    getIconClass: function() {
      switch (this.type) {
        case 'R':
          return 'icon-search4';
        case 'C':
          return 'icon-database-check';
        case 'U':
          return 'icon-database-arrow';
        case 'D':
          return 'el-icon-delete';
        case 'S':
          return 'el-icon-check';
        default:
          return '';
      }
    },
    getButtonType: function() {
      switch (this.type) {
        case 'R':
          return 'primary';
        case 'C':
        case 'U':
        case 'L':
          return 'success';
        case 'D':
        case 'K' :
          return 'danger';
        case 'S':
          return '';
        default:
          return '';
      }
    },
    setPermission(count) {
      const menuInfo = this.getCurrentMenu();
      if (count < 3 && this.isEmpty(menuInfo) && this.isEmpty(this.$store.getters.userMenus)) {
        console.log('console', count);
        setTimeout(() => {
          this.setPermission(++count);
        }, 1000);
        return;
      }
      // C 생성/U 수정/D 삭제/E 엑셀/R 조회/L 예약잠금/K 잠금해제
      if ((this.type === 'C' || this.type === 'U' || this.type === 'D' || this.type === 'E' || this.type === 'L' || this.type === 'K') && menuInfo.writeYn === 'Y') {
        this.hasPermission = true;
      } else if (this.type === 'R' && (menuInfo.readYn === 'Y' || menuInfo.writeYn === 'Y')) {
        this.hasPermission = true;
      } else if (this.type === 'E' && menuInfo.readYn === 'Y') {
        this.hasPermission = true;
      } else {
        this.hasPermission = false;
      }
    },
    onHandleClick(e) {
      this.$emit('click', e);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-button--small {
  height: 33px;
}
</style>
