<template>
<div class="col-md-2" :style="getStyle()">
  <div class="form-group">
    <label>호텔명</label>
    <fr-autocomplete size="small" :style="'float:left;width:' + (useCountryCode === true ? '60%' : '100%')"
      ref="input"
      v-model="value.htlMasterId"
      :fetch-suggestions="onHandleFetchSuggestions"
      :debounce="300"
      :trigger-on-focus="false"
      :hide-loading="false"
      placeholder="호텔명"
      valueMemberPath="htlMasterId"
      displayMemberPath="htlNameKr"
      @select="onHandleCitySelect"/>
      <div ref="inputNext" />
  </div>
</div>
</template>
<script>
import { conditionMixin } from '../conditionMixin';
import axios from 'axios';

export default {
  name: 'hotelName',
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
      Object.assign(this.value, {htlName: this.field.defaultValue});
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
        htlName: query
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

      this.httpGet('/api/common/code/hotels', data, option).then(result => {
        cb(result.data);
      });
    },
    onHandleCitySelect(item) {
      if ( this.isEmpty(item)) {
        this.value.htlMasterId = '';
      } else {
        this.value.htlMasterId = item.htlMasterId;
      }
      this.$emit('change', item);
    }
  }
};
</script>
