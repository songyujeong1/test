<template>
  <div @dblclick="onFieldClick" class="edit-cell" ref="input">
    <div v-if="!editMode && !showInput" class="edit-cell-inner">
      <slot name="cell-template"></slot>
    </div>
    <div v-if="editMode || showInput" v-on="listeners" class="fr-editable-cell-edit-template">
      <slot name="cell-editing-template"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'fr-editable-cell',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    isPrimaryKey: {
      type: Boolean,
      default: false
    },
    toolTipContent: {
      type: String,
      default: 'Click to edit'
    },
    toolTipDelay: {
      type: Number,
      default: 500
    },
    toolTipPlacement: {
      type: String,
      default: 'top-start'
    },
    showInput: {
      type: Boolean,
      default: false
    },
    closeEvent: {
      type: String,
      default: 'blur'
    },
    canEdit: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      editMode: false
    };
  },
  computed: {
    listeners() {
      return {
        [this.closeEvent]: this.onInputExit,
        ...this.$listeners
      };
    }
  },
  methods: {
    onFieldClick() {
      if (this.canEdit) {
        this.editMode = true;
        document.addEventListener('click', this.onHandleDocumentClick, false);
        this.$nextTick(() => {
          const inputRef = this.$refs.input;

          const inputInner = inputRef.querySelector('.el-input__inner');
          if (inputInner && inputInner.focus) {
            inputInner.focus();
          }
        });
      }
    },
    onInputExit() {
      document.removeEventListener('click', this.onHandleDocumentClick, false);
      this.editMode = false;
      this.$emit('preparingCellForEdit', this.value || {});
    },
    onHandleDocumentClick(e) {
      if (!this.$refs.input.contains(e.target)) {
        this.onInputExit(e);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.edit-cell {
  &-inner {
    padding: 8px 10px;
  }
}

</style>
