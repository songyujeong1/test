<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>정산상태</label>
    <el-select v-model="calcProcState" size="small" @change="onHandleDataChange" :clearable="clearable">
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
  name: 'calcProcState',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      this.calcProcState = this.field.defaultValue;
    } else {
      this.calcProcState = '93000001';
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
      calcProcState: '',
      clearable: false
    };
  },
  watch: {
    calcProcState(newValue) {
      this.value.calcProcState = newValue;
    }
  },
  methods: {
    initializeComponent() {
      this.getDetailCodeList('9300').then((payload) => {
        this.options = payload.data;
        if (this.field.removeCode) {
          this.removeGroupCode(this.options, this.field.removeCode);
          this.removeGroupCode(this.options, ['93000006']);
        } else {
          this.removeGroupCode(this.options, ['93000004', '93000009', '93000006']);
        }

        if (this.field.disableCode) {
          this.disableCode(this.options, this.field.disableCode);
        }
      });
    }
  }
};
</script>
