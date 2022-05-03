<template>
<div class="col-md-0" :style="getStyle()">
  <div class="form-group">
    <fr-autocomplete size="small"
      ref="input"
      v-model="value.draftNo"
      :fetch-suggestions="onHandleFetchSuggestions"
      :debounce="500"
      :trigger-on-focus="false"
      :hide-loading="false"
      :selectedItem="value"
      placeholder="기안번호 or 기안명을 입력하세요."
      valueMemberPath="draftNo"
      displayMemberPath="title"
      @select="onHandleDraftSelect"
      @change="onHandleDataChange"/>
      <div ref="inputNext" />
  </div>
</div>
</template>
<script>
import { conditionMixin } from '../conditionMixin';
import axios from 'axios';

export default {
  name: 'draftNo',
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
      Object.assign(this.value, {title: this.field.defaultValue});
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
        title: query,
        draftNo: query
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

      this.httpPost('/api/common/code/draftNo', data, option).then(result => {
        if (!this.isEmpty(result) && !this.isEmpty(result.data)) {
          result.data.forEach(item => {
            item.title = `[${item.draftNo}] ${item.title}`;
          });
        }
        cb(result.data);
      });
    },
    onHandleDraftSelect(item) {
      if (this.isEmpty(item)) {
        this.value.draftNo = '';
        this.value.draftKey = '';
        this.value.title = '';
      } else {
        this.value.draftNo = item.draftNo;
        this.value.draftKey = item.draftKey;
        this.value.title = item.title;
      }
      this.$emit('change', item);
    },
    setData(draft) {
      this.$refs.input.onHandleClear();
      this.$refs.input.fireSelected(draft);
      this.value.draftNo = draft.draftNo;
      this.value.draftKey = draft.draftKey;
      this.value.title = draft.title;
      this.$emit('change', draft);
    }
  }
};
</script>
