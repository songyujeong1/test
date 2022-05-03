<template>
<div class="col-md-2" :style="getStyle()">
  <div class="form-group">
    <label>대사정보 유형</label>
    <el-select v-model="mappingType" size="small" @change="onHandleDataChange" clearable>
      <el-option v-for="item in options" :key="item.detailCode" :label="item.detailCodeNameKr" :value="item.detailCode" :disabled="item.disabled"/>
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';

export default {
  name: 'mappingType',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      this.mappingType = this.field.defaultValue;
    }
    this.initializeComponent();
  },
  // created() {
  data() {
    return {
      mappingType: ''
    };
  },
  // },
  watch: {
    mappingType(newValue) {
      this.value.mappingType = newValue;
    }
  },
  methods: {
    initializeComponent() {
      this.getDetailCodeList('9400').then((payload) => {
        this.options = payload.data;
        if (this.field.removeCode) {
          this.removeGroupCode(this.options, this.field.removeCode);
        }
        if (this.field.disableCode) {
          this.disableCode(this.options, this.field.disableCode);
        }
      });
    }
  }
};
</script>
