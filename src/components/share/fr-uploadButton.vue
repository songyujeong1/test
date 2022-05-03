<template>
  <div class="fr-file el-button el-button--small" style="display:inline-block;" :class="{ 'is-disabled' : hasPermission === false }">
    <input type='file' class='inputfile' :accept="accept" :id="id" :multiple="multiple" @change="onHandleChange" :disabled="hasPermission === false" >
    <label :for="id" :class="{ 'is-disabled' : hasPermission === false }">
      <i v-if="iconVisible" class="icon-file-upload button-icon"></i>
      <slot />
    </label>
    <transition name="modal" v-if="isOpen === true">
      <div style="position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:999;cursor:default;">
        <div style="margin:auto;background: #000;opacity: 0.4;width:100%;height:100%;pointer-events:none;">
        </div>
        <span v-if="isLoading === true" class="p-v-10 p-h-10" style="padding-top:200px;text-align:center;font-size:16px;position:absolute;width:90%;height:80%;top:50%;left:50%;margin:auto;transform:translate(-50%, -50%);background-color:#fff;">
          <i class="el-icon-loading"></i> 데이타 조회중
        </span>
        <div v-else class="p-v-10 p-h-10" style="position:absolute;width:90%;height:85%;top:50%;left:50%;margin:auto;transform:translate(-50%, -50%);background-color:#fff;">
          <div class="reset" v-if="conditions !== null">
            <div v-for="(row, index) in conditions.rows" class="row m-v-10 w-100p" style="padding-left:0px;padding-right:10px;" :key="index">
              <component v-for="(field, fieldIndex) in row.fields" :key="fieldIndex" :isTavi="isTavi" v-bind:is="field.name ? field.name : field" :field="typeof field === 'string' ? {} : field" :value="formData" :isInitializeValue="false" />
              <div v-if="index === 0" class="fr p-v-10">
                <el-button size="small" type="success" @click="onHandleSaveClick">
                  저장
                </el-button>
                <el-button size="small" type="primary" @click="onHandleCloseClick">
                  취소
                </el-button>
              </div>
            </div>
          </div>
          <div class="reset" v-else>
            <div class="row m-v-10 w-100p" style="padding-left:0px;padding-right:10px;">
              <div class="fr p-v-10">
                <el-button size="small" type="success" @click="onHandleSaveClick">
                  저장
                </el-button>
                <el-button size="small" type="primary" @click="onHandleCloseClick">
                  취소
                </el-button>
              </div>
            </div>
          </div>
          <div style="padding-left:10px;padding-right:10px;">
            <el-table ref="grdList" :data="uploadData" :border="true" height="600" style="width:100%;" header-row-class-name="el-table-fixed-column" row-class-name="el-table-fixed-column">
              <el-table-column v-for="column in uploadColumns"
                          :key="column.label"
                          :prop="column.prop"
                          :label="column.label"
                          :width="120"
                          header-align="center">
              </el-table-column>
              <infinite-loading slot="append" v-if="canUseInfiniteLoading === true" @infinite="onHandleInfinite" force-use-infinite-wrapper=".el-table__body-wrapper" />
            </el-table>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import XLSX from 'xlsx';
import { csvToJson, getFileExtension } from '@/utils/ioUtils';
import { getObjectKeys } from '@/utils/commonUtils';

import benefit from '../common/condition/benefit';
import bookerName from '../common/condition/bookerName';
import bookingCode from '../common/condition/bookingCode';
import bookingState from '../common/condition/bookingState';
import bookingManager from '../common/condition/bookingManager';
import calcState from '../common/condition/calcState';
import cancelState from '../common/condition/cancelState';
import changeState from '../common/condition/changeState';
import currencyCode from '../common/condition/currencyCode';
import cityCode from '../common/condition/cityCode';
import countryCode from '../common/condition/countryCode';
import dateRange from '../common/condition/dateRange';
import paymentTypes from '../common/condition/paymentTypes';
import hotelName from '../common/condition/hotelName';
import inflowPath from '../common/condition/inflowPath';
import invoiceType from '../common/condition/invoiceType';
import localeType from '../common/condition/localeType';
import mid from '../common/condition/mid';
import misMatchBookingNo from '../common/condition/misMatchBookingNo';
import misMatchPrice from '../common/condition/misMatchPrice';
import paymentState from '../common/condition/paymentState';
import paymentType from '../common/condition/paymentType';
import processState from '../common/condition/processState';
import refundState from '../common/condition/refundState';
import retrieveButton from '../common/condition/retrieveButton';
import salesType from '../common/condition/salesType';
import selectDateRange from '../common/condition/selectDateRange';
import sprId from '../common/condition/sprId';
import sprType from '../common/condition/sprType';
import sprCode from '../common/condition/sprCode';
import tradeType from '../common/condition/tradeType';
import errorUpperState from '../common/condition/errorUpperState';
import errorDetailState from '../common/condition/errorDetailState';
import approvalNo from '../common/condition/approvalNo';

