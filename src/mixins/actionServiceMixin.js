export const actionServiceMixin = {
  methods: {
    calcProcess(calcType, bookingInfoList, calcRevenueYearMonth, cancelPageYn) {
      if (this.isEmpty(calcRevenueYearMonth)) {
        calcRevenueYearMonth = '-';
      }
      // cancelPageYn : 파라곤 취소수수료 발생 페이지에서 넘어왔을 경우 Y
      this.httpPut(`/api/common/action/calcProcess/${calcType}/${cancelPageYn}/${calcRevenueYearMonth}`, bookingInfoList).then(() => {
        messageBox.show('', '요청 처리되었습니다.').then(this.$emit('callback'));
      });
    },
    calcCancelProcess(calcType, bookingInfoList) {
      this.httpPut(`/api/common/action/calcCancelProcess/${calcType}/false`, bookingInfoList).then(() => {
        messageBox.show('', '요청 처리되었습니다.').then(this.$emit('callback'));
      });
    },
    feeCalcProcess(calcType, calcRevenueYearMonth, bookingInfoList) {
      this.httpPut(`/api/common/action/feeCalcProcess/${calcType}/${calcRevenueYearMonth}`, bookingInfoList).then(() => {
        messageBox.show('', '요청 처리되었습니다.').then(this.$emit('callback'));
      });
    },
    feeCalcCancelProcess(calcType, bookingInfoList) {
      this.httpPut(`/api/common/action/feeCalcCancelProcess/${calcType}`, bookingInfoList).then(() => {
        messageBox.show('', '요청 처리되었습니다.').then(this.$emit('callback'));
      });
    },
    combinedCalcCancelProcess(bookingIdInfoList, bookingNoInfoList) {
      if (!this.isEmpty(bookingIdInfoList)) {
        // 파라곤
        this.httpPut(`/api/common/action/calcCancelProcess/P/true`, bookingIdInfoList).then(() => {
          if (!this.isEmpty(bookingNoInfoList)) {
            // TAVI
            this.httpPut(`/api/common/action/calcCancelProcess/T/true`, bookingNoInfoList).then(() => {
              messageBox.show('', '요청 처리되었습니다.').then(this.$emit('callback'));
            });
          } else {
            messageBox.show('', '요청 처리되었습니다.').then(this.$emit('callback'));
          }
        });
      } else if (!this.isEmpty(bookingNoInfoList)) {
        // TAVI
        this.httpPut(`/api/common/action/calcCancelProcess/T/true`, bookingNoInfoList).then(() => {
          messageBox.show('', '요청 처리되었습니다.').then(this.$emit('callback'));
        });
      }
    },
    calcCompareProcess(compareObj) {
      this.httpPut(`/api/common/action/procCalcCompare`, compareObj).then(() => {
        messageBox.show('', '요청 처리되었습니다.').then(this.$emit('callback'));
      });
    },
    reqManagerConfirm(bookingId, calcType, reqMemo = null, bookingManagerId = null) {
      const data = {
        bookingIdList: bookingId,
        calcType: calcType,
        reqMemo: reqMemo,
        bookingManagerId: bookingManagerId
      };
      this.httpPost(`/api/common/action/reqManagerConfirm`, data).then(() => {
        messageBox.show('', '요청 처리되었습니다.').then(this.$emit('callback'));
      });
    },
    payRequestProcess(payReqData) {
      this.httpPost(`/api/common/action/payRequestProcess`, payReqData).then(() => {
        messageBox.show('', '요청 처리되었습니다.').then(this.$emit('callback'));
      });
    },
    payReqCancelProcess(payMastIdList) {
      this.httpPut(`/api/common/action/payRequestCancelProcess`, payMastIdList).then(() => {
        messageBox.show('', '요청 처리되었습니다.').then(this.$emit('callback'));
      });
    },
    bookingLockChangeProcess(calcType, calcModYn, bookingIds) {
      this.httpPut(`/api/common/bookingLock/${calcType}/${calcModYn}`, bookingIds).then(() => {
        messageBox.show('', '요청 처리되었습니다.').then(this.$emit('callback'));
      });
    },
    benefitCloseProcess(data) {
      this.httpPost(`/api/common/action/benefitCloseProcess`, data).then(() => {
        messageBox.show('', '요청 처리되었습니다.').then(this.$emit('callback'));
      });
    },
    uploadDelete(url, uploadInfoList) {
      this.httpPut(url, uploadInfoList).then(() => {
        messageBox.show('', '요청 처리되었습니다.').then(this.$emit('callback'));
      });
    },
    async sendTaxInvoiceEmail(data) {
      await this.httpPost(`/api/common/action/sendTaxInvoiceEmail`, data).then(() => {
        messageBox.show('', '발송 되었습니다.').then(this.$emit('callback'));
      });
    },
    async initTaxInvoiceEmail(bookingNoList, taxInvoiceType) {
      await this.httpPost(`/api/common/action/initTaxInvoiceEmail/${taxInvoiceType}`, bookingNoList).then(() => {
        messageBox.show('', '초기화 되었습니다.').then(this.$emit('callback'));
      });
    },
    async checkTaxInvoiceEmail(bookingNoList, taxInvoiceType, checkYn) {
      await this.httpPost(`/api/common/action/checkTaxInvoiceEmail/${taxInvoiceType}/${checkYn}`, bookingNoList).then(() => {
        messageBox.show('', '요청 처리되었습니다.').then(this.$emit('callback'));
      });
    },
    async payRequestTempSave(detailInfoData) {
      await this.httpPost(`/api/common/action/payRequestTempSave`, detailInfoData).then(() => {
        messageBox.show('', '저장 되었습니다.').then(this.$emit('callback'));
      });
    },
    calcStateValidCheck(bookingInfoList) {
      if (!this.isEmpty(bookingInfoList)) {
        let isValid = true;

        bookingInfoList.forEach(data => {
          if (isValid && this.isEmpty(data.calcDetailState) && this.isEmpty(data.feeCalcState)) {
            isValid = false;
          } else if (isValid && !this.isEmpty(data.calcDetailState) && data.calcDetailState !== this.possibleCalcDetailState()) {
            if (this.getPageName() === 'pcancelfeecheck' && data.calcDetailState !== '93100002') {
              // 파라곤 취소예약 화면에서는 두가지 정산상태가 가능
              isValid = false;
            } else if (this.getPageName() === 'pexpcom') {
              // 익스피디아 후컴은 정산상태 체크 X
            } else {
              isValid = false;
            }
          } else if (isValid && !this.isEmpty(data.feeCalcState) && data.feeCalcState !== this.possibleFeeCalcState()) {
            isValid = false;
          }
        });

        return isValid;
      }

      return false;
    },
    possibleCalcDetailState() {
      const pageName = this.getPageName();
      let calcDetailState = '';

      switch (pageName) {
        case 'psalescalc':
          calcDetailState = '93100001';
          break;
        case 'prnptavi':
          calcDetailState = '93100004';
          break;
        case 'tcancelfeecheck':
          calcDetailState = '93100001';
          break;
        default:
          calcDetailState = 'error';
      }

      return calcDetailState;
    },
    possibleFeeCalcState() {
      const pageName = this.getPageName();
      let feeCalcState = '';
      switch (pageName) {
        case 'derby':
        case 'tllincoln':
        case 'tripanzee':
        case 'siteminder':
        case 'sanha':
        case 'skypasscalc':
          feeCalcState = '93000006';
          break;
        default:
          feeCalcState = 'error';
      }

      return feeCalcState;
    }
  }
};
