<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group checkbox">
    <label />
    <fr-checkbox :checked.sync="value.misPriceYn" activeValue="Y" inactiveValue="N" @change="onHandleDataChange">차액발생</fr-checkbox>
  </div>
</div>
</template>
<script>
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'misMatchPrice',
  mixins: [conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {misPriceYn: this.field.defaultValue});
    }
  }
};
</script>
