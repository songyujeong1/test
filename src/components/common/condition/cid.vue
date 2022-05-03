<template>
<div class="col-md-2" :style="getStyle()">
  <div class="form-group">
    <label>CID</label>
    <!-- <el-input placeholder="" size="small" v-model="value.cid" maxlength="12" @change="onHandleDataChange" clearable/> -->
    <el-select v-model="value.cid" placeholder="전체" size="small" @change="onHandleDataChange" clearable>
      <el-option v-for="item in options" :key="item.cidKey" :label="item.cidName" :value="item.cidKey" />
    </el-select>
  </div>
</div>
</template>
<script>
import { conditionMixin } from '../conditionMixin';
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';

export default {
  name: 'cid',
  mixins: [conditionMixin, commonCodeServiceMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {cid: this.field.defaultValue});
    }
    this.initializeComponent();
  },
  methods: {
    async initializeComponent() {
      //  this.options = await this.getCidInfoAsync(); // 정산 사용 CID 명확히 실별 되지 않아서 하드코딩, 식별되면 쿼리타고 가져오도록 변경
      this.options = [
        {
          cidKey: 488461,
          cidName: 488461 //  P_STAND_ALONE
        },
        {
          cidKey: 488462,
          cidName: 488462 //  P_PKG
        },
        {
          cidKey: 489062,
          cidName: 489062 //  P_MOD
        },
        {
          cidKey: 600462,
          cidName: 600462
        },
        {
          cidKey: 600466,
          cidName: 600466
        }
      ];
    }
  }
};
</script>
