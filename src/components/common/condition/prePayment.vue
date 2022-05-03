<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>선지급상태</label>
    <el-tooltip class="item" effect="light" content="선지급 예약은 수불대사완료 시점에 식별됩니다." placement="bottom-start">
      <el-select v-model="value.prePaymentYn" placeholder="전체" size="small" @change="onHandleDataChange" clearable>
        <el-option v-for="item in options" :key="item.detailCode" :label="item.detailCodeNameKr" :value="item.detailCode" />
      </el-select>
    </el-tooltip>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'prePaymentYn',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {prePaymentYn: this.field.defaultValue});
    }

    this.initializeComponent();
  },
  methods: {
    initializeComponent() {
      this.options = [{detailCode: 'Y', detailCodeNameKr: '선지급'}, {detailCode: 'N', detailCodeNameKr: '비선지급'}];
    }
  }
};
</script>
