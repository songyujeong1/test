<template>
  <div class="el-input el-input--small" :class="disabled === true ? 'is-disabled': ''">
    <input
        type="text"
        class="el-input__inner"
        :class="'text-' + textAlign"
        :disabled="disabled"
        v-model="currentInputValue"
        @blur="handleBlur"
        @focus="handleFocus"
        @change="handleInputChange"
    />
</div>
</template>
<script>
export default {
  name: 'fr-input-number',
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    id: {
      type: String,
      default: function() {
        return 'fr-input-number' + this._uid;
      }
    },
    size: {
      type: String,
      default: ''
    },
    controls: {
      type: Boolean,
      default: true
    },
    ifErrorkeepState: {
      type: Boolean,
      default: false
    },
    disabled: Boolean,
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    modelValue: {
      type: Number,
      default: undefined
    },
    step: {
      type: Number,
      default: 1
    },
    defaultValue: {
      type: Number,
      default: undefined
    },
    canUseZero: {
      type: Boolean,
      default: false
    },
    textAlign: {
      type: String,
      default: 'center'
    }
  },
  data() {
    return {
      currentInputValue: null,
      beforeInputValue: null
    };
  },
  watch: {
    modelValue: function(newValue) {
      this.beforeInputValue = this.currentInputValue;

      if ( isNaN(newValue) || (newValue === 0 && this.canUseZero === false)) {
        this.currentInputValue = '';
      } else {
        this.currentInputValue = Number(newValue).toLocaleString();
      }
    }
  },
  mounted() {
    if ( isNaN(this.modelValue) || this.modelValue === 0) {
      this.currentInputValue = this.defaultValue == null ? '' : this.defaultValue;
      this.beforeInputValue = this.defaultValue == null ? '' : this.defaultValue;
    } else {
      this.currentInputValue = Number(this.modelValue);
      this.beforeInputValue = Number(this.modelValue);
    }
  },
  methods: {
    handleBlur(event) {
      // this.setCurrentValue(this.currentInputValue);
      this.$emit('blur', event);
    },
    handleFocus(event) {
      this.$emit('focus', event);
    },
    handleInputChange() {
      if (!this.isEmpty(this.currentInputValue)) {
        this.currentInputValue = this.currentInputValue.replace(/,/g, '');
      }

      const newVal =
        this.currentInputValue.trim() === ''
          ? undefined
          : Number(this.currentInputValue);

      if (!isNaN(newVal) && newVal >= this.min && newVal <= this.max) {
        this.setCurrentValue(newVal);
      } else {
        if (this.ifErrorkeepState === false) {
          if (this.isEmpty(this.defaultValue)) {
            this.currentInputValue = '';
            this.setCurrentValue(null);
          } else {
            this.currentInputValue = this.defaultValue;
            this.setCurrentValue(this.defaultValue);
          }
        } else {
          this.currentInputValue = this.beforeInputValue;
          this.setCurrentValue(this.beforeInputValue);
        }
      }
    },
    setCurrentValue(newVal) {
      this.$emit('update:modelValue', Number(newVal));
      this.$emit('change', Number(newVal));
    }
  }
};
</script>
