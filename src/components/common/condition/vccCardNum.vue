<template>
<div class="col-md-2" :style="getStyle()">
  <div class="form-group">
    <label>카드번호</label>
    <el-select v-model="value.vccCardNum" placeholder="선택" size="small" @change="onHandleDataChange" clearable>
      <el-option v-for="item in options" :key="item.exchangeUnit" :label="item.detailCodeNameKr" :value="item.detailCode" />
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'vccCardNum',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {vccCardNum: this.field.defaultValue});
    }
    this.options = [
      {detailCode: 'B001630354', detailCodeNameKr: '신한 Virtual_2759'},
      {detailCode: 'B002122760', detailCodeNameKr: '신한 VCC_4919'},
      {detailCode: '00015', detailCodeNameKr: '현대카드 vcc_0301'},
      {detailCode: 'B002382614', detailCodeNameKr: '신한 VCC_4882'}
    ];
  }
};
</script>
