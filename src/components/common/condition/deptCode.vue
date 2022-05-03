<template>
<div class="col-md-0" :style="getStyle()">
  <div class="form-group">
    <fr-autocomplete size="small"
      ref="input"
      v-model="value.deptCode"
      :fetch-suggestions="onHandleFetchSuggestions"
      :debounce="500"
      :trigger-on-focus="false"
      :hide-loading="false"
      :selectedItem="value"
      placeholder="부서를 검색하세요."
      valueMemberPath="deptCode"
      displayMemberPath="deptName"
      @select="onHandleDeptSelect"
      @change="onHandleDataChange"/>
      <div ref="inputNext" />
  </div>
</div>
</template>
<script>
import { conditionMixin } from '../conditionMixin';
import axios from 'axios';

export default {
  name: 'deptCode',
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
      Object.assign(this.value, {deptName: this.field.defaultValue});
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
        deptCode: query
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

      this.httpPost('/api/common/code/deptCode', data, option).then(result => {
        cb(result.data);
      });
    },
    onHandleDeptSelect(item) {
      if (this.isEmpty(item)) {
        this.value.deptCode = '';
        this.value.deptName = '';
      } else {
        this.value.deptCode = item.deptCode;
        this.value.deptName = item.deptName;
      }
      this.$emit('change', item);
    },
    setData(dept) {
      this.$refs.input.onHandleClear();
      this.$refs.input.fireSelected(dept);
      this.value.deptCode = dept.deptCode;
      this.value.deptName = dept.deptName;
      this.$emit('change', dept);
    }
  }
};
</script>