export default {
  name: 'fr-file',
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    accept: {
      type: String,
      default: '.csv, .xls, .xlsx'
    },
    id: {
      type: String,
      default: function() {
        return 'file-id-' + this._uid;
      }
    },
    hdr: {
      type: String,
      default: 'Y'
    },
    iconVisible: {
      type: Boolean,
      default: true
    },
    isPrevew: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    conditions: {
      type: Object
    },
    formData: {
      type: Object
    },
    isTavi: {
      default: false,
      required: false,
      type: Boolean
    }
  },
  components: {
    benefit,
    bookerName,
    bookingCode,
    bookingManager,
    bookingState,
    calcState,
    cancelState,
    changeState,
    cityCode,
    countryCode,
    currencyCode,
    dateRange,
    paymentTypes,
    hotelName,
    inflowPath,
    invoiceType,
    localeType,
    mid,
    misMatchBookingNo,
    misMatchPrice,
    paymentState,
    paymentType,
    processState,
    refundState,
    retrieveButton,
    salesType,
    selectDateRange,
    sprId,
    sprType,
    sprCode,
    tradeType,
    errorUpperState,
    errorDetailState,
    approvalNo
  },
  data() {
    return {
      canUseInfiniteLoading: false,
      infiniteScrollState: null,
      isOpen: false,
      isLoading: false,
      originalSource: null,
      page: 1,
      uploadColumns: [],
      uploadData: null,
      hasPermission: false
    };
  },
  mounted() {
    this.setPermission();
  },
  methods: {
    onInit() {
      document.getElementById(this.id).value = '';
      this.isOpen = false;
      this.isLoading = false;
      this.infiniteScrollState = null;
      this.page = 1;
      this.originalSource = null;
      this.uploadColumns = [];
      this.uploadData = [];
      this.hasPermission = false;
    },
    onHandleInfinite($state) {
      if ( this.originalSource ) {
        const begin = this.page * 30;
        const end = begin + 30;
        const appendList = this.originalSource.slice(begin, end);

        if ( appendList < 30 ) {
          $state.complete();
        } else {
          this.uploadData = this.uploadData.concat(appendList);
          this.page += 1;
          $state.loaded();
        }
      }

      if (this.isEmpty(this.infiniteScrollState)) {
        this.infiniteScrollState = $state;
      }
    },
    onHandleSaveClick(e) {
      this.$emit('save', {
        originalEvent: e,
        source: this.originalSource,
        formData: this.formData
      });
      this.onInit();
    },
    onHandleCloseClick(e) {
      this.$emit('cancel', {
        originalEvent: e
      });
      this.onInit();
      this.setPermission();
    },
    onHandleChange($event) {
      if (!$event.target.files.length || !window.FileReader) {
        return;
      }

      const file = $event.target.files[0];
      const ext = getFileExtension(file);

      if ( this.isPrevew === true && ext === 'csv' ) {
        this.onHandleCSVRead(file);
      } else if ( this.isPrevew === true && (ext === 'xls' || ext === 'xlsx')) {
        this.onHandleXLSRead(file);
      }

      this.$emit('change', $event);
    },
    onHandleXLSRead(file) {
      const reader = new FileReader();
      this.isLoading = true;
      this.isOpen = true;

      reader.onload = (() => {
        const fileData = reader.result;
        const wb = XLSX.read(fileData, {type: 'binary', cellDates: true, dateNF: 'yyyy-mm-dd'});
        const sheetNameList = wb.SheetNames; // 시트 이름 목록 가져오기
        const firstSheetName = sheetNameList[0]; // 첫번째 시트명
        const firstSheet = wb.Sheets[firstSheetName]; // 첫번째 시트

        const jsonData = XLSX.utils.sheet_to_json(firstSheet, {raw: false, defval: ''});

        let dataList = null;

        if ( this.hdr === 'Y' && jsonData && jsonData.length > 0 ) {
          const keys = getObjectKeys(jsonData);

          const errPropertys = [];

          keys.forEach(key => {
            if ( key.prop.indexOf(' ') > 0 ) {
              const newName = key.prop.trim();
              errPropertys.push({oldName: key.prop, newName: newName});
              key.label = newName;
              key.prop = newName;
            }
          });

          dataList = jsonData.map(row => {
            const item = row;

            errPropertys.forEach(property => {
              row[property.newName] = row[property.oldName];
              delete item[property.oldName];
            });

            return item;
          });

          const isEmptyRow = keys.some((item) => {
            if ( item.label === '__EMPTY') {
              return true;
            }
            return false;
          });

          if ( isEmptyRow ) {
            dataList.splice(0, 1);
          }
        }

        this.onHandleDataLoad(dataList);
      });
      reader.readAsBinaryString(file);
    },
    onHandleCSVRead(file) {
      const reader = new FileReader();
      this.isLoading = true;
      this.isOpen = true;

      reader.onload = ((e) => {
        const jsonData = csvToJson(e.target.result);

        this.onHandleDataLoad(jsonData);
      });

      reader.readAsText(file);
    },
    onHandleDataLoad(source) {
      const columns = getObjectKeys(source);

      this.originalSource = source;
      this.canUseInfiniteLoading = source.length > 30;
      this.uploadColumns = columns;
      this.uploadData = source.slice(0, 30);
      this.isLoading = false;
      this.infiniteScrollState && this.infiniteScrollState.loaded && this.infiniteScrollState.loaded();
    },
    setPermission() {
      const menuInfo = this.getCurrentMenu();
      if (menuInfo.writeYn === 'Y') {
        this.hasPermission = true;
      } else {
        this.hasPermission = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.fr-file {
  label {
    padding: 0px;
    display: inline-block;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-size: 12px;
  }

  label:focus,
  label:hover {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }

  label.is-disabled {
    color: #c0c4cc;
    cursor: not-allowed;
    background-image: none;
    background-color: #fff;
    border-color: #ebeef5;
  }

  input[type='file'] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
}
</style>
