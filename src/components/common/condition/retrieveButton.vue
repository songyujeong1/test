<template>
<div class="col-md-2 fr text-right">
  <div class="form-group" style="padding-top:21px;">
    <slot name="mainDashboardSlot"></slot>
    <fr-button size="small" type="R" @click="onHandleRetrieve">
      {{content}}
    </fr-button>
  </div>
</div>
</template>
<script>
export default {
  name: 'retrieveButton',
  props: {
    content: {
      type: String,
      default: '일괄 조회',
      required: false
    }
  },
  methods: {
    onHandleRetrieve(e) {
      this.$emit('retrieve', e);
    }
  }
};
</script>
