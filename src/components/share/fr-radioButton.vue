<template>
<label role="radio" aria-checked="true" tabindex="0" class="el-radio" :class="classObject">
  <span class="el-radio__input" :class="classObject">
    <span class="el-radio__inner">
    </span>
    <input type="radio" aria-hidden="true" tabindex="-1" class="el-radio__original"
      :id="id"
      :name="name"
      v-model="computedValue"
      :value="value"
      :required="required"
      :disabled="disabled"
       @change="updateInput">
  </span>
  <span class="el-radio__label">
    <slot></slot>
  </span>
</label>
</template>
<script>
export default {
  name: 'fr-radio',
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    id: {
      type: String,
      default: function() {
        return 'radio-id-' + this._uid;
      }
    },
    value: {
      type: String
    },
    modelValue: {
      default: null
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    required: {
      type: Boolean,
      required: false,
      default: false
    },
    name: {
      type: String,
      required: false
    }
  },
  computed: {
    computedValue: {
      get: function() {
        return this.modelValue;
      },
      set: function(newValue) {
        this.$emit('update:modelValue', newValue);
      }
    },
    classObject: function() {
      return { 'is-checked': this.shouldBeChecked };
    },
    shouldBeChecked: function() {
      return this.modelValue === this.value;
    }
  },
  methods: {
    updateInput() {
      this.$emit('change', this.value);
    }
  }
};
</script>
