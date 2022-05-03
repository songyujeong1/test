<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>정산유형</label>
    <el-select v-model="value.calcType" size="small" @change="onHandleDataChange">
      <el-option label="파라곤" value="P" />
      <el-option label="TAVI" value="T" />
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'calcType',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    Object.assign(this.value, {calcType: 'P'});
  },
  methods: {
  }
};
</script>
