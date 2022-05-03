<template>
  <div>
    <slot />
  </div>
</template>
<script>
export default {
  name: 'fr-table-column',
  props: {
    align: {
      type: String
    },
    colspan: {
      type: [String, Number],
      default: 1
    },
    fixed: {
      type: Boolean
    },
    formatter: {
      type: Function,
      default: null
    },
    func: {
      type: Function,
      default: null
    },
    headerAlign: {
      type: String,
      default: 'center'
    },
    isMerge: {
      type: Boolean,
      default: false
    },
    label: {
      type: String
    },
    lastFill: {
      type: Boolean,
      default: false
    },
    mergeColum: {
      type: String,
      default: null
    },
    parentField: {
      type: String,
      default: null
    },
    postContent: {
      type: String,
      default: null
    },
    prop: {
      type: String
    },
    rowspan: {
      type: [String, Number],
      default: 1
    },
    slotName: {
      type: String
    },
    type: {
      type: String
    },
    width: {
      type: [String, Number]
    },
    showOverflowTooltip: {
      type: Boolean,
      default: false
    },
    sortColumn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tag: 'fr-table-column',
      isAllSelect: false,
      columns: []
    };
  },
  created() {
    if ( this.$parent.tag === 'fr-table-column') {
      this.tag = 'fr-table-column1';
    } else if ( this.$parent.tag === 'fr-table-column1' ) {
      this.tag = 'fr-table-column2';
    }
  },
  mounted() {
    if ( this.$parent.addColumn) {
      this.$parent.addColumn({
        align: this.type === 'select' ? 'center' : this.align || 'left',
        columns: this.columns,
        formatter: this.formatter,
        flexWidth: this.lastFill ? '0 0 100%' : '0 0 ' + this.getColumnWidth() + 'px',
        fixed: this.fixed === true,
        func: this.func || null,
        isMerge: this.isMerge,
        label: this.label,
        lastFill: this.lastFill,
        headerAlign: this.headerAlign,
        mergeColum: this.mergeColum,
        parentField: this.parentField,
        postContent: this.postContent,
        prop: this.prop,
        slotName: this.slotName,
        type: this.type || 'text',
        width: this.getColumnWidth(),
        showOverflowTooltip: this.showOverflowTooltip,
        sortColumn: this.sortColumn
      });
    }
  },
  methods: {
    addColumn(column) {
      this.columns.push(column);
    },
    handleAllSelectChanged(e) {
      this.$parent.onHandleAllSelectedChanged(e, {checked: this.isAllSelect});
    },
    getClassName() {
      const _colspan = Number(this.colspan);
      const _rowspan = Number(this.rowspan);

      if ( _colspan > 1 || _rowspan > 1) {
        if (this.columns.length > 0) {
          return 'header-row-span-1';
        }

        return `header-row-span-${_rowspan}`;
      }

      return '';
    },
    getColumnFixedWidth() {
      if ( this.lastFill === true ) {
        return '0 0 100%';
      }

      let width = 0;
      this.columns.forEach(x => {
        width += x.width;
      });

      if ( width === 0 ) {
        width = this.getColumnWidth();
      }

      return '0 0 ' + width + 'px';
    },
    getColumnWidth() {
      if ( this.lastFill === true ) {
        return 0;
      };

      if (!isNaN(this.width)) {
        return Number(this.width);
      }

      return 80;
    }
  }
};
</script>
