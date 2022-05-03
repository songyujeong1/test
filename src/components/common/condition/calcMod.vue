<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>예약잠김</label>
    <el-select v-model="value.calcModYn" placeholder="전체" size="small" @change="onHandleDataChange" clearable>
      <el-option label="Y" value="N" /> <!-- N 이 예약잠김 -->
      <el-option label="N" value="Y" />
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'calcModYn',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
  },
  methods: {
  }
};
</script>
