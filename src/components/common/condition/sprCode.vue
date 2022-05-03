<template>
<div class="col-md-2" :style="getStyle()">
  <div class="form-group">
    <label>공급사</label>
    <fr-autocomplete size="small" :style="'float:left;width:' + (useCountryCode === true ? '60%' : '100%')"
      ref="input"
      v-model="value.clientCode"
      :fetch-suggestions="onHandleFetchSuggestions"
      :debounce="500"
      :trigger-on-focus="false"
      :hide-loading="false"
      :selectedItem="value"
      placeholder="공급사 (거래처)"
      valueMemberPath="clientCode"
      displayMemberPath="sprNameKr"
      @select="onHandleSprSelect"
      @change="onHandleDataChange"/>
      <div ref="inputNext" />
  </div>
</div>
</template>
<script>
import { conditionMixin } from '../conditionMixin';
import axios from 'axios';

export default {
  name: 'sprClientCode',
  mixins: [conditionMixin],
  props: {
    useCountryCode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cancel: null
    };
  },
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {sprName: this.field.defaultValue});
    }
  },
  methods: {
    onHandleFetchSuggestions(query, cb) {
      if (this.useCountryCode === true && this.isEmpty(this.countryCode)) {
        messageBox.show('', '국가를 선택하여 주시기 바랍니다.');
        return;
      }
      if (this.cancel) {
        this.cancel();
      }

      if ( this.isEmpty(query) || query.length < 1) {
        return;
      }

      const data = {
        taviYn: this.isTavi === true ? 'Y' : 'N',
        nationCode: this.countryCode,
        sprName: query
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

      this.httpGet('/api/common/code/supplierClientCode', data, option).then(result => {
        cb(result.data);
      });
    },
    onHandleSprSelect(item) {
      if ( this.isEmpty(item)) {
        this.value.clientCode = '';
        this.value.sprNameKr = '';
      } else {
        this.value.clientCode = item.sprCode;
        this.value.sprNameKr = item.sprNameKr;
      }
      this.$emit('change', item);
    }
  }
};
</script>
