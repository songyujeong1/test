<template>
<li :class="{'hover' : dataContext.isHover === true}" @click="onHandleMouseDown">
  {{dataContext[displayMemberPath]}}
</li>
</template>

<script>
export default {
  model: {
    prop: 'dataContext',
    event: 'click'
  },
  props: {
    dataContext: {
      default: null,
      required: false
    },
    displayMemberPath: {
      default: null,
      required: false
    }
  },
  data() {
    return {
    };
  },
  methods: {
    onHandleMouseDown(e) {
      this.$emit('click', e, this.dataContext);
    }
  }
};
</script>
