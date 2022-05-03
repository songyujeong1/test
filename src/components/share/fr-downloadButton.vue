<template>
<el-button :type="buttonType" :size="size" :id="idName" @click="onHandleGenerate">
  <i v-if="iconVisible" class="icon-file-excel button-icon"></i>
  <slot />
</el-button>
</template>

<script>
// https://github.com/jecovier/vue-json-excel
import download from 'downloadjs';

export default {
  name: 'fr-downloadButton',
  props: {
    buttonType: {
      tyle: String,
      default: ''
    },
    data: {
      type: Array,
      default: null
    },
    emptyMessage: {
      tyle: String,
      default: '조회된 데이타가 없습니다.'
    },
    fields: {
      type: Object,
      required: false
    },
    fileName: {
      type: String,
      default: 'data.xls'
    },
    iconVisible: {
      tyle: Boolean,
      default: true
    },
    meta: {
      type: Array,
      default: () => []
    },
    mimeType: {
      type: String,
      default: 'xls'
    },
    size: {
      tyle: String,
      default: 'small'
    },
    tableRef: {
      type: Object,
      default: null
    },
    title: {
      default: null
    },
    excelSubName: {
      tyle: String,
      default: ''
    }
  },
  computed: {
    // unique identifier
    idName: function() {
      let now = new Date().getTime();
      return 'export_' + now;
    }
  },
  methods: {
    onHandleGenerate(e) {
      this.$emit('click', e);
      if (this.tableRef === null && this.isEmpty(this.data)) {
        if (!this.isEmpty(this.emptyMessage)) {
          messageBox.show('', this.emptyMessage);
        }

        return null;
      } else if (this.isEmpty(this.tableRef.data) && !this.isEmpty(this.emptyMessage)) {
        messageBox.show('', this.emptyMessage);
        return null;
      }
      let json = null;

      const pageName = this.getPageName(); // 엑셀 다운로드명
      const excelSubName = this.excelSubName;
      let fileNm = '';

      switch (pageName) {
        case 'psalescalc':
          fileNm = '파라곤_매출정산_' + excelSubName;
          break;
        case 'salesTaxInvoice':
          fileNm = 'TAVI_수불대사(매출세금계산서)';
          break;
        case 'invoice':
          fileNm = '송금(Invoice)_청구내역';
          break;
        case 'vcc':
          fileNm = 'VCC_승인내역';
          break;
        case 'exchange-mng':
          fileNm = '환차(액)_조회';
          break;
        default:
          break;
      }

      if ( this.tableRef ) {
        this.tableRef.export(fileNm || this.fileName);
        return;
      } else {
        json = this.getProcessedJson(this.data, this.fields);
      }
      if (this.mimeType === 'csv') {
        return this.export(this.jsonToCSV(json), fileNm || this.fileName, 'application/csv');
      }

      return this.export(
        this.jsonToXLS(json),
        fileNm || this.fileName,
        'application/vnd.ms-excel'
      );
    },
    /*
    Use downloadjs to generate the download link
    */
    export: function(data, filename, mime) {
      let blob = this.base64ToBlob(data, mime);
      download(blob, filename, mime);
    },
    jsonToXLS: function(data) {
      let xlsData = '<thead><tr>';

      if (this.title != null) {
        if (Array.isArray(this.title)) {
          for (let i = 0; i < this.title.length; i++) {
            xlsData +=
              '<th colspan="' +
              Object.keys(data[0]).length +
              '">' +
              this.title[i] +
              '<th></tr><tr>';
          }
        } else {
          xlsData +=
            '<th colspan="' +
            Object.keys(data[0]).length +
            '">' +
            this.title +
            '<th></tr><tr>';
        }
      }

      if (data[0] instanceof Map) {
        for (var [key] of data[0]) {
          xlsData += '<th>' + key + '</th>';
        }
      } else {
        for (let key in data[0]) {
          xlsData += '<th>' + key + '</th>';
        }
      }

      xlsData += '</tr></thead>';
      xlsData += '<tbody>';

      data.map(function(item) {
        xlsData += '<tbody><tr>';

        if (item instanceof Map) {
          for (var [, value] of item) {
            xlsData += '<td>' + this.preprocessLongNum(value) + '</td>';
          }
        } else {
          for (let key in item) {
            xlsData += '<td>' + this.preprocessLongNum(item[key]) + '</td>';
          }
        }

        xlsData += '</tr></tbody>';
      });

      return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta name=ProgId content=Excel.Sheet> <meta name=Generator content="Microsoft Excel 11"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>${xlsData}</table></body></html>`;
    },
    jsonToCSV: function(data) {
      let csvData = '';

      if (this.title != null) {
        if (Array.isArray(this.title)) {
          for (let i = 0; i < this.title.length; i++) {
            csvData += this.title[i] + '\r\n';
          }
        } else {
          csvData += this.title + '\r\n';
        }
      }

      for (let key in data[0]) {
        csvData += key + ',';
      }
      csvData = csvData.slice(0, csvData.length - 1);
      csvData += '\r\n';

      data.map(function(item) {
        for (let key in item) {
          let escapedCSV = item[key] + ''; // cast Numbers to string
          if (escapedCSV.match(/[,"\n]/)) {
            escapedCSV = '"' + escapedCSV.replace(/\"/g, '""') + '"';
          }
          csvData += escapedCSV + ',';
        }
        csvData = csvData.slice(0, csvData.length - 1);
        csvData += '\r\n';
      });
      return csvData;
    },
    getProcessedJson: function(data, header) {
      let newData = [];

      if (data[0] instanceof Map) {
        return data;
      } else {
        let keys = this.getKeys(data, header);
        let _self = this;

        data.map(function(item) {
          let newItem = {};
          for (let label in keys) {
            let property = keys[label];
            newItem[label] = _self.getNestedData(property, item);
          }
          newData.push(newItem);
        });
      }

      return newData;
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
        if (value > 99999999999 || value < 0.0000000000001) {
          return '="' + value + '"';
        }
      }
      return value;
    },
    getKeys: function(data, header) {
      if (header) {
        return header;
      }

      let keys = {};
      for (let key in data[0]) {
        keys[key] = key;
      }
      return keys;
    },
    callItemCallback: function(field, itemValue, item) {
      if (typeof field === 'object' && typeof field.callback === 'function') {
        return field.callback(itemValue, item);
      }

      return itemValue;
    },
    getNestedData: function(key, item) {
      const field = typeof key === 'object' ? key.field : key;

      let valueFromNestedKey = null;
      let keyNestedSplit = field.split('.');

      valueFromNestedKey = item[keyNestedSplit[0]];
      for (let j = 1; j < keyNestedSplit.length; j++) {
        valueFromNestedKey = valueFromNestedKey[keyNestedSplit[j]];
      }

      valueFromNestedKey = this.callItemCallback(key, valueFromNestedKey, item);

      return valueFromNestedKey;
    },
    base64ToBlob: function(data, mime) {
      let base64 = window.btoa(window.unescape(encodeURIComponent(data)));
      let bstr = atob(base64);
      let n = bstr.length;
      let u8arr = new Uint8ClampedArray(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }
  }
};
</script>
