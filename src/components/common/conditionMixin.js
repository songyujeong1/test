export const conditionMixin = {
  props: {
    field: {
      type: Object
    },
    isInitializeValue: {
      default: true,
      type: Boolean
    },
    isTavi: {
      default: false,
      type: Boolean
    },
    value: {
      default: null,
      type: Object
    }
  },
  data() {
    return {
      options: []
    };
  },
  methods: {
    getStyle() {
      const style = {};
      if ( this.field && this.field.width ) {
        Object.assign(style, {width: this.field.width + '%'});
      }

      return style;
    },
    onHandleDataChange() {
      this.$emit('change', {data: this.value});
    }
  }
};
