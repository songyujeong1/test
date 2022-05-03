<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>공급사체인</label>
    <el-select v-model="value.upperClientCode" placeholder="전체" size="small" @change="onHandleDataChange" clearable>
      <el-option v-for="item in options" :key="item.detailCode" :label="item.detailCodeNameKr" :value="item.detailCode" />
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'upperClientCode',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.upperClientCode) {
      Object.assign(this.value, {upperClientCode: this.field.defaultValue});
    }

    this.options = this.getUpperClientCode();
  }
};
</script>
