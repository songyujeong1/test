<template>
<div class="col-md-12">
  <div class="form-group">
    <fr-autocomplete size="small" :style="'float:left;width:100%'"
      ref="input"
      v-model="userId"
      :fetch-suggestions="onHandleFetchSuggestions"
      :debounce="500"
      :trigger-on-focus="false"
      :hide-loading="false"
      placeholder="담당자 검색"
      valueMemberPath="userId"
      displayMemberPath="userName"
      @select="onHandleManagerSelect"/>
      <div ref="inputNext" />
  </div>
</div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'manager-search-form',
  data() {
    return {
      cancel: null,
      userId: '',
      userName: ''
    };
  },
  mounted() {
  },
  methods: {
    onHandleFetchSuggestions(query, cb) {
      if (this.cancel) {
        this.cancel();
      }

      if ( this.isEmpty(query) || query.length < 1) {
        return;
      }

      const data = {userName: query};

      if (this.wasQueryString === query) {
        this.wasQueryString = null;
        this.$nextTick(function() {
          if (!this.isEmpty(this.$refs.inputNext)) this.$refs.inputNext.focus();
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

      this.httpGet('/api/common/code/managerCode', data, option).then(result => {
        cb(result.data);
      });
    },
    onHandleManagerSelect(item) {
      this.$emit('change', item);
    }
  }
};
</script>
