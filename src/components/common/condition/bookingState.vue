<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>예약상태</label>
    <el-select v-model="bookingState" placeholder="전체" size="small" @change="onHandleDataChange" clearable>
      <el-option v-for="item in options" :key="item.detailCode" :label="item.detailCodeNameKr" :value="item.detailCode" />
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
import { includes } from 'lodash';

export default {
  name: 'bookingState',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      /* Object.assign(this.value, {bookingState: this.field.defaultValue}); */
      this.bookingState = this.field.defaultValue;
    } else {
      const pageName = this.getPageName();
      const salesMenu = ['psalescalc', 'csalescalc', 'pcancelfeecheck'];
      if (includes(salesMenu, pageName)) {
        this.bookingState = '40200001';
      }
    }
    this.initializeComponent();
  },
  data() {
    return {
      bookingState: ''
    };
  },
  watch: {
    bookingState(newValue) {
      this.value.bookingState = newValue;
    }
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
