<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>정산상태</label>
    <el-select v-model="feeCalcState" size="small" @change="onHandleDataChange" :clearable="clearable">
      <el-option v-for="item in options" :key="item.detailCode" :label="item.detailCodeNameKr" :value="item.detailCode" :disabled="item.disabled"/>
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
//  import store from '@/store';

export default {
  name: 'feeCalcState',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      this.feeCalcState = this.field.defaultValue;
    } else {
      this.feeCalcState = '93000006';
    }
    if (this.field.clearable) {
      this.clearable = this.field.clearable || false;
    }
    this.initializeComponent();
  },
  // created() {
  // },
  data() {
    return {
      feeCalcState: '',
      clearable: false
    };
  },
  watch: {
    feeCalcState(newValue) {
      this.value.feeCalcState = newValue;
    }
  },
  methods: {
    initializeComponent() {
      const removeCode = this.field.removeCode;
      this.getDetailCodeList('9300').then((payload) => {
        this.options = payload.data;
        this.removeGroupCode(this.options, ['93000001', '93000002', '93000009']);
        if (!this.isEmpty(removeCode)) {
          this.removeGroupCode(this.options, removeCode);
        }
      });
    }
  }
};
</script>
