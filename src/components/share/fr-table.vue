<template>
  <div class="main-scroll" ref="mainScroll" v-observe-visibility="setSize" :style="{ width: width}">
    <div ref="mainTable" :style="{ width: '100%', position: 'relative' }" :class="{ bordered: bordered }">
      <div class="t-header">
        <div ref="tHeaderTable" :style="{overflow: 'hidden', width: 'calc(100% - ' + getScrollBarWidth() + 'px)'}">
          <div class="header-line" :style="{width: isLastFill ? '100%' : columnInfo.totalWidth + 'px'}">
            <table class="header-line-table">
              <colgroup>
                <col v-for="(column, index) in columnInfo.columns" :key="index" :style="{width: isLastFill && index === columnInfo.columns.length -1 ? '' : column.width + 'px'}" />
              </colgroup>
              <thead>
                <tr v-for="(rows, rowIndex) in columnInfo.header" :key="rowIndex">
                  <td v-for="(col, colIndex) in rows" :key="colIndex" :rowspan="col.rowspan" :colspan="col.colspan">
                    <div v-if="(useFrozenColumn === false || col.fixed === false) && col.type === 'select'" :style="{'textAlign': col.align}">
                      <el-checkbox v-if="selectionMode === 'extended'" v-model="isAllSelect" :indeterminate="isAllSelectIndeterminate" @change="onHandleAllSelectChanged" />
                      <span v-else>선택</span>
                    </div>
                    <div v-else-if="col.fixed === false && col.sortColumn !== ''" class="header-cell" :style="{'textAlign': col.align}" v-html="getHeaderLable(col)" @click="onHandleSortByColumn(col.sortColumn, col.type)"/>
                    <div v-else-if="col.fixed === false" class="header-cell" :style="{'textAlign': col.align}" v-html="getHeaderLable(col)"/>
                  </td>
                </tr>
              </thead>
            </table>
          </div>
        </div>
        <div v-if="useFrozenColumn === true" :style="{position: 'absolute', left: '0px', top: '0px', overflow: 'hidden', width: columnInfo.fixedWidth + 'px'}" >
          <div class="header-line" :style="{width: columnInfo.fixedWidth + 'px'}">
            <table class="header-line-fixed-table">
              <colgroup>
                <col v-for="(column, index) in columnInfo.fixedColumns" :key="index" :style="{width: column.width + 'px'}" />
              </colgroup>
              <thead>
                <tr v-for="(rows, rowIndex) in columnInfo.fixedHeader" :key="rowIndex">
                  <td v-for="(col, colIndex) in rows" :key="colIndex" :rowspan="col.rowspan" :colspan="col.colspan" :style="{height: col.height + 'px'}">
                    <div v-if="col.fixed === true && col.type === 'select'" :style="{'textAlign': col.align}">
                      <el-checkbox v-if="selectionMode === 'extended'" v-model="isAllSelect" :indeterminate="isAllSelectIndeterminate" @change="onHandleAllSelectChanged" />
                      <span v-else>선택</span>
                    </div>
                    <div v-else-if="col.fixed === true && col.sortColumn !== ''" class="header-cell" :style="{'textAlign': col.align}" v-html="getHeaderLable(col)" @click="onHandleSortByColumn(col.sortColumn, col.type)"/>
                    <div v-else-if="col.fixed === true" class="header-cell" :style="{'textAlign': col.align}" v-html="getHeaderLable(col)"/>
                  </td>
                </tr>
              </thead>
            </table>
          </div>
        </div>
        <div class="header-scroll-area" :style="{width: getScrollBarWidth() + 'px'}"></div>
        <div v-if="!isLoaded"><slot /></div>
      </div>
      <div class="t-container" ref="tContainer" :style="{height: columnInfo.height + 'px'}">
        <virtual-scroller class="scroller" width="100%" :items="data" :item-height="itemHeight" content-tag="div" ref="scroller" :columnWidths="columnInfo.totalWidth" :isLastFill="isLastFill" @scroll="onHandleVirutalScroll">
          <template slot-scope="props">
            <div class="item-line" :class="{selected: props.itemIndex === selectedIndex}" :style="{ height: itemHeight + 'px' }" @dblclick="onHandleDbClickItem(props.item, props.itemIndex)" @click="onHandleClickItem(props.item, props.itemIndex)">
              <div class="item-cell" v-for="(column, index) in columnInfo.columns" :key="props.index + '-' + index" :style="getCellStyle(props.index, index, column, props.data)">
                <div v-if="(useFrozenColumn === false || column.fixed === false) && getSpanRow(props.index, index, column, props.data).rowspan === 0" />
                <div v-else-if="(useFrozenColumn === false || column.fixed === false) && column.type === 'rownum'" :style="{width: '100%', 'text-align': column.align }">
                  <span class="rownum">{{ props.itemIndex + 1 }}</span>
                </div>
                <div v-else-if="(useFrozenColumn === false || column.fixed === false) && column.slotName" :style="{width: '100%', 'text-align': column.align }">
                  <slot :name="column.slotName" :row="props.item" />
                </div>
                <div v-else-if="(useFrozenColumn === false || column.fixed === false)" class="item-cell-inner" :style="{ 'text-align': column.align }">
                  <fr-table-checkbox-column v-if="column.type === 'select'" :checked.sync="props.item[column.prop]" :data="props.itemIndex" @change="onHandleRowCheckBoxClick" />
                  <a v-else-if="column.type === 'link'" @click.prevent="column.func(props.item)" class="underline">{{getValue(column, props.item)}}</a>
                  <span v-else-if="column.type === 'hightlight'" style="color:red">{{ getValue(column, props.item) }}</span>
                  <el-tooltip v-else-if="column.showOverflowTooltip === true" class="item" effect="dark" :content="getValue(column, props.item)" placement="right">
                    <span>{{ getValue(column, props.item) }}</span>
                  </el-tooltip>
                  <span v-else>{{ getValue(column, props.item) }}</span>
                </div>
              </div>
              <div class="item-cell fixed" v-for="(column, index) in columnInfo.fixedColumns" :key="'f-' + props.index + '-' + index" :class="columnInfo.fixedColumns.length -1 === index ? 'last' :''" :style="getFixedCellStyle(props.index, index, column, props.data)">
                <div v-if="getSpanRow(props.index, index, column, props.data).rowspan === 0" />
                <div v-else-if="column.type === 'rownum'" :style="{width: '100%', 'text-align': column.align }">
                  <span class="rownum">{{ props.itemIndex + 1 }}</span>
                </div>
                <div v-else-if="column.slotName" :style="{width: '100%', 'text-align': column.align }">
                  <slot :name="column.slotName" :row="props.item" />
                </div>
                <div v-else class="item-cell-inner" :style="{ 'text-align': column.align }">
                  <fr-table-checkbox-column v-if="column.type === 'select'" :checked.sync="props.item[column.prop]" :data="props.itemIndex" @change="onHandleRowCheckBoxClick" />
                  <a v-else-if="column.type === 'link'" @click.prevent="column.func(props.item)" class="underline">{{getValue(column, props.item)}}</a>
                  <span v-else>{{ getValue(column, props.item) }}</span>
                </div>
              </div>
            </div>
          </template>
        </virtual-scroller>
      </div>
    </div>
    <resize-observer @notify="setSize" />
  </div>
