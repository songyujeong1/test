<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>PG구분</label>
    <el-select v-model="pgType" placeholder="전체" size="small" @change="onHandleDataChange" clearable>
      <el-option v-for="item in options" :key="item.detailCode" :label="item.detailCodeNameKr" :value="item.detailCode" />
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
// import { includes } from 'lodash';

export default {
  name: 'pgType',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    this.initializeComponent();
  },
  data() {
    return {
      pgType: ''
    };
  },
  watch: {
    pgType(newValue) {
      this.value.pgType = newValue;
    }
  },
  methods: {
    initializeComponent() {
      this.getDetailCodeList('9010').then((payload) => {
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
