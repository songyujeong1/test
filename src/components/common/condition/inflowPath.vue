<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>유입경로</label>
    <el-select v-model="value.inflowPath" placeholder="선택" size="small" @change="onHandleDataChange">
      <el-option v-for="item in options" :key="item.detailCode" :label="item.detailCodeNameKr" :value="item.detailCode" />
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'paymentState',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.localeType) {
      Object.assign(this.value, {inflowPath: this.field.defaultValue});
    }

    this.initializeComponent();
  },
  methods: {
    async initializeComponent() {
      this.options = await this.getDetailCodeListAsync('3050');
    }
  }
};
</script>
