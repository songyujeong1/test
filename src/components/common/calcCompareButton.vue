<template>
  <fr-button type="U" size="small" @click="onHandleClick" :disabled="this.buttonDisable">대사실행</fr-button>
</template>
<script>
import { actionServiceMixin } from '@/mixins/actionServiceMixin';
import { uniq, has } from 'lodash';

export default {
  name: 'calcCompareButton',
  mixins: [actionServiceMixin],
  props: {
    data: {
      type: Array,
      default: null
    },
    isBundle: {
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
      noBookingInfoRows: null,
      pageName: null,
      buttonDisable: false
    };
  },
  created() {
    this.pageName = this.getPageName();
    this.calcType = this.getCalcType(this.pageName);
    this.isCommissionYn = this.getCommissionYn(this.pageName);
  },
  watch: {
    calcProcState(code) {
      const pageName = this.pageName;
      if (!this.isEmpty(code)) {
        switch (pageName) {
          case 'psalescalc':
          case 'csalescalc':
          case 'pcancelfeecheck':
          case 'tcancelfeecheck':
            if (code === '93000001') {
              this.buttonDisable = false;
            } else {
              this.buttonDisable = true;
            }
            break;
          case 'prnpxml':
          case 'prnptavi':
          case 'pexpcom':
          case 'tavirnpinvoice':
          case 'tavirnpvcc':
          case 'tavirnpcts':
            if (code === '93000002') {
              this.buttonDisable = false;
            } else {
              this.buttonDisable = true;
            }
            break;
          default:
            break;
        }
      }
    }
  },
  methods: {
    onHandleClick() {
      if (this.isEmpty(this.data) ) {
        messageBox.show('', '조회된 데이터가 없습니다.');
        return;
      }
      let bookingInfoList = [];
      if (this.isBundle === false) {
        if (this.data) {
          this.checkedRow = this.data.filterBy(x => x.isChecked, true);
          if (this.isEmpty(this.checkedRow)) {
            messageBox.show('', '선택된 항목이 없습니다.');
            return;
          }
          if (this.calcType === 'P') {
            this.selectedRows = this.data.filterBy(x => x.isChecked && !this.isEmpty(x.bookingId), true);
          } else {
            this.selectedRows = this.data.filterBy(x => x.isChecked && !this.isEmpty(x.bookingNo), true);
          }
        }
        if (this.isEmpty(this.selectedRows)) {
          messageBox.show('', '예약번호가 존재 하지 않는 데이터는 처리되지 않습니다.');
          return;
        } else {
          this.selectedRows.map(item => {
            if (has(item, 'bookingId') && !this.isEmpty(item.bookingId) && !this.isEmpty(item.calcDetailState)) {
              bookingInfoList.push({'bookingId': item.bookingId, 'calcDetailState': item.calcDetailState});
            } else if (has(item, 'bookingNo') && !this.isEmpty(item.bookingNo) && !this.isEmpty(item.calcDetailState)) {
              bookingInfoList.push({'bookingId': item.bookingNo, 'calcDetailState': item.calcDetailState});
            }
          });
        }
      } else {
        if (this.data) {
          this.selectedRows.map(item => {
            if (has(item, 'bookingId') && !this.isEmpty(item.bookingId) && !this.isEmpty(item.calcDetailState)) {
              bookingInfoList.push({'bookingId': item.bookingId, 'calcDetailState': item.calcDetailState});
            } else if (has(item, 'bookingNo') && !this.isEmpty(item.bookingNo) && !this.isEmpty(item.calcDetailState)) {
              bookingInfoList.push({'bookingId': item.bookingNo, 'calcDetailState': item.calcDetailState});
            }
          });
        }
      }

      if (!this.calcStateValidCheck(uniq(bookingInfoList))) {
        messageBox.show('', '해당 페이지에서 처리 할 수 없는 정산상태 예약이 있습니다.');
        return;
      }

      const compareObj = Object.assign({}, {
        bookingInfoList: uniq(bookingInfoList),
        calcType: this.calcType,
        isCommissionYn: this.isCommissionYn
      });
      messageBox.show('', '대사실행 하시겠습니까?<br/>(예약번호가 존재 하지 않는 데이터는 처리되지 않습니다.)', 'YesNo').then(dialog => {
        if (dialog === 'yes') {
          this.calcCompareProcess(compareObj);
        }
      });
    }
  }
};
</script>
