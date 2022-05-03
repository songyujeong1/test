<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>예약처리상태</label>
    <el-select v-model="value.processState" placeholder="전체" size="small" @change="onHandleDataChange">
      <el-option label="전체" value="ALL" />
      <el-option label="XML" value="XML" />
      <el-option label="TAVI" value="TAVI" />
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'processState',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {processState: this.field.defaultValue});
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
