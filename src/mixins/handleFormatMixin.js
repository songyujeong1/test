import store from '@/store';

export const handleFormatMixin = {
  methods: {
    // 결재차액
    getDifferenceSalePrice(row) {
      return this.$n(row.totalSaleFare - Math.abs(row.totalPaymentAmt));
    },
    getCompareBpPoint(row) {
      return this.$n(row.bpAmt - Math.abs(row.transferAmt));
    },
    // PG 대사금액
    getPgDifferenceCost(row) {
      return this.$nMinus(row.paymentCost, Math.abs(row.calcAmt), Math.abs(row.pksAmount));
    },
    // 선할인
    getPreviousDiscountAmt(row) {
      return this.$nPlus(row.etcDiscPrice, row.tsSalesPrice, row.discountFare);
    },
    // 카드 결재금액
    getCardPaymentCost(row) {
      return this.$nMinus(row.paymentCost, row.calcAmt, row.pksAmount);
    },
    // 대사차액
    getCompareDifferenceCost(row) {
      return this.$nMinus(row.totalSaleFare, row.bpAmt, row.discountFare, row.cardAmt);
    },
    // 대사차액 => 수정
    getCompareKcpDifferenceCost(row) {
      return this.$nMinus(row.paymentCost, row.transferAmt);
    },
    // 청구차액
    getChargeDifferenceAmt(row) {
      return this.$nMinus(row.supplyPaymentInt, row.chargeAmt);
    },
    // TAVI 송금 청구차액(외화)
    getTiiChargeDiffAmt(row) {
      return this.$nMinus(row.supplyPaymentInt, row.tiiChargeAmt);
    },
    // CTS 청구금액(KRW 인지)
    getCtsChargeAmt(row) {
      return row.tciChargeCurrencyCode === 'KRW' ? this.$nNaN(row.tciDomChargeAmt) : this.$nNaN(row.tciIntLocalAmt);
    },
    // TAVI 현지 청구차액
    getTciIntLocalAmt(row) {
      return this.$nMinus(row.supplyPaymentInt, row.tciIntLocalAmt);
    },
    getTciIntLocalAmt2(row) {
      return row.tciChargeCurrencyCode === 'KRW' ? this.$nMinus(row.supplyPaymentInt, row.tciDomChargeAmt) : this.$nMinus(row.supplyPaymentInt, row.tciIntLocalAmt);
    },
    // TAVI VCC 청구차액
    getEviVccAmt(row) {
      return this.$nMinus(row.supplyPaymentInt, row.eviVccAmtInt);
    },
    getMarketingFeeRate(row) {
      return this.$nNaN(row.marketingFeeRate) + ' %';
    },
    getSalesAmt(row) {
      let result = 0;

      if (!this.isEmpty(row.markupWon) && row.markupWon !== 0) {
        result = result + row.markupWon;
      }

      if (!this.isEmpty(row.commissionWon) && row.commissionWon !== 0) {
        result = result + row.commissionWon;
      }

      return result; // 1. 매출 = M/U + 공급컴(현재 없음)
    },
    getDealTypeName(row) {
      if (row.bfpDealType === 'A') {
        return '승인';
      } else if (row.bfpDealType === 'C') {
        return '취소';
      } else if (row.bfpDealType === 'R') {
        return '환불';
      }

      return '';
    },
    getCouponNames(row) {
      if ( row.couponInfoList ) {
        return row.couponInfoList.map(x => {
          return x.name;
        }).join(',');
      }

      return '';
    },
    getCommissonDiffSlot(row) {
      return this.$nMinus(row.commissionInt, row.marketingFee);
    },
    getCouponAmt(row) {
      if ( row.couponInfoList ) {
        return row.couponInfoList.map(x => {
          return this.$n(x.amt);
        }).join(',');
      }

      return '';
    },
    // M/U 합계
    getMarkupSum(row) {
      return this.$nPlus(row.markupVat, row.markupSupply);
    },
    // 수익률
    getProfit(row) {
      return this.$nDiv(row.totalSaleFare, row.supplyPaymentWon) + ' %';
    },
    getTSProfitCommsion(row) {
      return this.$nNaN((row.commissionWon + row.markupFare) - row.calcFeeAmt);
    },
    getTSProfitCommsion2(row) { // 공급컴 + M/U – 이니시스 수수료 (TS순수익)의 inicisRate(변수명fail KCP)
      return this.$nNaN(((row.commissionWon + row.markupFare) - row.calcFeeAmt) * ( 100 - row.inicisRate) / 100 );
    },
    getHccDiscountRate(row) {
      return this.$n(row.hccDiscountRate);
    },
    getFamilyDiscountRate(row) {
      return this.$n(row.familyDiscountRate);
    },
    getCardClientList(row) {
      if (this.isEmpty(row.cardClientList)) return;
      let clientList = '';
      const list = row.cardClientList;
      list.forEach((element, index, list) => {
        if (index + 1 >= list.length) {
          clientList = clientList.concat(`${element}`);
        } else {
          clientList = clientList.concat(`${element} / `);
        }
      });
      return clientList;
    },
    getCancelChargeYn(row) {
      if (row.cancelChargeYn === 'Y') {
        return '발생';
      } else {
        return '미발생';
      }
    },
    getCancelSupplyNetInt(row) {
      return this.$nNaN(row.cancelSupplyNetInt);
    },
    getCancelSupplyNetWon(row) {
      return this.$nNaN(row.cancelSupplyNetWon);
    },
    getCancelTaviDiscountInt(row) {
      return this.$nNaN(row.cancelTaviDiscountInt);
    },
    getCancelTaviDiscountWon(row) {
      return this.$nNaN(row.cancelTaviDiscountWon);
    },
    getCancelTesDiscountInt(row) {
      return this.$nNaN(row.cancelTesDiscountInt);
    },
    getCancelTesDiscountWon(row) {
      return this.$nNaN(row.cancelTesDiscountWon);
    },
    getCancelCommDiscountInt(row) {
      return this.$nNaN(row.cancelCommDiscountInt);
    },
    getCancelCommDiscountWon(row) {
      return this.$nNaN(row.cancelCommDiscountWon);
    },
    getCancelAddFareInt(row) {
      return this.$nNaN(row.cancelAddFareInt);
    },
    getCancelAddFareWon(row) {
      return this.$nNaN(row.cancelAddFareWon);
    },
    getCancelMarkupInt(row) {
      return this.$nNaN(row.cancelMarkupInt);
    },
    getCancelMarkupWon(row) {
      return this.$nNaN(row.cancelMarkupWon);
    },
    getCancelBookingConfirmInt(row) {
      return this.$nNaN(row.cancelBookingConfirmInt);
    },
    getCancelMarkupFare(row) {
      return this.$nNaN(row.cancelMarkupFare);
    },
    getCancelDiscountFare(row) {
      return this.$nNaN(row.cancelDiscountFare);
    },
    getCancelBookingConfirmFare(row) {
      return this.$nNaN(row.cancelBookingConfirmFare);
    },
    getCancelTotalSaleFare(row) {
      return this.$nNaN(row.cancelTotalSaleFare);
    },
    getBookingCode(row) {
      return row.bookingCode;
    },
    getBookingNo(row) {
      return row.bookingNo;
    },
    getBookingId(row) {
      return row.bookingId;
    },
    getEviVccAmtInt(row) {
      return this.$nNaN(row.eviVccAmtInt);
    },
    getEviChargeAmt(row) {
      return this.$nNaN(row.eviChargeAmt);
    },
    getEviVccAmtWon(row) {
      return this.$nNaN(row.eviVccAmtWon);
    },
    getEviVccAmtVat(row) {
      return this.$nNaN(Math.round(row.eviVccAmtWon * 0.00178));
    },
    getMergedEviVccAmtInt(row) {
      const target = this.isEmpty(row.bookingNo) ? (this.isEmpty(row.eviBookingNo) ? '' : row.eviBookingNo ) : row.bookingNo;
      return this.$nNaN(this.mergedAmt.eviVccAmtInt[target]);
    },
    getMergedEviChargeAmt(row) {
      const target = this.isEmpty(row.bookingNo) ? (this.isEmpty(row.eviBookingNo) ? '' : row.eviBookingNo ) : row.bookingNo;
      return this.$nNaN(this.mergedAmt.eviChargeAmt[target]);
    },
    getMergedEviVccAmtWon(row) {
      const target = this.isEmpty(row.bookingNo) ? (this.isEmpty(row.eviBookingNo) ? '' : row.eviBookingNo ) : row.bookingNo;
      return this.$nNaN(this.mergedAmt.eviVccAmtWon[target]);
    },
    getMergedEviVccAmtVat(row) {
      const target = this.isEmpty(row.bookingNo) ? (this.isEmpty(row.eviBookingNo) ? '' : row.eviBookingNo ) : row.bookingNo;
      return this.$nNaN(Math.round(this.mergedAmt.eviVccAmtWon[target] * 0.00178));
    },
    getMergedCtsChargeAmt(row) {
      let target = null;
      if (this.isEmpty(row.bookingNo) && this.isEmpty(row.bookingId)) {
        target = 'Y' + row.tciApprovalNo;
      } else if (!this.isEmpty(row.bookingNo)) {
        target = 'N' + row.bookingNo;
      } else if (!this.isEmpty(row.bookingId)) {
        target = 'N' + row.bookingId;
      }
      // const target = this.isEmpty(row.bookingNo) ? 'Y' + row.tciApprovalNo : 'N' + row.bookingNo; //  병합용으로 식별할 수 있는키 값-groupKey
      return row.tciChargeCurrencyCode === 'KRW' ? this.$nNaN(this.mergedAmt.tciDomChargeAmt[target]) : this.$nNaN(this.mergedAmt.tciIntLocalAmt[target]);
    },
    getTciDomChargeAmt(row) {
      return this.$nNaN(row.tciDomChargeAmt);
    },
    getMergedTciDomChargeAmt(row) {
      let target = null;
      if (this.isEmpty(row.bookingNo) && this.isEmpty(row.bookingId)) {
        target = 'Y' + row.tciApprovalNo;
      } else if (!this.isEmpty(row.bookingNo)) {
        target = 'N' + row.bookingNo;
      } else if (!this.isEmpty(row.bookingId)) {
        target = 'N' + row.bookingId;
      }
      return this.$nNaN(this.mergedAmt.tciDomChargeAmt[target]);
    },
    getMergedChargeDiffAmt(row) {
      let target = null;
      if (this.isEmpty(row.bookingNo) && this.isEmpty(row.bookingId)) {
        target = 'Y' + row.tciApprovalNo;
      } else if (!this.isEmpty(row.bookingNo)) {
        target = 'N' + row.bookingNo;
      } else if (!this.isEmpty(row.bookingId)) {
        target = 'N' + row.bookingId;
      }
      return row.tciChargeCurrencyCode === 'KRW' ? this.$nMinus(this.mergedAmt.tciDomChargeAmt[target], row.supplyPaymentInt) : this.$nMinus(this.mergedAmt.tciIntLocalAmt[target], row.supplyPaymentInt);
    },
    fromSnakeToCamelCase(str) {
      return str.replace(/([-_][a-z])/g, (group) => group[1].toUpperCase());
    },
    handleOldContentHistory(row) {
      return this.handleHistoryContent(row.changeColumn, row.oldContent);
    },
    handleNewContentHistory(row) {
      return this.handleHistoryContent(row.changeColumn, row.newContent);
    },
    handleHistoryContent(changeColumn, content) {
      let rtn = content;
      switch (changeColumn) { // 이력테이블에 남겨지는 컬럼
        //  일반
        case 'booking_code': //  예약 코드
        case 'calc_proc_user': //  정산처리사용자
        case 'cancel_charge_yn': //  취소수수료 발생 여부
        case 'channel_ref_no': //  채널예약번호
        case 'pay_req_id': //  지급요청아이디
        case 'standard_currency_code': //  기준 통화 코드
          break;
        //  금액
        case 'exchange_cost': //  환전 금액
        case 'standard_cost': //  기준 금액
          rtn = this.$nNaN(rtn);
          break;
        //  일자
        case 'booking_reqs_dt': //  예약 요청 일시
        case 'calc_proc_dt': //  정산완료일
        case 'checkin_date': //  체크인 일자
        case 'checkout_date': //  체크아웃 일자
        case 'standard_date': //  기준 일자
          break;
        //  코드
        case 'booking_state': //  예약상태
        case 'calc_detail_state': //  정산처리상세상태
        case 'calc_proc_state': //  정산처리상태
        case 'commission_error_state': // 후컴 오류 상태
        case 'error_upper_state': //  오류/불일치 유형
        case 'error_detail_state': // 오류/불일치 유형상세
        case 'invoice_type': // 지급유형
        case 'sales_type': // 판매채널
          const _column = this.fromSnakeToCamelCase(changeColumn);
          const item = store.getters.commonCode[_column].findValue((x) => x.detailCode, content);
          if ( item && item.detailCodeNameKr ) {
            rtn = item.detailCodeNameKr;
          } else {
            if (_column === 'errorUpperState') {
              rtn = '대사 정보 불일치';
            } else if (_column === 'errorDetailState' || _column === 'commissionErrorState') {
              rtn = '대사 정보 누락';
            }
          }
          break;
        case 'locale_type': //  국내/해외구분
          if (content === 'INT') {
            rtn = '해외';
          } else if (content === 'DOM') {
            rtn = '국내';
          }
          break;
        //  데이터
        case 'spr_id': // 공급사 아이디
        case 'client_code': // 거래처코드
        case 'facility_no': // 시설번호
          break;
      }
      //  console.log(content, _column, rtn);
      return rtn;
    },
    getSprNameKr(row) {
      return row.sprNameKr || row.sciSprNameKr;
    }
  }
};
