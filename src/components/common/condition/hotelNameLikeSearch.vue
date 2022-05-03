<template>
<div class="col-md-2" :style="getStyle()">
  <div class="form-group">
    <label>호텔(시설)명</label>
    <el-input placeholder="" size="small" v-model="value.htlName" maxlength="30" @change="onHandleDataChange" clearable/>
  </div>
</div>
</template>
<script>
import { conditionMixin } from '../conditionMixin';

export default {
  name: 'hotelNameLikeSearch',
  mixins: [conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {htlName: this.field.defaultValue});
    }
  }
};
</script>
