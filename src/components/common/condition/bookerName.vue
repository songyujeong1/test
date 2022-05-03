<template>
<div class="col-md-2" :style="getStyle()">
  <div class="form-group">
    <label>예약자 정보</label>
    <div>
      <el-select v-model="value.bookingMemberType" placeholder="선택" size="small" class="fl" style="width:33%;margin-right:5px" @change="onHandleDataChange" clearable>
        <el-option label="이름" value="N" />
        <el-option label="연락처" value="T" />
        <el-option label="이메일" value="E" />
      </el-select>
      <el-input placeholder="" size="small" v-model="value.bookingMember" class="fr" style="width:calc(100% - 35%);" @change="onHandleDataChange" clearable/>
    </div>
  </div>
</div>
</template>
<script>
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'bookerName',
  mixins: [conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {bookingMemberType: this.field.defaultValue});
    }
  }
};
</script>
