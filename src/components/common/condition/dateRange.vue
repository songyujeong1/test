<template>
<div class="col-md-3" :style="getStyle()">
  <div class="form-group">
    <label>날짜</label>
    <el-date-picker v-model="value.dateRange" value-format="yyyy-MM-dd" type="daterange" range-separator="~" start-placeholder="시작일" end-placeholder="종료일" size="small" @change="onHandleDataChange"/>
  </div>
</div>
</template>
<script>
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'dateRange',
  mixins: [conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {dateRange: this.field.defaultValue});
    }
  }
};
</script>
