<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>결재유형</label>
    <el-select v-model="value.paymentType" placeholder="전체" size="small" @change="onHandleDataChange">
      <el-option value="XML" label="카드결재" />
      <el-option value="TAVI" label="현글결재" />
      <el-option value="TAVI" label="복합결재" />
      <el-option value="TAVI" label="미결재" />
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
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {paymentType: this.field.defaultValue});
    }

    this.initializeComponent();
  },
  methods: {
    async initializeComponent() {
      this.options = await this.getDetailCodeListAsync('4050');
    }
  }
};
</script>
