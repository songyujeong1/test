<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>국가</label>
    <div>
      <el-select v-model="countryCode" placeholder="선택" size="small" @change="onHandleDataChange">
        <el-option v-for="item in countrys" :key="item.nationCode" :label="item.nationNameKr" :value="item.nationCode" />
      </el-select>
    </div>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';

export default {
  name: 'countryCode',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {countryCode: this.field.defaultValue});
    }

    this.initializeComponent();
  },
  data() {
    return {
      cancel: null,
      countryCode: null,
      countrys: null
    };
  },
  methods: {
    async initializeComponent() {
      this.countrys = await this.getCountrysAsync();
    }
  }
};
</script>
