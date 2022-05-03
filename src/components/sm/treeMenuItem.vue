<template>
<span class="custom-tree-button-area">
  <fr-togglebutton
    style="width:70px;"
    :checkedValue.sync="data.dummy"
    @click="() => onHandlePermissionDummyClick(data)">
    None
  </fr-togglebutton>
  <fr-togglebutton
    :checkedValue.sync="data.readYn"
    @click="() => onHandlePermissionReadClick(data)">
    Read Only
  </fr-togglebutton>
  <fr-togglebutton
    style="width:70px;"
    :checkedValue.sync="data.writeYn"
    @click="() => onHandlePermissionWriteClick(data)">
    All
  </fr-togglebutton>
</span>
</template>
<script>
export default {
  props: {
    data: Object,
    default: {}
  },
  methods: {
    onHandlePermissionDummyClick() {
      const tmp = {
        dummy: this.data.dummy,
        readYn: this.data.readYn,
        writeYn: this.data.writeYn
      };

      if (this.data.dummy === 'Y') {
        tmp.readYn = 'N';
        tmp.writeYn = 'N';
      }

      this.$emit('click', {data: Object.assign(this.data, tmp)});
    },
    onHandlePermissionReadClick() {
      const tmp = {
        dummy: this.data.dummy,
        readYn: this.data.readYn,
        writeYn: this.data.writeYn
      };

      if (this.data.readYn === 'Y') {
        tmp.dummy = 'N';
        tmp.writeYn = 'N';
      } else if (this.data.readYn === 'N' && this.data.writeYn === 'N') {
        tmp.dummy = 'Y';
      }

      this.$emit('click', {data: Object.assign(this.data, tmp)});
    },
    onHandlePermissionWriteClick() {
      const tmp = {
        dummy: this.data.dummy,
        readYn: this.data.readYn,
        writeYn: this.data.writeYn
      };

      if (this.data.writeYn === 'Y') {
        tmp.dummy = 'N';
        tmp.readYn = 'N';
      } else if (this.data.readYn === 'N' && this.data.writeYn === 'N') {
        tmp.dummy = 'Y';
      }

      this.$emit('click', {data: Object.assign(this.data, tmp)});
    }
  }
};
</script>
