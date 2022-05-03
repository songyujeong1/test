<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>국내/해외</label>
    <el-select v-model="value.localeType" placeholder="전체" size="small" @change="onHandleDataChange" clearable>
      <el-option v-for="item in options" :key="item.detailCode" :label="item.detailCodeNameKr" :value="item.detailCode" />
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'localeType',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.localeType) {
      Object.assign(this.value, {localeType: this.field.defaultValue});
    }

    this.options = this.getLocaleType();
  }
};
</script>
