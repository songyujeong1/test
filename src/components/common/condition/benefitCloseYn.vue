<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>혜택마감여부</label>
    <el-select v-model="value.closeYn" placeholder="선택" size="small" @change="onHandleDataChange" clearable>
      <el-option v-for="item in options" :key="item.exchangeUnit" :label="item.detailCodeNameKr" :value="item.detailCode" />
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'benefitCloseYn',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {closeYn: this.field.defaultValue});
    }
    this.options = [
      {detailCode: 'Y', detailCodeNameKr: '마감'},
      {detailCode: 'N', detailCodeNameKr: '미마감'}
    ];
  }
};
</script>
