<template>
  <fr-button type="C" size="small" @click="onHandleClick" :disabled="buttonDisable">
    인보이스생성
    <div>
      <el-dialog slot="dialogSlot" title="" width="50%" :append-to-body="true" :destroy-on-close="true" :visible.sync="isDialogPopUp" :before-close="onHandleClose" :close-on-click-modal="false" style="margin-top:-75px">
        <div class="charge-confirm-info">
          <div class="panel-head row">
            <div class="col-md-4">
              <h4 slot="title">인보이스 생성</h4>
            </div>
          </div>
          <table class="table-basic">
            <colgroup>
              <col style="width:15%;" />
              <col style="width:35%;" />
              <col style="width:15%;" />
              <col style="width:35%;" />
            </colgroup>
            <tbody style="text-align:center">
              <tr>
                <th class="table-head">인보이스 제목<span style="color:red">*</span></th>
                <td class="text-left" colspan="3"><el-input placeholder="식별용입니다. 실제 인보이스 제목은 '판매 수수료 청구'" size="small" v-model="invoiceInfo.title" maxlength="50" clearable /></td>
              </tr>
              <tr>
                <th class="table-head">수신처(거래처명)<span style="color:red">*</span></th>
                <td class="text-left"><el-input placeholder="" size="small" v-model="invoiceInfo.recipient" maxlength="50" clearable /></td>
                <th class="table-head">인보이스년월<span style="color:red">*</span></th>
                <td class="text-left"><el-date-picker class="fl" v-model="invoiceInfo.calcYearMonth" value-format="yyyy-MM" type="month" size="small" /></td>
              </tr>
              <tr>
                <th class="table-head">채널판매가<span style="color:red">*</span></th>
                <td class="text-left">{{$n(this.invoiceInfo.channelSaleWon)}} 원</td>
                <th class="table-head">공급컴<span style="color:red">*</span></th>
                <td class="text-left">{{$n(invoiceInfo.commissionWon)}} 원</td>
              </tr>
              <tr>
                <th class="table-head">건수<span style="color:red">*</span></th>
                <td class="text-left">{{$n(invoiceInfo.bookingCnt)}} 건</td>
                <th class="table-head">수수료율(비고)<span style="color:red">*</span></th>
                <td class="text-left">{{invoiceInfo.note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <span slot="footer" class="dialog-footer">
          <fr-button type="C" @click="onHandleConfirm">확인</fr-button>
          <fr-button type="D" @click="onHandleClose">취소</fr-button>
        </span>
      </el-dialog>
    </div>
  </fr-button>
</template>
<script>
import { actionServiceMixin } from '@/mixins/actionServiceMixin';
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import BigNumber from 'bignumber.js';
// import { has } from 'lodash';

export default {
  name: 'create-invoice-button',
  mixins: [actionServiceMixin, commonCodeServiceMixin],
  props: {
    data: {
      type: Array,
      default: null
    },
    notiConfirm: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedRows: null,
      pageName: null,
      invoiceInfo: {
        title: null,
        calcYearMonth: null,
        recipient: null,
        commissionWon: 0,
        channelSaleWon: 0,
        note: null,
        bookingCnt: 0
      },
      buttonDisable: false,
      isDialogPopUp: false
    };
  },
  created() {
    this.pageName = this.getPageName();
    this.invoiceInfo = {
      title: null,
      calcYearMonth: null,
      recipient: null,
      commissionWon: 0,
      channelSaleWon: 0,
      note: null,
      bookingCnt: 0
    };
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
      if (this.isEmpty(this.data)) {
        messageBox.show('', '조회된 데이터가 없습니다.');
        return;
      }

      this.selectedRows = this.data.filterBy(x => x.isChecked, true);

      if (this.isEmpty(this.selectedRows)) {
        messageBox.show('', '선택된 항목이 없습니다.');
        return;
      }

      this.invoiceInfo.recipient = this.selectedRows[0].clientName;
      this.invoiceInfo.calcYearMonth = this.getCurrentDate().toStandardDateString().substr(0, 7);

      let commissionWon = new BigNumber(0);
      let channelSaleWon = new BigNumber(0);
      let supplyNetWon = new BigNumber(0);
      let addFareWon = new BigNumber(0);
      let channelSaleInt = new BigNumber(0);

      this.selectedRows.forEach(data => {
        commissionWon = commissionWon.plus(new BigNumber((this.isEmpty(data.commissionWon) || isNaN(data.commissionWon)) ? 0 : data.commissionWon));
        channelSaleWon = channelSaleWon.plus(new BigNumber((this.isEmpty(data.channelSaleWon) || isNaN(data.channelSaleWon)) ? 0 : data.channelSaleWon));
        supplyNetWon = supplyNetWon.plus(new BigNumber((this.isEmpty(data.supplyNetWon) || isNaN(data.supplyNetWon)) ? 0 : data.supplyNetWon));
        addFareWon = addFareWon.plus(new BigNumber((this.isEmpty(data.addFareWon) || isNaN(data.addFareWon)) ? 0 : data.addFareWon));
        channelSaleInt = channelSaleInt.plus(new BigNumber((this.isEmpty(data.channelSaleInt) || isNaN(data.channelSaleInt)) ? 0 : data.channelSaleInt));
      });

      this.invoiceInfo.commissionWon = commissionWon.toNumber();
      this.invoiceInfo.channelSaleWon = channelSaleWon.toNumber();
      this.invoiceInfo.note = commissionWon.multipliedBy(100).div(channelSaleInt).dp(0, BigNumber.ROUND_HALF_UP).toString().concat(' %');
      this.invoiceInfo.bookingCnt = this.selectedRows.length;

      this.openPopup();
    },
    openPopup() { // 정산년월 선택 팝업
      this.isDialogPopUp = !this.isDialogPopUp;
    },
    onHandleConfirm() {
      if (this.isDialogPopUp) {
        if (this.isEmpty(this.invoiceInfo.title)) {
          messageBox.show('', '인보이스제목을 입력해 주세요.');
          return;
        }

        if (this.isEmpty(this.invoiceInfo.recipient)) {
          messageBox.show('', '거래처명(수신처)를 입력해 주세요.');
          return;
        }

        if (this.isEmpty(this.invoiceInfo.calcYearMonth)) {
          messageBox.show('', '인보이스 년월을 입력해 주세요.');
          return;
        }

        this.confirmMsg();
      }
    },
    onHandleClose() {
      this.invoiceInfo = {
        title: null,
        calcYearMonth: null,
        recipient: null,
        commissionWon: 0,
        channelSaleWon: 0,
        note: null,
        bookingCnt: 0
      };
      if (this.isDialogPopUp) {
        this.isDialogPopUp = false;
      }
    },
    confirmMsg() {
      const confirmMsg = '인보이스를 생성하시겠습니까?<br/>(발송하지 않은 인보이스는 다음날 삭제됩니다.)';
      messageBox.show('', confirmMsg, 'YesNo').then(dialog => {
        if (dialog === 'yes') {
          this.saveSalesTaxInvoice(this.invoiceInfo);
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
.table-basic {
  cursor: default;
  th {
    font-weight: bold;
    text-align: left;
    background: #f5f7fa;
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
