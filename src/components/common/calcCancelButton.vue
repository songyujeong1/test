<template>
  <fr-button type="D" size="small" @click="onHandleClick" :disabled="buttonDisable">정산취소</fr-button>
</template>
<script>
import { actionServiceMixin } from '@/mixins/actionServiceMixin';
import { uniq, has, filter } from 'lodash';

export default {
  name: 'calc-cancel-button',
  mixins: [actionServiceMixin],
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
    calcProcState: {
      required: false,
      default: null
    }
  },
  data() {
    return {
      selectedRows: null,
      pageName: null,
      calcType: 'P',
      buttonDisable: false
    };
  },
  created() {
    this.pageName = this.getPageName();
    this.calcType = this.getCalcType(this.pageName);
  },
  watch: {
    calcProcState(code) {
      console.log(code);
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

      if (this.pageName === 'sprpayrequest') {
        let bookingIdInfoList = [];
        let bookingNoInfoList = [];

        fileterRow.map(item => {
          if (has(item, 'bookingId') && !this.isEmpty(item.bookingId) && !this.isEmpty(item.calcDetailState) && item.calcType === 'P') {
            bookingIdInfoList.push({'bookingId': item.bookingId, 'calcDetailState': item.calcDetailState});
          } else if (has(item, 'bookingId') && !this.isEmpty(item.bookingId) && !this.isEmpty(item.calcDetailState) && item.calcType === 'T') {
            bookingNoInfoList.push({'bookingId': item.bookingId, 'calcDetailState': item.calcDetailState});
          }

          if (this.isEmpty(bookingIdInfoList) && this.isEmpty(bookingNoInfoList)) {
            messageBox.show('', '처리할 데이터가 없습니다.');
            return;
          }

          const confirmMsg = '<span style="color:red">정산취소</span> 처리를 하시겠습니까?<br/>(예약번호가 존재 하지 않는 데이터는 처리되지 않습니다.';
          messageBox.show('', confirmMsg, 'YesNo').then(dialog => {
            if (dialog === 'yes') {
              this.combinedCalcCancelProcess(uniq(bookingIdInfoList), uniq(bookingNoInfoList));
            }
          });
        });
      } else if (this.pageName === 'cmspayrequest') {
        let bookingNoInfoList = [];

        fileterRow.map(item => {
          if (has(item, 'bookingId') && !this.isEmpty(item.bookingId) && !this.isEmpty(item.calcProcState) && item.calcType === 'T') {
            bookingNoInfoList.push({'bookingId': item.bookingId, 'feeCalcState': item.calcProcState});
          }
        });

        if (this.isEmpty(bookingNoInfoList)) {
          messageBox.show('', '처리할 데이터가 없습니다.');
          return;
        }

        const confirmMsg = '<span style="color:red">정산취소</span> 처리를 하시겠습니까?<br/>(예약번호가 존재 하지 않는 데이터는 처리되지 않습니다.';
        messageBox.show('', confirmMsg, 'YesNo').then(dialog => {
          if (dialog === 'yes') {
            this.feeCalcCancelProcess('T', uniq(bookingNoInfoList));
          }
        });
      } else if (this.pageName === 'skypasspayrequest') {
        let bookingIdInfoList = [];

        fileterRow.map(item => {
          if (has(item, 'bookingId') && !this.isEmpty(item.bookingId) && !this.isEmpty(item.calcProcState) && item.calcType === 'P') {
            bookingIdInfoList.push({'bookingId': item.bookingId, 'feeCalcState': item.calcProcState});
          }
        });

        if (this.isEmpty(bookingIdInfoList)) {
          messageBox.show('', '처리할 데이터가 없습니다.');
          return;
        }

        const confirmMsg = '<span style="color:red">정산취소</span> 처리를 하시겠습니까?<br/>(예약번호가 존재 하지 않는 데이터는 처리되지 않습니다.';
        messageBox.show('', confirmMsg, 'YesNo').then(dialog => {
          if (dialog === 'yes') {
            this.feeCalcCancelProcess('P', uniq(bookingIdInfoList));
          }
        });
      } else {
        let bookingInfoList = [];
        fileterRow.map(item => {
          if (has(item, 'bookingId') && !this.isEmpty(item.bookingId) && !this.isEmpty(item.calcDetailState)) {
            bookingInfoList.push({'bookingId': item.bookingId, 'calcDetailState': item.calcDetailState});
          } else if (has(item, 'bookingNo') && !this.isEmpty(item.bookingNo) && !this.isEmpty(item.calcDetailState)) {
            bookingInfoList.push({'bookingId': item.bookingNo, 'calcDetailState': item.calcDetailState});
          }
        });

        if (this.isEmpty(bookingInfoList)) {
          messageBox.show('', '처리할 데이터가 없습니다.');
          return;
        }
        const confirmMsg = '<span style="color:red">정산취소</span> 처리를 하시겠습니까?<br/>(예약번호가 존재 하지 않는 데이터는 처리되지 않습니다.';
        messageBox.show('', confirmMsg, 'YesNo').then(dialog => {
          if (dialog === 'yes') {
            this.calcCancelProcess(this.calcType, uniq(bookingInfoList));
            // this.$emit('callback');
          }
        });
      }
    }
  }
};
</script>