</template>
<script>
import VirtualScroller from './virtuaScroll/virtual-scroller';
import { Loading } from 'element-ui';
import { debounce, getColumnInfo, spanRow } from './utils';
import { ObserveVisibility } from 'vue-observe-visibility';
import { ResizeObserver } from 'vue-resize';
import { saveAs } from 'file-saver';
import 'vue-resize/dist/vue-resize.css';

export default {
  name: 'fr-table',
  directives: {
    ObserveVisibility
  },
  components: {
    VirtualScroller,
    ResizeObserver
  },
  props: {
    useRowNumber: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    bordered: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    height: {
      type: [String, Number],
      default: function() {
        return 300;
      }
    },
    hoverHighlight: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    itemHeight: {
      type: Number,
      default: function() {
        return 35;
      }
    },
    selectable: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    selectionMode: {
      type: String,
      default: 'extended'
    },
    width: {
      type: [String, Number],
      default: function() {
        return '100%';
      }
    }
  },
  data() {
    return {
      tag: 'fr-virtual-column',
      columnInfo: {
        columns: [],
        header: [],
        height: this.height,
        mergeOption: [],
        totalWidth: 100
      },
      columns: [],
      colWidth: [],
      headerMaxRows: 1,
      isAllSelectIndeterminate: false,
      isAllSelect: false,
      isLastFill: false,
      isLoaded: false,
      mainWidth: 600,
      loadingInstance: null,
      selectedIndex: -1,
      scrollLeft: 0,
      useFrozenColumn: false
    };
  },
  mounted() {
    this.setSize();

    this.isLoaded = true;
  },
  computed: {
    selection: function() {
      return this.data.filterBy(x => x.isChecked, true);
    }
  },
  watch: {
    data() {
      this.isAllSelectIndeterminate = false;
      this.isAllSelect = false;
      this.updateDebounce();
    },
    height() {
      this.setSize();
    }
  },
  methods: {
    addColumn(column) {
      if ( this.columns && this.columns.length === 0 && this.useRowNumber === true) {
        this.columns.push({
          align: 'right',
          columns: [],
          formatter: null,
          flexWidth: '0 0 60px',
          fixed: column.fixed,
          isMerge: false,
          label: '',
          lastFill: false,
          headerAlign: 'center',
          mergeColum: null,
          parentField: null,
          postContent: '',
          prop: '',
          slotName: null,
          type: 'rownum',
          width: 60
        });
      }

      this.columns.push(column);
      if ( column.lastFill ) {
        this.isLastFill = true;
      }
      if (this.useFrozenColumn === false && column.fixed === true) {
        this.useFrozenColumn = true;
      }
    },
    export(fileName) {
      this.loadingInstance = Loading.service({
        fullscreen: true,
        text: '엑셀파일 생성 중입니다. 잠시만 기다려 주십시오.',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      this.$nextTick(() => {
        setTimeout(() => {
          this.getExcelDataAsync('sheet1').then(blob => {
            this.loadingInstance.close();
            this.loadingInstance = null;
            saveAs(blob, fileName || 'data.xls');
          });
        }, 200);
      });
    },
    base64ToBlob(data, mime) {
      let base64 = window.btoa(window.unescape(encodeURIComponent(data)));
      let bstr = atob(base64);
      let n = bstr.length;
      let u8arr = new Uint8ClampedArray(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    formatTodate(val) {
      if ( val ) {
        return this.$d(val, 'd');
      }

      return '';
    },
    formatTodateTime(val) {
      if ( val ) {
        return this.$d(val, 'G');
      }

      return '';
    },
    formatTocurrency(val, unit) {
      if ( val ) {
        return this.$n(val, unit);
      }

      return '0';
    },
    getExcelDataAsync(sheetName) {
      return new Promise(resolve => {
        const html = this.getExcelData(sheetName, this.columnInfo.header);

        const blob = this.base64ToBlob(html, 'application/vnd.ms-excel');

        resolve(blob);
      });
    },
    getExcelData(sheetName, header) {
      let xlsData = '';
      xlsData += '<thead>';

      header.forEach(rows => {
        xlsData += '<tr>';
        rows.forEach(col => {
          if ( col.type !== 'select' && col.type !== 'rownum') {
            xlsData += '<th ';
            if ( col.rowspan > 1 ) {
              xlsData += 'rowspan="' + col.rowspan + '"';
            }

            if ( col.colspan > 1 ) {
              xlsData += 'colspan="' + col.colspan + '"';
            }

            xlsData += '>' + col.label.replace(/\\n/ig, ' ') + '</td>';
            xlsData += '</th>';
          }
        });
        xlsData += '</tr>';
      });

      xlsData += '</thead>';
      xlsData += '<tbody>';

      let spanInfo = null;
      this.data.forEach((item, rowIdx) => {
        xlsData += '<tr>';
        this.columnInfo.columns.map((col, columnIdx) => {
          spanInfo = this.getSpanRow(rowIdx, columnIdx, null, this.data);

          if ( col.type !== 'select' && col.type !== 'rownum') {
            if (spanInfo.rowspan !== 0) {
              xlsData += '<td';

              if (spanInfo.rowspan > 1) {
                xlsData += ' rowspan="' + spanInfo.rowspan + '" ';
              }

              xlsData += '>';
              xlsData += this.preprocessLongNum(this.getValue(col, item));

              xlsData += '</td>';
            }
          }
        });
        xlsData += '</tr>';
      });

      xlsData += '</tbody>';

      return `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${sheetName}</x:Name><x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body><table border='1px'>${xlsData}</table></body></html>`;
    },
    valueReformattedForMultilines(value) {
      if (typeof value === 'string') return value.replace(/\n/gi, '<br/>');
      else return value;
    },
    preprocessLongNum(value) {
      if (String(value).startsWith('0x')) {
        return value;
      }

      if (!isNaN(value) && value !== '') {
        if ((value > 99999999999 || value < 0.0000000000001) && isNaN(value.replace(/,/g, '').replace(/\-/g, ''))) {
          return '="' + value + '"';
        }
      }

      return value;
    },
    getHeaderLable(col) {
      if (col.label) {
        if (col.label.indexOf('\\n') < 0) {
          return col.label;
        }

        return col.label.replace(/\\n/ig, '<br />');
      }

      return col.prop || '';
    },
    getSpanRow(rowIndex, columnIndex, column, data) {
      return spanRow({rowIndex, columnIndex}, data, this.columnInfo.mergeOption);
    },
    getFixedCellStyle(rowIndex, columnIndex, column, data) {
      const option = this.useFrozenColumn === true ? this.getSpanRow(rowIndex, columnIndex, column, data) : {rowspan: 1, colspan: 1};

      let height = this.itemHeight;
      let zIndex = 10;
      let left = this.scrollLeft;

      for (let index = 0; index < columnIndex; index++) {
        left += this.columnInfo.fixedColumns[index].width;
      }

      if (option.rowspan > 1) {
        height = (this.itemHeight * option.rowspan) + 'px';
        return {
          width: column.width + 'px',
          height,
          lineHeight: height + 'px',
          zIndex,
          backgroundColor: '#fff',
          left: left + 'px'
        };
      } else if ( option.rowspan === 0) {
        return {
          width: column.width + 'px',
          left: left + 'px',
          height: '35px'
        };
      }

      return {
        width: column.width + 'px',
        left: left + 'px',
        height: '35px',
        zIndex
      };
    },
    getCellStyle(rowIndex, columnIndex, column, data) {
      const option = this.useFrozenColumn === true ? this.getSpanRow(rowIndex, columnIndex, column, data) : {rowspan: 1, colspan: 1};

      let rtnStyle = {
        flex: column.flexWidth
      };

      if ( this.useFrozenColumn === true && column.fixed) {
        return rtnStyle;
      }

      let height = this.itemHeight;

      if (option.rowspan > 1) {
        height = (this.itemHeight * option.rowspan) + 'px';

        return Object.assign(rtnStyle, {
          height,
          lineHeight: height + 'px',
          zIndex: 10,
          backgroundColor: '#fff'
        });
      }

      return rtnStyle;
    },
    getScrollBarWidth() {
      if ( this.$refs && this.$refs.scroller ) {
        return this.$refs.scroller.$el.offsetWidth - this.$refs.scroller.$el.clientWidth;
      }

      return 8;
    },
    getValue(column, row) {
      let val = column.formatter ? column.formatter(row, column) : row[column.prop];

      if ( val === null || val === undefined) {
        return '';
      }

      if (column.type === 'date') {
        val = this.formatTodate(val);
      } else if (column.type === 'dateTime') {
        val = this.formatTodateTime(val);
      } else if (column.type === 'currency') {
        val = this.formatTocurrency(val);
      }

      if (column.postContent) {
        return `${val} ${column.postContent}`;
      }

      return val;
    },
    updateDebounce() {
      if (!this.updateDebounceMethod) {
        this.updateDebounceMethod = debounce(this.update.bind(this), 100);
      }
      this.updateDebounceMethod();
    },
    update() {
      this.setSize();
    },
    onHandleClickItem(item, rowIndex) {
      this.selectedIndex = rowIndex;
      this.$emit('rowClick', item);
    },
    onHandleDbClickItem(item, rowIndex) {
      this.selectedIndex = rowIndex;
      this.$emit('rowDbClick', item);
    },
    onHandleVirutalScroll(e) {
      this.scrollLeft = this.$refs.tHeaderTable.scrollLeft = e.target.scrollLeft;
    },
    onHandleAllSelectChanged() {
      if (this.data) {
        this.data.forEach(x => {
          x.isChecked = this.isAllSelect;
        });
      }

      this.isAllSelectIndeterminate = false;
    },
    onHandleRowCheckBoxClick(checked, checkBoxRowIndex) {
      if ( this.data ) {
        if ( this.selectionMode === 'single') {
          this.data.forEach((x, index) => {
            if ( checkBoxRowIndex === index ) {
            } else if ( checkBoxRowIndex !== index && x.isChecked === true) {
              x.isChecked = false;
            }
          });
        } else {
          const checkedCount = this.data.filterBy((x) => x.isChecked, true).length;
          this.isAllSelectIndeterminate = !(this.data.length === checkedCount || checkedCount === 0);
          if ( checkedCount === 0) {
            this.isAllSelect = false;
          } else if (checkedCount === this.data.length) {
            this.isAllSelect = true;
          }
        }
      }
    },
    setSize() {
      if (!this.$refs || !this.$refs.tContainer) {
        return;
      }

      const hTableRect = this.$refs.tHeaderTable.getBoundingClientRect();

      if ( this.columns.length > 0 && this.columnInfo.columns.length === 0) {
        const tmp = this.columnInfo = getColumnInfo(this.columns, parseInt(this.height, 10), hTableRect);

        let headerHeight = 32;
        const lineBreakHeight = 21;

        tmp.header.forEach((r, rowIndex) => {
          let isLineFeed = false;
          r.forEach((c) => {
            if ( c.label && c.label.indexOf('\\n') > -1 ) {
              isLineFeed = true;
            }
          });
          if ( tmp.fixedHeader.length > rowIndex) {
            tmp.fixedHeader[rowIndex].forEach(x => {
              x.height = isLineFeed === true ? headerHeight + lineBreakHeight : headerHeight;
            });
          }
        });

        if ( tmp.fixedHeader.length === 1 && tmp.fixedHeader[0].length > 0) {
          if (tmp.fixedHeader[0][0].rowspan === 2) {
            tmp.fixedHeader[0][0].height = 65;
          } else if (tmp.fixedHeader[0][0].rowspan === 3) {
            tmp.fixedHeader[0][0].height = 99;
          }
        }
        this.columnInfo = tmp;
      }
    },
    onHandleSortByColumn(col, type) { //  컬럼 헤더 클릭시 정렬 taviCtsMapping
      this.$emit('sortByColumn', col, type);
    }
  }
};
</script>
<style lang="scss">
$default-color: #3caed2;

.main-scroll {
  width: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
  border: 1px solid #ebeef5;
  font-size: 13px;
  box-sizing: border-box;
  position: relative;

  .header-scroll-area {
    border-left: 1px solid #ebeef5;
    right: 0px;
    top: 0px;
    position: absolute;
    height: 100%;
  }
  .item-line,
  .header-line,
  .bottom-line {
    width: 100%;
    display: flex;
    flex-direction: row;
  }

  .item-line {
    position: relative;
    &:hover {
      background-color: #ecf5ff;
      .item-cell {
        background-color: #ecf5ff !important;
      }
    }
  }

  .item-cell,
  .header-cell,
  .bottom-cell {
    display: flex;
    padding: 5px;
    box-sizing: border-box;
    border-bottom: 1px solid #ebeef5;

    justify-content: center;
    align-items: center;
    min-width: 0;
  }
  .header-cell,
  .bottom-cell {
    border-bottom-width: 0;
  }

  .header-cell {
    background-color: #f5f7fa;
    padding: 0px;
    font-size: 13px;
    font-weight: 700;
    color: #8491b2;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }

  .item-cell {
    background-color: #fff;
    .rownum {
      color: #8491b2;
      font-weight: 400;
    }

    input[type="checkbox"] {
      height: 14px;
      width: 14px;
      vertical-align: middle;
      margin: 1px;
      border: 1px solid #dcdfe6;
      -webkit-appearance: none;
    }

    input[type="checkbox"] {
      -webkit-border-radius:2px;
      border-radius:2px;
    }

    input[type="checkbox"]:not(:disabled):hover {
      border-color:#409EFF;

    }

    input[type="checkbox"]:active:not(:disabled) {
      border-color:#409EFF;
    }

    /* focus state */
    input[type="checkbox"]:focus {
      outline:none;

    }

    input[type="checkbox"]:checked {
      border-color:#409EFF;
      background-color: #409EFF;
    }

    /* checkbox checked */
    input[type="checkbox"]:checked:before {
      content: '';
      display: block;
      width: 4px;
      height: 8px;
      border: solid #fff;
      border-width: 0 1px 1px 0;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      margin-left: 4px;
      margin-top: 1px;
    }

    /* disabled input */
    input[type="checkbox"]:disabled {
      opacity: .6;
      border-color:#dcdfe6 !important;
      background-color: #dcdfe6 !important;
      box-shadow: none;
      background: rgba(0, 0, 0, 0.1);
      box-shadow:none;
    }

    /* style label for disabled input */
    input[type="checkbox"]:disabled + label {
      opacity: .6;
      cursor:default;
      -webkit-user-select: none;
    }
  }

  .header-cell-sub {
    display: flex;
  }

  .item-cell.fixed {
    position: absolute;
    top:0px;
    z-index: 5;
  }

  .item-cell.fixed.last {
    border-right: 2px solid #e9edf7;
  }

  .header-inner-cell {
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    line-height: 32px;
    height: 32px;
    text-align: center;
  }

  .item-cell-inner {
    display: flex;
    width: 100%;
    height: 100%;
    word-break: break-all;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    > span {
      width:100%;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal;
    }
  }

  .header-cell-inner {
    position: relative;
    word-break: break-all;
    text-align: center;
    width:100%;
    > span {
      width:100%;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-wrap:normal;
    }
  }

  .header-cell-inner.caret-wrapper {
    width: 10px;
    height: 22px;
    cursor: pointer;
  }

  .header-line {
    color: #606266;
    .header-line-table {
      table-layout: fixed;
      td {
        padding: 6px 6px;
        border: 1px solid #ebeef5;
      }
    }
    .header-line-fixed-table {
      background: #f5f7fa;
      border-right: 5px solid #e9edf7;
      td {
        padding: 6px 6px;
        border: 1px solid #ebeef5;
      }
    }
  }
  .bottom-line {
    height: 30px;
  }

  .bordered .item-cell,
  .bordered .header-cell,
  .bordered .bottom-cell {
    border-left: 1px solid #ebeef5;
  }

  .bordered .item-cell:nth-child(1),
  .bordered .header-cell:nth-child(1),
  .bordered .bottom-cell:nth-child(1) {
    border-left-width: 0;
  }

  .t-header {
    background-color: #f5f7fa;
    border-bottom: 1px solid #ebeef5;
    position: relative;
  }

  .t-bottom {
    height: 50px;
    border-top: 1px solid #ebeef5;
    background-color: #f5f7fa;
  }

  .t-container {
    box-sizing: border-box;
    overflow: auto;
    overflow-x: hidden;
  }

  .scroller {
    height: 100%;
  }

  div.item-line.selected {
    background-color: #f0f9eb;
    .item-cell {
      background-color: #f0f9eb !important;
    }
  }
}
</style>
