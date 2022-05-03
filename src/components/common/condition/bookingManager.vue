<template>
<div class="col-md-2" :style="getStyle()">
  <div class="form-group">
    <label>담당자</label>
    <div>
      <el-select v-model="bookingManagerType" placeholder="선택" size="small" class="fl" style="width:33%;margin-right:5px" @change="onHandleDataChange">
        <el-option label="이름" value="N" />
        <el-option label="아이디" value="I" />
      </el-select>
      <el-input placeholder="" size="small" v-model="value.bookingManager" class="fr" style="width:calc(100% - 35%);" @change="onHandleDataChange" clearable/>
    </div>
  </div>
</div>
</template>
<script>
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'bookingManager',
  mixins: [conditionMixin],
  data() {
    return {
      bookingManagerType: ''
    };
  },
  watch: {
    bookingManagerType(newValue) {
      this.value.bookingManagerType = newValue;
    }
  },
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {bookingManasgerId: this.field.defaultValue});
    }
    this.bookingManagerType = 'N';
  }
};
</script>
