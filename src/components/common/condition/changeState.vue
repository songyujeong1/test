<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>예약변경</label>
    <el-select v-model="value.changeState" placeholder="전체" size="small" @change="onHandleDataChange" clearable>
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
  name: 'changeState',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {changeState: this.field.defaultValue});
    }
  },
  methods: {
  }
};
</script>
