<template>
<div class="col-md-2" :style="getStyle()">
  <div class="form-group">
    <label>EAN Itinerary Number</label>
    <el-input placeholder="" size="small" v-model="value.eanNumber" maxlength="12" @change="onHandleDataChange" clearable/>
  </div>
</div>
</template>
<script>
import { conditionMixin } from '../conditionMixin';

export default {
  name: 'eanNumber',
  mixins: [conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {eanNumber: this.field.defaultValue});
    }
  }
};
</script>
