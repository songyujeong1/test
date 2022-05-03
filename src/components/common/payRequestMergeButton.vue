<template>
  <fr-button type="U" size="small" @click="onHandleClick" :disabled="buttonDisable">지급요청건 병합</fr-button>
</template>
<script>
import { menuServiceMixin } from '@/mixins/menuServiceMixin';
import { actionServiceMixin } from '@/mixins/actionServiceMixin';
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';

export default {
  name: 'payRequestMergeButton',
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
    }
  },
  data() {
    return {
      selectedRows: null,
      noClientInfoRows: null,
      buttonDisable: false,
      unCheckedRows: null
    };
  },
  created() {
    this.pageName = this.getPageName();
  },
  mounted() {},
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
      messageBox
        .show('', `${this.selectedRows.length}건의 지급요청건을 <span style="color:red">병합</span> 하시겠습니까?<br/>`, 'YesNo')
        .then(dialog => {
          if (dialog === 'yes') {
            this.handleMergeRows();
          }
        });
    },
    onHandleClick() {
      if (this.isEmpty(this.data)) {
        messageBox.show('', '조회된 데이터가 없습니다.');
        return;
      } else {
        this.selectedRows = this.data.filterBy(x => x.isChecked && !this.isEmpty(x.clientName), true);
        this.unCheckedRows = this.data.filterBy(x => !x.isChecked, true);
        this.noClientInfoRows = this.data.filterBy(x => x.isChecked && this.isEmpty(x.clientName), true);
      }
      if (this.isEmpty(this.selectedRows) && this.isEmpty(this.noClientInfoRows)) {
        messageBox.show('', '선택된 항목이 없습니다.');
        return;
      } else if (!this.isEmpty(this.noClientInfoRows)) {
        messageBox.show('', '공급사 정보(이름, 코드)가 없는 항목은 병합 할 수 없습니다.');
        return;
      } else if (this.selectedRows.length === 1) {
        messageBox.show('', '병합 할 항목을 선택 해주세요.');
        return;
      }
      if (this.selectedRows.some(function (item, index, array) {
        return (item.clientCode + item.invoiceType + item.standardCurrencyCode) !== (array[0].clientCode + array[0].invoiceType + array[0].standardCurrencyCode);
        //  return (item.clientCode + item.standardCurrencyCode) !== (array[0].clientCode + array[0].standardCurrencyCode);
      })) {
        messageBox.show('', '공급사 정보(이름, 코드), 통화코드, 지급유형이 일치하는 항목만 병합 가능합니다.');
        return;
      }
      this.onHandleConfirm();
    },
    handleMergeRows() {
      let tempData = {};
      let tempLastCalcYearMonth = '';
      this.selectedRows.forEach((item, index) => {
        if (index === 0) {
          Object.assign(tempData, item);
          tempLastCalcYearMonth = item.calcRevenueYear.concat(item.calcRevenueMonth);
        } else {
          Object.assign(tempData, {
            amountPay: tempData.amountPay + item.amountPay,
            supplyPaymentInt: tempData.supplyPaymentInt + item.supplyPaymentInt,
            noPaymentAmt: tempData.noPaymentAmt + item.noPaymentAmt,
            prePaymentAmt: tempData.prePaymentAmt + item.prePaymentAmt,
            totalSaleFare: tempData.totalSaleFare + item.totalSaleFare,
            supplyNetWon: tempData.supplyNetWon + item.supplyNetWon,
            addFareWon: tempData.addFareWon + item.addFareWon,
            commissionWon: tempData.commissionWon + item.commissionWon,
            markupFare: tempData.markupFare + item.markupFare,
            preDiscountAmt: tempData.preDiscountAmt + item.preDiscountAmt,
            mainPaymentAmt: tempData.mainPaymentAmt + item.mainPaymentAmt,
            subPaymentAmt: tempData.subPaymentAmt + item.subPaymentAmt,
            chargeAmt: tempData.chargeAmt + item.chargeAmt,
            sprTotalSaleFare: tempData.sprTotalSaleFare + item.sprTotalSaleFare,
            sprSupplyNetWon: tempData.sprSupplyNetWon + item.sprSupplyNetWon,
            sprAddFareWon: tempData.sprAddFareWon + item.sprAddFareWon,
            sprCommissionWon: tempData.sprCommissionWon + item.sprCommissionWon,
            sprMarkupFare: tempData.sprMarkupFare + item.sprMarkupFare,
            sprPreDiscountAmt: tempData.sprPreDiscountAmt + item.sprPreDiscountAmt,
            sprMainPaymentAmt: tempData.sprMainPaymentAmt + item.sprMainPaymentAmt,
            sprSubPaymentAmt: tempData.sprSubPaymentAmt + item.sprSubPaymentAmt,
            detailInfoList: tempData.detailInfoList.concat(item.detailInfoList)
          });
          if (item.calcRevenueYear.concat(item.calcRevenueMonth) > tempLastCalcYearMonth) { //  병합된 데이터에서 사용할 정산년월 병합건 중 가장 최근값으로
            tempLastCalcYearMonth = item.calcRevenueYear.concat(item.calcRevenueMonth);
            Object.assign(tempData, {calcRevenueYear: item.calcRevenueYear, calcRevenueMonth: item.calcRevenueMonth});
          }
        }
      });
      const mergedData = this.unCheckedRows.concat(new Array(tempData));
      messageBox.show('', '병합 처리되었습니다.').then(this.$emit('callback', mergedData));
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
