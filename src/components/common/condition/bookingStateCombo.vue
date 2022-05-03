<template>
<div class="col-md-3" :style="getStyle()">
  <div class="form-group">
    <label>예약상태</label>
    <el-select v-model="value.bookingStateList" placeholder="전체" size="small" @change="onHandleDataChange" multiple filterable default-first-option>
      <el-option v-for="item in options" :key="item.detailCode" :label="item.detailCodeNameKr" :value="item.detailCode" />
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'bookingStateCombo',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {bookingStateList: [this.field.defaultValue]});
    }
    this.initializeComponent();
  },
  methods: {
    initializeComponent() {
      this.getDetailCodeList('4020').then((payload) => {
        this.options = payload.data;
        if (this.field.removeCode) {
          this.removeGroupCode(this.options, this.field.removeCode);
        }
        if (this.field.disableCode) {
          this.disableCode(this.options, this.field.disableCode);
        }
      });
    }
  }
};
</script>
