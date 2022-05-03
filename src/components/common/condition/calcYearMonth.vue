<template>
  <div class="col-md-2" :style="getStyle()">
    <div class="form-group">
      <label>정산년월</label>
      <div>
        <el-date-picker
          class="fl"
          v-model="value.date"
          value-format="yyyy-MM"
          type="month"
          size="small"
          @change="onHandleDataChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { conditionMixin } from '../conditionMixin';
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
export default {
  name: 'calcYearMonth',
  mixins: [conditionMixin, commonCodeServiceMixin],
  mounted() {
    const toDay = this.getCurrentDate();

    if (this.isInitializeValue === true) {
      if (this.field && this.field.defaultValue) {
        Object.assign(this.value, { date: this.field.defaultValue.date });
      } else {
        Object.assign(this.value, { date: toDay.toStandardDateString().substr(0, 7) });
      }
    }
  },
  methods: {}
};
</script>
