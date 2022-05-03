<template>
<div class="col-md-2" :style="getStyle()">
  <div class="form-group">
    <label>예약번호</label>
    <el-input placeholder="" size="small" v-model="value.bookingCode" maxlength="12" @change="onHandleDataChange" clearable/>
  </div>
</div>
</template>
<script>
import { conditionMixin } from '../conditionMixin';

export default {
  name: 'bookingCode',
  mixins: [conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {bookingCode: this.field.defaultValue});
    }
  }
};
</script>
