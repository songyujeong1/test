<template>
  <fr-button type="L" size="small" @click="onHandleClick" :disabled="buttonDisable">혜택 마감</fr-button>
</template>
<script>
import { menuServiceMixin } from '@/mixins/menuServiceMixin';
import { actionServiceMixin } from '@/mixins/actionServiceMixin';
import { commonCodeServiceMixin } from '@/mixins/commonCodeServiceMixin';

export default {
  name: 'benefitCloseButton',
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
    isPaymentInfoGroup: { // paymentInfoId가 Grouping 된 경우
      type: Boolean,
      default: false
    },
    calcType: {
      required: false,
      default: null
    }
  },
  data() {
    return {
      selectedRows: null,
      alreadyLockedRows: null,
      buttonDisable: false
    };
  },
  created() {
    this.pageName = this.getPageName();
  },
  mounted() {},
  methods: {
    onHandleConfirm() {
      messageBox
        .show('', `${this.selectedRows.length}건의 혜택을 <span style="color:red">마감 처리</span> 하시겠습니까?<br/>`, 'YesNo')
        .then(dialog => {
          if (dialog === 'yes') {
            if (this.isPaymentInfoGroup === true) {
              this.benefitCloseProcess(this.selectedRows.map((item) => {
                return {
                  closeYn: 'Y',
                  bookingId: item.bookingId,
                  paymentInfoIdList: this.isEmpty(item.paymentInfoIds) ? [] : item.paymentInfoIds.split(',')
                };
              }));
            } else {
              this.benefitCloseProcess(this.selectedRows.map((item) => { return { closeYn: 'Y', bookingId: item.bookingId, paymentInfoIdList: [item.paymentInfoId] }; }));
            }
          }
        });
    },
    onHandleClick() {
      if (this.isEmpty(this.data)) {
        messageBox.show('', '조회된 데이터가 없습니다.');
        return;
      }

      this.selectedRows = this.data.filterBy(x => x.isChecked, true);
      this.alreadyClosedRows = this.data.filterBy(x => x.isChecked && x.closeYn === 'Y', true);

      if (this.isEmpty(this.selectedRows)) {
        messageBox.show('', '선택된 항목이 없습니다.');
        return;
      }

      if (!this.isEmpty(this.alreadyClosedRows)) {
        messageBox.show('', '이미 마감된 혜택이 있습니다.');
        return;
      }

      this.onHandleConfirm();
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
