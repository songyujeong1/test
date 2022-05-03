<template>
<div class="col-md-0" :style="getStyle()">
  <div class="form-group">
    <fr-autocomplete size="small"
      ref="input"
      v-model="value.bankCode"
      :fetch-suggestions="onHandleFetchSuggestions"
      :debounce="500"
      :trigger-on-focus="false"
      :hide-loading="false"
      :selectedItem="value"
      placeholder="은행을 검색하세요."
      valueMemberPath="bankCode"
      displayMemberPath="disPlayBankName"
      @select="onHandleBankSelect"
      @change="onHandleDataChange"/>
      <div ref="inputNext" />
  </div>
</div>
</template>
<script>
import { conditionMixin } from '../conditionMixin';
import axios from 'axios';

export default {
  name: 'bankCode',
  mixins: [conditionMixin],
  props: {
  },
  data() {
    return {
      cancel: null
    };
  },
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {bankName: this.field.defaultValue});
    }
  },
  methods: {
    onHandleFetchSuggestions(query, cb) {
      if (this.cancel) {
        this.cancel();
      }

      if (this.isEmpty(query) || query.length < 1) {
        return;
      }

      const data = {
        bankCode: query,
        bankName: query,
        localeType: 'DOM'
      };

      if (this.wasQueryString === query) {
        this.wasQueryString = null;
        this.$nextTick(function() {
          this.$refs.inputNext.focus();
        });
        return;
      }
      this.wasQueryString = query;
      var option = {
        encode: true,
        isLoading: false,
        cancelToken: new axios.CancelToken((c) => {
          this.cancel = c;
        })
      };

      this.httpPost('/api/common/code/bankCode', data, option).then(result => {
        if (!this.isEmpty(result) && !this.isEmpty(result.data)) {
          result.data.forEach(item => {
            item.disPlayBankName = `[${item.bankCode}] ${item.bankName}`;
          });
        }
        cb(result.data);
      });
    },
    onHandleBankSelect(item) {
      if (this.isEmpty(item)) {
        this.value.bankCode = '';
        this.value.bankName = '';
        this.value.bankAccnt = '';
      } else {
        this.value.bankCode = item.bankCode;
        this.value.bankName = item.bankName;
        this.value.bankAccnt = item.bankAccnt;
      }
      this.$emit('change', item);
    },
    setData(bank) {
      this.$refs.input.onHandleClear();
      this.$refs.input.fireSelected(bank);
      this.value.bankCode = bank.bankCode;
      this.value.bankName = bank.bankName;
      this.value.bankAccnt = bank.bankAccnt;
      this.$emit('change', bank);
    }
  }
};
</script>
