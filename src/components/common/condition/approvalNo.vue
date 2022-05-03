<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>승인번호</label>
    <el-input placeholder="" size="small" v-model="value.approvalNo" maxlength="8" @change="onHandleDataChange"/>
  </div>
</div>
</template>
<script>
import { conditionMixin } from '../conditionMixin';

export default {
  name: 'approvalNo',
  mixins: [conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {approvalNo: this.field.defaultValue});
    }
  }
};
</script>
