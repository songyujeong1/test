<template>
<div class="col-md-1" :style="getStyle()">
  <div class="form-group">
    <label>통화</label>
    <el-select v-model="value.currencyCode" placeholder="선택" size="small" @change="onHandleDataChange" clearable>
      <el-option v-for="item in options" :key="item.exchangeUnit" :label="item.detailCodeNameKr" :value="item.detailCode" />
    </el-select>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
export default {
  name: 'currencyCode',
  mixins: [commonCodeServiceMixin, conditionMixin],
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {currencyCode: this.field.defaultValue});
    }

    this.options = [
      {detailCode: 'AED', detailCodeNameKr: 'AED'},
      {detailCode: 'AUD', detailCodeNameKr: 'AUD'},
      {detailCode: 'BDT', detailCodeNameKr: 'BDT'},
      {detailCode: 'BHD', detailCodeNameKr: 'BHD'},
      {detailCode: 'BND', detailCodeNameKr: 'BND'},
      {detailCode: 'BRL', detailCodeNameKr: 'BRL'},
      {detailCode: 'CAD', detailCodeNameKr: 'CAD'},
      {detailCode: 'CHF', detailCodeNameKr: 'CHF'},
      {detailCode: 'CLP', detailCodeNameKr: 'CLP'},
      {detailCode: 'CNY', detailCodeNameKr: 'CNY'},
      {detailCode: 'CZK', detailCodeNameKr: 'CZK'},
      {detailCode: 'DKK', detailCodeNameKr: 'DKK'},
      {detailCode: 'DZD', detailCodeNameKr: 'DZD'},
      {detailCode: 'EGP', detailCodeNameKr: 'EGP'},
      {detailCode: 'EUR', detailCodeNameKr: 'EUR'},
      {detailCode: 'GBP', detailCodeNameKr: 'GBP'},
      {detailCode: 'HKD', detailCodeNameKr: 'HKD'},
      {detailCode: 'HUF', detailCodeNameKr: 'HUF'},
      {detailCode: 'IDR', detailCodeNameKr: 'IDR'},
      {detailCode: 'ILS', detailCodeNameKr: 'ILS'},
      {detailCode: 'INR', detailCodeNameKr: 'INR'},
      {detailCode: 'JOD', detailCodeNameKr: 'JOD'},
      {detailCode: 'JPY', detailCodeNameKr: 'JPY'},
      {detailCode: 'KES', detailCodeNameKr: 'KES'},
      {detailCode: 'KRW', detailCodeNameKr: 'KRW'},
      {detailCode: 'KWD', detailCodeNameKr: 'KWD'},
      {detailCode: 'KZT', detailCodeNameKr: 'KZT'},
      {detailCode: 'LKR', detailCodeNameKr: 'LKR'},
      {detailCode: 'MNT', detailCodeNameKr: 'MNT'},
      {detailCode: 'MOP', detailCodeNameKr: 'MOP'},
      {detailCode: 'MXN', detailCodeNameKr: 'MXN'},
      {detailCode: 'MYR', detailCodeNameKr: 'MYR'},
      {detailCode: 'NOK', detailCodeNameKr: 'NOK'},
      {detailCode: 'NZD', detailCodeNameKr: 'NZD'},
      {detailCode: 'OMR', detailCodeNameKr: 'OMR'},
      {detailCode: 'PHP', detailCodeNameKr: 'PHP'},
      {detailCode: 'PKR', detailCodeNameKr: 'PKR'},
      {detailCode: 'PLN', detailCodeNameKr: 'PLN'},
      {detailCode: 'QAR', detailCodeNameKr: 'QAR'},
      {detailCode: 'RUB', detailCodeNameKr: 'RUB'},
      {detailCode: 'SAR', detailCodeNameKr: 'SAR'},
      {detailCode: 'SEK', detailCodeNameKr: 'SEK'},
      {detailCode: 'SGD', detailCodeNameKr: 'SGD'},
      {detailCode: 'THB', detailCodeNameKr: 'THB'},
      {detailCode: 'TRY', detailCodeNameKr: 'TRY'},
      {detailCode: 'TWD', detailCodeNameKr: 'TWD'},
      {detailCode: 'USD', detailCodeNameKr: 'USD'},
      {detailCode: 'VND', detailCodeNameKr: 'VND'},
      {detailCode: 'ZAR', detailCodeNameKr: 'ZAR'}
    ];
  }
};
</script>
