<template>
  <div class="col-md-2" :style="getStyle()">
    <div class="form-group">
      <label>오류/불일치 유형</label>
      <el-select v-model="value.errorUpperState" placeholder="전체" size="small" @change="onHandleDataChange" clearable>
        <el-option v-for="item in options" :key="item.detailCode" :label="item.detailCodeNameKr" :value="item.detailCode"/>
      </el-select>
    </div>
  </div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'errorUpperState',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, { calcProcState: this.field.defaultValue });
    }

    this.initializeComponent();
  },
  methods: {
    async initializeComponent() {
      this.options = await this.getDetailCodeListAsync('9200');
      if (this.field.removeCode) this.removeGroupCode(this.options, this.field.removeCode);
    }
  }
};
</script>
