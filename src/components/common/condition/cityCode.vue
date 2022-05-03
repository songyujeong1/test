<template>
<div class="col-md-2" :style="getStyle()">
  <div class="form-group">
    <label>도시</label>
    <div>
      <el-select v-if="useCountryCode === true" v-model="countryCode" placeholder="선택" size="small" style="float:left;width:calc(40% - 5px);">
        <el-option v-for="item in countrys" :key="item.nationCode" :label="item.nationNameKr" :value="item.nationCode" />
      </el-select>
      <div v-if="useCountryCode === true" style="float:left;width:5px">
        &nbsp;
      </div>
      <fr-autocomplete size="small" :style="'float:left;width:' + (useCountryCode === true ? '60%' : '100%')"
        ref="input"
        v-model="value.cityMasterId"
        :fetch-suggestions="onHandleFetchSuggestions"
        :debounce="300"
        :trigger-on-focus="false"
        :hide-loading="false"
        placeholder="도시명"
        valueMemberPath="cityMasterId"
        displayMemberPath="cityNameKr"
        @select="onHandleCitySelect"/>
        <div ref="inputNext" />
    </div>
  </div>
</div>
</template>
<script>
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { conditionMixin } from '../conditionMixin';
import axios from 'axios';

export default {
  name: 'cityCode',
  mixins: [commonCodeServiceMixin, conditionMixin],
  props: {
    useCountryCode: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (this.isInitializeValue === true && this.field && this.field.defaultValue) {
      Object.assign(this.value, {cityMasterId: this.field.defaultValue});
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
    },
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
        nationCode: this.countryCode,
        cityName: query
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

      this.httpGet('/api/common/code/city', data, option).then(result => {
        cb(result.data);
      });
    },
    onHandleCitySelect(item) {
      if ( this.isEmpty(item)) {
        this.value.cityMasterId = '';
      } else {
        this.value.cityMasterId = item.cityMasterId;
      }
      this.$emit('change', item);
    }
  }
};
</script>
