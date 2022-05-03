<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>공급사</label>
    <el-select v-model="value.sprId" placeholder="전체" size="small" @change="onHandleDataChange" clearable>
      <el-option v-for="item in options" :key="item.sprCode" :label="item.sprNameKr" :value="item.sprId" />
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'sprId',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {sprId: this.field.defaultValue});
    }

    this.initializeComponent();
  },
  methods: {
    async initializeComponent() {
      this.options = await this.getSupplierinfoAsync(this.isTavi === true ? 'Y' : 'N');
    }
  }
};
</script>
