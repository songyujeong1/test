<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>취소수수료 발생</label>
    <el-select v-model="value.cancelChargeYn" placeholder="전체" size="small" @change="onHandleDataChange" clearable>
      <el-option label="발생" value="Y" />
      <el-option label="미발생" value="N" />
    </el-select>
  </div>
</div>
</template>
<script>
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'cancelChargeYn',
  mixins: [conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {cancelChargeYn: this.field.defaultValue});
    }
  }
};
</script>
