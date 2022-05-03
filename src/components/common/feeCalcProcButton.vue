<template>
  <fr-button type="U" size="small" @click="onHandleClick" :disabled="buttonDisable">
    수수료정산처리
    <el-dialog slot="dialogSlot" title="정산년월 설정" width="30%" :append-to-body="true" :destroy-on-close="true" :visible.sync="isDialogPopUp" :before-close="onHandleClose" :close-on-click-modal="false">
      <div class="charge-confirm-info">
        <table>
          <colgroup>
            <col style="width:30%;" />
            <col style="width:70%;" />
          </colgroup>
          <tbody>
            <tr>
              <th>수수료 정산년월</th>
              <td><el-date-picker class="fl" style="width:calc(100% - 135px);" v-model="calcRevenueYearMonth" value-format="yyyy-MM" type="month" size="small" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <fr-button type="C" @click="onHandleConfirm">확인</fr-button>
        <fr-button type="D" @click="onHandleClose">취소</fr-button>
      </span>
    </el-dialog>
  </fr-button>
</template>
<script>
import { actionServiceMixin } from '@/mixins/actionServiceMixin';
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import { uniq, has, filter } from 'lodash';

export default {
  name: 'calc-proc-button',
  mixins: [actionServiceMixin, commonCodeServiceMixin],
  props: {
    domRef: {
      type: Object,
      default: null
    },
    data: {
      type: Array,
      default: null
    },
    isBundle: {
      type: Boolean,
      default: false
    },
    notiConfirm: {
      type: Boolean,
      default: false
    },
    feeCalcState: {
      required: false,
      default: null
    }
  },
  data() {
    return {
      selectedRows: null,
      pageName: null,
      calcType: 'T',
      calcRevenueYearMonth: null,
      buttonDisable: false,
      isDialogPopUp: false,
      bookingInfoList: []
    };
  },
  created() {
    this.pageName = this.getPageName();
    this.calcType = this.getCalcType(this.pageName);
    this.calcRevenueYearMonth = null;
  },
  watch: {
    feeCalcState(code) {
      // tavi 수수료 정산시
      const pageName = this.pageName;
      if (!this.isEmpty(code)) {
        switch (pageName) {
          case 'derby':
          case 'tllincoln':
          case 'tripanzee':
          case 'siteminder':
          case 'sanha':
            this.isTaviCmsFeeCalc = true;
            if (code === '93000006') {
              this.buttonDisable = false;
            } else {
              this.buttonDisable = true;
            }
            break;
          case 'skypasscalc':
            if (code === '93000006') {
              this.buttonDisable = false;
            } else {
              this.buttonDisable = true;
            }
            break;
          default:
            break;
        }
      } else {
        this.buttonDisable = true;
      }
    }
  },
  methods: {
    onHandleClick() {
      if (
        this.isEmpty(this.data) &&
        (this.isEmpty(this.domRef) || this.isEmpty(this.domRef.data))
      ) {
        messageBox.show('', '조회된 데이터가 없습니다.');
        return;
      }

      let fileterRow = [];
      if (this.isBundle === false) {
        if (this.data) {
          this.selectedRows = this.data.filterBy(x => x.isChecked, true);
        } else {
          this.selectedRows = this.domRef.selection;
        }

        if (this.isEmpty(this.selectedRows)) {
          messageBox.show('', '선택된 항목이 없습니다.');
          return;
        }

        fileterRow = filter(this.selectedRows, function(o) { return has(o, 'bookingId') || has(o, 'bookingNo'); });
      } else {
        if (this.data) {
          fileterRow = filter(this.data, function(o) { return has(o, 'bookingId') || has(o, 'bookingNo'); });
        } else {
          fileterRow = filter(this.domRef.data, function(o) { return has(o, 'bookingId') || has(o, 'bookingNo'); });
        }
      }

      if (this.isEmpty(fileterRow)) {
        messageBox.show('', '처리할 데이터가 없습니다.');
        return;
      }

      this.bookingInfoList = [];
      fileterRow.map(item => {
        if (has(item, 'bookingNo') && !this.isEmpty(item.bookingNo) && !this.isEmpty(item.feeCalcState)) {
          this.bookingInfoList.push({'bookingId': item.bookingNo, 'feeCalcState': item.feeCalcState});
        } else if (has(item, 'bookingId') && !this.isEmpty(item.bookingId) && !this.isEmpty(item.feeCalcState)) {
          this.bookingInfoList.push({'bookingId': item.bookingId, 'feeCalcState': item.feeCalcState});
        }
      });

      if (this.isEmpty(this.bookingInfoList)) {
        messageBox.show('', '처리할 데이터가 없습니다.');
        return;
      }

      if (!this.calcStateValidCheck(this.bookingInfoList)) {
        messageBox.show('', '해당 페이지에서 처리 할 수 없는 정산상태 예약이 있습니다.');
        return;
      }
      this.openPopup();
    },
    openPopup() { // 정산년월 선택 팝업
      this.calcRevenueYearMonth = this.getCurrentDate().toStandardDateString().substr(0, 7);
      this.isDialogPopUp = !this.isDialogPopUp;
    },
    onHandleConfirm() {
      if (this.isDialogPopUp && this.isEmpty(this.calcRevenueYearMonth)) {
        messageBox.show('', '정산년월을 선택해 주세요.');
        return;
      }
      this.confirmMsg();
    },
    onHandleClose() {
      this.calcRevenueYearMonth = null;
      if (this.isDialogPopUp) {
        this.isDialogPopUp = false;
      }
    },
    confirmMsg() {
      const confirmMsg = (this.notiConfirm === true ? '오류/불일치가 있는 예약이 선택되었습니다.<br/>' : '').concat('정산 처리를 하시겠습니까?<br/>(예약번호가 존재 하지 않는 데이터는 처리되지 않습니다.)');
      messageBox.show('', confirmMsg, 'YesNo').then(dialog => {
        if (dialog === 'yes') {
          this.feeCalcProcess(this.calcType, this.calcRevenueYearMonth, uniq(this.bookingInfoList));
          this.onHandleClose();
        }
      });
    },
    handleAssignValues() { // dateType에 따른 기간 설정
      Object.assign(this.value, {dateType: this.tmpDateType, date: this.tmpMonth, dateRange: null});
      this.$emit('change', {data: this.value});
    }
  }
};
</script>

<style lang="scss" scoped>
.charge-confirm-info {
  cursor: default;
  font-size: 14px;
  td {
    text-align: left;
    padding: 5px 15px;
  }
  th {
    font-weight: bold;
    text-align: left;
    padding: 5px 15px;
  }
}
</style>
