<template>
<div class="col-md-3" :style="getStyle()">
  <div class="form-group">
    <label>정산상태</label>
    <el-select v-model="value.calcProcStateList" placeholder="전체" size="small" @change="onHandleDataChange" multiple filterable default-first-option>
      <el-option v-for="item in options" :key="item.detailCode" :label="item.detailCodeNameKr" :value="item.detailCode" />
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'calcStateCombo',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {calcProcStateList: [this.field.defaultValue]});
    }
    this.initializeComponent();
  },
  methods: {
    initializeComponent() {
      this.getDetailCodeList('9300').then((payload) => {
        this.options = payload.data;
        this.removeGroupCode(this.options, ['93000006']);
        // this.removeGroupCode(this.options, ['40400001', '40400002', '40400003', '40400004', '40400009', '40400010', '40400011', '40400012', '40400014', '40400015', '40400016']);
      });
    }
  }
};
</script>
