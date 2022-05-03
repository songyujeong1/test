<template>
<div class="col-md-6" :style="getStyle()">
  <div class="form-group">
    <label>결제/혜택</label>
    <el-select v-model="value.paymentTypeList" placeholder="선택" size="small" @change="onHandleDataChange" multiple filterable default-first-option>
      <el-option v-for="item in options" :key="item.detailCode" :label="item.detailCodeNameKr" :value="item.detailCode" />
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'paymentTypes',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {paymentTypeList: this.field.defaultValue});
    }
    this.initializeComponent();
  },
  props: {
    codes: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    initializeComponent() {
      this.getDetailCodeList('4040').then((payload) => {
        this.options = this.selectGroupCode(payload.data, this.field.selectValues);
      });
    }
  }
};
</script>
