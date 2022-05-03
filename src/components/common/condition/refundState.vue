<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>환불상태</label>
    <el-select v-model="value.refundState" placeholder="전체" size="small" @change="onHandleDataChange" clearable>
      <el-option label="Y" value="Y" />
      <el-option label="N" value="N" />
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'refundState',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {refundState: this.field.defaultValue});
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
