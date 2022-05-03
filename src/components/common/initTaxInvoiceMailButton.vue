<template>
  <fr-button type="D" size="small" @click="onHandleClick" >발송 초기화</fr-button>
</template>
<script>
import { actionServiceMixin } from '@/mixins/actionServiceMixin';
import { uniq } from 'lodash';

export default {
  name: 'init-tax-invoice-mail-button',
  mixins: [actionServiceMixin],
  props: {
    data: {
      type: Array,
      default: null
    },
    taxInvoiceType: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      selectedRows: null
    };
  },
  methods: {
    onHandleClick() {
      if (this.isEmpty(this.data)) {
        messageBox.show('', '선택된 예약이 없습니다.');
        return;
      }

      this.selectedRows = this.data.filterBy(x => x.isChecked, true);
      if (this.isEmpty(this.selectedRows)) {
        messageBox.show('', '선택된 예약이 없습니다.');
        return;
      }

      let bookingNoList = [];
      this.selectedRows.map(item => {
        bookingNoList.push(item.bookingNo);
      });

      if (this.isEmpty(bookingNoList) || this.isEmpty(this.taxInvoiceType)) {
        messageBox.show('', '처리할 데이터가 없습니다.');
        return;
      }

      const confirmMsg = '선택한 예약을 <span style="color:red">발송 초기화</span> 하시겠습니까?';
      messageBox.show('', confirmMsg, 'YesNo').then(dialog => {
        if (dialog === 'yes') {
          this.initTaxInvoiceEmail(uniq(bookingNoList), this.taxInvoiceType);
        }
      });
    }
  }
};
</script>
