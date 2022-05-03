<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>환율</label>
    <fr-input-number size="small" v-model="value.exchangeCost" :min="0" :canUseZero="true" :controls="false" textAlign="right" @change="onHandleDataChange" :disabled="hasPermission === false" />
  </div>
</div>
</template>
<script>
import { conditionMixin } from '../conditionMixin';

export default {
  name: 'exchangeCost',
  mixins: [conditionMixin],
  data() {
    return {
      hasPermission: false
    };
  },
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {exchangeCost: this.field.defaultValue});
    }
    this.value.exchangeCost = 0;
    this.setPermission();
  },
  methods: {
    setPermission() {
      const menuInfo = this.getCurrentMenu();
      if (menuInfo.writeYn === 'Y') {
        this.hasPermission = true;
      } else {
        this.hasPermission = false;
      }
    }
  }
};
</script>
