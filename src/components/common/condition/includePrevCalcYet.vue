<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group checkbox">
    <label />
    <el-tooltip class="item" effect="light" content="이월은 검색(기간) 기준으로 이전 정보를 의미함" placement="bottom-start">
      <fr-checkbox :checked.sync="value.includePrevCalcYet" @change="onHandleDataChange" border>이월항목 포함</fr-checkbox>
    </el-tooltip>
  </div>
</div>
</template>
<script>
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'includePrevCalcYet',
  mixins: [conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {includePrevCalcYet: this.field.defaultValue});
    } else {
      Object.assign(this.value, {includePrevCalcYet: false});
    }
  }
};
</script>
