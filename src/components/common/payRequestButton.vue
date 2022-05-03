<template>
  <fr-button type="U" size="small" @click="onHandleClick" :disabled="buttonDisable">
    지급요청
    <el-dialog slot="dialogSlot" title="지급요청" width="70%" min-height="400" :append-to-body="true" :destroy-on-close="true" :visible.sync="isDialogPopUp" :before-close="onHandleClose" :close-on-click-modal="false">
      <div class="charge-confirm-info">
        <table class="table-basic">
          <colgroup>
            <col style="width:15%;" />
            <col style="width:35%;" />
            <col style="width:15%;" />
            <col style="width:35%;" />
          </colgroup>
          <tbody style="text-align:center">
            <tr>
              <th class="table-head">사업장</th>
              <td class="text-left">{{erpDivCodeName}}</td>
              <th class="table-head">유입채널</th>
              <td class="text-left">{{salesTypeName}}</td>
            </tr>
            <tr>
              <th class="table-head">지급등록일</th>
              <td class="text-left"><el-date-picker class="fl" v-model="displayReqData.registDt" type="date" value-format="yyyy-MM-dd" size="small" disabled/></td>
              <th class="table-head">지급요청일</th>
              <td class="text-left"><el-date-picker class="fl" v-model="payDate" type="date" :picker-options="pickerOptions" value-format="yyyy-MM-dd" size="small"/></td>
            </tr>
            <tr>
              <th class="table-head">지급유형</th>
              <td class="text-left"><span>{{invoiceTypeName}}</span></td>
              <th class="table-head">정산담당</th>
              <td class="text-left">{{$store.getters.userInfo.userName}}</td>
            </tr>
            <tr>
              <th class="table-head">지급액</th>
              <td class="text-left">{{$n(displayReqData.paymentAmt)}}</td>
              <th class="table-head">정산통화</th>
              <td class="text-left">{{displayReqData.standardCurrencyCode}}</td>
            </tr>
            <tr v-show="!isDiffCurrency">
              <th class="table-head"></th>
              <td class="text-left"></td>
              <th class="table-head">지급통화</th>
              <td class="text-left">{{displayReqData.payCurrencyCode}}</td>
            </tr>
            <tr v-show="isDiffCurrency">
              <th class="table-head">송금환율</th>
              <td class="text-left">{{$n(displayReqData.frnExchangeCost)}}</td>
              <th class="table-head">지급통화</th>
              <td class="text-left">{{displayReqData.payCurrencyCode}}</td>
            </tr>
            <tr v-show="isDiffCurrency">
              <th class="table-head">송금환율 적용 지급액</th>
              <td class="text-left">{{isTlLincoln === true ? $n(displayReqData.frnPaymentAmt + this.defaultFeeAmt) + '(기본 수수료 ￥100,000 포함)' : $n(displayReqData.frnPaymentAmt)}}</td>
              <th class="table-head"></th>
              <td class="text-left"></td>
            </tr>
            <tr>
              <td colspan="6">
                <el-input type="textarea" placeholder="적요" rows="3" v-model="title" maxlength="2000" ></el-input>
              </td>
            </tr>
          </tbody>
        </table>
        <font color="red">기안상신은 그룹웨어에서 가능합니다.<br>그룹웨어에서 수정한 정보는 연동되지 않습니다.</font>
      </div>
      <span slot="footer" class="dialog-footer">
        <fr-button type="C" @click="onHandleConfirm">확인</fr-button>
        <fr-button type="D" @click="onHandleCancel">취소</fr-button>
      </span>
    </el-dialog>
  </fr-button>
</template>
<script>
import { menuServiceMixin } from '@/mixins/menuServiceMixin';
import { actionServiceMixin } from '@/mixins/actionServiceMixin';
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';
import BigNumber from 'bignumber.js';

