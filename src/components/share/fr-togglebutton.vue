<template>
 <button @click="onToggle" class="fr-togglebutton" :class="classObject"><slot></slot></button>
</template>
<script>
export default {
  name: 'fr-togglebutton',
  model: {
    prop: 'modelValue',
    event: 'click'
  },
  props: {
    id: {
      type: String,
      default: function() {
        return 'togglebutton-id-' + this._uid;
      }
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
      type: Boolean,
      default: false
    },
    checkedValue: {
      type: String,
      default: 'N'
    },
    required: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    model: {}
  },
  data() {
    return {
      selected: false
    };
  },
  computed: {
    classObject: function() {
      return {
        'fr-togglebutton-selected': this.selected || this.checked,
        'fr-togglebutton-readonly': this.readonly
      };
    }
  },
  watch: {
    checked(newValue) {
      this.selected = newValue;
    },
    checkedValue(newValue) {
      this.selected = newValue === 'Y';
    }
  },
  methods: {
    onToggle() {
      if (this.readonly === true) {
        return;
      }
      this.selected = !this.selected;
      this.$emit('update:checkedValue', this.selected ? 'Y' : 'N');
      this.$emit('update:checked', this.selected);
      this.$emit('click', this.selected);
    }
  },
  mounted() {
    if (this.checked) {
      this.selected = this.checked;
    }

    if (this.checkedValue === 'N') {
      this.selected = false;
    } else if ( this.checkedValue === 'Y') {
      this.selected = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.fr-togglebutton {
  display: inline-block;
  padding: 0 10px;
  height: 32px;
  line-height: 30px;
  font-size: 12px;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #999999;
  border: 1px solid #999999;
  white-space: nowrap;
  color: #fff;
  user-select: none;
  cursor: pointer;
  &:hover {
    background: #999999;
    border-color: #999999;
    color: #fff;
    opacity: 0.5;
  }

  &-selected {
    background-color: #337ecc;
    border-color: #337ecc;
    color: #fff;
  }
  &-selected:hover {
    background: #337ecc;
    border-color: #337ecc;
    color: #fff;
    opacity: 0.5;
  }
  &-readonly {
    pointer-events: none;
  }
}
</style>
