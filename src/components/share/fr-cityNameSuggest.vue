<template>
<div>
  <fr-autocomplete size="small"
    ref="input"
    v-model="city"
    :fetch-suggestions="querySearch"
    :debounce="200"
    :trigger-on-focus="false"
    :hide-loading="false"
    placeholder="Please input"
    value-key="cityName"
    @select="handleSelect"/>
    <div ref="inputNext"></div>
</div>
</template>

<script>
import axios from 'axios';
const CancelToken = axios.CancelToken;
let cancel;

export default {
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    modelValue: {
      default: null,
      required: false
    },
    regionCode: {
      default: null,
      required: false,
      type: Number
    },
    countryCode: {
      default: null,
      required: false,
      type: String
    },
    cityCode: {
      default: null,
      required: false,
      type: Number
    },
    cityName: {
      default: null,
      required: false,
      type: String
    },
    useYn: {
      default: 'Y',
      required: false,
      type: String
    }
  },
  data() {
    return {
      city: '',
      internalCityCode: null,
      internalCityName: null,
      wasQueryString: null
    };
  },
  watch: {
    cityCode: function(newValue, oldValue) {
      if (newValue === oldValue || newValue === null) {
        return;
      }
      this.httpGet(`/api/region/kr/city/${newValue}`).then(result => {
        this.city = result.data;
      });
    }
  },
  mounted() {
    this.internalCityName = this.cityName;
    this.internalCityCode = this.cityCode;
  },
  methods: {
    querySearch(query, cb) {
      if ( cancel ) {
        cancel();
      }

      if ( this.isEmpty(this.regionCode) || this.isEmpty(this.countryCode) ) {
        messageBox.show('', '지역/국가를 먼저 선택하십시오');
        this.city = '';
        return;
      }

      if (!this.isEmpty(query) && query.length <= 1) {
        return;
      }

      const path = '/api/region/citySearch';
      const params = {
        region: this.regionCode,
        country: this.countryCode,
        lang: this.$store.getters.cultureTwoLetter,
        text: query,
        useYn: this.useYn
      };

      console.log(this.city, query);

      if (this.wasQueryString === query) {
        this.wasQueryString = null;
        this.$nextTick(function() {
          this.$refs.inputNext.focus();
        });
        return;
      }
      this.wasQueryString = query;

      var option = {
        params: params,
        encode: true,
        isLoading: false,
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        })
      };

      this.httpGet(path, option).then(result => {
        cb(result.data);
      });
    },
    handleSelect(item) {
      if ( this.isEmpty(item)) {
        this.internalCityName = '';
        this.$emit('update:cityName', '');
        this.$emit('update:cityCode', undefined);
      } else {
        this.internalCityName = item.cityName;
        this.$emit('update:cityName', item.cityName);
        this.$emit('update:cityCode', item.cityCode);
      }
      this.$emit('change', item);
    }
  }
};
</script>
