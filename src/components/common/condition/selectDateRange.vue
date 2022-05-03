<template>
<div class="col-md-3" :style="getStyle()">
  <div class="form-group">
    <label>날짜</label>
    <div>
      <el-select v-model="tmpDateType" placeholder="전체" size="small" class="fl" style="width:150px;margin-right:5px;" @change="onHandleDataChange">
        <el-option v-for="item in options" :key="item.detailCode" :label="item.detailCodeNameKr" :value="item.detailCode" :disabled="item.disabled"/>
      </el-select>
      <el-date-picker v-show="tmpDateType !== 'CM' && tmpDateType !== 'SM' && tmpDateType !== 'CEM' && tmpDateType !== 'SEM' && tmpDateType !== 'CY' && tmpDateType !== 'WM' && tmpDateType !== 'CFM'" class="fl" style="width:calc(100% - 155px);" v-model="tmpDateRange" value-format="yyyy-MM-dd" type="daterange" range-separator="~" start-placeholder="시작일" end-placeholder="종료일" size="small" @change="onHandleDataChange"/>
      <el-date-picker v-show="tmpDateType === 'CM' || tmpDateType === 'SM' || tmpDateType === 'CEM' || tmpDateType === 'SEM' || tmpDateType === 'WM' || tmpDateType === 'CFM'" class="fl" style="width:calc(100% - 155px);" v-model="tmpMonth" value-format="yyyy-MM" type="month" size="small"  @change="onHandleDataChange"/>
      <el-date-picker v-show="tmpDateType === 'CY'" class="fl" style="width:calc(100% - 155px);" v-model="tmpYear" value-format="yyyy" type="year" size="small"  @change="onHandleDataChange"/>
    </div>
  </div>
