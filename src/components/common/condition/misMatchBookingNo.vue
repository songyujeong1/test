<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group checkbox">
    <label />
    <fr-checkbox :checked.sync="value.misBookingNoYn" activeValue="Y" inactiveValue="N" @change="onHandleDataChange">예약번호 누락</fr-checkbox>
  </div>
</div>
</template>
<script>
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'misMatchBookingNo',
  mixins: [conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {misBookingNoYn: this.field.defaultValue});
    }
  }
};
</script>
