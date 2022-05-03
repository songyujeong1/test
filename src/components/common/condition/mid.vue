<template>
  <div class="col-md-1" :style="getStyle()">
    <div class="form-group">
      <label>이니시스MID</label>
      <el-select v-model="value.mid" placeholder="전체" size="small" @change="onHandleDataChange" clearable>
        <el-option v-for="item in options" :key="item.detailCode" :label="item.detailCodeNameKr" :value="item.detailCodeNameKr"/>
      </el-select>
    </div>
  </div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'mid',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (
      this.isInitializeValue === true &&
      this.field &&
      this.field.defaultValue
    ) {
      Object.assign(this.value, { mide: this.field.defaultValue });
    }

    this.initializeComponent();
  },
  methods: {
    async initializeComponent() {
      this.options = await this.getDetailCodeListAsync('9040');
      if (this.field.removeCode) {
        this.removeGroupCode(this.options, this.field.removeCode);
      }
    }
  }
};
</script>
