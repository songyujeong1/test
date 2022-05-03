<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>지급유형</label>
    <el-select v-model="value.invoiceType" placeholder="전체" size="small" @change="onHandleDataChange" clearable>
      <el-option v-for="item in options" :key="item.detailCode" :label="item.detailCodeNameKr" :value="item.detailCode" />
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';

export default {
  name: 'invoiceType',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {invoiceType: this.field.defaultValue});
    }
    this.initializeComponent();
  },
  methods: {
    initializeComponent() {
      const code = this.isTavi === true ? '9330' : '9350'; // 9330 INVOICE/VCC/CTS || 9350 XML/TAVI
      this.getDetailCodeList(code).then((payload) => {
        this.options = payload.data;
      });
    }
  }
};
</script>
