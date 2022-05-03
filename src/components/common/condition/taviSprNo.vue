<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>TAVI CMS 공급사</label>
    <el-select v-model="taviSprNo" size="small" @change="onHandleDataChange" :clearable="clearable">
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
  name: 'taviSprNo',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      this.taviSprNo = this.field.defaultValue;
    } else {
      this.taviSprNo = null;
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
      taviSprNo: '',
      clearable: false
    };
  },
  watch: {
    taviSprNo(newValue) {
      this.value.taviSprNo = newValue;
    }
  },
  methods: {
    initializeComponent() {
      const removeCode = this.field.removeCode;
      this.options = [
        {detailCode: '2', detailCodeNameKr: 'Derby'},
        {detailCode: '3', detailCodeNameKr: 'TlLincoln'},
        {detailCode: '5', detailCodeNameKr: 'SiteMinder'},
        {detailCode: '7', detailCodeNameKr: 'SanHa'}
      ];

      if (!this.isEmpty(removeCode)) {
        this.removeGroupCode(this.options, removeCode);
      }
    }
  }
};
</script>
