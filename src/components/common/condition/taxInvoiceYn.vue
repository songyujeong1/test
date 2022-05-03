<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>세금계산서</label>
    <el-select v-model="value.taxInvoiceYn" placeholder="전체" size="small" @change="onHandleDataChange" clearable>
      <el-option v-for="item in options" :key="item.detailCode" :label="item.detailCodeNameKr" :value="item.detailCode" />
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'taxInvoiceYn',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {taxInvoiceYn: this.field.defaultValue});
    }

    this.initializeComponent();
  },
  methods: {
    initializeComponent() {
      this.options = [{detailCode: 'Y', detailCodeNameKr: 'Y'}, {detailCode: 'N', detailCodeNameKr: 'N'}];
    }
  }
};
</script>
