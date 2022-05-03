<template>
<div class="col-md-3">
  <div class="form-group checkbox">
    <label style="padding-left:0px;">혜택별 조회</label>
    <div class="inblock checkbox-group">
      <div class="fl m-r-10">
        <fr-checkbox :checked.sync="value.aocnfwjdtksdhksfy" activeValue="Y" inactiveValue="N" @change="onHandleDataChange">HCC 선할인</fr-checkbox>
      </div>
      <div class="fl m-r-10">
        <fr-checkbox :checked.sync="value.aocnfwjdtksdhksfy" activeValue="Y" inactiveValue="N" @change="onHandleDataChange">프리비아 쿠폰</fr-checkbox>
      </div>
      <div class="fl">
        <fr-checkbox :checked.sync="value.aocnfwjdtksdhksfy" activeValue="Y" inactiveValue="N" @change="onHandleDataChange">TS 이용권</fr-checkbox>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'bookingState',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
  },
  methods: {
  }
};
</script>
