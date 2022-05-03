<template>
<label role="checkbox" class="el-checkbox" :class="classObject" aria-checked="true">
  <span aria-checked="mixed" class="el-checkbox__input" :class="classObject">
    <span class="el-checkbox__inner"></span>
    <input type="checkbox" aria-hidden="true" class="el-checkbox__original"
      :id="id"
      :name="name"
      :value="value"
      :class="className"
      :required="required"
      :disabled="disabled"
      :checked="state"
      @change="toggle" />
  </span>
  <span v-if="hasDefaultSlot" class="el-checkbox__label">
    <slot></slot>
  </span>
</label>
</template>

<script>
export default {
  name: 'fr-checkbox',
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    id: {
      type: String,
      default: function() {
        return 'checkbox-id-' + this._uid;
      }
    },
    indeterminate: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: null
    },
    value: {
      default: null
    },
    modelValue: {
      default: undefined
    },
    className: {
      type: String,
      default: null
    },
    checked: {
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    selectedItems: {
      type: Array
    },
    activeValue: {
      type: String,
      default: null
    },
    inactiveValue: {
      type: String,
      default: null
    },
    data: {
      type: [String, Number, Object],
      default: null
    }
  },
  data() {
    return {};
  },
  computed: {
    hasDefaultSlot () {
      return !!this.$slots.default;
    },
    classObject: function() {
      return {
        'is-checked': this.state,
        'is-indeterminate': this.state && this.indeterminate
      };
    },
    state() {
      if (this.modelValue === undefined) {
        if (this.activeValue != null && this.inactiveValue != null) {
          return this.checked === this.activeValue;
        }
        return this.checked;
      }

      if (Array.isArray(this.modelValue)) {
        return this.modelValue.indexOf(this.value) > -1;
      }

      return !!this.modelValue;
    }
  },
  methods: {
    toggle() {
      let value;

      if (Array.isArray(this.modelValue)) {
        value = this.modelValue.slice(0);

        if (this.state) {
          value.splice(value.indexOf(this.value), 1);
        } else {
          value.push(this.value);
        }
      } else {
        value = !this.state;
      }

      if (this.activeValue != null && this.inactiveValue != null) {
        this.$emit(
          'update:checked',
          value === true ? this.activeValue : this.inactiveValue
        );
        this.$emit(
          'change',
          value === true ? this.activeValue : this.inactiveValue
        );
      } else {
        this.$emit('update:checked', value);
        this.$emit('change', value, this.data);
      }
    }
  },
  watch: {
    checked(newValue) {
      let newVal = newValue === this.activeValue || newValue === true;
      if (newVal !== this.state) {
        this.toggle();
      }
    }
  },
  mounted() {
    let isChecked = this.checked === true || this.checked === this.activeValue;
    if (isChecked && !this.state) {
      this.toggle();
    }
  }
};
</script>
