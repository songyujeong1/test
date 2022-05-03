<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>유입채널</label>
    <el-select v-model="value.salesType" placeholder="전체" size="small" @change="onHandleDataChange" clearable>
      <el-option v-for="item in options" :key="item.detailCode" :label="item.detailCodeNameKr" :value="item.detailCode" />
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'salesType',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {salesType: this.field.defaultValue});
    }

    this.initializeComponent();
  },
  methods: {
    initializeComponent() {
      this.getDetailCodeList('3020').then((payload) => {
        this.options = payload.data;
        if (this.field.removeCode) {
          this.removeGroupCode(this.options, this.field.removeCode);
        }
      });
    }
  }
};
</script>