export default {
  name: 'payRequestButton',
  mixins: [menuServiceMixin, actionServiceMixin, commonCodeServiceMixin],
  props: {
    domRef: {
      type: Object,
      default: null
    },
    data: {
      type: Array,
      default: null
    },
    calcProcState: {
      required: false,
      default: null
    },
    defaultPayDate: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      displayReqData: {
        type: Array,
        default: null
      },
      isDialogPopUp: false,
      isMultipleDialogPopUp: false,
      selectedRows: [],
      alreadyRequestRows: null,
      buttonDisable: false,
      payDate: '',
      title: '',
      toDay: '',
      // defaultPayDate: '',
      invoiceTypeName: '',
      erpDivCodeName: '',
      salesTypeName: '',
      frnPaymentAmt: 0,
      isDiffCurrency: false,
      isTlLincoln: false,
      isVccCts: false,
      pickerOptions: {
        disabledDate: this.disabledDueDate
      },
      defaultFeeAmt: 0
    };
  },
  created() {
    this.pageName = this.getPageName();
  },
  mounted() {
    this.toDay = this.getCurrentDate().toStandardDateString();
  },
  watch: {
    calcProcState(code) {
      const pageName = this.pageName;
      if (!this.isEmpty(code)) {
        switch (pageName) {
          case 'sprpayrequest':
            if (code === '93000003') {
              this.buttonDisable = false;
            } else {
              this.buttonDisable = true;
            }
            break;
          default:
            this.buttonDisable = true;
            break;
        }
      }
    }
  },
  methods: {
    onHandleConfirm() {
      if (this.isEmpty(this.payDate)) {
        messageBox.show('', '지급요청일을 입력해 주세요.');
        return;
      } else if (this.payDate < this.toDay) {
        messageBox.show('', '지급요청일이 지급등록일보다 빠릅니다.');
        return;
      }

      if (this.isEmpty(this.title)) {
        messageBox.show('', '적요를 입력해 주세요.');
        return;
      }

      if (this.isDiffCurrency) {
        if (this.displayReqData.frnExchangeCost === 0) {
          messageBox.show('', '정산통화와 지급통화가 다른 공급사의 경우 송금환율 입력이 필수 입니다.');
          return;
        }

        if (this.displayReqData.frnPaymentAmt === 0) {
          messageBox.show('', '정산통화와 지급통화가 다른 공급사의 경우 송금환율 적용 지급액이 0원 일 경우 지급요청 할 수 없습니다.');
          return;
        }
      }

      messageBox
        .show('', `${this.selectedRows.length}건의 지급 요청을 하시겠습니까?`, 'YesNo')
        .then(dialog => {
          if (dialog === 'yes') {
            const rows = this.selectedRows;
            rows.forEach(row => {
              // Object.assign(row, {reqMemo: this.reqMemo, paymentReqDt: this.displayReqData.registDt, paymentDueDt: this.payDate, accountSubject: this.accountSubject});
              if (this.isEmpty(row.correctionAmt)) {
                Object.assign(row, {correctionAmt: 0});
              }
            });
            let mastInfo = {
              title: this.title,
              payRegistDt: this.displayReqData.registDt,
              payReqDt: this.payDate,
              standardCurrencyCode: this.displayReqData.standardCurrencyCode,
              payCurrencyCode: this.displayReqData.payCurrencyCode,
              frnExchangeCost: this.displayReqData.frnExchangeCost,
              paymentAmt: this.displayReqData.paymentAmt,
              frnPaymentAmt: this.displayReqData.frnPaymentAmt,
              erpDivCode: this.displayReqData.erpDivCode,
              diffCurrency: this.isDiffCurrency,
              vccCts: this.isVccCts,
              category: this.selectedRows[0].category
            };

            let payReqData = {mastInfo: mastInfo, detailInfoList: this.selectedRows};
            this.payRequestProcess(payReqData);
            this.onHandleClose();
          }
        });
    },
    onHandleCancel() {
      this.isDialogPopUp = false;
      this.isMultipleDialogPopUp = false;
    },
    onHandleClose(e) {
      this.isDialogPopUp = false;
      this.isMultipleDialogPopUp = false;
      this.displayReqData = {};
      this.displayReqData.registDt = this.toDay;
      this.displayReqData.frnExchangeCost = 0;
      this.displayReqData.frnPaymentAmt = 0;
      this.frnPaymentAmt = 0;
      console.log(e);
    },
    onHandleClick() {
      let isCurrencyCodeVaild = true;
      let isInvoiceTypeVaild = true;
      let isErpDivCodeVaild = true;
      let isHasDetailSaveVaild = true;
      let isCalcStateVaild = true;
      let isClientCodeVaild = true;
      let paymentAmt = 0;
      let frnPaymentAmt = 0;
      let payCurrencyCode = '';
      let standardCurrencyCode = '';
      let frnExchangeCost = 0;
      this.defaultFeeAmt = 0;
      this.isVccCts = false;
      this.isDiffCurrency = false;

      if (this.isEmpty(this.data)) {
        messageBox.show('', '조회된 데이터가 없습니다.');
        return;
      } else {
        this.selectedRows = this.data.filterBy(x => x.isChecked && !this.isEmpty(x.clientName), true);
        this.alreadyRequestRows = this.data.filterBy(x => x.isChecked && this.isEmpty(x.clientName), true);
      }

      this.selectedRows.forEach((item, index) => {
        if (index < this.selectedRows.length - 1) {
          if (isCurrencyCodeVaild && this.selectedRows[(index + 1)].payCurrencyCode !== item.payCurrencyCode) {
            isCurrencyCodeVaild = false;
          }

          if (isInvoiceTypeVaild && this.selectedRows[(index + 1)].invoiceType !== item.invoiceType) {
            isInvoiceTypeVaild = false;
          }

          if (isErpDivCodeVaild && this.selectedRows[(index + 1)].erpDivCode !== item.erpDivCode) {
            isErpDivCodeVaild = false;
          }

          if (isClientCodeVaild && this.selectedRows[(index + 1)].clientCode !== item.clientCode) {
            isClientCodeVaild = false;
          }
        }

        if (this.isEmpty(payCurrencyCode) && (item.defaultFee === false || this.selectedRows.length === 1)) {
          payCurrencyCode = item.payCurrencyCode;
        }

        if (this.isEmpty(standardCurrencyCode) && (item.defaultFee === false || this.selectedRows.length === 1)) {
          standardCurrencyCode = item.standardCurrencyCode;
        }

        if (frnExchangeCost === 0 && (item.defaultFee === false || this.selectedRows.length === 1)) {
          frnExchangeCost = item.frnExchangeCost;
        }

        if (isHasDetailSaveVaild && !item.hasDetailSave) {
          isHasDetailSaveVaild = false;
        }

        if (isCalcStateVaild) {
          if (!this.isEmpty(item.bookingInfoList)) {
            item.bookingInfoList.forEach((item) => {
              if (isCalcStateVaild && (item.calcProcState !== '93000003')) {
                isCalcStateVaild = false;
              }
            });
          }
        }

        if (!this.isDiffCurrency && (item.clientCode === 'B000000418' || item.clientCode === 'A000004518')) {
          this.isDiffCurrency = true;
        }

        if (!this.isTlLincoln && item.clientCode === 'A000004518') {
          this.isTlLincoln = true;
        }

        // toFixed를 활용해 소수점 더하기 버그 보정 ex) 1000 + 759.64 = 1759.6399999999999
        paymentAmt = new BigNumber(paymentAmt).plus(new BigNumber(item.paymentAmt)).toNumber();
        frnPaymentAmt = new BigNumber(frnPaymentAmt).plus(new BigNumber(item.frnPaymentAmt)).toNumber();
      });

      if (this.isEmpty(this.selectedRows) && this.isEmpty(this.alreadyRequestRows)) {
        messageBox.show('', '선택된 항목이 없습니다.');
        return;
      }

      // if (this.isDiffCurrency && this.selectedRows.length !== 1) {
      //   messageBox.show('', 'FitRuums 공급사의 경우 여러 항목을 한번에 요청 할 수 없습니다.');
      //   return;
      // }

      if (this.isDiffCurrency && !isClientCodeVaild) {
        messageBox.show('', '정산통화와 지급통화가 다른 공급사의 경우 다른 공급사와 같이 요청 할 수 없습니다.(e.g. fitruums, TlLincoln)');
        return;
      }

      if (!isHasDetailSaveVaild) {
        messageBox.show('', '상세내용을 작성하지 않은 항목을 요청 할 수 없습니다.');
        return;
      }

      if (!isErpDivCodeVaild) {
        messageBox.show('', '서로 다른 사업장은 한번에 요청 할 수 없습니다.');
        return;
      }

      if (!isInvoiceTypeVaild) {
        messageBox.show('', '서로 다른 지급 항목은 한번에 요청 할 수 없습니다.');
        return;
      }

      // vcc나 cts가 아닐때만 체크
      this.isVccCts = (this.selectedRows[0].invoiceType === '93300002' || this.selectedRows[0].invoiceType === '93300003');
      if (!isCurrencyCodeVaild && !this.isVccCts) {
        messageBox.show('', '서로 다른 통화 항목은 한번에 요청 할 수 없습니다.');
        return;
      }

      if (!isCalcStateVaild) {
        messageBox.show('', '정산상태가 지급요청대기가 아닌 예약이 있습니다. 새로고침 후 다시 시도해 주세요.');
        return;
      }

      if (paymentAmt === 0) {
        messageBox.show('', '지급액(결정액)이 0원은 지급요청을 할 수 없습니다.');
        return;
      }

      if (!this.isEmpty(this.alreadyRequestRows)) {
        messageBox.show('', '기요청, 기완료 공급사 코드가 미할당 된 항목은 요청 할 수 없습니다.');
        return;
      }

      // tl의 경우 기본수수료 추가
      if (this.selectedRows[0].clientCode === 'A000004518' && this.selectedRows[0].category === '93900002') {
        this.defaultFeeAmt = new BigNumber(100000).toNumber();
      }

      // if (this.selectedRows.length === 1) {
      //   Object.assign(this.displayReqData, {clientName: this.selectedRows[0].clientName, standardCurrencyCode: this.selectedRows[0].standardCurrencyCode, registDt: this.toDay});
      //   this.reqMemo = `${this.selectedRows[0].clientName} 지급요청`;
      //   this.isDialogPopUp = true;
      // } else {
      //   Object.assign(this.displayReqData, {clientName: this.selectedRows[0].clientName, standardCurrencyCode: this.selectedRows[0].standardCurrencyCode, registDt: this.toDay});
      //   this.reqMemo = `${this.selectedRows[0].clientName} 외 ${this.selectedRows.length - 1}건 지급요청`;
      //   this.isMultipleDialogPopUp = true;
      // }

      Object.assign(this.displayReqData, {
        clientName: this.selectedRows[0].clientName,
        standardCurrencyCode: this.isVccCts ? 'KRW' : standardCurrencyCode,
        payCurrencyCode: payCurrencyCode,
        frnExchangeCost: frnExchangeCost,
        registDt: this.toDay,
        paymentAmt: paymentAmt,
        frnPaymentAmt: frnPaymentAmt,
        erpDivCode: this.selectedRows[0].erpDivCode
      });

      this.title = `${this.toDay.substring(0, 4)}년 ${this.toDay.substring(5, 7)}월 ${this.$store.getters.userInfo.deptName} ${this.$store.getters.userInfo.userName} 지급요청서(${this.displayReqData.payCurrencyCode === 'KRW' ? '원화' : '외화'})`;
      this.isDialogPopUp = true;
      this.payDate = this.defaultPayDate.substring(0, 4) + '-' + this.defaultPayDate.substring(4, 6) + '-' + this.defaultPayDate.substring(6, 8);
      this.invoiceType = this.selectedRows[0].invoiceType;
      const invoiceItem = this.$store.getters.commonCode['invoiceType'].findValue((x) => x.detailCode, this.selectedRows[0].invoiceType);
      if (invoiceItem && invoiceItem.detailCodeNameKr) {
        this.invoiceTypeName = invoiceItem.detailCodeNameKr;
      }

      const salesTypeItem = this.$store.getters.commonCode['salesType'].findValue((x) => x.detailCode, this.selectedRows[0].salesType);
      if (salesTypeItem && salesTypeItem.detailCodeNameKr) {
        this.salesTypeName = salesTypeItem.detailCodeNameKr;
      }

      if (this.selectedRows[0].erpDivCode === '100') {
        this.erpDivCodeName = 'TIDESQUARE';
      } else if (this.selectedRows[0].erpDivCode === '130') {
        this.erpDivCodeName = '(주)타이드스퀘어 투어비스';
      }
    },
    disabledDueDate(time) {
      let date = new Date(this.defaultPayDate.substring(0, 4) + '-' + this.defaultPayDate.substring(4, 6) + '-' + this.defaultPayDate.substring(6, 8));
      date.setDate(date.getDate() - 1);
      return time.getTime() < date;
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
</style>
