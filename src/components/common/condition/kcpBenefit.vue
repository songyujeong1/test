<template>
<div class="col-md-3" :style="getStyle()">
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
  name: 'kcpBenefit',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {paymentTypeList: this.field.defaultValue});
    }
    this.initializeComponent();
  },
  methods: {
    initializeComponent() {
      this.getDetailCodeList('4040').then((payload) => {
        this.options = payload.data;
        this.removeGroupCode(this.options, ['40400005', '40400006', '40400007', '40400008', '40400009', '40400010', '40400011', '40400012', '40400013', '40400014', '40400015', '40400016', '40400017', '40400018', '40400019', '40400020', '40400021']);
      });
    }
  }
};
</script>