</div>
</template>
<script>
import { conditionMixin } from '../conditionMixin';
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
export default {
  name: 'selectDateRange',
  mixins: [conditionMixin, commonCodeServiceMixin],
  mounted() {
    /* const toDay = this.getCurrentDate();
    const yesterDay = toDay.addDays(-1);

    if (this.isInitializeValue === true) {
      if ( this.field && this.field.defaultValue) {
        this.tmpDateType = this.field.defaultValue.dateType ? this.field.defaultValue.dateType : 'CI';
        this.tmpDateRange = this.field.defaultValue.dateRange ? this.field.defaultValue.dateRange : [yesterDay.toStandardDateString(), yesterDay.toStandardDateString()];
        this.tmpMonth = this.field.defaultValue.date ? this.field.defaultValue.date : toDay.toStandardDateString().substr(0, 7);
        this.tmpYear = this.field.defaultValue.year ? this.field.defaultValue.year : toDay.toStandardDateString().substr(0, 4);
      }
    } */

    this.initializeComponent();
  },
  data() {
    return {
      tmpYear: '',
      tmpMonth: '',
      tmpDateType: '',
      tmpDateRange: [],
      pageName: ''
    };
  },
  watch: { // onHandleDataChange 사용중이라 watch로 변경확인
    tmpYear() {
      this.handleAssignValues();
    },
    tmpMonth() {
      this.handleAssignValues();
    },
    // tmpDateRange(e) {
    //   if (!this.isEmpty(e)) {
    //     if (this.getPageName() === 'sprpayrequest') {
    //       if (this.dateDiff(new Date(e[0]), new Date(e[1])) < 182) {
    //         this.handleAssignValues();
    //       } else {
    //         messageBox.show('', '조회 가능한 기간은 최대 6개월입니다.');
    //         this.tmpDateRange = [];
    //         this.value.dateRange = [];
    //       }
    //     } else {
    //       if (this.dateDiff(new Date(e[0]), new Date(e[1])) < 92) {
    //         this.handleAssignValues();
    //       } else {
    //         messageBox.show('', '조회 가능한 기간은 최대 3개월입니다.');
    //         this.tmpDateRange = [];
    //         this.value.dateRange = [];
    //       }
    //     }
    //   } else {
    //     this.value.dateRange = [];
    //   }
    // },
    tmpDateType() {
      this.handleAssignValues();
    }
  },
  methods: {
    async initializeComponent() {
      this.options = [
        /* 날짜유형(RD : 등록일, BK : 예약일, CI : 체크인, CO : 체크아웃, CID : startDt보다 체크인이 낮은, CM : 정산년월(YYYY-MM), CEM : 정산년월-익스피디아용(YYYY-MM),
        SM : 매출년월(YYYY-MM), SEM : 매출년월-익스피디아용 (YYYY-MM), AD : 결제승인일, PA: 결제일, CD : 지급요청일(청구일??), PS : 지급요청품의일(그룹웨어에게..),
        PE : 지급일자, UD : 이용일)") CY : 연도별 */
        /* {detailCode: 'CID', detailCodeNameKr: '내부적사용 체크인보다 빠른날'}, */
        {detailCode: 'CI', detailCodeNameKr: 'data1', disabled: false},
        {detailCode: 'CI', detailCodeNameKr: 'data2', disabled: false}
      ];
      this.handleDefaultValues();
      this.handlePopupValues();
    },
    handleDefaultValues() { //  페이지별 기간 조건 설정
      let tmpObj = {dateType: '', removeCodes: [], disableCodes: [], dateRange: [], month: '', year: ''};
      const toDay = this.getCurrentDate();
      const yesterDay = toDay.addDays(-1);

      const dateDataSet = {
        yesterDayRange: [yesterDay.toStandardDateString(), yesterDay.toStandardDateString()],
        sevenDayBeforeRange: [toDay.addDays(-7).toStandardDateString(), yesterDay.toStandardDateString()],
        vccPayRange: [toDay.toStandardDateString().substr(0, 8).concat('15'), toDay.toStandardDateString().substr(0, 8).concat('20')],
        lastMonthRange: [toDay.addMonths(-1).getFirstDate().toStandardDateString(), toDay.addMonths(-1).getLastDate().toStandardDateString()],
        thisMonthRange: [toDay.getFirstDate().toStandardDateString(), toDay.toStandardDateString()],
        thisMonth: toDay.toStandardDateString().substr(0, 7),
        thisYear: toDay.toStandardDateString().substr(0, 4)
      };

      switch (this.getPageName()) {
        case '':
        case 'calc-stat':
        case 'home': // 정산 업무 현황판
          tmpObj.dateType = 'CI';
          tmpObj.removeCodes = ['CEM', 'CY', 'ED', 'SEM', 'UD', 'RD', 'WM', 'BKC', 'CFM', 'SCD'];
          tmpObj.disableCodes = ['AD', 'BK', 'CD', 'PA', 'PE', 'PS', 'SM'];
          tmpObj.dateRange = dateDataSet.lastMonthRange;
          tmpObj.month = dateDataSet.thisMonth;
          break;
        case 'psalescalc': // 파라곤 매출정산
          tmpObj.dateType = 'CI';
          tmpObj.removeCodes = ['CD', 'CEM', 'CY', 'ED', 'PE', 'PS', 'RD', 'SEM', 'UD', 'WM', 'BKC', 'CFM', 'SCD'];
          tmpObj.disableCodes = ['SM', 'PA'];
          tmpObj.dateRange = dateDataSet.yesterDayRange;
          tmpObj.month = dateDataSet.thisMonth;
          break;
        case 'tripanzee': // TAVI CMS tripanzee
          tmpObj.dateType = 'BK';
          tmpObj.removeCodes = ['PA', 'CD', 'CEM', 'CY', 'ED', 'PE', 'PS', 'RD', 'SEM', 'UD', 'WM', 'SM', 'UD', 'AD', 'BKC', 'CM', 'CFM', 'SCD'];
          tmpObj.disableCodes = [];
          tmpObj.dateRange = dateDataSet.lastMonthRange;
          tmpObj.month = dateDataSet.thisMonth;
          break;
        case 'skypasspayrequest': // 스카이패스 지급요청
          tmpObj.dateType = 'CFM';
          tmpObj.removeCodes = ['PA', 'BK', 'UD', 'SM', 'SEM', 'CM', 'WM', 'CEM', 'BKC', 'PE', 'CD', 'PS', 'RD', 'CY', 'ED', 'AD'];
          tmpObj.disableCodes = [];
          tmpObj.dateRange = dateDataSet.thisMonthRange;
          tmpObj.month = dateDataSet.thisMonth;
          break;
        case 'invoice': // 송금청구내역
          tmpObj.dateType = 'RD';
          tmpObj.removeCodes = ['AD', 'CD', 'CEM', 'CY', 'ED', 'PE', 'PS', 'SEM', 'SM', 'UD', 'PA', 'WM', 'BKC', 'CFM', 'SCD'];
          tmpObj.disableCodes = [''];
          tmpObj.dateRange = dateDataSet.yesterDayRange;
          tmpObj.month = dateDataSet.thisMonth;
          break;
        case 'vcc': // VCC 승인내역
          tmpObj.dateType = 'PA';
          tmpObj.removeCodes = ['AD', 'BK', 'CD', 'CEM', 'CI', 'CO', 'CY', 'ED', 'UD', 'PE', 'PS', 'RD', 'SEM', 'SM', 'WM', 'BKC', 'CFM', 'SCD'];
          tmpObj.disableCodes = [''];
          tmpObj.dateRange = dateDataSet.yesterDayRange;
          tmpObj.month = dateDataSet.thisMonth;
          break;
        case 'cts': // CTS 승인내역
          tmpObj.dateType = 'WM';
          tmpObj.removeCodes = ['AD', 'BK', 'CD', 'CEM', 'CI', 'CO', 'CY', 'ED', 'UD', 'PE', 'PS', 'RD', 'SEM', 'SM', 'PA', 'BKC', 'CFM', 'SCD'];
          tmpObj.disableCodes = [''];
          tmpObj.dateRange = dateDataSet.yesterDayRange;
          tmpObj.month = dateDataSet.thisMonth;
          break;
        case 'salesTaxInvoice':
          tmpObj.dateType = 'CI';
          tmpObj.removeCodes = ['CEM', 'CY', 'ED', 'SEM', 'UD', 'RD', 'WM', 'BKC', 'CFM', 'SCD'];
          tmpObj.disableCodes = ['AD', 'BK', 'CD', 'PA', 'PE', 'PS', 'SM'];
          tmpObj.dateRange = dateDataSet.lastMonthRange;
          tmpObj.month = dateDataSet.thisMonth;
          break;
        default:
          tmpObj.dateType = 'CI';
          tmpObj.removeCodes = ['CEM', 'CY', 'ED', 'SEM', 'UD', 'RD', 'WM', 'BKC', 'CFM', 'SCD'];
          tmpObj.disableCodes = ['AD', 'BK', 'CD', 'PA', 'PE', 'PS', 'SM'];
          tmpObj.dateRange = dateDataSet.yesterDayRange;
          tmpObj.month = dateDataSet.thisMonth;
          break;
      }

      this.removeGroupCode(this.options, tmpObj.removeCodes);
      this.disableCode(this.options, tmpObj.disableCodes);
      this.tmpDateType = tmpObj.dateType;
      this.tmpDateRange = tmpObj.dateRange;
      this.tmpMonth = tmpObj.month;
      this.tmpYear = tmpObj.year;
    },
    handleAssignValues() { // dateType에 따른 기간 설정
      if (this.tmpDateType === 'SM' || this.tmpDateType === 'SEM' || this.tmpDateType === 'CM' || this.tmpDateType === 'CEM' || this.tmpDateType === 'WM' || this.tmpDateType === 'CFM') {
        Object.assign(this.value, {dateType: this.tmpDateType, date: this.tmpMonth, dateRange: null});
      } else if (this.tmpDateType === 'CY') {
        Object.assign(this.value, {dateType: this.tmpDateType, date: this.tmpYear, dateRange: null});
      } else if (!this.isEmpty(this.tmpDateType)) {
        Object.assign(this.value, {dateType: this.tmpDateType, date: null, dateRange: this.tmpDateRange});
      }
      this.$emit('change', {data: this.value});
    },
    handlePopupValues() { //  팝업에 복제되는 조건
      if (this.value.dateType === 'SM' || this.value.dateType === 'SEM' || this.value.dateType === 'CM' || this.tmpDateType === 'CEM' || this.value.dateType === 'WM') {
        this.tmpMonth = this.value.date;
        this.tmpYear = null;
        this.tmpDateRange = null;
        this.tmpDateType = this.value.dateType;
      } else if (this.value.dateType === 'CY') {
        this.tmpMonth = null;
        this.tmpYear = this.value.date;
        this.tmpDateRange = null;
        this.tmpDateType = this.value.dateType;
      } else if (!this.isEmpty(this.value.dateType)) {
        this.tmpMonth = null;
        this.tmpYear = null;
        this.tmpDateRange = this.value.dateRange;
        this.tmpDateType = this.value.dateType;
      }
    }
  }
};
</script>
